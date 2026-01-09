

// --- HIGH-PERFORMANCE WEATHER ANIMATION (CANVAS) ---
let canvas = document.getElementById('weather-canvas');
let ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let clouds = []; // Array untuk awan
let lightningBolts = []; // Array untuk petir
let animationFrameId = null;
let wxInterval = null;
let currentWxType = null;
let storm = null;
let wxIsDay = true;
let wxCode = 0;
let wxWindSpeed = 0; // Kecepatan angin lokasi terpilih
let stars = [];
let moonPhase = 0.5; // 0.0 - 1.0
let wxLocalHour = new Date().getHours(); // Jam lokal lokasi terpilih
let lastSkyGradient = ''; // Cache untuk mencegah redraw background berlebihan
let currentSkyTop = '#000000'; // NEW: Cache for landscape
let currentSkyBot = '#000000'; // NEW: Cache for landscape
let isAudioUnlocked = false; // Status untuk autoplay audio di HP
let pendingAudio = null; // Sinkronisasi audio & animasi
let landscapeTreePath = null; // Cache untuk siluet pohon


// --- NEW: Inject SVG Filters & CSS for Realistic Clouds ---
function initCloudAssets() {
    if(document.getElementById('cloud-assets')) return;

    const assets = document.createElement('div');
    assets.id = 'cloud-assets';
    assets.innerHTML = `
        <div id="sky-gradient" style="position:fixed; top:0; left:0; width:100%; height:100%; z-index:40; pointer-events:none;"></div>
        <svg width="0" height="0" style="position:absolute; z-index:-1;">
            <filter id="filter-base">
                <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="5" seed="8517" />     
                <feDisplacementMap in="SourceGraphic" scale="120" />
            </filter>
            <filter id="filter-back">
                <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="8517" />     
                <feDisplacementMap in="SourceGraphic" scale="120" />
            </filter>
            <filter id="filter-mid">
                <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="8517"/>
                <feDisplacementMap in="SourceGraphic" scale="120" />
            </filter>
            <filter id="filter-front">
                <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="4" seed="8517"/>
                <feDisplacementMap in="SourceGraphic" scale="50" />
            </filter>
        </svg>
        <style>
            .cloud-wrapper {
                position: fixed;
                z-index: 41; /* Behind Rain Canvas (42) */
                pointer-events: none;
            }
            /* Container Awan (Sesuai snippet Anda) */
            .cloud-group {
                position: absolute;
                width: 600px;
                height: 300px;
                animation: drift 60s linear infinite;
                left: -700px;
                z-index: 41; /* FIX: Agar awan muncul di atas peta */
                pointer-events: none;
                will-change: transform; /* FIX: Optimasi GPU agar tidak patah-patah di HP */
            }
            @keyframes drift {
                from { transform: translate3d(0, 0, 0); }
                to { transform: translate3d(calc(110vw + 700px), 0, 0); }
            }
            .cloud { position: absolute; border-radius: 50%; } /* FIX: Samakan nama class dengan JS */
            
            /* --- STYLES AWAN REALISTIS (CERAH/PUTIH) --- */
            .c-base {
                width: 600px; height: 100px;
                filter: url(#filter-base); 
                box-shadow: 200px 170px 25px 45px rgba(255, 255, 255, 0.9);
            }
            .c-back {
                width: 500px; height: 40px;
                filter: url(#filter-back); 
                box-shadow: 200px 200px 15px 45px rgba(240, 240, 240, 0.4);
            }
            .c-mid {
                width: 580px; height: 45px;
                filter: url(#filter-mid); 
                box-shadow: 210px 250px 30px 35px rgba(255, 255, 255, 0.3);
            }
            .c-front {
                width: 450px; height: 50px;
                filter: url(#filter-front); 
                box-shadow: 210px 270px 35px 5px rgba(255, 255, 255, 0.4);
            }

            /* --- STYLES KHUSUS (Malam, Sunset, Badai) --- */
            
            /* STORM: Abu-abu Gelap Natural (Tidak Hitam Pekat) */
            .cloud-storm .c-base { box-shadow: 200px 170px 25px 45px rgba(85, 95, 105, 0.95) !important; }
            .cloud-storm .c-back { box-shadow: 200px 200px 15px 45px rgba(55, 65, 75, 0.5) !important; }
            .cloud-storm .c-mid { box-shadow: 210px 250px 30px 35px rgba(105, 115, 125, 0.4) !important; }
            .cloud-storm .c-front { box-shadow: 210px 270px 35px 5px rgba(125, 135, 145, 0.5) !important; }

            /* NIGHT: Abu-abu Natural Malam Hari (Tidak Terlalu Biru) */
            .cloud-night .c-base { box-shadow: 200px 170px 25px 45px rgba(70, 70, 80, 0.9) !important; }   /* Base: Abu-abu gelap netral */
            .cloud-night .c-back { box-shadow: 200px 200px 15px 45px rgba(50, 50, 60, 0.5) !important; }   /* Back: Bayangan lebih gelap */
            .cloud-night .c-mid { box-shadow: 210px 250px 30px 35px rgba(85, 85, 95, 0.4) !important; }    /* Mid: Sedikit lebih terang */
            .cloud-night .c-front { box-shadow: 210px 270px 35px 5px rgba(110, 110, 120, 0.5) !important; } /* Front: Highlight abu-abu terang */

            /* SUNSET: Putih Kemerahan dengan Sentuhan Abu (Sesuai Request) */
            .cloud-sunset .c-base { box-shadow: 200px 170px 25px 45px rgba(230, 220, 225, 0.9) !important; } /* Base: Putih Pink Abu */
            .cloud-sunset .c-back { box-shadow: 200px 200px 15px 45px rgba(255, 182, 193, 0.4) !important; } /* Back: Pink Lembut */
            .cloud-sunset .c-mid { box-shadow: 210px 250px 30px 35px rgba(160, 160, 170, 0.4) !important; } /* Mid: Abu-abu Ringan */
            .cloud-sunset .c-front { box-shadow: 210px 270px 35px 5px rgba(255, 240, 245, 0.5) !important; } /* Front: Putih Pink Cerah */
        </style>
    `;
    document.body.appendChild(assets);
}

function resizeCanvas() {
    if(canvas && ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
        generateLandscapeTrees();
    }
}

function generateLandscapeTrees() {
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    
    landscapeTreePath = new Path2D();
    
    // 1. Gambar Tanah Dasar (Bukit bergelombang)
    landscapeTreePath.moveTo(0, h);
    for (let x = 0; x <= w; x += 10) {
        const groundY = h * 0.93 - Math.sin(x * 0.0025) * 25;
        landscapeTreePath.lineTo(x, groundY);
    }
    landscapeTreePath.lineTo(w, h);
    landscapeTreePath.closePath();

    // 2. Tambahkan Pohon Pinus (Natural & Bertingkat)
    let x = 0;
    while (x < w) {
        // Jarak antar pohon acak (Rapat agar terlihat seperti hutan)
        const gap = 5 + Math.random() * 20; 
        x += gap;
        if (x >= w) break;

        // Posisi Y mengikuti kontur tanah
        const groundY = h * 0.93 - Math.sin(x * 0.0025) * 25;

        // Variasi Ukuran Pohon
        const scale = 0.8 + Math.random() * 1.2; // Skala diperbesar (0.8x - 2.0x)
        const treeH = 75 * scale; // Tinggi dasar dinaikkan agar lebih tinggi
        const treeW = 20 * scale; // Lebar dasar disesuaikan
        const baseY = groundY + 5; // Sedikit tertanam

        // Gambar Pohon Pinus (3 Tingkat Segitiga)
        // Tingkat 1 (Bawah)
        landscapeTreePath.moveTo(x - treeW, baseY);
        landscapeTreePath.lineTo(x, baseY - treeH * 0.4);
        landscapeTreePath.lineTo(x + treeW, baseY);
        landscapeTreePath.closePath();

        // Tingkat 2 (Tengah)
        landscapeTreePath.moveTo(x - treeW * 0.8, baseY - treeH * 0.25);
        landscapeTreePath.lineTo(x, baseY - treeH * 0.7);
        landscapeTreePath.lineTo(x + treeW * 0.8, baseY - treeH * 0.25);
        landscapeTreePath.closePath();

        // Tingkat 3 (Atas)
        landscapeTreePath.moveTo(x - treeW * 0.6, baseY - treeH * 0.55);
        landscapeTreePath.lineTo(x, baseY - treeH); // Puncak
        landscapeTreePath.lineTo(x + treeW * 0.6, baseY - treeH * 0.55);
        landscapeTreePath.closePath();
    }
}

function initStars() {
    stars = [];
    for(let i=0; i<150; i++) {
        stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * (window.innerHeight * 0.6), // Top 60%
            size: Math.random() * 2,
            alpha: 0.2 + Math.random() * 0.8,
            twinkle: Math.random() * 0.05
        });
    }
}

// --- NEW: PWA INSTALLATION LOGIC ---
let deferredPrompt;

function initPWA() {
    // 1. Register Service Worker (Wajib untuk PWA)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(err => console.error('SW Register Failed', err));
    }

    // 2. Listen event 'beforeinstallprompt' (Browser mendeteksi web bisa diinstall)
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent default browser banner
        e.preventDefault();
        deferredPrompt = e;
        // Tampilkan tombol install custom
        showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
        const btn = document.getElementById('pwa-install-btn');
        if(btn) btn.remove();
        deferredPrompt = null;
        console.log('PWA Installed');
    });
}

function showInstallButton() {
    if(document.getElementById('pwa-install-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    // Style: Floating Button di pojok kanan bawah
    btn.className = 'fixed bottom-24 right-4 z-[2000] flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/50 transition-all transform hover:scale-105 font-bold text-sm backdrop-blur-sm border border-white/10';
    btn.innerHTML = `<i data-lucide="download" class="w-5 h-5"></i><span>Install App</span>`;
    
    btn.onclick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Munculkan dialog native
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Install prompt outcome: ${outcome}`);
            deferredPrompt = null;
            btn.remove();
        }
    };
    
    document.body.appendChild(btn);
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

// --- FIX: Initialize after DOM Ready to ensure body & canvas exist ---
function initWeatherSystem() {
    canvas = document.getElementById('weather-canvas');
    ctx = canvas ? canvas.getContext('2d') : null;
    initCloudAssets();
    resizeCanvas();
    initPWA(); // Initialize PWA Logic
    weatherAudio.init(); // Preload audio files
}

// --- NEW: Audio Manager ---
const weatherAudio = {
    rain: null,
    thunder: [], // Pool of thunder sounds to allow overlap
    thunderIndex: 0,
    isReady: false,
    fadeInterval: null, // To manage fade in/out

    init: function() { // This will be for PRELOADING
        if (this.rain) return; // Already initialized
        console.log("Preloading audio files...");
        try {
            // Menggunakan audio langsung dari URL GitHub (raw)
            this.rain = new Audio('https://raw.githubusercontent.com/wayanku/fishing/main/real-rain-sound-379215%20(2).mp3');
            this.rain.loop = true;
            this.rain.volume = 0; // Mulai dengan volume 0
            this.rain.preload = 'auto';

            // Buat beberapa audio petir agar bisa tumpang tindih
            for (let i = 0; i < 3; i++) {
                this.thunder.push(new Audio('https://raw.githubusercontent.com/wayanku/fishing/main/loud-thunder-192165.mp3'));
                this.thunder[i].volume = 0.7;
                this.thunder[i].preload = 'auto';
            }
        } catch (e) {
            console.error("Failed to create audio elements for preloading:", e);
        }
    },
    
    unlock: function() { // This will be for UNLOCKING on user interaction
        if (this.isReady) return;
        if (!this.rain) this.init(); // Failsafe if preloading didn't run
        
        console.log("Attempting to unlock audio context...");
        
        // FIX: Pastikan volume 0 saat unlock agar tidak ada suara bocor/glitch
        this.rain.volume = 0;

        // Trik untuk "membuka kunci" audio di browser mobile
        const promise = this.rain.play();
        if (promise !== undefined) {
            promise.then(_ => {
                this.rain.pause();
                this.rain.currentTime = 0; // Rewind after test play
                console.log("Audio context unlocked by user interaction.");
                this.isReady = true;
                isAudioUnlocked = true; // Set flag global
            }).catch(error => {
                console.warn("Audio unlock failed. Will be silent until next interaction.", error);
            });
        } else {
            // For older browsers that don't return a promise
            this.isReady = true;
            isAudioUnlocked = true;
        }
    },

    playRain: function(volume = 0.5) {
        if (this.isReady && this.rain.paused) {
            this.rain.currentTime = 0;
            this.rain.volume = 0;
            this.rain.play().catch(e => console.error("Rain audio play failed:", e));
            
            clearInterval(this.fadeInterval);
            this.fadeInterval = setInterval(() => {
                if (this.rain.volume < volume) {
                    this.rain.volume = Math.min(volume, this.rain.volume + 0.1); // Percepat fade-in (0.05 -> 0.1)
                } else {
                    this.rain.volume = volume;
                    clearInterval(this.fadeInterval);
                }
            }, 50); // Interval lebih cepat (80ms -> 50ms)
        }
    },

    stopRain: function() {
        if (this.isReady && !this.rain.paused) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = setInterval(() => {
                if (this.rain.volume > 0.05) {
                    this.rain.volume -= 0.05;
                } else {
                    this.rain.volume = 0;
                    this.rain.pause();
                    this.rain.currentTime = 0;
                    clearInterval(this.fadeInterval);
                }
            }, 80);
        }
    },

    muteAll: function() {
        if (this.isReady) {
            clearInterval(this.fadeInterval);
            if (this.rain) {
                this.rain.volume = 0;
                this.rain.pause();
                this.rain.currentTime = 0;
            }
            this.thunder.forEach(t => {
                t.pause();
                t.currentTime = 0;
            });
        }
    },

    playThunder: function() {
        if (this.isReady) {
            this.thunder[this.thunderIndex].currentTime = 0;
            this.thunder[this.thunderIndex].play().catch(e => console.error("Thunder audio play failed:", e));
            this.thunderIndex = (this.thunderIndex + 1) % this.thunder.length;
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeatherSystem);
} else {
    initWeatherSystem();
}

window.addEventListener('resize', () => {
    resizeCanvas();
});

class RainDrop {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * (canvas.width + 400) - 200; // Area spawn lebih lebar karena angin kencang
        this.y = initial ? Math.random() * canvas.height : -100;
        
        const layer = Math.random();
        // Layering: Depan (Sangat Cepat & Panjang), Tengah, Belakang
        if (layer < 0.15) { // Front - Lebih agresif
            this.length = 50 + Math.random() * 30; // Streak panjang (efek deras)
            this.speed = 40 + Math.random() * 20;  // Kecepatan tinggi (40-60px per frame)
            this.width = 2.5;
            this.opacity = 0.8;
            this.splash = true;
        } else if (layer < 0.5) { // Mid
            this.length = 35 + Math.random() * 20;
            this.speed = 30 + Math.random() * 15;
            this.width = 1.8;
            this.opacity = 0.5;
            this.splash = Math.random() > 0.5;
        } else { // Back
            this.length = 20 + Math.random() * 15;
            this.speed = 20 + Math.random() * 10;
            this.width = 1;
            this.opacity = 0.3;
            this.splash = false;
        }

        // Simulasi Angin Kencang (4 - 8 px per frame)
        this.vx = 4 + Math.random() * 4; 
    }

    update() {
        if (!canvas) return;
        this.y += this.speed;
        this.x += this.vx; // Gerakan horizontal

        if (this.y > canvas.height) {
            if (this.splash) particles.push(new Splash(this.x));
            this.reset();
        }
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath(); ctx.moveTo(this.x, this.y);
        // Gambar ekor berlawanan arah gerakan (agar miringnya pas)
        ctx.lineTo(this.x - this.vx * 1.5, this.y - this.length);
        // Warna Hujan Natural (Putih Kebiruan)
        ctx.strokeStyle = `rgba(220, 235, 255, ${this.opacity})`; 
        ctx.lineWidth = this.width; 
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

class Splash {
    constructor(x) { 
        this.x = x; 
        this.y = canvas ? canvas.height : 0; 
        this.life = 0; 
        this.maxLife = 20; 
        this.isDead = false;
        this.size = 2 + Math.random() * 3;
    }
    update() { 
        this.life++; 
        if (this.life >= this.maxLife) this.isDead = true; 
    }
    draw() {
        if (!ctx) return;
        const p = this.life / this.maxLife;
        const opacity = 0.6 * (1 - p);
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(1, 0.25); // Lebih pipih (perspektif tanah)
        
        // Main Splash (Cipratan Utama)
        ctx.beginPath();
        ctx.arc(0, 0, this.size + (p * 5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`;
        ctx.fill();

        // Ripple Ring (Efek Cincin Pantulan)
        ctx.beginPath();
        ctx.arc(0, 0, this.size + (p * 15), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
    }
}

class SnowFlake {
    constructor() { 
        if(!canvas) return; 
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 3 + 0.5;
        this.color = ['#ccc', '#eee', '#fff', '#ddd'][Math.floor(Math.random() * 4)];
        this.radians = Math.random() * Math.PI * 2;
        this.velocity = 0.02;
        this.fallSpeed = 1 + Math.random() * 2;
    }
    update() { 
        if(!canvas) return; 
        this.radians += this.velocity;
        this.x += Math.sin(this.radians) * 0.5; // Gerakan mengayun ringan
        this.y += this.fallSpeed; // Jatuh ke bawah
        
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() { if(!ctx) return; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); ctx.closePath(); }
}

// --- NEW: Realistic Lightning Logic ---
function createLightningPath(x1, y1, x2, y2, displacement) {
    let path = [];
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    if (displacement < 3) {
        return [{x: x1, y: y1}, {x: x2, y: y2}];
    }

    // Geser titik tengah secara acak untuk menciptakan efek patahan
    const nx = midX + (Math.random() - 0.5) * displacement;
    const ny = midY + (Math.random() - 0.5) * displacement;

    path = path.concat(createLightningPath(x1, y1, nx, ny, displacement / 2));
    path = path.concat(createLightningPath(nx, ny, x2, y2, displacement / 2));
    
    return path;
}

class Lightning {
    constructor(x, y, targetX, targetY, thickness, isBranch = false) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.thickness = thickness;
        this.opacity = 1;
        this.isBranch = isBranch;
        
        // Displacement awal menentukan seberapa "liar" lekukannya
        this.path = createLightningPath(x, y, targetX, targetY, isBranch ? 40 : 120);
        this.branches = [];

        // Buat cabang hanya pada batang utama
        if (!isBranch) {
            this.generateBranches();
        }
    }

    generateBranches() {
        // Ambil beberapa titik secara acak di jalur utama untuk dijadikan pangkal cabang
        for (let i = 0; i < this.path.length; i += 10) {
            if (Math.random() < 0.2) {
                const pt = this.path[i];
                const direction = (Math.random() - 0.5) * 400;
                const branchX = pt.x + direction;
                const branchY = pt.y + Math.random() * 300;
                this.branches.push(new Lightning(pt.x, pt.y, branchX, branchY, this.thickness * 0.4, true));
            }
        }
    }

    draw() {
        if (!ctx || this.opacity <= 0) return;

        ctx.save();
        // Efek Cahaya Luar (Glow)
        ctx.shadowBlur = this.isBranch ? 5 : 15;
        ctx.shadowColor = "#4d79ff";
        ctx.strokeStyle = `rgba(180, 200, 255, ${this.opacity})`;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) { ctx.lineTo(this.path[i].x, this.path[i].y); }
        ctx.stroke();
        // Inti Putih
        ctx.shadowBlur = 0; ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`; ctx.lineWidth = this.thickness * 0.3; ctx.stroke();
        ctx.restore();
        // Gambar cabang & Fade
        this.branches.forEach(b => { b.opacity = this.opacity; b.draw(); });
        this.opacity -= 0.01;
    }
}

class WindLine {
    constructor() { if(!canvas) return; this.x = -150; this.y = Math.random() * canvas.height; this.length = 150; this.speed = 15 + Math.random() * 10; }
    update() { if(!canvas) return; this.x += this.speed; if (this.x > canvas.width + 50) { this.x = -150; this.y = Math.random() * canvas.height; } }
    draw() {
        if (!ctx) return;
        const g = ctx.createLinearGradient(this.x, this.y, this.x + this.length, this.y);
        g.addColorStop(0, 'rgba(255, 255, 255, 0)'); g.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)'); g.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x + this.length, this.y); ctx.stroke();
    }
}

// --- MODIFIED: Cloud Class using DOM Elements (Realistic Style) ---
class Cloud {
    constructor(type = 'day') {
        this.element = document.createElement('div');
        
        let typeClass = '';
        if(type === 'storm') typeClass = ' cloud-storm';
        else if(type === 'night') typeClass = ' cloud-night';
        else if(type === 'sunset') typeClass = ' cloud-sunset';

        this.element.className = 'cloud-group' + typeClass;

        // --- OPTIMIZATION: Reduce layers on mobile ---
        // Di HP, gunakan 2 layer saja agar rendering instan. Di PC tetap 4 layer.
        const isMobile = window.innerWidth < 768;
        const layers = isMobile ? ['c-base', 'c-front'] : ['c-base', 'c-back', 'c-mid', 'c-front'];

        layers.forEach(cls => {
            const l = document.createElement('div');
            l.className = `cloud ${cls}`;
            this.element.appendChild(l);
        });

        document.body.appendChild(this.element);
        
        // Randomize Position & Animation
        // FIX: Posisi awan lebih tinggi di HP agar tidak menutupi peta
        const minTop = isMobile ? -20 : 5;
        const maxTop = isMobile ? 10 : 40;
        this.y = minTop + Math.random() * (maxTop - minTop);
        this.element.style.top = `${this.y}%`;

        // --- MODIFIED: Smart Positioning, Static Speed ---
        // 1. Kecepatan statis (tidak dipercepat saat badai)
        const duration = 50 + Math.random() * 40; // Durasi acak antara 50s - 90s
        this.element.style.animationDuration = `${duration}s`;

        // 2. Delay agar awan LANGSUNG MUNCUL di layar (tidak menunggu dari pinggir)
        // CSS Animation bergerak dari -700px ke (110vw + 700px). Total jarak = 700 + 1.1*W
        const w = window.innerWidth;
        const totalDist = 700 + (1.1 * w);
        
        // Tentukan posisi acak di layar (0 sampai lebar layar)
        const targetX = Math.random() * w; 
        const distTraveled = 700 + targetX; // Jarak yang seolah-olah sudah ditempuh
        const progress = distTraveled / totalDist; // Persentase progres (0.0 - 1.0)
        
        // Set negative delay agar animasi mulai dari posisi tersebut
        const delay = -1 * progress * duration;
        this.element.style.animationDelay = `${delay}s`;

        const scale = 0.6 + Math.random() * 0.4;
        const opacity = 0.7 + Math.random() * 0.3;
        this.element.style.transform = `scale(${scale})`;
        this.element.style.opacity = opacity;
    }

    update() {
        // Movement handled by CSS animation 'drift'
    }

    draw() {
        // No-op: Drawing is handled by DOM/CSS
    }

    remove() {
        if(this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Helper: Interpolasi Warna Hex (untuk transisi halus)
function lerpColor(a, b, amount) {
    const ah = parseInt(a.replace(/#/g, ''), 16),
          bh = parseInt(b.replace(/#/g, ''), 16),
          ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
          br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
          rr = ar + amount * (br - ar),
          rg = ag + amount * (bg - ag),
          rb = ab + amount * (bb - ab);
    return '#' + ((1 << 24) + (Math.round(rr) << 16) + (Math.round(rg) << 8) + Math.round(rb)).toString(16).slice(1);
}

// Helper: Convert Hex to RGB (untuk transparansi)
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

function drawSkyBackground() {
    if (!ctx || !canvas) return;
    
    // --- MODIFIED: Transisi Halus per Menit & Waktu Matahari Dinamis ---
    // Hitung jam dalam desimal (misal 17.5 untuk 17:30)
    const now = new Date();
    const minutes = now.getMinutes();
    const floatHour = wxLocalHour + (minutes / 60);
    
    let skyKeys;

    // Coba gunakan waktu matahari terbit/terbenam dinamis jika data tersedia
    if (currentWeatherData && currentWeatherData.daily && currentWeatherData.daily.sunrise[0]) {
        const sunriseDate = new Date(currentWeatherData.daily.sunrise[0]);
        const sunsetDate = new Date(currentWeatherData.daily.sunset[0]);

        const sunriseHour = sunriseDate.getHours() + sunriseDate.getMinutes() / 60;
        const sunsetHour = sunsetDate.getHours() + sunsetDate.getMinutes() / 60;

        // Definisi Keyframe Warna Langit (Jam -> Warna Top, Warna Bot)
        // Menggunakan Hitam Pekat (True Dark) untuk malam
        skyKeys = [
            { h: 0,               top: "#000000", bot: "#0a0a0a" },   // Midnight: Black -> Neutral-950
            { h: sunriseHour - 2, top: "#000000", bot: "#171717" },   // Pre-Dawn
            { h: sunriseHour - 1, top: "#0a0a0a", bot: "#1e3a8a" },   // Dawn
            { h: sunriseHour,     top: "#1e40af", bot: "#f97316" },   // Sunrise Moment
            { h: sunriseHour + 2, top: "#3b82f6", bot: "#bae6fd" },   // Morning
            { h: 12,              top: "#0ea5e9", bot: "#cffafe" },   // Noon
            { h: sunsetHour - 2,  top: "#2563eb", bot: "#fdba74" },   // Late Afternoon
            { h: sunsetHour,      top: "#1e3a8a", bot: "#f59e0b" },   // Sunset Moment: Blue-900 -> Amber-500 (Softer Orange)
            { h: sunsetHour + 1,  top: "#172554", bot: "#0a0a0a" },   // Dusk: Deep Dark Blue -> Neutral-950
            { h: 24,              top: "#000000", bot: "#0a0a0a" }    // Loop back to Midnight
        ];

    } else {
        // Fallback ke jam tetap jika data API belum ada
        skyKeys = [
            { h: 0, top: "#000000", bot: "#0a0a0a" },   // Midnight
            { h: 4, top: "#000000", bot: "#171717" },   // Pre-Dawn
            { h: 5, top: "#0a0a0a", bot: "#1e3a8a" },   // Dawn
            { h: 6, top: "#1e40af", bot: "#f97316" },   // Sunrise
            { h: 8, top: "#3b82f6", bot: "#bae6fd" },   // Morning
            { h: 12, top: "#0ea5e9", bot: "#cffafe" },  // Noon
            { h: 16, top: "#2563eb", bot: "#fdba74" },  // Late Afternoon
            { h: 17, top: "#1d4ed8", bot: "#f59e0b" },  // Pre-Sunset (Amber)
            { h: 18, top: "#1e3a8a", bot: "#f59e0b" },  // Sunset (Amber)
            { h: 19, top: "#172554", bot: "#0a0a0a" },  // Dusk
            { h: 24, top: "#000000", bot: "#0a0a0a" }   // Loop back
        ];
    }

    let top, bot;

    // --- NEW: Override based on active animation type (Immediate Visual Feedback) ---
    if (currentWxType === 'storm') {
        top = "#0a0a0a"; bot = "#1e1b4b"; // Deep Storm
    } else if (currentWxType === 'rain') {
        // Cek waktu (siang/malam) berdasarkan floatHour
        const isDay = (floatHour > 6 && floatHour < 18);
        if(isDay) { top = "#334155"; bot = "#64748b"; } // Slate-700 -> Slate-500 (Gloomy Day)
        else { top = "#000000"; bot = "#171717"; } // Black -> Neutral-900 (Dark Night)
    } else if (wxCode >= 95) { // Badai (Sangat Gelap)
        top = "#000000"; bot = "#1e1b4b"; 
    } else if (wxCode >= 51 || wxCode === 3) { // Hujan / Mendung Tebal
        const isDaytimeCloudy = (skyKeys.length > 4 && skyKeys[3].h && skyKeys[7].h) ? (floatHour > skyKeys[3].h && floatHour < skyKeys[7].h) : (floatHour > 6 && floatHour < 18);
        if(isDaytimeCloudy) { top = "#475569"; bot = "#94a3b8"; } // Siang Kelabu
        else { top = "#0a0a0a"; bot = "#334155"; } // Malam Kelabu
    } else {
        // Interpolasi Warna Berdasarkan Waktu
        // Cari segmen waktu saat ini
        let start = skyKeys[0];
        let end = skyKeys[skyKeys.length - 1];
        
        for (let i = 0; i < skyKeys.length - 1; i++) {
            if (floatHour >= skyKeys[i].h && floatHour < skyKeys[i+1].h) {
                start = skyKeys[i];
                end = skyKeys[i+1];
                break;
            }
        }

        // Hitung persentase perjalanan waktu di antara dua keyframe
        const range = end.h - start.h;
        const progress = (range > 0) ? ((floatHour - start.h) / range) : 0;

        // Campurkan warna
        top = lerpColor(start.top, end.top, progress);
        bot = lerpColor(start.bot, end.bot, progress);

        // NEW: Cache colors for landscape rendering
        currentSkyTop = top;
        currentSkyBot = bot;
    }

    // OPTIMISASI: Hanya update DOM jika warna berubah (Mencegah Lag/Patah-patah)
    const newGradient = `linear-gradient(to bottom, ${top}, ${bot})`;
    if (lastSkyGradient !== newGradient) {
        const sky = document.getElementById('sky-gradient');
        if(sky) sky.style.background = newGradient;
        lastSkyGradient = newGradient;

        // --- NEW: Update Status Bar Color (Transparent Effect) ---
        // Mengubah warna status bar browser agar menyatu dengan langit
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if(!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = "theme-color";
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = top; // Status bar menyatu dengan langit
    }
}

function drawCelestialBodies() {
    if (!ctx) return;
    
    let sunX = canvas.width / 2;
    let sunY = canvas.height + 200; // Default sembunyi di bawah
    let moonX = canvas.width / 2;
    let moonY = canvas.height + 200;
    let sunAlt = -1;
    let moonAlt = -1;
    
    // --- NEW: Kalkulasi Posisi Realtime (SunCalc) ---
    // Menggunakan library SunCalc untuk menghitung posisi akurat berdasarkan GPS & Waktu
    if (typeof SunCalc !== 'undefined' && currentWeatherData && currentWeatherData.latitude) {
        const now = new Date();
        const lat = currentWeatherData.latitude;
        const lng = currentWeatherData.longitude;
        
        const sunPos = SunCalc.getPosition(now, lat, lng);
        const moonPos = SunCalc.getMoonPosition(now, lat, lng);
        
        sunAlt = sunPos.altitude; // Ketinggian matahari (Radians)
        moonAlt = moonPos.altitude;

        // Fungsi Mapping: Azimuth/Altitude -> Canvas X/Y
        // Azimuth: 0 (Selatan) -> Tengah. -PI/2 (Timur) -> Kiri. PI/2 (Barat) -> Kanan.
        const mapPos = (az, alt) => {
            const fov = 2 * Math.PI; // MODIFIED: 360 derajat FOV agar seluruh langit terlihat (termasuk Utara)
            // X: Mapping Azimuth ke Lebar Layar
            // Kita geser sedikit agar Timur ada di kiri (10%) dan Barat di kanan (90%)
            const x = (canvas.width / 2) + (az / fov) * canvas.width;
            
            // Y: Mapping Altitude ke Tinggi Layar
            // MODIFIED: Horizon di 50% (sejajar kolom info)
            // Zenith di 2% (Hampir menyentuh atas)
            const horizon = canvas.height * 0.50; 
            const zenith = canvas.height * 0.02;
            
            // FIX: Gunakan Math.sin dan scaling 1.3x agar matahari terlihat lebih tinggi (melengkung ke atas)
            // Ini meniru efek visual "tinggi" yang diinginkan user
            let visualAlt = alt > 0 ? Math.min(Math.PI / 2, alt * 1.3) : alt;
            
            const y = horizon - Math.sin(visualAlt) * (horizon - zenith);
            
            return { x, y };
        };

        const s = mapPos(sunPos.azimuth, sunPos.altitude);
        sunX = s.x; sunY = s.y;

        const m = mapPos(moonPos.azimuth, moonPos.altitude);
        moonX = m.x; moonY = m.y;
    }

    // --- Draw Stars (Bintang) ---
    // Bintang muncul jika Matahari di bawah horizon (Twilight/Malam)
    let starOpacity = 0;
    if (sunAlt < 0.1) { // Mulai muncul saat matahari rendah (< 6 derajat)
        starOpacity = Math.min(1, (0.1 - sunAlt) * 5); 
    }
    
    // Sembunyikan bintang jika cuaca buruk
    if (wxCode >= 60 || wxCode === 3) starOpacity = 0;

    if (starOpacity > 0) {
        ctx.fillStyle = "white";
        stars.forEach(star => {
            ctx.globalAlpha = star.alpha * starOpacity;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            // Efek Kelap-kelip
            star.alpha += star.twinkle;
            if (star.alpha > 1 || star.alpha < 0.2) star.twinkle *= -1;
        });
        ctx.globalAlpha = 1.0;
    }

    // --- Draw Sun (Matahari) ---
    // Muncul jika altitude > -0.15 (Civil Twilight) & Cuaca Bagus
    if (sunAlt > -0.15 && wxCode < 3) { 
        // Warna Dinamis: Merah/Orange saat terbit/terbenam, Kuning saat siang
        // Altitude 0 (Horizon) -> 1 (Zenith)
        let p = Math.min(1, Math.max(0, sunAlt / 0.8)); 
        
        if (p < 0.3) {
            // --- MODE SUNRISE/SUNSET (Original Style) ---
            // Tetap bulat dan berwarna oranye/kuning tegas saat rendah
            const colorHigh = "#facc15"; 
            const colorLow = "#f97316";  
            const localP = p / 0.3; // Normalisasi p untuk range 0 - 0.3
            const colorCore = lerpColor(colorLow, colorHigh, localP);
            const glowRgb = hexToRgb(colorCore);

            // Glow Luar
            const grd = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 80);
            grd.addColorStop(0, `rgba(${glowRgb}, 0.6)`);
            grd.addColorStop(1, `rgba(${glowRgb}, 0)`);
            ctx.fillStyle = grd;
            ctx.beginPath(); ctx.arc(sunX, sunY, 80, 0, Math.PI * 2); ctx.fill();

            // Inti Matahari
            ctx.fillStyle = colorCore;
            ctx.beginPath(); ctx.arc(sunX, sunY, 30, 0, Math.PI * 2); ctx.fill();
        } else {
            // --- MODE SIANG (Realistic Glare & Lens Flare) ---
            const glareIntensity = (p - 0.3) / 0.7; // 0.0 -> 1.0
            
            // RESPONSIVE SIZING: Gunakan ukuran layar untuk menentukan besarnya matahari
            const minDim = Math.min(canvas.width, canvas.height);

            // 1. Main Sun Glare (Blinding Light - Not Round)
            // Radius dinamis: HP (kecil) vs Laptop (besar)
            const outerRadius = (minDim * 0.4) + (glareIntensity * (minDim * 0.5)); 
            
            const grdMain = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, outerRadius);
            grdMain.addColorStop(0, "rgba(255, 255, 255, 1.0)"); // Inti Putih Solid
            grdMain.addColorStop(0.03, "rgba(255, 255, 255, 0.9)"); // Glow Inti Tajam
            grdMain.addColorStop(0.08, "rgba(255, 250, 220, 0.5)"); // Transisi Hangat (Golden Tint)
            grdMain.addColorStop(0.2, "rgba(255, 255, 255, 0.15)"); // Haze Putih
            grdMain.addColorStop(0.5, "rgba(255, 255, 255, 0.01)"); // Fade Out
            grdMain.addColorStop(1, "rgba(255, 255, 255, 0)");
            
            ctx.fillStyle = grdMain;
            ctx.beginPath(); ctx.arc(sunX, sunY, outerRadius, 0, Math.PI * 2); ctx.fill();

            // 2. Sun Rays / Beams (Responsive)
            ctx.save();
            ctx.translate(sunX, sunY);
            ctx.rotate(Date.now() * 0.0001); // Rotasi sangat pelan & elegan

            const rayCount = 8; 
            
            for (let i = 0; i < rayCount; i++) {
                ctx.save();
                ctx.rotate((Math.PI * 2 * i) / rayCount);
                
                const variation = (i % 2 === 0) ? 1.0 : 0.7;
                // Panjang sinar responsif terhadap ukuran layar (tidak fix pixel)
                // Agar proporsional di HP maupun Laptop
                const rayLen = ((minDim * 0.15) + (glareIntensity * (minDim * 0.2))) * variation; 
                const rayWidth = (minDim * 0.05) + (glareIntensity * (minDim * 0.02));

                // Teknik: Scale unit circle menjadi oval panjang (Sinar)
                ctx.scale(rayLen, rayWidth);

                // Gradient Radial dari Pusat ke Luar
                const grdRay = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
                grdRay.addColorStop(0, "rgba(255, 255, 255, 0.5)"); // Lebih terang di pusat
                grdRay.addColorStop(0.3, "rgba(255, 255, 255, 0.15)");
                grdRay.addColorStop(1, "rgba(255, 255, 255, 0)");

                ctx.fillStyle = grdRay;
                ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); 
                ctx.fill();
                ctx.restore();
            }
            ctx.restore();

            // 2.5. Crescent Rainbow Halo (Efek Pelangi Bulan Sabit)
            ctx.save();
            ctx.translate(sunX, sunY);
            
            // Scale agar oval (Pipih)
            ctx.scale(1.4, 0.9); 
            
            // Radius dasar - Dikurangi sesuai permintaan (130 -> 70)
            const rBase = 70 + (glareIntensity * 40); 
            
            // Buat Path Bulan Sabit (Smile)
            ctx.beginPath();
            
            // Koordinat Tip Kiri dan Kanan
            const tipX = rBase * 1.4;
            const tipY = rBase * 0.1; // Mulai sedikit di bawah pusat
            
            // Gambar kurva luar (Bawah Lebar)
            ctx.moveTo(-tipX, tipY);
            // Control point Y lebih besar = lebih melengkung ke bawah
            ctx.bezierCurveTo(-tipX * 0.4, rBase * 1.6, tipX * 0.4, rBase * 1.6, tipX, tipY);
            
            // Gambar kurva dalam (Atas - membuat efek menipis di ujung)
            // Control point Y lebih kecil = kurang melengkung, sehingga ada jarak di tengah (tebal)
            ctx.bezierCurveTo(tipX * 0.4, rBase * 1.1, -tipX * 0.4, rBase * 1.1, -tipX, tipY);
            
            ctx.closePath();

            // Gradient Pelangi Radial (Centered at 0,0)
            const grdRainbow = ctx.createRadialGradient(0, 0, rBase * 0.8, 0, 0, rBase * 1.6);
            
            // Urutan warna pelangi (Dalam: Biru -> Luar: Merah)
            grdRainbow.addColorStop(0, "rgba(255, 255, 255, 0)");
            grdRainbow.addColorStop(0.3, "rgba(100, 150, 255, 0.15)"); // Biru
            grdRainbow.addColorStop(0.5, "rgba(100, 255, 100, 0.15)"); // Hijau
            grdRainbow.addColorStop(0.7, "rgba(255, 200, 50, 0.15)");  // Kuning
            grdRainbow.addColorStop(0.9, "rgba(255, 100, 100, 0.15)"); // Merah
            grdRainbow.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.fillStyle = grdRainbow;
            
            // Blur agar tidak tajam pinggirannya
            ctx.filter = "blur(6px)";
            ctx.fill();
            ctx.filter = "none"; // Reset filter
            
            ctx.restore();

            // 3. Lens Flare (Efek Pelangi di Bawah)
            // Hitung arah ke pusat layar (agar flare bergerak realistis)
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const dirX = centerX - sunX;
            const dirY = centerY - sunY;
            const dist = Math.sqrt(dirX*dirX + dirY*dirY);
            
            if (dist > 0) {
                const uX = dirX / dist;
                const uY = dirY / dist;

                // Helper function flare
                const drawFlare = (pos, size, color, alpha) => {
                    const fx = sunX + uX * (dist * pos);
                    const fy = sunY + uY * (dist * pos);
                    ctx.fillStyle = color;
                    ctx.globalAlpha = alpha * glareIntensity;
                    ctx.beginPath(); ctx.arc(fx, fy, size, 0, Math.PI * 2); ctx.fill();
                };

                // Flare 1: Lingkaran Cahaya Dekat (Kuning Pudar)
                drawFlare(0.3, 40, "rgba(255, 255, 200, 0.4)", 0.3);

                // Flare 2: Hexagon/Lingkaran (Hijau/Biru Pudar)
                drawFlare(0.6, 25, "rgba(150, 255, 200, 0.3)", 0.2);

                // Flare 3: Cincin Pelangi (Rainbow Ring) - "kayak efek pelangi"
                const ringPos = 1.3; // Jauh di bawah
                const rx = sunX + uX * (dist * ringPos);
                const ry = sunY + uY * (dist * ringPos);
                
                ctx.globalAlpha = 0.15 * glareIntensity;
                // Gradient Pelangi Radial
                const grdRing = ctx.createRadialGradient(rx, ry, 30, rx, ry, 70);
                grdRing.addColorStop(0, "rgba(255, 255, 255, 0)");
                grdRing.addColorStop(0.2, "rgba(255, 0, 0, 0.3)"); // Merah
                grdRing.addColorStop(0.4, "rgba(255, 255, 0, 0.3)"); // Kuning
                grdRing.addColorStop(0.6, "rgba(0, 255, 0, 0.3)"); // Hijau
                grdRing.addColorStop(0.8, "rgba(0, 0, 255, 0.3)"); // Biru
                grdRing.addColorStop(1, "rgba(255, 0, 255, 0)"); // Ungu
                
                ctx.fillStyle = grdRing;
                ctx.beginPath(); ctx.arc(rx, ry, 70, 0, Math.PI * 2); ctx.fill();

                // Flare 4: Titik Kecil Tajam (Putih)
                drawFlare(0.9, 4, "rgba(255, 255, 255, 0.9)", 0.6);
                
                // Flare 5: Glow Ungu Besar (Jauh)
                drawFlare(1.6, 100, "rgba(100, 100, 255, 0.15)", 0.15);
                
                ctx.globalAlpha = 1.0; // Reset
            }
        }
    }

    // --- Draw Moon (Bulan) ---
    // Muncul jika altitude > -0.1 & Tidak Hujan Deras
    if (moonAlt > -0.1 && wxCode < 51) { 
        // LOGIKA BARU: Bulan jadi samar saat matahari terbit
        let moonOpacity = 1.0;
        if (sunAlt > -0.1) {
            // Semakin tinggi matahari, semakin transparan (min 0.3 agar tetap terlihat samar)
            moonOpacity = Math.max(0.3, 1.0 - (sunAlt * 3.0));
        }
        ctx.globalAlpha = moonOpacity; // Terapkan transparansi

        const radius = 25;

        // 1. Moon Glow (Atmosphere) - Lebih natural
        const grd = ctx.createRadialGradient(moonX, moonY, radius, moonX, moonY, radius * 5);
        grd.addColorStop(0, "rgba(255, 255, 255, 0.2)");
        grd.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(moonX, moonY, radius * 5, 0, Math.PI * 2); ctx.fill();

        // 2. Draw Dark Side (Earthshine) - Abu Gelap Kebiruan (Slate-800)
        // Ini memberikan efek "lingkaran luar" yang natural (tidak hitam pekat)
        ctx.fillStyle = "rgba(30, 41, 59, 0.95)"; 
        ctx.beginPath(); ctx.arc(moonX, moonY, radius, 0, Math.PI * 2); ctx.fill();

        // 3. Draw Lit Part (Phase) - Putih Terang
        ctx.fillStyle = "#f8fafc"; 
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.shadowBlur = 15; // Glow pada bagian yang terang

        ctx.beginPath();
        
        // Logika Fase Geometris (Bukan sekedar geser bayangan)
        // 0.0 (New) -> 0.5 (Full) -> 1.0 (New)
        
        if (moonPhase <= 0.5) {
            // Waxing (Menuju Purnama) - Terang di Kanan
            ctx.arc(moonX, moonY, radius, -Math.PI / 2, Math.PI / 2);
            
            // Terminator (Garis Batas)
            const p = moonPhase / 0.5; // 0 -> 1
            const scale = -1 + (p * 2); // FIX: -1 (New) -> 1 (Full)
            
            ctx.save();
            ctx.translate(moonX, moonY);
            ctx.scale(scale, 1);
            ctx.arc(0, 0, radius, Math.PI / 2, 3 * Math.PI / 2);
            ctx.restore();
        } else {
            // Waning (Menuju Baru) - Terang di Kiri
            ctx.arc(moonX, moonY, radius, Math.PI / 2, 3 * Math.PI / 2);
            
            const p = (moonPhase - 0.5) / 0.5; // 0 -> 1
            const scale = 1 - (p * 2); // FIX: 1 (Full) -> -1 (New)
            
            ctx.save();
            ctx.translate(moonX, moonY);
            ctx.scale(scale, 1);
            ctx.arc(0, 0, radius, 3 * Math.PI / 2, 5 * Math.PI / 2);
            ctx.restore();
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        // 4. Texture (Kawah) - Opsional, Sederhana
        ctx.save();
        ctx.beginPath(); ctx.arc(moonX, moonY, radius, 0, Math.PI * 2); ctx.clip();
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        // Beberapa kawah statis relatif terhadap pusat bulan
        ctx.beginPath(); ctx.arc(moonX - 5, moonY - 5, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(moonX + 8, moonY + 2, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(moonX - 2, moonY + 10, 5, 0, Math.PI*2); ctx.fill();
        ctx.restore();

        ctx.globalAlpha = 1.0; // Reset transparansi untuk elemen berikutnya
    }
}

// --- NEW: Draw Landscape (Mountains) ---
function drawLandscape() {
    if (!ctx) return;
    
    const w = canvas.width;
    const h = canvas.height;
    
    // --- MODIFIED: Dynamic Color based on Sky & More Realistic Shape ---
    // Warna gunung diambil dari warna langit bawah (horizon) dan digelapkan
    // untuk menciptakan efek siluet atmosferik yang realistis. Ini membuat
    // warna gunung menyatu dengan transisi warna langit saat sunrise/sunset.
    const baseColor = currentSkyBot; // Ambil warna horizon dari cache
    const backColor = lerpColor(baseColor, '#000000', 0.4); // Gelapkan 40% untuk gunung belakang
    const frontColor = lerpColor(baseColor, '#000000', 0.7); // Gelapkan 70% untuk gunung depan

    // 1. Gunung Belakang (Layer Jauh - Lebih Pudar)
    ctx.fillStyle = backColor;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, h * 0.48); // MODIFIED: Naikkan ke 48% agar benar-benar menutupi horizon 50%
    ctx.bezierCurveTo(w * 0.15, h * 0.45, w * 0.3, h * 0.65, w * 0.4, h * 0.55);
    ctx.bezierCurveTo(w * 0.55, h * 0.40, w * 0.7, h * 0.60, w * 0.8, h * 0.55);
    ctx.lineTo(w, h * 0.60);
    ctx.lineTo(w, h);
    ctx.fill();

    // 2. Gunung Depan (Layer Dekat - Lebih Gelap)
    ctx.fillStyle = frontColor;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, h * 0.65);
    ctx.bezierCurveTo(w * 0.2, h * 0.75, w * 0.35, h * 0.55, w * 0.5, h * 0.70);
    ctx.bezierCurveTo(w * 0.7, h * 0.85, w * 0.85, h * 0.65, w, h * 0.70);
    ctx.lineTo(w, h);
    ctx.fill();

    // 3. Siluet Pohon (Layer Paling Depan - Kaki Gunung)
    if (landscapeTreePath) {
        // Warna pohon lebih gelap dari gunung depan (hampir hitam tapi menyatu)
        ctx.fillStyle = lerpColor(frontColor, '#000000', 0.6);
        ctx.fill(landscapeTreePath);
    }
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Draw Sky & Celestial Bodies
    drawSkyBackground();
    drawCelestialBodies();

    // 2. Draw Landscape (Gunung) - NEW
    // Digambar setelah matahari/bulan agar mereka tenggelam di balik gunung
    drawLandscape();

    // 2. Update Clouds (DOM)
    clouds.forEach(c => c.update());

    // 3. Draw Particles (Hujan/Salju)
    particles = particles.filter(p => !p.isDead);
    for (const p of particles) { p.update(); p.draw(); }

    // --- NEW: Ground Reflection / Mist (Pantulan Bawah) ---
    if (['rain', 'storm'].includes(currentWxType)) {
        const grad = ctx.createLinearGradient(0, canvas.height - 80, 0, canvas.height);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, 'rgba(200, 220, 255, 0.15)'); // Efek basah/kabut bawah
        ctx.fillStyle = grad;
        ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
    }

    // 4. Draw Lightning (Storm Only)
    if (currentWxType === 'storm' && storm) {
        // Background Flash (Atmospheric)
        if (storm.flashOpacity > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${storm.flashOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            storm.flashOpacity -= 0.01;
        }

        // Draw Bolts
        for (let i = lightningBolts.length - 1; i >= 0; i--) {
            lightningBolts[i].draw();
            if (lightningBolts[i].opacity <= 0) lightningBolts.splice(i, 1);
        }

        // Trigger Random Strike
        if (Math.random() < 0.01 && lightningBolts.length === 0) {
            const startX = Math.random() * canvas.width;
            const targetX = startX + (Math.random() - 0.5) * 300;
            const targetY = canvas.height * 0.8 + Math.random() * canvas.height * 0.2;
            lightningBolts.push(new Lightning(startX, -10, targetX, targetY, Math.random() * 2 + 2));
            storm.flashOpacity = 0.3; // Trigger flash

            // --- NEW: Play Thunder Sound with Delay ---
            // Suara guntur muncul setelah kilat terlihat (kecepatan cahaya > suara)
            const thunderDelay = 300 + Math.random() * 500;
            setTimeout(() => {
                weatherAudio.playThunder();
            }, thunderDelay);
        }
    }

    // REMOVED: Top Gradient Mask to allow clear view of sky/stars

    // --- NEW: Sync Audio Start with Animation Frame ---
    if (pendingAudio && isAudioUnlocked) {
        // SAFETY CHECK: Pastikan audio hanya main jika cuaca Hujan atau Badai
        if (currentWxType !== 'rain' && currentWxType !== 'storm') {
            pendingAudio = null;
            return;
        }

        // FIX: Langsung mainkan audio tanpa delay frame untuk responsivitas instan
        weatherAudio.playRain(pendingAudio.volume);
        pendingAudio = null;
    }
}

function startWeatherEffect(type) {
    if(currentWxType === type) return;
    if(!canvas) return;
    
    stopWeatherEffect();
    currentWxType = type;
    const isMobile = window.innerWidth < 768; // Deteksi HP untuk optimasi performa

    // Pastikan canvas muncul di BELAKANG panel text (z-index 50) tapi DI ATAS peta
    canvas.style.zIndex = "42"; 
    canvas.style.pointerEvents = "none";
    
    if (type === 'rain') {
        const count = isMobile ? 150 : 350; // Kurangi jumlah partikel di HP agar loading cepat
        for (let i = 0; i < count; i++) particles.push(new RainDrop());
        pendingAudio = { volume: 0.5 }; // Sinkronisasi: Queue audio
    }
    else if (type === 'snow') {
        const count = isMobile ? 100 : 200;
        for (let i = 0; i < count; i++) particles.push(new SnowFlake());
    }
    else if (type === 'wind') for (let i = 0; i < 10; i++) particles.push(new WindLine());
    else if (type === 'storm') {
        const count = isMobile ? 250 : 500; // Kurangi kepadatan badai di HP
        for (let i = 0; i < count; i++) particles.push(new RainDrop()); // Badai lebih padat
        lightningBolts = []; // Reset bolts
        storm = { flashOpacity: 0 };
        pendingAudio = { volume: 0.7 }; // Sinkronisasi: Queue audio
    }
    
    // Tambahkan Awan jika cuaca mendukung (Berawan/Hujan/Salju)
    // Kode: 1,2,3 (Cloudy), 45,48 (Fog), 51+ (Rain/Snow)
    
    // Tentukan Tipe Awan (Warna)
    let cloudType = 'day';
    const h = wxLocalHour; // Integer hour is sufficient here

    // NEW: Dynamic cloud colors based on sunrise/sunset
    if (currentWeatherData && currentWeatherData.daily && currentWeatherData.daily.sunrise[0]) {
        const sunriseHour = new Date(currentWeatherData.daily.sunrise[0]).getHours();
        const sunsetHour = new Date(currentWeatherData.daily.sunset[0]).getHours();

        // Night is from one hour after sunset to one hour before sunrise
        if (h >= sunsetHour + 1 || h < sunriseHour - 1) {
            cloudType = 'night';
        // Sunset/sunrise is a 3-hour window around the event
        } else if ( (h >= sunriseHour - 1 && h <= sunriseHour + 1) || (h >= sunsetHour - 1 && h <= sunsetHour + 1) ) {
            cloudType = 'sunset';
        }
    } else {
        // Fallback to fixed hours if data isn't ready
        if (h >= 19 || h < 5) cloudType = 'night';
        else if ((h >= 5 && h < 7) || (h >= 17 && h < 19)) cloudType = 'sunset';
    }

    if (['storm', 'rain'].includes(type) || wxCode >= 51) cloudType = 'storm';
    
    if ([1, 2, 3, 45, 48].includes(wxCode) || wxCode >= 51 || ['rain', 'storm', 'snow', 'cloudy'].includes(type)) {
        // Lebih banyak awan jika hujan/badai
        let cloudCount = (wxCode >= 51 || wxCode === 3 || ['rain', 'storm'].includes(type)) ? 8 : 5; 
        
        // --- OPTIMIZATION: Reduce cloud count on mobile ---
        if (isMobile) cloudCount = Math.max(3, Math.floor(cloudCount / 2));

        for(let i=0; i<cloudCount; i++) clouds.push(new Cloud(cloudType));
    }
    
    // FIX: Force render background immediately to prevent transparency
    drawSkyBackground();

    if (!animationFrameId) animate();
}

function stopWeatherEffect() {
    if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
    pendingAudio = null; // Reset pending audio
    particles = [];
    lightningBolts = []; // Clear lightning
    // Clean up DOM clouds
    clouds.forEach(c => c.remove());
    clouds = [];
    weatherAudio.muteAll(); // Hentikan semua audio (Hujan & Petir) tanpa syarat flag
    storm = null;
    currentWxType = null;
    
    // Reset Sky Gradient agar peta terlihat kembali saat panel ditutup
    const sky = document.getElementById('sky-gradient');
    if(sky) sky.style.background = 'transparent';
    lastSkyGradient = ''; // FIX: Reset cache agar saat dibuka kembali background langsung dirender ulang

    // Reset Status Bar ke default (Slate-900) saat keluar dari cuaca
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    
    // FIX: Cek tema aktif (Light/Dark) agar status bar kembali sesuai tema aplikasi
    const isLight = document.body.classList.contains('light-mode');
    const defaultColor = isLight ? "#ffffff" : "#000000";
    
    if(metaTheme) metaTheme.content = defaultColor;

    if(ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(canvas) canvas.style.zIndex = "-1"; // Reset z-index saat stop
}

// --- WEATHER VARIABLES ---
let currentUserWeatherCode = null; // Simpan kode cuaca user
let currentUserWindSpeed = 0; // Simpan kecepatan angin user
let currentWeatherData = null; // Simpan data cuaca lengkap
let currentMarineData = null; // Simpan data laut (New)
let currentSolunarData = null; // Data Solunar untuk chart
let currentChartData = []; // Data untuk tooltip chart
let currentRouteLine = null; // Menyimpan garis rute
let currentRouteSteps = []; // Menyimpan langkah-langkah rute

// --- WEATHER FUNCTIONS ---

// Fitur: Cuaca Realtime di Lokasi User (Header)
function getUserWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            userLatlng = L.latLng(lat, lng);
            
            // Simpan lokasi ke browser agar refresh selanjutnya instan
            localStorage.setItem('lastLat', lat);
            localStorage.setItem('lastLng', lng);
            
            // Auto-center map ke lokasi user saat data lokasi didapat
            if(typeof map !== 'undefined') map.flyTo([lat, lng], 15);
            
            fetchUserWeather(lat, lng);
        }, (err) => {
            // Handle Error Lokasi (Penting agar user tahu kenapa tidak muncul)
            console.warn("Geo Error:", err);
            let msg = "Gagal Lokasi";
            if(err.code === 1) msg = "Izin Ditolak"; // User menolak izin
            if(err.code === 3) msg = "Timeout GPS";  // Sinyal lemah
            const infoEl = document.getElementById('user-weather-info');
            if(infoEl) infoEl.innerText = msg;
            
            // FALLBACK: Jika GPS ditolak/gagal, gunakan estimasi lokasi via IP Address
            // Ini solusi untuk pengguna baru yang menolak izin lokasi agar tidak stuck di Jakarta
            fetch('https://ipapi.co/json/')
                .then(res => res.json())
                .then(data => {
                    if(data.latitude && data.longitude) {
                        const lat = data.latitude;
                        const lng = data.longitude;
                        userLatlng = L.latLng(lat, lng);
                        
                        // Pindahkan peta ke lokasi IP (Zoom level 12 karena kurang akurat dibanding GPS)
                        if(typeof map !== 'undefined') map.flyTo([lat, lng], 12);
                        
                        // Simpan estimasi ini agar refresh selanjutnya tetap di area user
                        localStorage.setItem('lastLat', lat);
                        localStorage.setItem('lastLng', lng);
                        
                        fetchUserWeather(lat, lng);
                    }
                })
                .catch(() => console.log("Gagal deteksi lokasi IP"));
        }, { timeout: 10000, enableHighAccuracy: true });
    }
}

async function fetchUserWeather(lat, lng) {
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`);
        const data = await res.json();
        if(data.current_weather) {
            if(data.current_weather.time) wxLocalHour = parseInt(data.current_weather.time.split('T')[1].split(':')[0]);
            const temp = Math.round(data.current_weather.temperature);
            currentUserWeatherCode = data.current_weather.weathercode;
            currentUserWindSpeed = data.current_weather.windspeed;
            
            const infoEl = document.getElementById('user-weather-info');
            if(infoEl) {
                const lang = localStorage.getItem('appLang') || 'id';
                const locText = dynamicTranslations[lang].location;
                infoEl.innerText = `${locText}: ${temp}°C`;
            }
            
            // Cek Animasi Cuaca di lokasi user
            // Disabled: Jangan auto-start di peta
        }
    } catch(e) {
        const infoEl = document.getElementById('user-weather-info');
        if(infoEl) infoEl.innerText = "Cuaca Offline";
    }
}

function checkWeatherAnimation(code, windSpeed = 0, isDay = true) {
    // Update Globals for Background
    wxCode = code;
    wxWindSpeed = windSpeed; // Simpan kecepatan angin untuk animasi awan
    wxIsDay = isDay;

    // Priority: Storm > Snow > Rain > Wind
    let type = 'clear'; // Default to clear (shows sky/sun/moon)
    if([95, 96, 99].includes(code)) type = 'storm';
    else if([71, 73, 75, 77, 85, 86].includes(code)) type = 'snow';
    else if([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        // LOGIKA NYATA: Jika terdeteksi hujan tapi suhu <= 1°C, ubah animasi jadi salju
        if (currentWeatherData && currentWeatherData.current_weather && currentWeatherData.current_weather.temperature <= 1) {
            type = 'snow';
        } else {
            type = 'rain';
        }
    }
    else if([1, 2, 3, 45, 48].includes(code)) type = 'cloudy'; // NEW: Tipe khusus berawan
    else if(windSpeed > 20) type = 'wind';
    
    startWeatherEffect(type);
}

// --- NEW: Responsive Styles for PC/Desktop ---
function injectResponsiveStyles() {
    if (document.getElementById('weather-responsive-styles')) return;
    const style = document.createElement('style');
    style.id = 'weather-responsive-styles';
    style.innerHTML = `
        @media (min-width: 1024px) {
            /* Wrapper Konten Utama di Tengah (Agar tidak terlalu lebar di monitor ultrawide) */
            #location-panel > div {
                max-width: 1400px !important;
                margin: 0 auto !important;
                padding: 0 2rem !important;
            }
            /* Forecast 7 Hari jadi 2 Kolom (Kiri-Kanan) */
            #forecast-list {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 1rem !important;
                align-items: start !important;
            }
            /* Header Lebih Besar */
            #new-weather-header { padding: 3rem 0 !important; }
            #header-temp { font-size: 8rem !important; }

            /* --- NEW: Responsive Navigation Bar (Floating Dock Style) --- */
            /* Membuat menu navigasi bawah melayang & rapi di tengah layar PC */
            nav, 
            div.fixed.bottom-0.w-full.z-50:not(#location-panel), 
            div.fixed.bottom-0.w-full.bg-black:not(#location-panel) {
                max-width: 500px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                bottom: 24px !important;
                border-radius: 24px !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5) !important;
                width: auto !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// --- NEW: Card Styles (White Text & Fixed Layout) ---
function injectCardStyles() {
    if (document.getElementById('weather-card-styles')) return;
    const style = document.createElement('style');
    style.id = 'weather-card-styles';
    style.innerHTML = `
        /* Horizontal Scroll Layout (Hemat Tempat) */
        .weather-grid-container {
            display: flex;
            overflow-x: auto;
            gap: 12px;
            margin-bottom: 1rem;
            padding-bottom: 4px; /* Ruang untuk scrollbar tipis */
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none;  /* IE 10+ */
        }
        .weather-grid-container::-webkit-scrollbar { display: none; } /* Chrome/Safari */

        /* Card Consistency (Agar tidak melompat saat loading) */
        .weather-card-fixed {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            min-width: 100px !important; /* Lebar minimum agar tidak gepeng */
            width: 100px !important;
            min-height: 100px !important;
            height: 100% !important;
            padding: 8px !important;
            text-align: center !important;
        }
        /* Force White Text & Icons */
        .weather-card-fixed, .weather-card-fixed * { color: #ffffff !important; }
        
        /* Styling Judul (Kecil) */
        .weather-card-fixed .text-xs, .weather-card-fixed p:first-child {
            opacity: 0.9 !important; font-weight: 600 !important;
            text-transform: uppercase !important; font-size: 10px !important;
            margin-bottom: 4px !important;
        }
    `;
    document.head.appendChild(style);
}

async function showLocationPanel(latlng) {
    const panel = document.getElementById('location-panel');
    
    const lang = localStorage.getItem('appLang') || 'id';
    const dt = dynamicTranslations[lang];

    // --- NEW: Unlock Audio on First Interaction ---
    // Ini adalah kunci agar audio bisa autoplay di HP
    if (!isAudioUnlocked) {
        weatherAudio.unlock();
    }
    // ---------------------------------------------

    // --- MODIFIED: Reset UI with Full Skeleton (Tampilan Loading Kartu) ---
    const skeletonBlock = '<div class="h-5 w-16 bg-slate-600/50 rounded animate-pulse mx-auto"></div>';
    const skeletonText = '<div class="h-3 w-24 bg-slate-600/50 rounded animate-pulse mx-auto mt-1"></div>';
    
    // 1. Header Skeleton (Agar header langsung muncul walau data belum ada)
    // FIX: Target langsung panel utama, bukan anak div-nya agar header tidak masuk ke dalam flex container
    let header = document.getElementById('new-weather-header');
    
    // FIX: Hapus header duplikat jika ada (Penyebab loading ganda/tidak hilang)
    const allHeaders = document.querySelectorAll('#new-weather-header');
    if (allHeaders.length > 1) {
        for (let i = 1; i < allHeaders.length; i++) allHeaders[i].remove();
    }

    // FIX: Force hide old elements EVERY TIME to prevent "ghost" loading bars
    const oldAddress = document.getElementById('panel-address');
    const oldCoords = document.getElementById('panel-coords');
    const oldDist = document.getElementById('panel-dist');
    const oldTitle = panel.querySelector('h2.text-2xl'); // Judul "Kondisi Cuaca" lama
    
    if (oldAddress) oldAddress.classList.add('hidden');
    if (oldCoords) oldCoords.classList.add('hidden');
    if (oldDist) oldDist.classList.add('hidden');
    if (oldTitle) oldTitle.classList.add('hidden'); // Sembunyikan judul lama
    
    // FIX: Paksa sembunyikan panel-dist dengan style inline agar tidak muncul loading bar kecil di bawah
    if (oldDist) oldDist.style.display = 'none';

    // Sembunyikan kartu lama yang pindah ke header (Temp & Weather Desc)
    const tempCard = document.querySelector('[onclick="showMetricInsight(\'temp\')"]');
    const weatherCard = document.querySelector('[onclick="showMetricInsight(\'weather\')"]');
    if (tempCard) tempCard.classList.add('hidden');
    if (weatherCard) weatherCard.classList.add('hidden');

    if (!header) {
        header = document.createElement('div');
        header.id = 'new-weather-header';
        header.className = 'flex flex-col items-center text-white pt-16 pb-10 px-4 text-center';
        // Sisipkan di paling atas panel
        panel.insertBefore(header, panel.firstChild);
    }

    if (header) {
        // MODIFIED: Isi Header dengan Placeholder Statis (Tanpa Efek Loading Pulse)
        // Menggunakan style text-shadow yang sama dengan tampilan akhir agar tidak ada pergeseran visual
        header.innerHTML = `
            <div class="flex items-center justify-center gap-2 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-blue-400 w-6 h-6 drop-shadow-md"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <h2 id="header-location" class="text-3xl font-bold tracking-tight text-center leading-tight line-clamp-2" style="text-shadow: 0 2px 4px rgb(0 0 0 / 0.5);">Mencari lokasi...</h2>
            </div>
            <p class="text-sm font-medium text-slate-200 mt-1 mb-2 opacity-90 tracking-wide" style="text-shadow: 0 1px 3px rgb(0 0 0 / 0.4);"><span id="header-time">--:--</span></p>
            
            <p id="header-temp" class="text-8xl font-thin -my-2 tracking-tighter" style="font-family: -apple-system, sans-serif; text-shadow: 0 3px 8px rgb(0 0 0 / 0.5);">--°</p>
            
            <p id="header-desc" class="text-xl font-medium mt-1" style="text-shadow: 0 1px 3px rgb(0 0 0 / 0.4);">Memuat...</p>
            <p id="header-minmax" class="text-sm font-medium opacity-80 mt-1" style="text-shadow: 0 1px 3px rgb(0 0 0 / 0.4);">-- / --</p>
        `;
        
        // FIX: Hapus icon map-pin lama yang mungkin masih muncul (duplikat)
        const strayPins = panel.querySelectorAll('[data-lucide="map-pin"], .lucide-map-pin');
        strayPins.forEach(pin => {
            if (!pin.closest('#new-weather-header')) {
                pin.style.display = 'none';
            }
        });
    }

    // 2. Grid Cards Skeleton (Ombak, Pasang, dll)
    document.getElementById('wx-wave').innerHTML = skeletonBlock;
    document.getElementById('wx-tide').innerHTML = skeletonBlock;
    document.getElementById('wx-sst').innerHTML = skeletonBlock;
    document.getElementById('wx-depth').innerHTML = skeletonBlock;
    document.getElementById('wx-score').innerHTML = skeletonBlock;
    document.getElementById('wx-wind-speed').innerHTML = '<div class="h-5 w-10 bg-slate-600/50 rounded animate-pulse inline-block"></div>';
    document.getElementById('wx-sun').innerHTML = `<div class="flex flex-col gap-2 items-center justify-center w-full h-full"><div class="h-3 w-16 bg-slate-600/50 rounded animate-pulse"></div><div class="h-3 w-16 bg-slate-600/50 rounded animate-pulse"></div></div>`;
    document.getElementById('panel-dist').innerHTML = '<div class="h-8 w-24 bg-slate-700/50 rounded animate-pulse mx-auto"></div>';
    
    // --- MODIFIED: Render Skeleton UI immediately (Agar tampilan siap sebelum data datang) ---
    
    // 1. Setup Hourly Forecast Skeleton
    let hourlyContainer = document.getElementById('hourly-forecast-container');
    const existingScroll = document.getElementById('weather-scroll');
    const dotsContainer = document.getElementById('scroll-dots');
    
    // Create Hourly Card if missing (Buat wadah kartu jika belum ada)
    if (!hourlyContainer && existingScroll) {
        const referenceNode = dotsContainer || existingScroll;
        const parentNode = referenceNode.parentNode;
        const cardClass = "mx-0 mb-3 bg-slate-900/30 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden";

        // Precip Card (Hidden initially)
        const precipCard = document.createElement('div');
        precipCard.id = 'precip-card';
        precipCard.className = cardClass + " hidden";
        if(parentNode) parentNode.insertBefore(precipCard, referenceNode.nextSibling);
        
        const precipChartContainer = document.createElement('div');
        precipChartContainer.id = 'precip-chart-container';
        precipChartContainer.className = "px-4 py-2";
        precipCard.appendChild(precipChartContainer);

        // Hourly Card
        const hourlyCard = document.createElement('div');
        hourlyCard.id = 'hourly-card';
        hourlyCard.className = cardClass;
        if(parentNode) parentNode.insertBefore(hourlyCard, precipCard.nextSibling);

        // Summary
        const hourlySummaryContainer = document.createElement('div');
        hourlySummaryContainer.id = 'hourly-summary-container';
        hourlySummaryContainer.className = "px-4 py-3 text-xs text-slate-200 leading-relaxed font-medium border-b border-white/5";
        hourlyCard.appendChild(hourlySummaryContainer);

        // Scroll List
        hourlyContainer = document.createElement('div');
        hourlyContainer.id = 'hourly-forecast-container';
        hourlyContainer.className = "flex items-stretch gap-x-4 overflow-x-auto no-scrollbar p-4";
        hourlyCard.appendChild(hourlyContainer);
    }

    // Fill Hourly with Skeletons (Isi dengan animasi loading)
    if (hourlyContainer) {
        let hourlySkeleton = '';
        for(let i=0; i<12; i++) {
            hourlySkeleton += `
                <div class="flex flex-col items-center justify-between py-2 shrink-0 w-14 border-b-2 border-transparent animate-pulse">
                    <div class="w-8 h-3 bg-slate-700/50 rounded mb-2"></div>
                    <div class="w-6 h-6 bg-slate-700/50 rounded-full mb-2"></div>
                    <div class="w-8 h-4 bg-slate-700/50 rounded"></div>
                </div>`;
        }
        hourlyContainer.innerHTML = hourlySkeleton;
        
        const summary = document.getElementById('hourly-summary-container');
        if(summary) summary.innerHTML = `<div class="h-3 w-3/4 bg-slate-700/50 rounded animate-pulse"></div>`;
    }

    // 2. Setup Daily Forecast Skeleton (Forecast List)
    const list = document.getElementById('forecast-list');
    if (list) {
        list.className = "mx-0 bg-neutral-900/30 backdrop-blur-xl rounded-xl border border-white/20 p-2 shadow-lg";
        let dailySkeleton = `
            <div class="px-2 py-2 mb-2 flex items-center gap-2 border-b border-white/5">
                <i data-lucide="calendar" class="w-4 h-4 text-slate-400"></i> 
                <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">Prakiraan 10 Hari</span>
            </div>`;
            
        for(let i=0; i<7; i++) {
            dailySkeleton += `
                <div class="flex items-center justify-between py-3 px-3 mx-2 mb-0 border-b border-white/5 last:border-0 animate-pulse">
                    <div class="w-[22%] h-3 bg-neutral-700/50 rounded"></div>
                    <div class="w-[18%] flex flex-col items-center justify-center">
                        <div class="w-6 h-6 bg-neutral-700/50 rounded-full"></div>
                    </div>
                    <div class="w-[60%] flex items-center gap-3 pl-1">
                        <div class="w-6 h-3 bg-neutral-700/50 rounded"></div>
                        <div class="flex-1 h-1.5 bg-neutral-700/50 rounded-full"></div>
                        <div class="w-6 h-3 bg-neutral-700/50 rounded"></div>
                    </div>
                </div>`;
        }
        list.innerHTML = dailySkeleton;
    }
    
    lucide.createIcons();
    
    // --- FIX: Tampilkan Latar Langit Dulu Sebelum Panel Muncul ---
    // Agar tidak terlihat peta yang "berantakan" di bawah panel transparan
    const sysHour = new Date().getHours();
    let initIsDay = (sysHour >= 6 && sysHour < 18);

    // Cek apakah data yang ada di memori relevan dengan lokasi yang dibuka
    if (currentWeatherData && currentWeatherData.latitude && 
        Math.abs(currentWeatherData.latitude - latlng.lat) < 0.01 && 
        Math.abs(currentWeatherData.longitude - latlng.lng) < 0.01 &&
        currentWeatherData.current_weather) {
        
        const wx = currentWeatherData.current_weather;
        if(wx.time) wxLocalHour = parseInt(wx.time.split('T')[1].split(':')[0]); // Update jam dari cache
        
        // --- NEW: Force Draw Sky Immediately ---
        drawSkyBackground(); // Gambar langit langsung, jangan tunggu animasi
        
        checkWeatherAnimation(wx.weathercode, wx.windspeed, wx.is_day);
    } else {
        // Lokasi baru / belum ada data: Gunakan estimasi waktu sistem & cerah
        wxLocalHour = sysHour; // Reset ke jam sistem sementara loading
        wxIsDay = initIsDay;
        wxCode = 0;
        
        // --- NEW: Force Draw Sky Immediately ---
        drawSkyBackground(); // Gambar langit langsung
        
        startWeatherEffect('clear');
    }

    // Tampilkan Panel
    panel.classList.remove('translate-y-full');
    
    // --- FIX: Integrasi dengan Sistem Halaman Baru ---
    // Pindah ke tab Cuaca secara otomatis (Hanya jika belum aktif untuk mencegah Loop)
    if (typeof navigateTo === 'function') {
        const weatherView = document.getElementById('view-weather');
        if (weatherView && !weatherView.classList.contains('active')) {
            navigateTo('weather');
        }
    }

    // Reset style agar mengikuti layout halaman (bukan popup fixed)
    panel.style.removeProperty('position');
    panel.style.removeProperty('top');
    panel.style.removeProperty('left');
    panel.style.removeProperty('height');
    panel.style.removeProperty('width');
    panel.style.removeProperty('z-index');
    
    panel.style.setProperty('background', 'transparent', 'important'); // Make transparent so canvas shows
    panel.style.setProperty('backdrop-filter', 'none', 'important'); // Hapus efek blur
    panel.style.setProperty('-webkit-backdrop-filter', 'none', 'important'); // Support Safari
    panel.style.setProperty('padding-bottom', '80px', 'important'); // Tambahan padding bawah agar konten paling bawah tidak mentok
    
    // FIX: Hapus lengkungan pada elemen anak (konten dalam panel)
    Array.from(panel.children).forEach(child => {
        // --- FIX: JANGAN HAPUS STYLE KARTU-KARTU PENTING ---
        // Kartu ini harus tetap memiliki background glass, jangan dibuat transparan
        const preservedIds = ['hourly-card', 'weather-insight-panel', 'precip-card', 'precip-map-card', 'quake-container', 'aqi-container', 'forecast-list'];
        if (preservedIds.includes(child.id) || child.classList.contains('weather-card-fixed')) {
            return;
        }

        child.style.setProperty('border-radius', '0', 'important');
        child.style.setProperty('border', 'none', 'important'); // FIX: Hapus border anak elemen
        child.style.setProperty('max-height', 'none', 'important'); // CRITICAL: Hapus batasan tinggi wrapper
        child.style.setProperty('height', 'auto', 'important'); // Biarkan konten memanjang
        child.style.setProperty('min-height', '100%', 'important');
        child.style.setProperty('width', '100%', 'important'); // NEW: Paksa lebar penuh
        child.style.setProperty('max-width', 'none', 'important'); // NEW: Hapus batasan lebar mobile
        child.classList.remove('rounded-t-[2rem]', 'rounded-t-3xl', 'rounded-2xl', 'rounded-3xl', 'overflow-hidden');
        
        // FIX: Paksa background transparan agar canvas langit terlihat
        child.style.setProperty('background', 'transparent', 'important');
        child.style.setProperty('background-color', 'transparent', 'important');
        child.style.setProperty('backdrop-filter', 'none', 'important'); // Hapus efek blur pada anak elemen
        child.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
        child.style.setProperty('box-shadow', 'none', 'important');
    });

    // FIX: Style Kartu Grid (Angin, Ombak, dll) agar kontras di siang hari
    // Berikan latar belakang gelap transparan pada kartu agar teks putih terbaca jelas
    const detailCards = panel.querySelectorAll('[onclick*="showMetricInsight"]');
    
    // --- NEW: Tag Container for Responsive Grid ---
    if(detailCards.length > 0 && detailCards[0].parentElement) {
        detailCards[0].parentElement.classList.add('weather-grid-container');
    }

    detailCards.forEach(card => {
        card.classList.add('weather-card-fixed'); // Tambahkan class layout tetap
        // LIQUID GLASS STYLE: Lebih transparan (0.3), Blur lebih kuat (16px)
        card.style.setProperty('background-color', 'rgba(10, 10, 10, 0.5)', 'important'); 
        card.style.setProperty('backdrop-filter', 'blur(16px)', 'important');
        card.style.setProperty('-webkit-backdrop-filter', 'blur(16px)', 'important');
        card.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.2)', 'important');
        card.style.setProperty('border-radius', '1rem', 'important'); // Rounded-xl
        card.style.setProperty('box-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 'important');
    });

    injectCardStyles(); // Apply Card Styles
    injectResponsiveStyles(); // Apply PC Styles

    // --- CLEANUP: Hapus elemen navigasi ganda (Garis & Tombol X) ---
    // 1. Sembunyikan garis drag handle (biasanya div kecil di tengah atas)
    const handles = panel.querySelectorAll('div.w-12.h-1\\.5, div.w-16.h-1\\.5, .mx-auto.bg-slate-700, .mx-auto.bg-gray-300');
    handles.forEach(h => h.classList.add('hidden'));
    // 2. Sembunyikan tombol close bawaan (X)
    const oldCloseBtns = panel.querySelectorAll('button');
    oldCloseBtns.forEach(btn => {
        // Cek Icon X atau Posisi Top Right
        if(btn.querySelector('[data-lucide="x"]') || btn.querySelector('[data-lucide="x-circle"]') || (btn.classList.contains('absolute') && btn.classList.contains('right-4'))) {
            btn.classList.add('hidden');
        }
    });
    
    // Pastikan tombol close dari detail view (grafik) tersembunyi agar tidak menumpuk
    const floatClose = document.getElementById('weather-floating-close');
    if(floatClose) floatClose.classList.add('hidden');
    
    panel.classList.remove('rounded-t-[2rem]', 'rounded-t-3xl', 'rounded-2xl', 'rounded-3xl', 'max-h-[85vh]', 'h-auto');

    // 1. HITUNG RUTE & WAKTU (OSRM Routing)
    if(userLatlng) {
        // Hapus garis rute lama jika ada
        if(currentRouteLine) map.removeLayer(currentRouteLine);
        
        const distance = userLatlng.distanceTo(latlng); // Jarak dalam meter

        // Jika jarak > 5000km, jangan hitung rute, tampilkan jarak lurus untuk mencegah error
        if (distance > 5000000) { 
            document.getElementById('panel-dist').innerHTML = `${(distance / 1000).toFixed(0)} km<br><span class="text-xs text-slate-400">(Jarak Lurus)</span>`;
            currentRouteSteps = []; // Kosongkan data rute sebelumnya
        } else {
            // Fetch data rute dari OSRM (Gratis)
            fetch(`https://router.project-osrm.org/route/v1/driving/${userLatlng.lng},${userLatlng.lat};${latlng.lng},${latlng.lat}?overview=full&geometries=geojson&steps=true`)
                .then(res => res.json())
                .then(data => {
                    if(data.routes && data.routes.length > 0) {
                        const route = data.routes[0];
                        const distKm = (route.distance / 1000).toFixed(1);
                        const durationSec = route.duration;
                        
                        // Format Waktu (Jam & Menit)
                        const hours = Math.floor(durationSec / 3600);
                        const minutes = Math.floor((durationSec % 3600) / 60);
                        let timeStr = `${minutes} mnt`;
                        if(hours > 0) timeStr = `${hours} jam ${minutes} mnt`;

                        document.getElementById('panel-dist').innerHTML = `${distKm} km<br><span class="text-xs text-slate-300">${timeStr}</span>`;

                        // Gambar Garis Rute di Peta
                        const routeCoords = route.geometry.coordinates.map(c => [c[1], c[0]]); // GeoJSON [lng,lat] -> Leaflet [lat,lng]
                        currentRouteLine = L.polyline(routeCoords, {color: '#3b82f6', weight: 5, opacity: 0.8, lineCap: 'round'}).addTo(map);
                        
                        // Simpan Steps
                        if(route.legs && route.legs.length > 0) {
                            currentRouteSteps = route.legs[0].steps;
                        }
                    } else {
                        document.getElementById('panel-dist').innerText = "Tidak ada jalan";
                    }
                })
                .catch(() => document.getElementById('panel-dist').innerText = "Gagal hitung");
        }
    }

    // 2. Reverse Geocoding Detail (Nominatim)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`)
        .then(res => res.json())
        .then(data => {
            const addr = data.address;
            
            // Susun alamat lengkap (Jalan, Desa, Kecamatan, Kota)
            let parts = [];
            if(addr.road) parts.push(addr.road);
            if(addr.village) parts.push(addr.village);
            else if(addr.hamlet) parts.push(addr.hamlet);
            if(addr.suburb) parts.push(addr.suburb); // Kecamatan biasanya di sini
            if(addr.city_district) parts.push(addr.city_district);
            if(addr.town) parts.push(addr.town);
            else if(addr.city) parts.push(addr.city);
            else if(addr.county) parts.push(addr.county); // Kabupaten

            // Gabungkan dan potong jika terlalu panjang
            let fullAddr = parts.join(', ');
            if(fullAddr.length > 45) fullAddr = fullAddr.substring(0, 45) + "...";
            
            document.getElementById('panel-address').innerText = fullAddr || "Lokasi Terpilih";
            // NEW: Also update the new header if it exists
            const headerLocation = document.getElementById('header-location');
            if (headerLocation) headerLocation.innerText = fullAddr || "Lokasi Terpilih";
        })
        .catch(() => document.getElementById('panel-address').innerText = "Lokasi Tidak Dikenal");

    // 2.5 Fetch Depth/Elevation (GEBCO via OpenTopoData)
    const depthEl = document.getElementById('wx-depth');
    if(depthEl) depthEl.innerHTML = '<span class="animate-pulse">...</span>';

    // Helper: Fetch dengan Timeout
    const fetchWithTimeout = (url, timeout = 5000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        return fetch(url, { signal: controller.signal })
            .then(res => { clearTimeout(id); return res.json(); });
    };

    // Fallback Terakhir: Open-Meteo (Hanya Darat)
    const fetchLandOnly = () => {
        fetch(`https://api.open-meteo.com/v1/elevation?latitude=${latlng.lat}&longitude=${latlng.lng}`)
            .then(res => res.json())
            .then(data => {
                if(data && data.elevation) {
                    const val = data.elevation[0];
                    // Jika 0 di laut, berarti data tidak ada
                    if(depthEl) depthEl.innerText = (val === 0) ? "0 m (?)" : (val < 0 ? `${Math.abs(Math.round(val))} m` : `+${Math.round(val)} m`);
                } else {
                    if(depthEl) depthEl.innerText = "N/A";
                }
            }).catch(() => { if(depthEl) depthEl.innerText = "--"; });
    };

    // Gunakan CORS Proxy untuk mengatasi error "Blocked by CORS policy"
    const corsProxy = "https://corsproxy.io/?";

    // Strategi Bertingkat: GEBCO (High Res) -> ETOPO1 (Backup) -> Open-Meteo (Land)
    // 1. Coba GEBCO 2020 (Paling Akurat untuk Laut) - Timeout 8 detik
    fetchWithTimeout(`${corsProxy}https://api.opentopodata.org/v1/gebco2020?locations=${latlng.lat},${latlng.lng}`, 8000)
        .then(data => {
            if(data && data.results && data.results.length > 0) {
                const elVal = data.results[0].elevation;
                if(depthEl) depthEl.innerText = (elVal < 0) ? `${Math.abs(Math.round(elVal))} m` : `+${Math.round(elVal)} m`;
            } else {
                throw new Error("GEBCO No Data");
            }
        })
        .catch(() => {
            console.warn("GEBCO timeout/fail, trying ETOPO1...");
            // 2. Coba ETOPO1 (Dataset alternatif yang juga punya data laut, biasanya lebih ringan)
            fetchWithTimeout(`${corsProxy}https://api.opentopodata.org/v1/etopo1?locations=${latlng.lat},${latlng.lng}`, 5000)
                .then(data => {
                    if(data && data.results && data.results.length > 0) {
                        const elVal = data.results[0].elevation;
                        if(depthEl) depthEl.innerText = (elVal < 0) ? `${Math.abs(Math.round(elVal))} m` : `+${Math.round(elVal)} m`;
                    } else {
                        throw new Error("ETOPO1 No Data");
                    }
                })
                .catch(() => {
                    // 3. Jika semua gagal, fallback ke Open-Meteo (Darat Only)
                    console.warn("All bathymetry sources failed, fallback to land data.");
                    fetchLandOnly();
                });
        });

    // 3. Fetch Weather & Marine Data (Open-Meteo API)
    try {
        // Mengambil Weather + Marine (Wave Height) + Sun (Sunrise/Sunset)
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latlng.lat}&longitude=${latlng.lng}&current_weather=true&hourly=temperature_2m,precipitation_probability,precipitation,weathercode,wave_height,windspeed_10m,winddirection_10m,relativehumidity_2m,surface_pressure,visibility,apparent_temperature,dewpoint_2m,cloudcover,windgusts_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,sunrise,sunset,uv_index_max&minutely_15=precipitation&timezone=auto&forecast_days=14`);
        const data = await res.json();
        currentWeatherData = data; // Simpan data untuk detail view
        updateWeatherUI(data);
    } catch(err) {
        document.getElementById('wx-desc').innerText = "Offline";
        document.getElementById('wx-temp').innerText = "-";
        document.getElementById('forecast-list').innerHTML = '<div class="text-center text-red-400 text-xs py-4">Gagal memuat data. Cek koneksi internet.</div>';
        
        // FIX: Update Header Skeleton jika Error (Agar loading tidak macet)
        const hTemp = document.getElementById('header-temp');
        if(hTemp) hTemp.innerText = "--";
        const hDesc = document.getElementById('header-desc');
        if(hDesc) hDesc.innerText = "Data Tidak Tersedia";
        const hMinMax = document.getElementById('header-minmax');
        if(hMinMax) hMinMax.innerText = "Cek koneksi internet";
    }

    // 4. Fetch Tide Data (Marine API)
    try {
        // Added sea_surface_temperature
        const res = await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${latlng.lat}&longitude=${latlng.lng}&hourly=sea_level_height_msl,sea_surface_temperature&timezone=auto`);
        const data = await res.json();
        currentMarineData = data; // Store data for AI Insight

        // Perbaikan: Cek jika API mengembalikan error (misal: lokasi di darat) atau tidak ada data 'hourly'
        if (data.error || !data.hourly) {
            if(data.reason) console.warn("Marine API:", data.reason); // Log alasan error jika ada
            document.getElementById('wx-tide').innerText = "-- m";
            document.getElementById('wx-sst').innerText = "--°C";
        } else {
            const currentHour = new Date().getHours();

            // Handle Tide Data (Enhanced)
            const tideData = data.hourly.sea_level_height_msl;
            if (tideData) {
                const currentLevel = tideData[currentHour];
                const nextLevel = tideData[currentHour + 1] || currentLevel;
                
                // 1. Determine Trend (Naik/Turun)
                const isRising = nextLevel > currentLevel;
                const trendIcon = isRising ? 'trending-up' : 'trending-down';
                const trendColor = isRising ? 'text-cyan-300' : 'text-purple-300';

                // 2. Find Next High & Low (in next 24h)
                let nextHigh = null;
                let nextLow = null;
                
                for(let i = currentHour + 1; i < currentHour + 25; i++) {
                    if(i >= tideData.length - 1) break;
                    const prev = tideData[i-1];
                    const curr = tideData[i];
                    const next = tideData[i+1];
                    
                    if(!nextHigh && curr > prev && curr > next) nextHigh = { h: i % 24, v: curr };
                    if(!nextLow && curr < prev && curr < next) nextLow = { h: i % 24, v: curr };
                    if(nextHigh && nextLow) break;
                }

                // Format Output HTML
                const formatTime = (h) => `${h.toString().padStart(2, '0')}:00`;
                let details = '';
                if(nextHigh) details += `<span class="text-cyan-200">▲ ${formatTime(nextHigh.h)}</span>`;
                if(nextHigh && nextLow) details += `<span class="mx-1 opacity-30">|</span>`;
                if(nextLow) details += `<span class="text-purple-200">▼ ${formatTime(nextLow.h)}</span>`;

                document.getElementById('wx-tide').innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full -mt-1">
                        <div class="flex items-center gap-1 text-lg font-black text-white">
                            <i data-lucide="${trendIcon}" class="w-4 h-4 ${trendColor}"></i>
                            ${currentLevel.toFixed(1)}m
                        </div>
                        <div class="text-[9px] font-bold mt-0.5 flex items-center justify-center w-full">
                            ${details || '<span class="text-slate-500">Stabil</span>'}
                        </div>
                    </div>
                `;
                lucide.createIcons();
            } else {
                document.getElementById('wx-tide').innerText = "-- m";
            }

            // Handle Sea Surface Temperature (SST) Data
            const sst = data.hourly.sea_surface_temperature ? data.hourly.sea_surface_temperature[currentHour] : null;
            document.getElementById('wx-sst').innerText = (sst !== null && typeof sst === 'number') ? `${sst.toFixed(1)}°C` : '--°C';
        }
    } catch(e) { 
        console.log("Marine API data unavailable for this location.", e);
        document.getElementById('wx-tide').innerText = "-- m";
        document.getElementById('wx-sst').innerText = "--°C";
    }

    // 5. NEW: Fetch Air Quality (AQI) untuk Kesehatan
    fetchAirQuality(latlng.lat, latlng.lng);
}

function getMoonPhaseValue(date) {
    const lp = 2551443; 
    const now = new Date(date.getTime());
    const new_moon = new Date(1970, 0, 7, 20, 35, 0);
    const phase = ((now.getTime() - new_moon.getTime()) / 1000) % lp;
    return phase / lp;
}

// Fungsi Update UI Cuaca (Dipisah agar bisa dipanggil saat ganti bahasa)
function updateWeatherUI(data) {
    if(!data || !data.current_weather) return;
    
    // Update Jam Lokal dari Data API
    if(data.current_weather.time) wxLocalHour = parseInt(data.current_weather.time.split('T')[1].split(':')[0]);

    const lang = localStorage.getItem('appLang') || 'id';
    const dt = dynamicTranslations[lang];

    // --- NEW: Dynamic Background handled by Canvas now ---
    const panel = document.getElementById('location-panel');
    let code = data.current_weather.weathercode;
    const isDay = data.current_weather.is_day;

    // --- FIX: Override Weather Code if Rain Detected in Minutely Data ---
    // Open-Meteo current_weather update interval is 1 hour, but minutely_15 is more precise.
    // If minutely data shows rain > 0mm (sekecil apapun), force animation to Rain/Drizzle.
    if (data.minutely_15 && data.minutely_15.precipitation) {
        const pVals = data.minutely_15.precipitation;
        const pTimes = data.minutely_15.time;
        const now = new Date();
        
        // Find current time slot (look back 10 mins to include current interval)
        let currentIdx = pTimes.findIndex(t => new Date(t) > new Date(now.getTime() - 10*60000));
        if (currentIdx === -1) currentIdx = 0;
        
        // --- MODIFIED: Extreme Sensitive Rain Detection (Sekecil Apapun) ---
        // Perluas jangkauan cek ke +/- 60 menit (4 slot sebelum & sesudah)
        // Agar hujan gerimis tipis atau yang baru lewat/akan datang tetap memicu animasi.
        const checkIndices = [currentIdx - 4, currentIdx - 3, currentIdx - 2, currentIdx - 1, currentIdx, currentIdx + 1, currentIdx + 2, currentIdx + 3, currentIdx + 4];
        let hasRain = false;

        for (let idx of checkIndices) {
            if (idx >= 0 && idx < pVals.length) {
                // Jika ada nilai > 0 (walau 0.1mm), anggap hujan
                if (pVals[idx] > 0) {
                    hasRain = true;
                    break;
                }
            }
        }
        
        // Fallback: Jika minutely 0 tapi probability jam ini ada (>5%), anggap hujan
        if (!hasRain && data.hourly) {
            const hIdx = wxLocalHour;
            
            // 1. Cek Curah Hujan Hourly (mm) - Jika ada angka > 0, pasti hujan
            if (data.hourly.precipitation && (data.hourly.precipitation[hIdx] > 0 || (data.hourly.precipitation[hIdx+1] && data.hourly.precipitation[hIdx+1] > 0))) {
                hasRain = true;
            }

            // 2. Cek Probability (>5% sangat sensitif)
            if (!hasRain && data.hourly.precipitation_probability) {
                const probNow = data.hourly.precipitation_probability[hIdx] || 0;
                const probNext = data.hourly.precipitation_probability[hIdx + 1] || 0;
                
                // FIX: Naikkan threshold agar tidak dianggap hujan saat hanya mendung tipis (5% -> 40%)
                if (probNow >= 40 || probNext >= 50) hasRain = true;
            }
            
            // 3. Cek Hourly Weather Code (Jika jam ini diprediksi hujan kode >= 51)
            if (!hasRain && data.hourly.weathercode && data.hourly.weathercode[hIdx] >= 51) hasRain = true;
        }

        if (hasRain) {
            // If current code is Clear/Cloudy (less than 51), force it to Drizzle (51)
            if (code < 51) {
                // LOGIKA NYATA: Cek suhu. Jika <= 1°C anggap Salju (71), jika lebih anggap Hujan (51)
                if (data.current_weather.temperature <= 1) {
                    code = 71; // Force Snow
                } else {
                    code = 51; // Force Drizzle/Light Rain
                }
            }
        }
    }

    panel.style.setProperty('background', 'transparent', 'important'); // Ensure transparency
    panel.style.setProperty('backdrop-filter', 'none', 'important'); // Ensure no blur
    panel.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
    
    // --- NEW: Hitung Jam Lokal Lokasi Terpilih ---
    const timeZone = data.timezone || 'UTC';
    const localTimeStr = new Date().toLocaleTimeString('en-GB', { timeZone: timeZone, hour: '2-digit', minute: '2-digit' });

    // --- NEW: Create and Populate iPhone-style Header ---
    // FIX: Gunakan panel langsung sebagai container
    if (panel) {
        let header = document.getElementById('new-weather-header');
        if (!header) {
            header = document.createElement('div');
            header.id = 'new-weather-header';
            // FIX: Tambah jarak atas (pt-16) dan jarak bawah ke grid (pb-10) agar lebih lega
            header.className = 'flex flex-col items-center text-white pt-16 pb-10 px-4 text-center';
            header.innerHTML = `
                <div class="flex items-center justify-center gap-2 px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-blue-400 w-6 h-6 drop-shadow-md"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <h2 id="header-location" class="text-3xl font-bold tracking-tight text-center leading-tight line-clamp-2" style="text-shadow: 0 2px 4px rgb(0 0 0 / 0.5);"></h2>
                </div>
                <p class="text-sm font-medium text-slate-200 mt-1 mb-2 opacity-90 tracking-wide" style="text-shadow: 0 1px 3px rgb(0 0 0 / 0.4);"><span id="header-time">--:--</span></p>
                
                <p id="header-temp" class="text-8xl font-thin -my-2 tracking-tighter" style="font-family: -apple-system, sans-serif; text-shadow: 0 3px 8px rgb(0 0 0 / 0.5);"></p>
                
                <p id="header-desc" class="text-xl font-medium mt-1" style="text-shadow: 0 1px 3px rgb(0 0 0 / 0.4);"></p>
                <p id="header-minmax" class="text-sm font-medium opacity-80" style="text-shadow: 0 1px 3px rgb(0 0 0 / 0.4);"></p>
            `;
            // Insert header at the top of the panel content
            panel.insertBefore(header, panel.firstChild);

            // Hide the old elements that are now in the header.
            const oldAddress = document.getElementById('panel-address');
            const oldCoords = document.getElementById('panel-coords');
            const oldDist = document.getElementById('panel-dist');
            const oldTitle = panel.querySelector('h2.text-2xl');
            
            if (oldAddress) oldAddress.classList.add('hidden');
            if (oldCoords) oldCoords.classList.add('hidden');
            if (oldDist) oldDist.classList.add('hidden');
            if (oldTitle) oldTitle.classList.add('hidden');
            
            // Hapus icon map-pin lama (yang warna biru/lainnya) yang mungkin tertinggal
            // const panel = document.getElementById('location-panel'); // REMOVED: Redundant declaration
            const strayPins = panel.querySelectorAll('[data-lucide="map-pin"], .lucide-map-pin');
            strayPins.forEach(pin => {
                if (!pin.closest('#new-weather-header')) pin.classList.add('hidden');
            });

            // Hide the now-redundant cards from the scroll view
            const tempCard = document.querySelector('[onclick="showMetricInsight(\'temp\')"]');
            const weatherCard = document.querySelector('[onclick="showMetricInsight(\'weather\')"]');
            if (tempCard) tempCard.classList.add('hidden');
            if (weatherCard) weatherCard.classList.add('hidden');
        }

        // FIX: Pastikan icon lama terhapus (jalankan setiap update)
        const strayPins = document.getElementById('location-panel').querySelectorAll('[data-lucide="map-pin"], .lucide-map-pin');
        strayPins.forEach(pin => {
            if (!pin.closest('#new-weather-header')) {
                pin.style.display = 'none';
            }
        });

        // Populate new header with data
        // FIX: Pastikan elemen loading dibersihkan sebelum diisi teks
        const hTemp = document.getElementById('header-temp');
        if(hTemp) { hTemp.innerHTML = ""; hTemp.innerText = `${Math.round(data.current_weather.temperature)}°`; }
        
        const hMinMax = document.getElementById('header-minmax');
        if(hMinMax) { 
            hMinMax.innerHTML = ""; 
            if (data.daily && data.daily.temperature_2m_max && data.daily.temperature_2m_min) {
                hMinMax.innerText = `Tertinggi: ${Math.round(data.daily.temperature_2m_max[0])}° Terendah: ${Math.round(data.daily.temperature_2m_min[0])}°`; 
            } else {
                hMinMax.innerText = "-- / --";
            }
        }
        
        document.getElementById('header-time').innerText = localTimeStr;
    }

    const wx = data.current_weather;
    document.getElementById('wx-temp').innerText = `${Math.round(wx.temperature)}°`;
    document.getElementById('wx-wind-speed').innerText = wx.windspeed;
    
    // Rotasi panah angin
    const arrow = document.getElementById('wx-wind-dir');
    arrow.style.transform = `rotate(${wx.winddirection}deg)`;
    
    // Kode cuaca sederhana (WMO code)
    
    // Mapping Kode ke Deskripsi
    let desc = dt.weather[code] || dt.weather[0]; // Default Cerah
    // Mapping kasar jika kode tidak ada di list utama
    if(!dt.weather[code]) {
        if(code > 3) desc = dt.weather[2]; // Berawan
        if(code > 50) desc = dt.weather[61]; // Hujan
        if(code >= 70 && code <= 79) desc = dt.weather[71]; // Salju
        if(code >= 85 && code <= 86) desc = dt.weather[71]; // Salju
        if(code > 80) desc = dt.weather[95]; // Badai
    }

    document.getElementById('wx-desc').innerText = desc; // Keep old one for the card logic
    const headerDesc = document.getElementById('header-desc');
    if (headerDesc) headerDesc.innerText = desc;
    const headerLocation = document.getElementById('header-location');
    if(headerLocation) headerLocation.innerText = document.getElementById('panel-address').innerText;

    // Cek Animasi Cuaca untuk lokasi yang dipilih
    // Hanya jalankan animasi jika panel cuaca sedang terbuka
    if (!document.getElementById('location-panel').classList.contains('translate-y-full')) {
        // MODIFIED: Gunakan SunCalc untuk akurasi fase bulan (Realtime)
        if (typeof SunCalc !== 'undefined') {
            moonPhase = SunCalc.getMoonIllumination(new Date()).phase;
        } else {
            moonPhase = getMoonPhaseValue(new Date()); 
        }
        checkWeatherAnimation(code, wx.windspeed, isDay);
    }

    // Ambil data ombak jam sekarang
    if(data.hourly && data.hourly.wave_height) {
        const currentHour = new Date().getHours();
        const waveHeight = data.hourly.wave_height[currentHour] || 0;
        document.getElementById('wx-wave').innerText = `${waveHeight} m`;
    }
    
    // Data Matahari (Sunrise/Sunset)
    if(data.daily && data.daily.sunrise && data.daily.sunset) {
        const sunrise = data.daily.sunrise[0].split('T')[1];
        const sunset = data.daily.sunset[0].split('T')[1];
        document.getElementById('wx-sun').innerHTML = `<div class="flex items-center justify-center gap-1"><i data-lucide="sunrise" class="w-3 h-3 text-yellow-300"></i> ${sunrise}</div><div class="flex items-center justify-center gap-1"><i data-lucide="sunset" class="w-3 h-3 text-orange-400"></i> ${sunset}</div>`;
    }

    // AI Score Calculation
    let score = 90; // Base score
    if(wx.windspeed > 15) score -= 10;
    if(wx.windspeed > 25) score -= 20;
    if(wx.temperature < 20 || wx.temperature > 32) score -= 10;
    if(wx.weathercode > 3) score -= 5;
    if(wx.weathercode > 50) score -= 20;
    if(wx.weathercode > 80) score -= 40;
    
    // Tampilkan Score
    document.getElementById('wx-score').innerText = `${Math.max(10, score)}%`;

    // --- NEW: HOURLY FORECAST (iPhone Style) ---
    // Cari atau buat container baru DI BAWAH weather-scroll agar fitur lama (AI Score dll) tetap ada
    let hourlySummaryContainer = document.getElementById('hourly-summary-container');
    let precipChartContainer = document.getElementById('precip-chart-container'); // Container Grafik Hujan
    let hourlyContainer = document.getElementById('hourly-forecast-container');
    const existingScroll = document.getElementById('weather-scroll');
    const dotsContainer = document.getElementById('scroll-dots');

    if (!hourlyContainer && existingScroll) {
        const referenceNode = dotsContainer || existingScroll;
        const parentNode = referenceNode.parentNode;

        // --- MODIFIED: Pisahkan Precip Chart, tapi Gabungkan Summary ke Hourly ---
        // LIQUID GLASS STYLE: bg-slate-900/30 (Transparan), backdrop-blur-xl (Blur Kuat)
        const cardClass = "mx-0 mb-3 bg-neutral-900/30 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden p-1";

        // 1. Precip Chart Card (Hidden by default) - Separate
        const precipCard = document.createElement('div');
        precipCard.id = 'precip-card';
        precipCard.className = cardClass + " hidden";
        if(parentNode) parentNode.insertBefore(precipCard, referenceNode.nextSibling);

        precipChartContainer = document.createElement('div');
        precipChartContainer.id = 'precip-chart-container';
        precipChartContainer.className = "px-4 py-2";
        precipCard.appendChild(precipChartContainer);

        // 2. Hourly Forecast Card (Summary + Scroll)
        const hourlyCard = document.createElement('div');
        hourlyCard.id = 'hourly-card';
        hourlyCard.className = cardClass;
        if(parentNode) parentNode.insertBefore(hourlyCard, precipCard.nextSibling);

        // 2a. Summary (Header)
        hourlySummaryContainer = document.createElement('div');
        hourlySummaryContainer.id = 'hourly-summary-container';
        hourlySummaryContainer.className = "px-4 py-3 text-xs text-slate-200 leading-relaxed font-medium border-b border-white/5";
        hourlyCard.appendChild(hourlySummaryContainer);

        // 2b. Scroll List
        hourlyContainer = document.createElement('div');
        hourlyContainer.id = 'hourly-forecast-container';
        hourlyContainer.className = "flex items-stretch gap-x-4 overflow-x-auto no-scrollbar p-4";
        hourlyCard.appendChild(hourlyContainer);
    }

    if (hourlyContainer && data.hourly && data.hourly.time && data.daily) {
        
        // Helper: Cek Salju (Codes: 71, 73, 75, 77, 85, 86)
        const getPrecipType = (c) => [71, 73, 75, 77, 85, 86].includes(c) ? "Salju" : "Hujan";
        
        // --- NEW: PRECIPITATION CHART LOGIC (Next Hour) ---
        if (data.minutely_15 && data.minutely_15.precipitation && precipChartContainer) {
            const pTimes = data.minutely_15.time.map(t => new Date(t).getTime());
            const pVals = data.minutely_15.precipitation;
            const now = new Date();
            const nowTime = now.getTime();
            
            // MODIFIED: Generate 30 slots for the next 60 minutes (1 slot per 2 mins) for a smoother graph
            const nextSlots = [];
            let hasRain = false;
            const totalSlots = 30; // 30 bars for 60 minutes
            const minuteInterval = 2; // 2 minutes per bar
            
            for(let i=0; i < totalSlots; i++) {
                const targetTime = nowTime + (i * minuteInterval * 60 * 1000);
                
                // Find index in original data (Interpolation)
                let idx = pTimes.findIndex(t => t >= targetTime);
                
                let val = 0;
                if (idx === -1) {
                    val = pVals[pVals.length - 1] || 0;
                } else if (idx === 0) {
                    val = pVals[0] || 0;
                } else {
                    // Linear Interpolation
                    const t2 = pTimes[idx];
                    const t1 = pTimes[idx - 1];
                    const v2 = pVals[idx];
                    const v1 = pVals[idx - 1];
                    
                    if (t2 === t1) {
                        val = v1;
                    } else {
                        const factor = (targetTime - t1) / (t2 - t1);
                        val = v1 + (v2 - v1) * factor;
                    }
                }
                
                // Clamp & Round
                val = Math.max(0, Math.round(val * 100) / 100);
                if(val > 0.05) hasRain = true;
                
                // Label: "Kini", lalu setiap 10 menit (kelipatan 5 batang jika interval 2 menit)
                let label = '';
                if (i === 0) label = "Kini";
                else if ((i * minuteInterval) % 10 === 0) label = `${i * minuteInterval}m`;
                
                nextSlots.push({ t: targetTime, v: val, label: label });
            }

            if (hasRain) {
                precipChartContainer.classList.remove('hidden');
                const pCard = document.getElementById('precip-card');
                if(pCard) pCard.classList.remove('hidden');
                
                // Generate Text Status
                const pTypeChart = getPrecipType(wx.weathercode);
                let statusText = `${pTypeChart} ringan untuk beberapa saat.`;
                const currentVal = nextSlots[0].v;
                
                if (currentVal > 0.05) {
                    // Sedang Hujan -> Cari kapan berhenti
                    const stopIdx = nextSlots.findIndex(s => s.v <= 0.05);
                    if (stopIdx !== -1) {
                        const diffMin = stopIdx * minuteInterval;
                        statusText = `${pTypeChart} berhenti dalam ${diffMin} menit.`;
                    } else {
                        statusText = `${pTypeChart} berlanjut untuk 1 jam ke depan.`;
                    }
                } else {
                    // Tidak Hujan -> Cari kapan mulai
                    const startRainIdx = nextSlots.findIndex(s => s.v > 0.05);
                    if (startRainIdx !== -1) {
                        const diffMin = startRainIdx * minuteInterval;
                        statusText = `${pTypeChart} dimulai dalam ${diffMin} menit.`;
                    }
                }

                // Generate Chart HTML
                const maxP = Math.max(...nextSlots.map(s => s.v), 1); // Scaling
                let barsHtml = nextSlots.map(s => {
                    const heightPct = Math.min((s.v / maxP) * 100, 100);
                    const barColor = s.v > 0.05 ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]' : 'bg-neutral-700/30';
                    return `<div class="flex flex-col items-center justify-end h-20 flex-1 gap-1"><div class="w-1 rounded-full ${barColor} transition-all duration-500" style="height: ${Math.max(heightPct, 5)}%"></div><span class="text-[9px] text-slate-400 font-mono">${s.label}</span></div>`;
                }).join('');

                precipChartContainer.innerHTML = `<p class="text-xs font-bold text-white mb-2 flex items-center gap-2"><i data-lucide="cloud-rain" class="w-4 h-4 text-blue-400"></i> ${statusText}</p><div class="flex items-end justify-between gap-0.5 h-16 border-b border-white/5 pb-1">${barsHtml}</div>`;
            } else {
                precipChartContainer.classList.add('hidden');
                const pCard = document.getElementById('precip-card');
                if(pCard) pCard.classList.add('hidden');
            }
        }

        hourlyContainer.innerHTML = ''; // Clear only the new container

        // NEW: Populate Summary Text
        if (hourlySummaryContainer) {
            const currentCode = wx.weathercode;
            
            // Smart Summary Logic
            let smartText = "";
            const hourlyCode = data.hourly.weathercode;
            const nowIdx = new Date().getHours();
            
            // NEW: Use Minutely Data for better precision
            let minutelyUsed = false;
            if (data.minutely_15 && data.minutely_15.precipitation) {
                const pVals = data.minutely_15.precipitation;
                const pTimes = data.minutely_15.time;
                const now = new Date();
                let startIdx = pTimes.findIndex(t => new Date(t) > new Date(now.getTime() - 10*60000));
                if (startIdx === -1) startIdx = 0;
                
                const currentP = pVals[startIdx] || 0;
                const pType = getPrecipType(currentCode);

                if (currentP > 0) { // Sedang Hujan
                    let stopIdx = -1;
                    for(let i=startIdx; i<pVals.length; i++) { if(pVals[i] === 0) { stopIdx = i; break; } }
                    if(stopIdx !== -1) {
                        const diffMin = Math.ceil((new Date(pTimes[stopIdx]) - now) / 60000);
                        if(diffMin <= 120) { smartText = `${pType} berhenti dalam ${diffMin} menit.`; minutelyUsed = true; }
                    }
                } else { // Tidak Hujan
                    let startRainIdx = -1;
                    for(let i=startIdx; i<pVals.length; i++) { if(pVals[i] > 0) { startRainIdx = i; break; } }
                    if(startRainIdx !== -1) {
                        const diffMin = Math.ceil((new Date(pTimes[startRainIdx]) - now) / 60000);
                        if(diffMin <= 120) { smartText = `${pType} dimulai dalam ${diffMin} menit.`; minutelyUsed = true; }
                    }
                }
            }

            if (!minutelyUsed) {
                if (currentCode >= 51) { // Sedang Hujan/Salju
                    const pType = getPrecipType(currentCode);
                    let stopIdx = -1;
                    for(let i=nowIdx; i<nowIdx+12; i++) { if(hourlyCode[i] < 51) { stopIdx = i; break; } }
                    if(stopIdx !== -1) {
                        const h = stopIdx % 24;
                        const dayLabel = stopIdx >= 24 ? "besok " : "";
                        smartText = `${pType} diperkirakan reda sekitar ${dayLabel}jam ${h}:00.`;
                    }
                    else smartText = `${pType} diperkirakan berlanjut hingga malam.`;
                } else { // Sedang Cerah/Berawan
                    let startIdx = -1;
                    let nextType = "Hujan";
                    for(let i=nowIdx; i<nowIdx+12; i++) { if(hourlyCode[i] >= 51) { startIdx = i; nextType = getPrecipType(hourlyCode[i]); break; } }
                    if(startIdx !== -1) {
                        const h = startIdx % 24;
                        const dayLabel = startIdx >= 24 ? "besok " : "";
                        smartText = `Cerah saat ini. ${nextType} diperkirakan mulai ${dayLabel}jam ${h}:00.`;
                    }
                    else smartText = `Cuaca cenderung stabil untuk 12 jam ke depan.`;
                }
            }
            
            const maxWind = (data.daily.windspeed_10m_max) ? data.daily.windspeed_10m_max[0] : 0;
            let summaryText = `${smartText} Angin hingga <strong>${maxWind} km/j</strong>.`;
            hourlySummaryContainer.innerHTML = `<p>${summaryText}</p>`;
        }

        const now = new Date();
        const endOfForecast = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const currentHour = now.getHours();

        // 1. Buat daftar semua acara (per jam, matahari terbit, terbenam)
        let timelineEvents = [];

        // Tambahkan data prakiraan per jam
        for (let i = 0; i < 24; i++) {
            const hourIndex = currentHour + i;
            if (hourIndex >= data.hourly.time.length) break;

            const date = new Date(data.hourly.time[hourIndex]);
            timelineEvents.push({
                type: 'hourly',
                date: date,
                temp: Math.round(data.hourly.temperature_2m[hourIndex]),
                code: data.hourly.weathercode[hourIndex],
                pop: data.hourly.precipitation_probability[hourIndex], // Chance of Rain
                isNow: i === 0
            });
        }

        // Tambahkan acara matahari terbit/terbenam untuk hari ini dan besok
        if (data.daily.sunrise && data.daily.sunset) {
            const todaySunrise = new Date(data.daily.sunrise[0]);
            const todaySunset = new Date(data.daily.sunset[0]);
            if (data.daily.sunrise[1]) {
                const tomorrowSunrise = new Date(data.daily.sunrise[1]);
                if (tomorrowSunrise > now && tomorrowSunrise < endOfForecast) {
                    timelineEvents.push({ type: 'sunrise', date: tomorrowSunrise });
                }
            }
            if (todaySunrise > now && todaySunrise < endOfForecast) {
                timelineEvents.push({ type: 'sunrise', date: todaySunrise });
            }
            if (todaySunset > now && todaySunset < endOfForecast) {
                timelineEvents.push({ type: 'sunset', date: todaySunset });
            }
        }

        // 2. Urutkan semua acara berdasarkan waktu
        timelineEvents.sort((a, b) => a.date - b.date);

        // 3. Render acara yang sudah diurutkan
        const sunriseLabel = { id: 'Terbit', en: 'Sunrise', jp: '日の出' }[lang];
        const sunsetLabel = { id: 'Terbenam', en: 'Sunset', jp: '日没' }[lang];

        timelineEvents.forEach(event => {
            const item = document.createElement('div');
            const hour = event.date.getHours();
            const minutes = event.date.getMinutes().toString().padStart(2, '0');

            if (event.type === 'hourly') {
                // Logika ikon dinamis siang/malam
                const isNight = hour >= 19 || hour < 6;
                let icon = getWeatherIcon(event.code);
                let iconColorClass = 'text-white';

                if (isNight) {
                    if (icon === 'sun') icon = 'moon';
                    if (icon === 'cloud-sun') icon = 'cloud-moon';
                } else { // Day
                    if (icon === 'sun') iconColorClass = 'text-yellow-300';
                }

                item.className = "flex flex-col items-center justify-between py-2 shrink-0 w-14 border-b-2 border-transparent hover:bg-white/5 rounded-lg transition-colors";
                const timeText = event.isNow ? (lang === 'en' ? 'Now' : 'Kini') : `${hour.toString().padStart(2, '0')}`;
                const textWeight = event.isNow ? 'font-bold text-white' : 'font-medium text-slate-300';
                if (event.isNow) item.classList.replace('border-transparent', 'border-blue-500');
                
                // Add Rain Probability if significant
                const popHtml = (event.pop >= 30) ? `<div class="text-[9px] font-bold text-blue-200 flex items-center justify-center gap-0.5 mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="text-blue-400"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>${event.pop}%</div>` : '';
                
                // FIX: Dual Color Icon for Cloud-Sun (Sun Yellow, Cloud White)
                let iconHtml = `<i data-lucide="${icon}" class="w-6 h-6 ${iconColorClass} drop-shadow-lg my-1"></i>`;
                if (icon === 'cloud-sun') {
                    iconHtml = `
                        <div class="relative w-6 h-6 my-1">
                            <i data-lucide="sun" class="absolute -top-0.5 -right-0.5 w-4 h-4 text-yellow-300 fill-yellow-300/20"></i>
                            <i data-lucide="cloud" class="absolute bottom-0 left-0 w-5 h-5 text-white fill-white/10"></i>
                        </div>
                    `;
                }

                item.innerHTML = `<div class="text-xs ${textWeight}">${timeText}</div>${iconHtml}<div class="text-lg font-bold text-white leading-none">${event.temp}°</div>${popHtml}`;
            } else { // Sunrise or Sunset
                const isSunrise = event.type === 'sunrise';
                item.className = "flex flex-col items-center justify-end py-2 shrink-0 w-20 text-center"; // Lebih lebar untuk teks
                item.innerHTML = `<div class="text-xs font-medium ${isSunrise ? 'text-yellow-300' : 'text-orange-400'} mb-2">${isSunrise ? sunriseLabel : sunsetLabel}</div><i data-lucide="${isSunrise ? 'sunrise' : 'sunset'}" class="w-7 h-7 ${isSunrise ? 'text-yellow-400' : 'text-orange-400'} drop-shadow-lg mb-2"></i><div class="text-lg font-bold text-white">${hour}:${minutes}</div>`;
            }
            hourlyContainer.appendChild(item);
        });

        lucide.createIcons();
    }

    // --- FITUR BARU: 7-DAY FORECAST & FISHING RATING ---
    if(data.daily) {
        // Hapus Judul Lama (External) sesuai permintaan
        const oldTitle = document.querySelector('[data-i18n="forecast_title"]');
        if(oldTitle) {
            oldTitle.style.display = 'none';
            if(oldTitle.parentElement) oldTitle.parentElement.style.display = 'none'; // Sembunyikan container judul lama
        }

        const list = document.getElementById('forecast-list');
        list.className = "mx-0 bg-neutral-900/30 backdrop-blur-xl rounded-xl border border-white/20 p-2 shadow-lg"; // Style Kartu 7 Hari (Liquid Glass)
        list.innerHTML = ''; // Clear

        // --- RESTORED: Judul Header Kartu 7 Hari (Internal) ---
        const titleDiv = document.createElement('div');
        titleDiv.className = "px-2 py-2 mb-2 flex items-center gap-2 border-b border-white/5";
        const titleText = lang === 'en' ? '10-Day Forecast' : (lang === 'jp' ? '10日間予報' : 'Prakiraan 10 Hari');
        titleDiv.innerHTML = `<i data-lucide="calendar" class="w-4 h-4 text-slate-400"></i> <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">${titleText}</span>`;
        list.appendChild(titleDiv);

        // Pre-calculate overall min/max temps for consistent bar scaling (iPhone style)
        const allMinTemps = data.daily.temperature_2m_min.slice(0, 10);
        const allMaxTemps = data.daily.temperature_2m_max.slice(0, 10);
        const overallMinTemp = Math.min(...allMinTemps);
        const overallMaxTemp = Math.max(...allMaxTemps);
        const totalRange = (overallMaxTemp - overallMinTemp) || 1; // Avoid division by zero
        
        // Helper Warna Suhu (iPhone Style Gradient)
        const getTempColor = (t) => {
            if (t < 10) return '#3b82f6'; // Blue
            if (t < 20) return '#22d3ee'; // Cyan
            if (t < 28) return '#4ade80'; // Green
            if (t < 32) return '#facc15'; // Yellow
            return '#f97316'; // Orange/Red
        };

        for(let i=0; i<Math.min(data.daily.time.length, 10); i++) {
            const date = new Date(data.daily.time[i]);
            const dayName = i === 0 ? (lang === 'en' ? 'Today' : (lang === 'jp' ? '今日' : 'Hari Ini')) : dt.days[date.getDay()];
            const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
            const minTemp = Math.round(data.daily.temperature_2m_min[i]);
            const code = data.daily.weathercode[i];
            const isSnowDay = [71, 73, 75, 77, 85, 86].includes(code);
            const rainSum = data.daily.precipitation_sum[i];
            const rainProb = data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[i] : 0;

            // Calculate bar dimensions based on the overall range
            const leftOffset = ((minTemp - overallMinTemp) / totalRange) * 100;
            const barWidth = ((maxTemp - minTemp) / totalRange) * 100;

            // Dynamic Icon Color
            const iconColor = "text-white"; // FIX: Force all icons to be white for consistency
            
            // Gradient Bar Colors
            const c1 = getTempColor(minTemp);
            const c2 = getTempColor(maxTemp);

            const item = document.createElement('div');
            // Improved Aesthetics: Card-like row, better spacing, hover effect
            item.className = "flex items-center justify-between py-3 px-3 mx-2 mb-0 rounded-lg cursor-pointer hover:bg-white/5 transition-all duration-200 group border-b border-white/5 last:border-0";
            item.onclick = () => openDetailModal(i); // Tambahkan event klik

            // FIX: Dual Color Icon for Cloud-Sun (Sun Yellow, Cloud White)
            let iconHtml = `<i data-lucide="${getWeatherIcon(code)}" class="w-6 h-6 ${iconColor} drop-shadow-md transition-transform group-hover:scale-110"></i>`;
            if (getWeatherIcon(code) === 'cloud-sun') {
                iconHtml = `
                    <div class="relative w-6 h-6 group-hover:scale-110 transition-transform">
                        <i data-lucide="sun" class="absolute -top-1 -right-1 w-4 h-4 text-white fill-white/20"></i>
                        <i data-lucide="cloud" class="absolute bottom-0 left-0 w-5 h-5 text-white fill-white/10"></i>
                    </div>
                `;
            }

            item.innerHTML = `
                <div class="w-[22%] text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">${dayName}</div>
                <div class="w-[18%] flex flex-col items-center justify-center">
                    ${iconHtml}
                    ${rainProb >= 20 ? `<span class="text-[9px] font-bold ${isSnowDay ? 'text-cyan-200' : 'text-blue-300'} mt-0.5">${rainProb}%</span>` : ''}
                </div>
                <div class="w-[60%] flex items-center gap-3 pl-1">
                    <span class="text-slate-200 text-xs font-medium w-6 text-right">${minTemp}°</span>
                    <div class="flex-1 h-1.5 bg-slate-700/50 rounded-full relative overflow-hidden">
                        <div class="absolute h-full rounded-full opacity-90"
                             style="left: ${leftOffset.toFixed(2)}%; width: ${barWidth.toFixed(2)}%; background: linear-gradient(to right, ${c1}, ${c2});">
                        </div>
                    </div>
                    <span class="text-white text-xs font-bold w-6 text-left">${maxTemp}°</span>
                </div>
            `;
            list.appendChild(item);
        }
        lucide.createIcons();

        // --- NEW: Load Earthquake Info (Async) ---
        fetchEarthquakeInfo();

        // --- NEW: Inject Precipitation Map Card ---
        if(typeof injectPrecipitationCard === 'function') {
            injectPrecipitationCard(data.latitude, data.longitude);
        }
    }
}

// --- INTERNAL ROUTE MODAL FUNCTIONS ---
function openRouteModal() {
    if(!currentRouteSteps || currentRouteSteps.length === 0) {
        // Jika rute belum ada (misal belum klik peta), coba hitung atau alert
        if(tempLatlng && userLatlng) {
            alert("Sedang menghitung rute... Silakan tunggu sebentar.");
            return;
        }
        alert("Rute tidak tersedia. Pastikan lokasi Anda terdeteksi.");
        return;
    }
    
    const list = document.getElementById('route-steps-list');
    list.innerHTML = '';
    
    currentRouteSteps.forEach((step, index) => {
        const dist = step.distance < 1000 ? `${Math.round(step.distance)} m` : `${(step.distance/1000).toFixed(1)} km`;
        const instr = step.maneuver.type; 
        const mod = step.maneuver.modifier; 
        const name = step.name || "Jalan";
        
        // Mapping Icon & Text Sederhana
        let icon = "arrow-up";
        let actionText = "Lurus";
        
        if(mod && mod.includes('left')) { icon = "corner-up-left"; actionText = "Belok Kiri"; }
        else if(mod && mod.includes('right')) { icon = "corner-up-right"; actionText = "Belok Kanan"; }
        else if(mod === 'uturn') { icon = "refresh-ccw"; actionText = "Putar Balik"; }
        else if(instr === 'arrive') { icon = "map-pin"; actionText = "Tiba di Tujuan"; }
        else if(instr === 'depart') { icon = "navigation"; actionText = "Mulai Perjalanan"; }
        
        const item = document.createElement('div');
        // Layout Timeline Modern
        item.className = "relative pl-2 py-1 flex items-start gap-3 group";
        
        // Garis vertikal (Timeline)
        const isLast = index === currentRouteSteps.length - 1;
        const line = !isLast ? `<div class="absolute top-10 bottom-0 w-0.5 bg-slate-700 group-hover:bg-blue-500/50 transition-colors" style="left: 19px;"></div>` : '';

        // Warna Icon Dinamis
        let iconBg = "bg-slate-800 border-slate-700";
        let iconColor = "text-slate-400";
        
        if(instr === 'depart') { iconBg = "bg-blue-500/20 border-blue-500/50"; iconColor = "text-blue-400"; }
        else if(instr === 'arrive') { iconBg = "bg-emerald-500/20 border-emerald-500/50"; iconColor = "text-emerald-400"; }
        else if(mod && (mod.includes('left') || mod.includes('right'))) { iconColor = "text-white"; }

        item.innerHTML = `
            ${line}
            <div class="z-10 mt-1 ${iconBg} p-2 rounded-full border shrink-0 shadow-sm transition-all group-hover:scale-110 group-hover:shadow-blue-500/20">
                <i data-lucide="${icon}" class="w-4 h-4 ${iconColor}"></i>
            </div>
            <div class="flex-1 bg-neutral-800/30 p-3 rounded-xl border border-white/5 hover:bg-neutral-800 hover:border-blue-500/30 transition-all">
                <div class="flex justify-between items-start mb-1">
                    <p class="font-bold text-white text-sm leading-tight">${actionText}</p>
                    <span class="text-[10px] font-mono text-slate-400 bg-black/20 px-1.5 py-0.5 rounded border border-white/5">${dist}</span>
                </div>
                <p class="text-xs text-slate-400 line-clamp-2">${name}</p>
            </div>
        `;
        list.appendChild(item);
    });
    
    document.getElementById('routeModal').classList.remove('translate-y-full');
    lucide.createIcons();
}

function closeRouteModal() {
    document.getElementById('routeModal').classList.add('translate-y-full');
}

function getWeatherIcon(code) {
    if (code === 0) return 'sun'; // Cerah
    if (code >= 1 && code <= 2) return 'cloud-sun'; // Sedikit Berawan
    if (code === 3) return 'cloud'; // Berawan
    if (code >= 45 && code <= 48) return 'cloud-fog'; // Kabut
    if (code >= 51 && code <= 67) return 'cloud-drizzle'; // Hujan Ringan
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snowflake'; // Salju
    if (code >= 80 && code <= 82) return 'cloud-rain'; // Hujan Deras
    if (code >= 95) return 'cloud-lightning'; // Badai
    return 'sun'; // Default
}

function closeLocationPanel() {
    // Kembali ke Peta alih-alih menutup panel (karena sekarang ini halaman)
    if (typeof navigateTo === 'function') {
        navigateTo('map');
    }
}

// --- FITUR DETAIL CUACA (Chart & Hourly) ---
let currentChartType = 'temp';
let currentDayIndex = 0;
const solunarTranslations = { id: "Aktivitas Ikan", en: "Fish Activity", jp: "魚の活性" };

function openDetailModal(dayIndex) {
    // closeLocationPanel(); // JANGAN tutup panel utama agar bisa kembali
    
    if(!currentWeatherData || !currentWeatherData.hourly) return;
    
    currentDayIndex = dayIndex;
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dateStr = currentWeatherData.daily.time[dayIndex];
    // Penting: Set ke tengah hari agar kalkulasi 1 hari penuh akurat
    const dateObj = new Date(dateStr + 'T12:00:00');
    
    document.getElementById('tab-solunar').innerText = solunarTranslations[localStorage.getItem('appLang') || 'id'];

    document.getElementById('detail-title').innerText = days[dateObj.getDay()];
    document.getElementById('detail-date').innerText = dateStr;
    
    // Update Advanced Details (Ambil data jam 12 siang sebagai representasi)
    const noonIdx = (dayIndex * 24) + 12;
    const humidity = currentWeatherData.hourly.relativehumidity_2m[noonIdx] || '-';
    const pressure = currentWeatherData.hourly.surface_pressure[noonIdx] || '-';
    const uv = currentWeatherData.daily.uv_index_max[dayIndex] || '-';
    
    document.getElementById('det-humidity').innerText = `${humidity}%`;
    document.getElementById('det-pressure').innerText = `${pressure} hPa`;
    document.getElementById('det-uv').innerText = uv;
    
    // --- NEW: Extra Weather Details ---
    const feelsLike = currentWeatherData.hourly.apparent_temperature ? Math.round(currentWeatherData.hourly.apparent_temperature[noonIdx]) : '-';
    const dewPoint = currentWeatherData.hourly.dewpoint_2m ? Math.round(currentWeatherData.hourly.dewpoint_2m[noonIdx]) : '-';
    const cloudCover = currentWeatherData.hourly.cloudcover ? currentWeatherData.hourly.cloudcover[noonIdx] : '-';
    const windGust = currentWeatherData.hourly.windgusts_10m ? currentWeatherData.hourly.windgusts_10m[noonIdx] : '-';
    const visibility = currentWeatherData.hourly.visibility ? (currentWeatherData.hourly.visibility[noonIdx] / 1000).toFixed(1) : '-';
    
    // --- NEW: Pressure Trend Calculation (3 Jam Terakhir) ---
    // Ikan sensitif terhadap perubahan tekanan. Turun = Buruk, Naik/Stabil = Bagus.
    const currentP = currentWeatherData.hourly.surface_pressure[noonIdx] || 0;
    const prevP = currentWeatherData.hourly.surface_pressure[noonIdx - 3] || currentP;
    let pTrend = "Stabil";
    if (currentP > prevP + 1) pTrend = "Naik";
    else if (currentP < prevP - 1) pTrend = "Turun";

    const extraDetailsHtml = `
        <div class="grid grid-cols-3 gap-2 mb-4 mt-2">
            <div class="bg-neutral-800/50 p-2 rounded-xl border border-white/5 text-center">
                <p class="text-[9px] text-slate-400 uppercase font-bold">Terasa Spt</p>
                <p class="text-sm font-bold text-white">${feelsLike}°</p>
            </div>
            <div class="bg-neutral-800/50 p-2 rounded-xl border border-white/5 text-center">
                <p class="text-[9px] text-slate-400 uppercase font-bold">Awan</p>
                <p class="text-sm font-bold text-white">${cloudCover}<span class="text-[9px]">%</span></p>
            </div>
            <div class="bg-neutral-800/50 p-2 rounded-xl border border-white/5 text-center">
                <p class="text-[9px] text-slate-400 uppercase font-bold">Gust Angin</p>
                <p class="text-sm font-bold text-white">${windGust} <span class="text-[9px]">km/h</span></p>
            </div>
            <div class="bg-neutral-800/50 p-2 rounded-xl border border-white/5 text-center">
                <p class="text-[9px] text-slate-400 uppercase font-bold">Titik Embun</p>
                <p class="text-sm font-bold text-white">${dewPoint}°</p>
            </div>
            <div class="bg-neutral-800/50 p-2 rounded-xl border border-white/5 text-center">
                <p class="text-[9px] text-slate-400 uppercase font-bold">Visibilitas</p>
                <p class="text-sm font-bold text-white">${visibility} <span class="text-[9px]">km</span></p>
            </div>
            <div class="bg-neutral-800/50 p-2 rounded-xl border border-white/5 text-center">
                <p class="text-[9px] text-slate-400 uppercase font-bold">Tren Barometer</p>
                <p class="text-sm font-bold ${pTrend === 'Turun' ? 'text-red-400' : 'text-emerald-400'}">${pTrend}</p>
            </div>
        </div>
    `;

    // Render Summary Text
    const dailyCode = currentWeatherData.daily.weathercode[dayIndex];
    const isSnow = [71, 73, 75, 77, 85, 86].includes(dailyCode);
    const rainSum = currentWeatherData.daily.precipitation_sum ? currentWeatherData.daily.precipitation_sum[dayIndex] : 0;
    
    let summary = extraDetailsHtml + `<div class="flex items-center gap-2"><i data-lucide="info" class="text-blue-400 w-4 h-4"></i> <p>Total presipitasi: ${rainSum}mm. `;
    if (isSnow) {
        summary += "Turun salju, siapkan pakaian hangat.";
    } else {
        if(rainSum > 5) summary += "Siapkan jas hujan.";
        else summary += "Cuaca relatif kering.";
    }
    summary += "</p></div>";
    
    // --- NEW: Astro Visualization (Sun Position) ---
    const nowTime = new Date().getTime();
    let sunPct = -1; // Default hidden
    
    if (currentWeatherData.daily.sunrise && currentWeatherData.daily.sunset) {
        const riseTime = new Date(currentWeatherData.daily.sunrise[dayIndex]).getTime();
        const setTime = new Date(currentWeatherData.daily.sunset[dayIndex]).getTime();
    
    // Only show for Today
    if (new Date().toDateString() === dateObj.toDateString()) {
        if(nowTime > riseTime && nowTime < setTime) sunPct = (nowTime - riseTime) / (setTime - riseTime);
        else if (nowTime >= setTime) sunPct = 1;
        else sunPct = 0;
    }
    
    if(sunPct >= 0) {
        // MODIFIED: Batasi rotasi agar tidak terlalu ke bawah (-70 s/d 70 derajat)
        const maxRot = 70; 
        const sunRotate = (sunPct * (maxRot * 2)) - maxRot;

        summary += `
            <div class="relative h-28 w-full overflow-hidden mt-4 mb-2 bg-neutral-800/30 rounded-xl border border-white/5 pt-4">
                <p class="absolute top-2 left-0 w-full text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest">Posisi Matahari</p>
                <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-56 h-28 border-t-2 border-dashed border-yellow-500/20 rounded-t-full"></div>
                <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-56 h-28">
                    <div class="w-full h-full origin-bottom transition-transform duration-1000" style="transform: rotate(${sunRotate}deg)">
                        <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-yellow-400 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.8)] flex items-center justify-center border-2 border-white/20">
                            <div class="w-2 h-2 bg-white rounded-full opacity-80"></div>
                        </div>
                    </div>
                </div>
                <div class="absolute bottom-2 w-full flex justify-between px-4 text-[10px] font-bold text-slate-400">
                    <span class="bg-black/50 px-2 py-0.5 rounded text-yellow-500/80">${currentWeatherData.daily.sunrise[dayIndex].split('T')[1]}</span>
                    <span class="bg-black/50 px-2 py-0.5 rounded text-orange-500/80">${currentWeatherData.daily.sunset[dayIndex].split('T')[1]}</span>
                </div>
            </div>
        `;
    }
    }

    document.getElementById('rain-summary').innerHTML = summary;

    // --- NEW: Calculate Solunar Data ---
    const lat = currentWeatherData.latitude;
    const lng = currentWeatherData.longitude;
    
    let sunTimes = { sunrise: null, sunset: null };
    let moonTimes = { rise: null, set: null };
    let moonTransit = null;
    let moonNadir = null;
    
    if (typeof SunCalc !== 'undefined') {
        sunTimes = SunCalc.getTimes(dateObj, lat, lng);
        moonTimes = SunCalc.getMoonTimes(dateObj, lat, lng);
        
        // Find moon transit (peak) and nadir (low)
        let highestAlt = -2; // Start from -2 to ensure any value is higher
        
        for(let i=0; i<24; i++) {
            const hourDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), i, 0, 0);
            const moonPos = SunCalc.getMoonPosition(hourDate, lat, lng);
            if(moonPos.altitude > highestAlt) {
                highestAlt = moonPos.altitude;
                moonTransit = hourDate;
            }
        }
        // Nadir is approx 12.4 hours after transit
        if(moonTransit) moonNadir = new Date(moonTransit.getTime() + 12.4 * 3600 * 1000);
    }

    currentSolunarData = { sunTimes, moonTimes, moonTransit, moonNadir };

    // --- AI ANALYSIS & SUMMARY (New Logic) ---
    const warningsContainer = document.getElementById('ai-warnings-container');
    const recommendationsContainer = document.getElementById('ai-recommendations-container');

    if(warningsContainer && recommendationsContainer) {
        // Reset content
        warningsContainer.innerHTML = '<p class="text-xs text-slate-500 animate-pulse">Menganalisa potensi bahaya...</p>';
        recommendationsContainer.innerHTML = '<p class="text-xs text-slate-500 animate-pulse">Mencari waktu terbaik...</p>';

        let warningsHtml = '';
        let recommendationsHtml = '';
        let aiWarnings = [];
        
        // 1. Analisa Bahaya (Warnings)
        const dCode = currentWeatherData.daily.weathercode[dayIndex];
        const dWind = currentWeatherData.daily.windspeed_10m_max ? currentWeatherData.daily.windspeed_10m_max[dayIndex] : 0;
        const dRain = currentWeatherData.daily.precipitation_sum ? currentWeatherData.daily.precipitation_sum[dayIndex] : 0;
        const dWave = currentWeatherData.hourly.wave_height ? Math.max(...currentWeatherData.hourly.wave_height.slice(dayIndex*24, (dayIndex+1)*24)) : 0;

        if([95, 96, 99].includes(dCode)) aiWarnings.push({ icon: 'cloud-lightning', text: "<b>BAHAYA PETIR:</b> Sebaiknya jangan melaut di area terbuka." });
        if(dWind > 25) aiWarnings.push({ icon: 'wind', text: "<b>ANGIN KENCANG:</b> Waspada gelombang tinggi, bahaya untuk perahu kecil." });
        if(dWave > 2.0) aiWarnings.push({ icon: 'waves', text: `<b>OMBAK TINGGI:</b> Gelombang mencapai ${dWave.toFixed(1)}m. Sangat berbahaya.` });
        if(dRain > 15) aiWarnings.push({ icon: 'cloud-rain', text: "<b>HUJAN LEBAT:</b> Jarak pandang terbatas & licin." });

        // 2. Cari Waktu Terbaik (Golden Hours)
        const events = [
            { t: sunTimes.sunrise, label: "Pagi (Sunrise)" },
            { t: sunTimes.sunset, label: "Sore (Sunset)" },
            { t: moonTransit, label: "Puncak Bulan" },
            { t: moonNadir, label: "Lembah Bulan" }
        ];
        
        let goodHours = [];
        const hourly = currentWeatherData.hourly;
        const startIdx = dayIndex * 24;

        events.forEach(ev => { if(ev.t && !isNaN(ev.t)) {
            const h = ev.t.getHours();
            const idx = startIdx + h;
            if(idx < hourly.time.length) {
                const wSpeed = hourly.windspeed_10m[idx];
                const wRain = hourly.precipitation_probability[idx];
                const wCode = hourly.weathercode[idx];
                // Syarat: Angin < 20, Hujan < 50%, Tidak Badai
                if(wSpeed < 20 && wRain < 50 && wCode < 90) {
                    goodHours.push(`<b>Jam ${h}:00</b> (${ev.label})`);
                }
            }
        }});

        // 3. Susun HTML
        // Warnings
        if(aiWarnings.length > 0) {
            warningsHtml = aiWarnings.map(w => `
                <div class="flex items-start gap-3 bg-red-900/30 p-3 rounded-lg border border-red-500/30 text-red-300 text-xs">
                    <i data-lucide="${w.icon}" class="w-5 h-5 text-red-400 shrink-0 mt-0.5"></i>
                    <p class="leading-relaxed">${w.text}</p>
                </div>
            `).join('');
        } else {
            warningsHtml = `
                <div class="flex items-start gap-3 bg-emerald-900/30 p-3 rounded-lg border border-emerald-500/30 text-emerald-300 text-xs">
                    <i data-lucide="shield-check" class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"></i>
                    <p class="leading-relaxed"><b>Kondisi Aman:</b> Cuaca relatif bersahabat untuk memancing hari ini.</p>
                </div>
            `;
        }

        // Recommendations
        if(goodHours.length > 0) {
            let unique = [...new Set(goodHours)];
            recommendationsHtml += `
                <div class="flex items-start gap-3 bg-blue-900/30 p-3 rounded-lg border border-blue-500/30 text-blue-200 text-xs">
                    <i data-lucide="clock" class="w-5 h-5 text-blue-300 shrink-0 mt-0.5"></i>
                    <div>
                        <p class="font-bold text-blue-200 mb-1">Waktu Potensial</p>
                        <p class="leading-relaxed">Coba mancing pada ${unique.join(", ")}. Ikan diprediksi lebih aktif & cuaca mendukung.</p>
                    </div>
                </div>
            `;
        } else {
            recommendationsHtml += `
                <div class="flex items-start gap-3 bg-neutral-800 p-3 rounded-lg border border-neutral-700 text-slate-400 text-xs">
                    <i data-lucide="moon-star" class="w-5 h-5 text-slate-500 shrink-0 mt-0.5"></i>
                    <p class="leading-relaxed"><b>Waktu Premium Tidak Ditemukan:</b> Cuaca kurang mendukung pada jam-jam aktif ikan. Cari spot terlindung.</p>
                </div>
            `;
        }
        
        // NEW: Detailed Solunar Explanation
        recommendationsHtml += `
            <div class="flex items-start gap-3 bg-neutral-800 p-3 rounded-lg border border-neutral-700 text-slate-400 text-xs">
                <i data-lucide="moon" class="w-5 h-5 text-purple-400 shrink-0 mt-0.5"></i>
                <div>
                    <p class="font-bold text-purple-300 mb-1">Info Solunar & Pasang Surut</p>
                    <p class="leading-relaxed text-slate-300">
                        Gravitasi bulan memicu 2 periode makan utama:<br>
                        • <b>Puncak Bulan:</b> Saat bulan tepat di atas, seringkali bersamaan dengan pasang naik.<br>
                        • <b>Lembah Bulan:</b> Saat bulan di bawah kaki kita, juga memicu pasang dan aktivitas ikan.
                    </p>
                </div>
            </div>
        `;

        warningsContainer.innerHTML = warningsHtml;
        recommendationsContainer.innerHTML = recommendationsHtml;
    }

    // Default Chart
    switchChart('temp');
    
    const modal = document.getElementById('weatherDetailModal');
    modal.classList.remove('hidden');
    modal.classList.remove('translate-y-full');
    
    // FIX: Tampilan Penuh (Full Page) - Paksa Style via JS
    modal.style.setProperty('height', '100vh', 'important');
    modal.style.setProperty('width', '100vw', 'important');
    modal.style.setProperty('top', '0', 'important');
    modal.style.setProperty('left', '0', 'important');
    modal.style.setProperty('right', '0', 'important');
    modal.style.setProperty('bottom', '0', 'important');
    modal.style.setProperty('position', 'fixed', 'important');
    modal.style.setProperty('z-index', '2147483647', 'important');
    modal.style.setProperty('border-radius', '0', 'important');
    modal.style.setProperty('max-height', 'none', 'important');
    modal.style.setProperty('max-width', 'none', 'important');
    modal.style.setProperty('margin', '0', 'important');
    modal.style.setProperty('background-color', '#000000', 'important');
    modal.style.setProperty('overflow-y', 'auto', 'important'); // Pastikan bisa di-scroll
    modal.style.setProperty('padding-bottom', '80px', 'important');
    
    // FIX: Reset style anak elemen modal juga agar tidak memotong konten
    Array.from(modal.children).forEach(child => {
        child.style.setProperty('border-radius', '0', 'important');
        child.style.setProperty('max-height', 'none', 'important');
        child.style.setProperty('height', 'auto', 'important');
        child.style.setProperty('min-height', '100%', 'important');
        child.classList.remove('rounded-t-[2rem]', 'rounded-t-3xl', 'rounded-2xl', 'rounded-3xl', 'overflow-hidden');
    });

    modal.classList.remove('rounded-t-[2rem]', 'rounded-t-3xl', 'rounded-2xl', 'rounded-3xl', 'max-h-[85vh]', 'h-auto');
    
    // --- FIX: Tombol Close Floating (Pindah ke Body) ---
    let closeBtn = document.getElementById('weather-floating-close');
    if (!closeBtn) {
        // Buat tombol baru jika belum ada
        closeBtn = document.createElement('button');
        closeBtn.id = 'weather-floating-close';
        closeBtn.onclick = closeDetailModal;
        document.body.appendChild(closeBtn);
        
        // Bersihkan tombol lama di dalam modal jika ada
        const originalBtn = modal.querySelector('button[onclick*="closeDetailModal"]');
        if (originalBtn) originalBtn.remove();
    }
    
    // Update Style menjadi Tombol Back di Kiri Atas (Konsisten)
    closeBtn.style.position = 'fixed';
    closeBtn.style.top = '16px';
    closeBtn.style.left = 'auto';
    closeBtn.style.right = '16px'; 
    closeBtn.style.zIndex = '2147483647';
    closeBtn.className = "p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition-colors";
    closeBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';

    if (closeBtn) {
        closeBtn.classList.remove('hidden');
    }
    
    lucide.createIcons();
    initChartInteractivity();
}

function switchChart(type) {
    currentChartType = type;
    // Update Tabs UI
    document.querySelectorAll('.chart-tab').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white', 'border-blue-600');
        btn.classList.add('bg-neutral-800/50', 'text-slate-400', 'border-white/10');
    });
    const activeBtn = document.getElementById(`tab-${type}`);
    if(activeBtn) {
        activeBtn.classList.add('active', 'bg-blue-600', 'text-white', 'border-blue-600');
        activeBtn.classList.remove('bg-neutral-800/50', 'text-slate-400', 'border-white/10');
    }
    renderChart();
}

function renderChart() {
    const container = document.getElementById('chart-container');
    currentChartData = []; // Reset data
    const startIndex = currentDayIndex * 24;
    const hourly = currentWeatherData.hourly;
    
    const labels = [];
    const data1 = []; // Main Line
    const data2 = []; // Secondary
    
    for(let i=0; i<24; i++) {
        const idx = startIndex + i;
        if(idx >= hourly.time.length) break;
        labels.push(i);
        
        if(currentChartType === 'temp') {
            data1.push(hourly.temperature_2m[idx]);
            data2.push(hourly.precipitation_probability[idx]);
            currentChartData.push({temp: data1[i], rain: data2[i]});
        } else if(currentChartType === 'wind') {
            data1.push(hourly.windspeed_10m[idx]);
            data2.push(hourly.winddirection_10m[idx]);
        } else if(currentChartType === 'wave') {
            data1.push(hourly.wave_height[idx] || 0);
        }
    }
    
    const w = container.clientWidth || 300;
    const h = container.clientHeight || 150;
    const pad = 30;
    
    const minVal = Math.min(...data1);
    const maxVal = Math.max(...data1);
    const range = (maxVal - minVal) || 1;
    
    const getX = (i) => pad + (i / 23) * (w - 2 * pad);
    const getY = (v) => h - pad - ((v - minVal) / range) * (h - 2 * pad);
    
    let svgContent = '';
    // Grid Lines
    svgContent += `<line x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}" stroke="#475569" stroke-width="1" />`;
    
    if(currentChartType === 'temp') {
        // Rain Bars
        const getYRain = (p) => h - pad - (p / 100) * (h - 2 * pad);
        data2.forEach((r, i) => { if(r > 0) svgContent += `<rect x="${getX(i)-3}" y="${getYRain(r)}" width="6" height="${(h-pad)-getYRain(r)}" fill="#3b82f6" opacity="0.3" rx="2" />`; });
        
        // Temp Line
        let path = `M ${getX(0)} ${getY(data1[0])}`;
        for(let i=1; i<data1.length; i++) path += ` L ${getX(i)} ${getY(data1[i])}`;
        let area = path + ` L ${getX(data1.length-1)} ${h-pad} L ${getX(0)} ${h-pad} Z`;
        
        svgContent += `<defs><linearGradient id="gradTemp" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#fbbf24" stop-opacity="0.4"/><stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/></linearGradient></defs>`;
        svgContent += `<path d="${area}" fill="url(#gradTemp)" stroke="none" />`;
        svgContent += `<path d="${path}" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`;
        data1.forEach((v, i) => { if(i%3===0) svgContent += `<circle cx="${getX(i)}" cy="${getY(v)}" r="3" fill="#fbbf24" stroke="#1e293b" stroke-width="2" />`; });
        
    } else if(currentChartType === 'wind') {
        currentChartData = data1.map((speed, i) => ({ speed, dir: data2[i] }));
        let path = `M ${getX(0)} ${getY(data1[0])}`;
        for(let i=1; i<data1.length; i++) path += ` L ${getX(i)} ${getY(data1[i])}`;
        svgContent += `<path d="${path}" fill="none" stroke="#22d3ee" stroke-width="2" />`;
        data2.forEach((dir, i) => { if(i%3===0) svgContent += `<g transform="translate(${getX(i)},${getY(data1[i])-15}) rotate(${dir})"><path d="M0 5 L-3 -2 L0 0 L3 -2 Z" fill="#cbd5e1" /></g>`; });
        
    } else if(currentChartType === 'solunar') {
        const activity = Array(24).fill(10); // Base activity
        const times = [
            { time: currentSolunarData.sunTimes.sunrise, score: 30, type: 'sunrise' },
            { time: currentSolunarData.sunTimes.sunset, score: 30, type: 'sunset' },
            { time: currentSolunarData.moonTimes.rise, score: 25, type: 'moonrise' },
            { time: currentSolunarData.moonTimes.set, score: 25, type: 'moonset' },
            { time: currentSolunarData.moonTransit, score: 40, type: 'moontransit' },
            { time: currentSolunarData.moonNadir, score: 40, type: 'moonnadir' }
        ];

        times.forEach(t => {
            if(t.time && !isNaN(t.time)) {
                const hour = t.time.getHours();
                // Boost current hour and +/- 1 hour
                if(activity[hour]) activity[hour] = Math.min(100, activity[hour] + t.score);
                if(hour > 0 && activity[hour-1]) activity[hour-1] = Math.min(100, activity[hour-1] + t.score / 2);
                if(hour < 23 && activity[hour+1]) activity[hour+1] = Math.min(100, activity[hour+1] + t.score / 2);
            }
        });

        currentChartData = activity;
        
        const getYActivity = (v) => h - pad - (v / 100) * (h - 2 * pad);
        
        // Activity Bars
        activity.forEach((val, i) => {
            svgContent += `<rect x="${getX(i)-4}" y="${getYActivity(val)}" width="8" height="${(h-pad)-getYActivity(val)}" fill="#a78bfa" opacity="0.6" rx="2" />`;
        });

        // Add icons for key events
        times.forEach(t => {
            if(t.time && !isNaN(t.time)) {
                const hour = t.time.getHours() + t.time.getMinutes() / 60;
                const x = pad + (hour / 23) * (w - 2 * pad);
                let iconPath = 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'; // Moon
                let color = '#93c5fd'; // Blue
                if(t.type.includes('sun')) {
                    iconPath = 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42';
                    color = '#facc15'; // Yellow
                }
                svgContent += `<g transform="translate(${x}, 15)"><circle cx="12" cy="12" r="5" fill="${color}" opacity="${t.type.includes('transit') || t.type.includes('nadir') ? 1 : 0.7}"/><path d="${iconPath}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
            }
        });
    } else if(currentChartType === 'wave') {
        currentChartData = data1;
        let path = `M ${getX(0)} ${getY(data1[0])}`;
        for(let i=1; i<data1.length; i++) path += ` L ${getX(i)} ${getY(data1[i])}`;
        let area = path + ` L ${getX(data1.length-1)} ${h-pad} L ${getX(0)} ${h-pad} Z`;
        svgContent += `<defs><linearGradient id="gradWave" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#60a5fa" stop-opacity="0.6"/><stop offset="100%" stop-color="#60a5fa" stop-opacity="0.1"/></linearGradient></defs>`;
        svgContent += `<path d="${area}" fill="url(#gradWave)" stroke="none" />`;
        svgContent += `<path d="${path}" fill="none" stroke="#60a5fa" stroke-width="2" />`;
    }
    
    labels.forEach((t, i) => { if(i%4===0) svgContent += `<text x="${getX(i)}" y="${h-10}" font-size="11" fill="#94a3b8" text-anchor="middle">${t}:00</text>`; });
    container.innerHTML = `<svg viewBox="0 0 ${w} ${h}" class="w-full h-full overflow-visible">${svgContent}</svg>`;
}

function initChartInteractivity() {
    const wrapper = document.getElementById('chart-wrapper');
    const tooltip = document.getElementById('chart-tooltip');
    const cursor = document.getElementById('chart-cursor');
    
    wrapper.onmousemove = (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const w = rect.width;
        const pad = 30;
        
        let idx = Math.round(((x - pad) / (w - 2 * pad)) * 23);
        if(idx < 0) idx = 0; if(idx > 23) idx = 23;
        
        const cursorX = pad + (idx / 23) * (w - 2 * pad);
        cursor.style.left = `${cursorX}px`;
        cursor.classList.remove('hidden');
        
        const realIdx = (currentDayIndex * 24) + idx;
        const h = currentWeatherData.hourly;
        
        let html = `<strong>${idx}:00</strong><br>`;
        // Use SVG strings directly for performance in tooltip
        const iconTemp = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline text-yellow-400"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>`;
        const iconRain = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline text-blue-400"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`;
        const iconWind = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline text-slate-300"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`;
        const iconWave = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline text-cyan-400"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`;
        const iconFish = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline text-purple-400"><path d="M6.5 12.5c0-2.5 3.5-6 3.5-6s3.5 3.5 3.5 6-1.5 2.5-3.5 2.5-3.5-0-3.5-2.5z"/><path d="M18.5 10.5c0-2.5 3.5-6 3.5-6s3.5 3.5 3.5 6-1.5 2.5-3.5 2.5-3.5-0-3.5-2.5z"/><path d="M13 10.5c-2.5 0-2.5 2-5 2s-2.5-2-5-2"/><path d="M13 15.5c-2.5 0-2.5 2-5 2s-2.5-2-5-2"/></svg>`;

        if(currentChartType === 'temp') {
            const d = currentChartData[idx] || {temp: '-', rain: '-'};
            html += `${iconTemp} ${d.temp}°C<br>${iconRain} ${d.rain}%`;
        } else if(currentChartType === 'wind') {
            const d = currentChartData[idx] || {speed: '-', dir: '-'};
            html += `${iconWind} ${d.speed} km/h<br>🧭 ${d.dir}°`;
        } else if(currentChartType === 'wave') {
            html += `${iconWave} ${currentChartData[idx] || 0} m`;
        } else if(currentChartType === 'solunar') {
            const activityScore = Math.round(currentChartData[idx] || 0);
            html += `${iconFish} Aktivitas: <strong>${activityScore}%</strong>`;
        }
        
        tooltip.innerHTML = html;
        tooltip.style.display = 'block';
        tooltip.style.left = `${Math.min(x + 10, w - 80)}px`;
        tooltip.style.top = '10px';
    };
    
    wrapper.onmouseleave = () => { tooltip.style.display = 'none'; cursor.classList.add('hidden'); };
}

function closeDetailModal() {
    document.getElementById('weatherDetailModal').classList.add('translate-y-full');
    const closeBtn = document.getElementById('weather-floating-close');
    if(closeBtn) closeBtn.classList.add('hidden');
}

// --- AI INSIGHT FUNCTION (New) ---
function showMetricInsight(type) {
    // Trigger Animation saat diklik
    if(currentWeatherData && currentWeatherData.current_weather) {
        const wx = currentWeatherData.current_weather;
        if(type === 'weather') checkWeatherAnimation(wx.weathercode, wx.windspeed, wx.is_day);
        else if(type === 'temp' && [71, 73, 75, 77, 85, 86].includes(wx.weathercode)) startWeatherEffect('snow');
    }

    const panel = document.getElementById('weather-insight-panel');
    const titleEl = document.getElementById('insight-title');
    const textEl = document.getElementById('insight-text');
    const iconEl = document.getElementById('insight-icon');

    // --- NEW: Reposition the insight panel (Standalone Card) ---
    // Apply card styles
    panel.className = "mx-0 mb-3 bg-neutral-900/30 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden p-4 hidden";
    
    // Insert BEFORE the precip card (or hourly card if precip missing)
    const precipCard = document.getElementById('precip-card');
    const hourlyCard = document.getElementById('hourly-card');
    const targetCard = precipCard || hourlyCard;
    
    if (targetCard && targetCard.parentNode) {
        targetCard.parentNode.insertBefore(panel, targetCard);
    } else {
        // Fallback logic
        const hourlySummary = document.getElementById('hourly-summary-container');
        if (hourlySummary && hourlySummary.closest('#hourly-card')) {
             const card = hourlySummary.closest('#hourly-card');
             if(card.parentNode) card.parentNode.insertBefore(panel, card);
        }
    }
    
    // Ensure panel is visible
    panel.classList.remove('hidden');
    
    // Default values if data not loaded
    if(!currentWeatherData || !currentWeatherData.current_weather) {
        textEl.innerText = "Data cuaca belum tersedia sepenuhnya. Silakan tunggu atau refresh.";
        return;
    }

    const wx = currentWeatherData.current_weather;
    const hourly = currentWeatherData.hourly;
    const currentHour = new Date().getHours();
    
    let title = "";
    let text = "";
    let icon = "info";

    switch(type) {
        case 'score':
            title = "AI Fishing Score";
            icon = "sparkles";
            const scoreText = document.getElementById('wx-score').innerText;
            const scoreVal = parseInt(scoreText);
            if(scoreVal > 80) text = `Skor ${scoreText} sangat bagus! Kondisi angin, suhu, dan tekanan udara sangat mendukung aktivitas ikan. Waktu yang tepat untuk memancing.`;
            else if(scoreVal > 50) text = `Skor ${scoreText} cukup baik. Ikan mungkin aktif, namun perhatikan perubahan angin mendadak.`;
            else text = `Skor ${scoreText} rendah. Kondisi cuaca kurang mendukung (mungkin angin kencang atau badai). Ikan cenderung bersembunyi.`;
            break;
        case 'temp':
            title = "Analisis Suhu";
            icon = "thermometer";
            const temp = wx.temperature;
            if(temp > 32) text = `Suhu ${temp}°C tergolong panas. Ikan cenderung turun ke kedalaman yang lebih sejuk. Pastikan Anda membawa air minum yang cukup.`;
            else if(temp < 20) text = `Suhu ${temp}°C cukup dingin. Ikan mungkin kurang aktif di permukaan. Coba teknik dasar (bottom fishing).`;
            else text = `Suhu ${temp}°C sangat ideal. Metabolisme ikan stabil, kemungkinan strike lebih besar di area dangkal maupun tengah.`;
            break;
        case 'wind':
            title = "Analisis Angin";
            icon = "wind";
            const wind = wx.windspeed;
            if(wind > 30) text = `BAHAYA: Angin ${wind} km/h sangat kencang. Ombak bisa tinggi tiba-tiba. Tidak disarankan untuk perahu kecil.`;
            else if(wind > 15) text = `Angin ${wind} km/h lumayan terasa. Permukaan air akan bergelombang. Gunakan pemberat/timah yang lebih besar agar umpan tidak hanyut.`;
            else text = `Angin tenang (${wind} km/h). Permukaan air stabil, sangat nyaman untuk memancing teknik casting atau pelampung.`;
            break;
        case 'weather':
            title = "Kondisi Langit";
            icon = "cloud-sun";
            const code = wx.weathercode;
            if(code > 90) text = "Peringatan Badai Petir! Segera hindari area terbuka atau laut. Joran karbon bisa menghantar listrik.";
            else if(code >= 61) text = "Hujan sedang turun. Ikan lele atau patin mungkin lebih aktif, tapi jarak pandang terbatas. Hati-hati licin.";
            else if(code <= 3) text = "Langit cerah/berawan. Cahaya matahari menembus air, gunakan umpan dengan warna natural atau mengkilap.";
            else text = "Cuaca mendung/berkabut. Ikan predator mungkin lebih berani naik ke permukaan karena cahaya redup.";
            break;
        case 'wave':
            title = "Tinggi Ombak";
            icon = "waves";
            const wave = hourly && hourly.wave_height ? hourly.wave_height[currentHour] : 0;
            if(wave > 2.5) text = `Ombak ${wave}m SANGAT TINGGI. Dilarang melaut dengan perahu nelayan biasa. Bahaya terbalik.`;
            else if(wave > 1.2) text = `Ombak ${wave}m cukup tinggi. Perahu akan bergoyang keras. Waspada mabuk laut.`;
            else text = `Ombak ${wave}m relatif tenang. Aman untuk sebagian besar aktivitas memancing di pinggir atau tengah.`;
            break;
        case 'tide':
            title = "Pasang Surut";
            icon = "activity";
            text = "Pergerakan air (arus) memicu ikan untuk makan. Saat terbaik adalah menjelang pasang penuh atau saat air mulai surut perlahan.";
            if(currentMarineData && currentMarineData.hourly && currentMarineData.hourly.sea_level_height_msl) {
                const tideData = currentMarineData.hourly.sea_level_height_msl;
                const tideNow = tideData[currentHour];
                const tideNext = tideData[currentHour+1];
                
                if(tideNext > tideNow) text += " Air sedang <b>PASANG NAIK</b>, ikan biasanya bergerak ke tepian untuk mencari makan.";
                else text += " Air sedang <b>SURUT</b>, ikan predator sering menunggu mangsa yang terbawa arus keluar ke laut dalam.";

                // Cari waktu pasang/surut berikutnya
                let nextHigh = null;
                let nextLow = null;
                
                for(let i = currentHour + 1; i < currentHour + 25; i++) {
                    if(i >= tideData.length - 1) break;
                    const prev = tideData[i-1];
                    const curr = tideData[i];
                    const next = tideData[i+1];
                    
                    if(!nextHigh && curr > prev && curr > next) nextHigh = { h: i % 24, v: curr };
                    if(!nextLow && curr < prev && curr < next) nextLow = { h: i % 24, v: curr };
                    if(nextHigh && nextLow) break;
                }

                if(nextHigh || nextLow) {
                    text += "<br><br><b>Jadwal Berikutnya:</b><br>";
                    if(nextHigh) text += `🌊 Pasang: Jam ${nextHigh.h.toString().padStart(2, '0')}:00 (${nextHigh.v.toFixed(1)}m)<br>`;
                    if(nextLow) text += `🔻 Surut: Jam ${nextLow.h.toString().padStart(2, '0')}:00 (${nextLow.v.toFixed(1)}m)`;
                }
            }
            break;
        case 'sst':
            title = "Suhu Permukaan Laut";
            icon = "thermometer-sun";
            const sstText = document.getElementById('wx-sst').innerText;
            text = `Suhu air ${sstText}. Perubahan suhu air drastis bisa membuat ikan mogok makan (shock). Suhu hangat stabil biasanya disukai ikan pelagis.`;
            break;
        case 'travel':
            title = "Info Perjalanan";
            icon = "map";
            const distText = document.getElementById('panel-dist').innerText;
            text = `Estimasi perjalanan: ${distText.replace('\n', ', ')}. Pastikan bahan bakar cukup. Cek rute untuk menghindari macet.`;
            break;
        case 'sun':
            title = "Solunar Matahari";
            icon = "sunrise";
            text = "Waktu perpindahan gelap-terang (Sunrise/Sunset) adalah 'Golden Hour'. Predator sangat aktif berburu di waktu ini karena penglihatan mangsa terbatas.";
            break;
        case 'depth':
            title = "Info Kedalaman / Elevasi";
            icon = "anchor";
            const dVal = document.getElementById('wx-depth').innerText;
            if(dVal.includes('+')) {
                text = `Lokasi ini berada di daratan dengan ketinggian <b>${dVal}</b> di atas permukaan laut.`;
            } else if(dVal.includes('?') || dVal.includes('--') || dVal.includes('N/A')) {
                text = "Data kedalaman belum tersedia atau tidak valid untuk lokasi ini.";
            } else {
                text = `Kedalaman laut di titik ini diperkirakan <b>${dVal}</b>. Area ini potensial untuk teknik Jigging atau Dasaran tergantung struktur bawah laut.`;
            }
            break;
        case 'aqi':
            title = "Kualitas Udara (AQI)";
            icon = "wind";
            const aqiVal = parseInt(document.getElementById('wx-aqi').innerText);
            if(aqiVal <= 50) text = `AQI ${aqiVal} (Bagus). Udara bersih, sangat bagus untuk aktivitas luar ruangan seharian.`;
            else if(aqiVal <= 100) text = `AQI ${aqiVal} (Sedang). Udara cukup baik, namun sensitif mungkin sedikit terganggu.`;
            else if(aqiVal <= 150) text = `AQI ${aqiVal} (Tidak Sehat bagi Sensitif). Kurangi aktivitas berat di luar ruangan jika Anda punya asma/alergi.`;
            else text = `AQI ${aqiVal} (Tidak Sehat/Bahaya). Disarankan pakai masker atau hindari aktivitas luar ruangan yang lama.`;
            break;
        default:
            title = "Info";
            text = "Klik item lain untuk melihat analisis detail.";
    }
    
    titleEl.innerText = title;
    textEl.innerHTML = text;
    iconEl.setAttribute('data-lucide', icon);
    lucide.createIcons();
}

// Apply responsive styles immediately on load
injectResponsiveStyles();

// --- NEW: EARTHQUAKE INFO FUNCTION ---
async function fetchEarthquakeInfo() {
    // 1. Siapkan Container di bawah Forecast List
    let quakeContainer = document.getElementById('quake-container');
    const forecastList = document.getElementById('forecast-list');
    
    if (!quakeContainer && forecastList && forecastList.parentNode) {
        quakeContainer = document.createElement('div');
        quakeContainer.id = 'quake-container';
        // Style mirip dengan kartu prakiraan cuaca (Liquid Glass)
        quakeContainer.className = "mx-0 mt-3 bg-neutral-900/30 backdrop-blur-xl rounded-xl border border-white/20 p-2 shadow-lg";
        
        // MODIFIED: Cek apakah ada AQI container. Jika ada, taruh Gempa DI BAWAH AQI.
        const aqiContainer = document.getElementById('aqi-container');
        if (aqiContainer && aqiContainer.parentNode === forecastList.parentNode) {
             if (aqiContainer.nextSibling) forecastList.parentNode.insertBefore(quakeContainer, aqiContainer.nextSibling);
             else forecastList.parentNode.appendChild(quakeContainer);
        } else {
             forecastList.parentNode.insertBefore(quakeContainer, forecastList.nextSibling);
        }
    }
    
    if(!quakeContainer) return;

    // 2. Render Header & Loading State
    quakeContainer.innerHTML = `
        <div class="px-2 py-2 mb-2 flex items-center gap-2 border-b border-white/5">
            <i data-lucide="activity" class="w-4 h-4 text-red-400"></i> 
            <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">Info Gempa Terkini (Dunia)</span>
        </div>
        <div id="quake-list" class="flex flex-col gap-2">
            <div class="text-center text-xs text-slate-500 py-4 animate-pulse">Memuat data gempa...</div>
        </div>
    `;
    lucide.createIcons();

    try {
        // 3. Fetch Data USGS (Gempa > 4.5 SR dalam 24 jam terakhir) - Ringan & Cepat
        const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson');
        const data = await res.json();
        
        const list = document.getElementById('quake-list');
        list.innerHTML = '';

        if(data.features && data.features.length > 0) {
            // Pastikan hanya 3 gempa terbaru
            const quakes = data.features.slice(0, 3);
            
            quakes.forEach(q => {
                const p = q.properties;
                const mag = p.mag.toFixed(1);
                const place = p.place; // Lokasi
                const time = new Date(p.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const depth = q.geometry.coordinates[2].toFixed(0); // Kedalaman (km)
                const tsunami = p.tsunami === 1; // Potensi Tsunami (0=Tidak, 1=Ya)
                
                // Warna Warni berdasarkan Skala Gempa
                let magColor = 'text-yellow-400';
                let borderColor = 'border-yellow-500/30';
                if(mag >= 6.0) { magColor = 'text-red-500'; borderColor = 'border-red-500/50'; }
                else if(mag >= 5.0) { magColor = 'text-orange-400'; borderColor = 'border-orange-500/40'; }

                const item = document.createElement('div');
                item.className = `flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border ${borderColor} hover:bg-neutral-800 transition-colors`;
                
                item.innerHTML = `
                    <div class="flex items-center gap-3 overflow-hidden">
                        <div class="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-white/10 shrink-0 shadow-md">
                            <span class="text-xs font-black ${magColor}">${mag}</span>
                            <span class="text-[8px] text-slate-500">SR</span>
                        </div>
                        <div class="min-w-0">
                            <p class="text-xs font-bold text-white truncate" title="${place}">${place}</p>
                            <p class="text-[10px] text-slate-400 flex items-center gap-3 mt-0.5">
                                <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${time}</span>
                                <span class="flex items-center gap-1"><i data-lucide="arrow-down" class="w-3 h-3"></i> ${depth} km</span>
                            </p>
                        </div>
                    </div>
                    ${tsunami ? `<div class="flex flex-col items-center justify-center text-red-400 animate-pulse ml-2 shrink-0 bg-red-900/20 px-2 py-1 rounded border border-red-500/30"><i data-lucide="waves" class="w-4 h-4"></i><span class="text-[8px] font-bold uppercase mt-0.5">Tsunami</span></div>` : ''}
                `;
                list.appendChild(item);
            });
        } else {
            list.innerHTML = '<div class="text-center text-xs text-slate-500 py-2">Tidak ada gempa signifikan (>4.5 SR) hari ini.</div>';
        }
        lucide.createIcons();
    } catch(e) {
        console.error("Gagal load gempa:", e);
        const list = document.getElementById('quake-list');
        if(list) list.innerHTML = '<div class="text-center text-xs text-red-400 py-2">Gagal memuat data gempa.</div>';
    }
}

// --- NEW: AIR QUALITY FUNCTIONS ---
async function fetchAirQuality(lat, lng) {
    try {
        // Fetch US AQI standard
        const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi`);
        const data = await res.json();
        if(data.current) {
            updateAqiUI(data.current.us_aqi);
        }
    } catch(e) { console.warn("AQI Fetch failed", e); }
}

function updateAqiUI(aqi) {
    // Target Parent: Forecast List Wrapper (Agar bisa disisipkan di bawahnya)
    const forecastList = document.getElementById('forecast-list');
    if (!forecastList || !forecastList.parentNode) return;
    
    // Cek apakah container AQI sudah ada
    let aqiContainer = document.getElementById('aqi-container');
    
    // Jika belum ada, buat baru
    if (!aqiContainer) {
        aqiContainer = document.createElement('div');
        aqiContainer.id = 'aqi-container';
        // Style mirip kartu gempa (Liquid Glass)
        aqiContainer.className = "mx-0 mt-3 bg-neutral-900/30 backdrop-blur-xl rounded-xl border border-white/20 p-3 shadow-lg";
    }

    // Tentukan warna & status
    let status = "Bagus";
    let colorClass = "text-emerald-400";
    // let barColor = "bg-emerald-500"; // Removed: Menggunakan gradient full
    let desc = "Udara bersih, bagus untuk aktivitas luar.";

    if(aqi > 50) { status = "Sedang"; colorClass = "text-yellow-400"; desc = "Kualitas udara dapat diterima, namun berisiko bagi yang sensitif."; }
    if(aqi > 100) { status = "Tdk Sehat"; colorClass = "text-orange-400"; desc = "Kurangi aktivitas fisik yang berat di luar ruangan."; }
    if(aqi > 150) { status = "Bahaya"; colorClass = "text-red-400"; desc = "Hindari aktivitas luar ruangan. Gunakan masker."; }
    if(aqi > 300) { status = "Beracun"; colorClass = "text-purple-400"; desc = "Sangat berbahaya. Tetap di dalam ruangan."; }

    const pct = Math.min((aqi / 300) * 100, 100);

    aqiContainer.innerHTML = `
        <div class="flex items-center justify-between mb-2 border-b border-white/5 pb-2">
            <div class="flex items-center gap-2">
                <i data-lucide="wind" class="w-4 h-4 ${colorClass}"></i>
                <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">Kualitas Udara</span>
            </div>
            <span class="text-xs font-bold ${colorClass}">${status}</span>
        </div>
        
        <div class="flex items-center justify-between gap-4">
            <div class="flex flex-col">
                <span class="text-3xl font-bold text-white leading-none" id="wx-aqi">${aqi}</span>
                <span class="text-[10px] text-slate-400 mt-1">US AQI</span>
            </div>
            <div class="flex-1">
                <div class="relative w-full h-2 rounded-full" style="background: linear-gradient(to right, #4ade80, #facc15, #fb923c, #f87171, #a78bfa, #881337);">
                    <div class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_4px_rgba(0,0,0,0.5)] border border-slate-500 transition-all duration-1000" style="left: calc(${pct}% - 6px);"></div>
                </div>
                <p class="text-[10px] text-slate-300 mt-2 leading-tight">${desc}</p>
            </div>
        </div>
    `;
    lucide.createIcons();

    // --- FIX: LOGIKA PENEMPATAN (PLACEMENT LOGIC) ---
    // MODIFIED: Pastikan AQI selalu di ATAS Gempa (Tepat di bawah Forecast)
    const parent = forecastList.parentNode;

    // Cabut dulu elemennya (jika sudah ada) agar bisa dipindah ke posisi yang benar
    if (aqiContainer.parentNode) aqiContainer.parentNode.removeChild(aqiContainer);

    // Selalu sisipkan AQI tepat setelah Forecast List
    // (Ini akan otomatis mendorong Gempa ke bawah jika Gempa sudah ada)
    if (forecastList.nextSibling) {
        parent.insertBefore(aqiContainer, forecastList.nextSibling);
    } else {
        parent.appendChild(aqiContainer);
    }
}

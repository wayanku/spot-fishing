

        // --- SAFETY CHECK: OFFLINE MODE FALLBACK ---
        // Mencegah aplikasi crash jika library tidak termuat karena offline
        if (typeof lucide === 'undefined') {
            // Definisi Path Icon (SVG) untuk Fallback Offline agar tidak jadi Emoji
            const iconPaths = {
                'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
                'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
                'wind': '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
                'waves': '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
                'fish': '<path d="M6.5 12.5c0-2.5 3.5-6 3.5-6s3.5 3.5 3.5 6-1.5 2.5-3.5 2.5-3.5-0-3.5-2.5z"/><path d="M18.5 10.5c0-2.5 3.5-6 3.5-6s3.5 3.5 3.5 6-1.5 2.5-3.5 2.5-3.5-0-3.5-2.5z"/><path d="M13 10.5c-2.5 0-2.5 2-5 2s-2.5-2-5-2"/><path d="M13 15.5c-2.5 0-2.5 2-5 2s-2.5-2-5-2"/>',
                'menu': '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
                'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
                'chevron-left': '<path d="m15 18-6-6 6-6"/>',
                'layers': '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
                'cloud-sun': '<path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>',
                'navigation': '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
                'locate-fixed': '<line x1="2" x2="5" y1="12" y2="12"/><line x1="19" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="5"/><line x1="12" x2="12" y1="19" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/>',
                'heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
                'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
                'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
                'moon': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
                'wifi': '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/>',
                'wifi-off': '<line x1="1" x2="23" y1="1" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/>',
                'check': '<path d="M20 6 9 17l-5-5"/>',
                'activity': '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
                'anchor': '<circle cx="12" cy="5" r="3"/><line x1="12" x2="12" y1="22" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
                'gauge': '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
                'scan-line': '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
                'thermometer-sun': '<path d="M12 9a4 4 0 0 0-2 7.5"/><path d="M12 3v2"/><path d="m6.6 18.4-1.4 1.4"/><path d="M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/><path d="M4 13H2"/><path d="M6.34 7.34 4.93 5.93"/>',
                'sprout': '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
                'thermometer': '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
                'sunrise': '<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
                'sunset': '<path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
                'corner-up-left': '<polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>',
                'corner-up-right': '<polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>',
                'refresh-ccw': '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
                'arrow-up': '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
                'image': '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
                'trophy': '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
                'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
                'star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
                'loader': '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
                'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
                'scan': '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>',
                'pencil': '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
                'shield-x': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m14.5 9-5 5"/><path d="m9.5 9 5 5"/>',
                'trash-2': '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
                'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
                'sparkles': '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 9h4"/><path d="M3 5h4"/>',
                'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
                'shield-check': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>',
                'moon-star': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M19 3v4"/><path d="M21 5h-4"/>',
                'cloud': '<path d="M17.5 19c0-1.7-1.3-3-3-3h-11a4 4 0 0 1-1-7.9 5 5 0 0 1 9.8-1.2 3 3 0 0 1 2.7 2.1"/>',
                'cloud-fog': '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7"/><path d="M17 21H9"/>',
                'cloud-drizzle': '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" stroke="currentColor"/><path d="M8 19v2 M8 13v2 M16 19v2 M16 13v2 M12 21v2 M12 15v2" stroke="#3b82f6"/>',
                'cloud-snow': '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 15h.01"/><path d="M8 19h.01"/><path d="M12 17h.01"/><path d="M12 21h.01"/><path d="M16 15h.01"/><path d="M16 19h.01"/>',
                'cloud-rain': '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" stroke="currentColor"/><path d="M16 14v6 M8 14v6 M12 16v6" stroke="#3b82f6"/>',
                'cloud-lightning': '<path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" stroke="currentColor"/><path d="m13 12-3 5h4l-3 5" stroke="#facc15" fill="#facc15"/>',
                'trending-up': '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
                'trending-down': '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
                'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
                'heart-off': '<line x1="2" x2="22" y1="2" y2="22"/><path d="M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35"/><path d="M8.76 3.1c1.1-.36 2.24-.27 3.24.44 1.5 1.05 2.74 2 4.5 2A5.5 5.5 0 0 1 21.5 11c0 2.12-.74 4.07-1.97 5.61"/>',
                'radar': '<path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/>',
                'ship': '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.33a2 2 0 0 0-.59-1.41l-5-5A2 2 0 0 0 13.33 2H4a2 2 0 0 0-2 2Z"/><path d="M8 12h8"/><path d="M8 16h8"/>'
            };

            window.lucide = {
                isFallback: true, // Flag untuk deteksi saat online nanti
                createIcons: () => {
                    document.querySelectorAll('[data-lucide]').forEach(el => {
                        const key = el.getAttribute('data-lucide');
                        const path = iconPaths[key];
                        // Jika path ada, render SVG. Jika tidak, fallback ke emoji atau dot
                        if (path) {
                            // Cek class bawaan elemen untuk ditransfer ke SVG
                            const existingClass = el.getAttribute('class') || '';
                            el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${key} ${existingClass}">${path}</svg>`;
                        } else {
                            // Fallback Emoji (Hanya untuk yang belum terdaftar di iconPaths)
                            const emojiMap = { 'map-pin': '📍', 'search': '🔍', 'wind': '💨', 'waves': '🌊', 'fish': '🐟', 'menu': '☰', 'x': '✖', 'chevron-left': '⬅', 'layers': '📚', 'cloud-sun': '⛅', 'navigation': '🧭', 'locate-fixed': '🎯', 'heart': '❤️', 'settings': '⚙️' };
                            if(!el.innerHTML.trim()) el.innerHTML = emojiMap[key] || '•';
                        }
                    });
                }
            };
        }
        lucide.createIcons();
        let isSat = true; // Hoisted to top to fix initialization error
        
        // --- MAP LAYERS CONFIGURATION ---
        const OWM_API_KEY = "YOUR_OWM_API_KEY"; // Ganti dengan API Key OpenWeatherMap Anda untuk layer Angin
        let activeLayers = {}; // Menyimpan layer yang aktif (Multi-layer support)

        // --- THEME SYSTEM (Default Dark) ---
        function initTheme() {
            const saved = localStorage.getItem('appTheme');
            // Default ke 'dark' jika belum ada settingan
            const theme = saved || 'dark';
            applyTheme(theme);
        }

        function applyTheme(theme) {
            const body = document.body;
            const btn = document.getElementById('theme-btn');
            
            if(theme === 'light') {
                body.classList.add('light-mode');
                if(btn) { btn.innerHTML = '<i data-lucide="sun" class="w-3 h-3 inline mr-1"></i> Light'; btn.className = "bg-white text-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-200 font-bold shadow-sm"; }
                
                // Auto-switch to Street View for better blending
                if(isSat) setBaseMap('street');
            } else {
                body.classList.remove('light-mode');
                if(btn) { btn.innerHTML = '<i data-lucide="moon" class="w-3 h-3 inline mr-1"></i> Dark'; btn.className = "bg-black text-white text-xs px-3 py-2 rounded-lg border border-white/10 font-bold"; }
                
                // Auto-switch to Satellite for Dark Mode
                if(!isSat) setBaseMap('satellite');
            }
            localStorage.setItem('appTheme', theme);
            lucide.createIcons();
        }

        function toggleTheme() {
            const isLight = document.body.classList.contains('light-mode');
            applyTheme(isLight ? 'dark' : 'light');
        }

        // Jalankan tema saat start
        initTheme();

        // --- MULTI-LANGUAGE SYSTEM ---
        const translations = {
            id: {
                app_title: "Fishing Spot by Wayan & StoryBali", login_subtitle: "Masuk untuk simpan spot memancing Anda",
                btn_login: "Masuk Sekarang", btn_register: "Belum punya akun? Daftar gratis",
                search_placeholder: "Cari lokasi (Desa, Kota, Laut)...",
                wx_score: "AI Score", wx_temp: "Suhu", wx_wind: "Angin", wx_weather: "Cuaca",
                wx_wave: "Ombak (Max)", wx_travel: "Perjalanan", wx_tide: "Pasang Surut", wx_sun: "Matahari",
                forecast_title: "Prakiraan 7 Hari & Potensi Mancing",
                wx_depth: "Kedalaman", btn_savespot: "Simpan Spot", modal_add_title: "Posting Spot",
                placeholder_spotname: "Nama Spot/Ikan", placeholder_comment: "Komentar...",
                label_add_photo: "Tambah Foto (Opsional)", btn_save_cloud: "Posting", btn_cancel: "Batal",
                label_contributors: "Kontributor", label_record: "Rekor Ikan", btn_add_review: "Tambah Foto / Ulasan Disini"
            },
            en: {
                app_title: "Fishing Spot by Wayan & StoryBali", login_subtitle: "Login to save your fishing spots",
                btn_login: "Login Now", btn_register: "No account? Sign up free",
                search_placeholder: "Search location (City, Sea)...",
                wx_score: "AI Score", wx_temp: "Temp", wx_wind: "Wind", wx_weather: "Weather",
                wx_wave: "Wave (Max)", wx_travel: "Travel", wx_tide: "Tide", wx_sun: "Sun",
                wx_depth: "Depth", forecast_title: "7-Day Forecast & Fishing Potential",
                btn_savespot: "Save Spot", modal_add_title: "Post Spot",
                placeholder_spotname: "Spot Name/Fish", placeholder_comment: "Comment...", solunar_title: "Fish Activity",
                label_add_photo: "Add Photo (Optional)", btn_save_cloud: "Post", btn_cancel: "Cancel",
                label_contributors: "Contributors", label_record: "Fish Record", btn_add_review: "Add Photo / Review Here"
            },
            jp: {
                app_title: "Fishing Spot by Wayan & StoryBali", login_subtitle: "釣り場を保存するためにログインしてください",
                btn_login: "ログイン", btn_register: "アカウントなし？ 無料登録",
                search_placeholder: "場所を検索 (都市, 海)...",
                wx_score: "AIスコア", wx_temp: "気温", wx_wind: "風", wx_weather: "天気",
                wx_wave: "波 (最大)", wx_travel: "移動", wx_tide: "潮汐", wx_sun: "太陽",
                wx_depth: "水深", forecast_title: "7日間の予報と釣りの可能性",
                btn_savespot: "スポット保存", modal_add_title: "スポット投稿",
                placeholder_spotname: "スポット名/魚", placeholder_comment: "コメント...", solunar_title: "魚の活性",
                label_add_photo: "写真を追加 (任意)", btn_save_cloud: "投稿", btn_cancel: "キャンセル",
                label_contributors: "投稿者", label_record: "最大記録", btn_add_review: "写真/レビューを追加"
            }
        };

        // Dictionary untuk konten dinamis (Cuaca, Hari, dll)
        const dynamicTranslations = {
            id: {
                days: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
                weather: { 0: "Cerah", 1: "Cerah Berawan", 2: "Berawan", 3: "Mendung", 45: "Kabut", 51: "Gerimis", 61: "Hujan", 80: "Hujan Deras", 95: "Badai", 71: "Salju" },
                rating: { good: "Bagus", medium: "Sedang", bad: "Buruk" },
                loading: "Memuat...", location: "Lokasi Anda"
            },
            en: {
                days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                weather: { 0: "Clear", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast", 45: "Fog", 51: "Drizzle", 61: "Rain", 80: "Showers", 95: "Thunderstorm", 71: "Snow" },
                rating: { good: "Good", medium: "Fair", bad: "Poor" },
                loading: "Loading...", location: "Your Location"
            },
            jp: {
                days: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
                weather: { 0: "快晴", 1: "晴れ", 2: "一部曇り", 3: "曇り", 45: "霧", 51: "霧雨", 61: "雨", 80: "にわか雨", 95: "雷雨", 71: "雪" },
                rating: { good: "良い", medium: "普通", bad: "悪い" },
                loading: "読み込み中...", location: "あなたの場所"
            }
        };

        function changeLanguage(lang) {
            const t = translations[lang];
            if(!t) return;
            
            // Update Text Content
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if(t[key]) el.innerText = t[key];
            });
            // Update Placeholders
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if(t[key]) el.placeholder = t[key];
            });
            
            // Sync Selectors
            document.querySelectorAll('select').forEach(s => {
                if(s.options[0].value === 'id' && s.options[1].value === 'en') s.value = lang;
            });
            
            localStorage.setItem('appLang', lang);
            
            // Refresh tampilan cuaca jika sedang terbuka atau ada data
            if(typeof currentWeatherData !== 'undefined' && currentWeatherData && typeof updateWeatherUI === 'function') updateWeatherUI(currentWeatherData);
            if(typeof currentUserWeatherCode !== 'undefined' && currentUserWeatherCode !== null && typeof getUserWeather === 'function') getUserWeather();
        }
        
        // Init Language
        setTimeout(() => changeLanguage(localStorage.getItem('appLang') || 'id'), 100);

        // --- CONFIGURATION ---
        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbybJe6cBuciSnj4j4hmm3nN4C860Sen9RVht6b1O5cZoRpkwvBoDLw6jTkYa4tmUas1/exec"; 
        const IMGBB_API_KEY = "7e6f3ce63649d305ccaceea00c28266d"; // Daftar gratis di api.imgbb.com

        // --- AI SETUP (Web Worker & Lazy Loading) ---
        let aiWorker = null;
        let isAiReady = false; // Flag to check if AI model is pre-loaded

        function getAiWorker() {
            if (!aiWorker) {
                const workerCode = `
                    self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest', 'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@latest');
                    let model = null;
 
                    async function loadModel() {
                        if (!model) {
                            self.postMessage({ type: 'status', message: 'AI_LOADING' });
                            try {
                                model = await mobilenet.load();
                                self.postMessage({ type: 'status', message: 'AI_READY' });
                            } catch (e) {
                                self.postMessage({ type: 'error', message: 'Failed to load AI model.' });
                            }
                        }
                        return model;
                    }
 
                    self.onmessage = async (e) => {
                        // Handle pre-loading message
                        if (e.data.type === 'init') {
                            await loadModel();
                            return;
                        }

                        // Handle classification message
                        const { imageData } = e.data;
                        try {
                            const classifier = await loadModel(); // Will be fast if already loaded
                            if (!classifier) { throw new Error("Model not available."); }
                            if (!imageData) { throw new Error("No image data received."); }
                            
                            const image = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
                            const imgTensor = tf.browser.fromPixels(image);
                            const predictions = await classifier.classify(imgTensor);
                            imgTensor.dispose();
                            self.postMessage({ type: 'result', predictions: predictions });
                        } catch (error) {
                            self.postMessage({ type: 'error', message: error.message });
                        }
                    };
                `;
                const blob = new Blob([workerCode], { type: 'application/javascript' });
                aiWorker = new Worker(URL.createObjectURL(blob));

                // Add a permanent listener to update the isAiReady flag
                aiWorker.addEventListener('message', (e) => {
                    if (e.data.type === 'status' && e.data.message === 'AI_READY') {
                        isAiReady = true;
                        console.log("AI Model is ready and pre-loaded.");
                    }
                });
            }
            return aiWorker;
        }

        // Cek apakah Leaflet (Peta) termuat
        if (typeof L === 'undefined') {
            document.getElementById('map').innerHTML = '<div class="flex flex-col items-center justify-center h-full text-slate-500 bg-slate-900 gap-2"><i class="text-4xl">🗺️</i><p>Mode Offline: Peta tidak dapat dimuat.</p></div>';
            // Mock object agar script tidak crash total
            window.L = {
                map: () => ({ setView: () => {}, on: () => {}, addControl: () => {}, removeLayer: () => {}, addLayer: () => {}, getPane: () => ({ style: {} }), createPane: () => {}, getBounds: () => ({ getNorth:()=>0, getWest:()=>0, getSouth:()=>0, getEast:()=>0 }), getZoom: () => 10, flyTo: () => {}, eachLayer: () => {}, invalidateSize: () => {} }),
                tileLayer: () => ({ addTo: () => {} }), marker: () => ({ addTo: () => ({ bindPopup: () => ({ openPopup: () => {} }), on: () => {} }) }), divIcon: () => {}, control: { attribution: () => ({ addTo: () => {} }), extend: () => {} }, DomUtil: { create: () => document.createElement('div') }, Control: { extend: () => {} }, latLng: () => {}, polyline: () => ({ addTo: () => {} }), circleMarker: () => ({ addTo: () => {} }), geoJSON: () => ({ addTo: () => {} }), heatLayer: () => ({ addTo: () => {} })
            };
            window.L.tileLayer.wms = () => ({ addTo: () => {} });
        }

        // 2. Map & Street View Setup
        // Menggunakan Google Hybrid (Satelit + Label/Jalan) agar lebih lengkap & cerah
        const satLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { 
            maxZoom: 20,
            attribution: '© Google Maps'
        });
        
        // GANTI OSM DENGAN GOOGLE ROADMAP (Lebih Lengkap & Familiar)
        const streetLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { 
            maxZoom: 20,
            attribution: '© Google Maps'
        });

        // Layer Laut (Bathymetry/Depth) - Esri Ocean Basemap
        // UPDATED: Menggunakan LayerGroup (Base + Reference + Seamark) agar mirip i-Boating/Navionics
        const oceanBaseTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
            maxNativeZoom: 10, // FIX: Batas zoom asli Esri Ocean adalah 10, paksa stretch setelahnya agar tidak "data not available"
            maxZoom: 20,
            attribution: 'Tiles &copy; Esri'
        });
        const oceanRefTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}', {
            maxNativeZoom: 10, // FIX: Batas zoom asli Esri Ocean adalah 10
            maxZoom: 20
        });
        // Tambahan: OpenSeaMap untuk navigasi lengkap (Buoy, Lampu, Jalur)
        const oceanSeamarkTile = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
            maxNativeZoom: 18,
            maxZoom: 20,
            attribution: 'OpenSeaMap'
        });
        const oceanLayer = L.layerGroup([oceanBaseTile, oceanRefTile, oceanSeamarkTile]);
        
        // Cek penyimpanan lokal agar saat refresh langsung ke lokasi terakhir
        const lastLat = localStorage.getItem('lastLat');
        const lastLng = localStorage.getItem('lastLng');
        const initLat = lastLat ? parseFloat(lastLat) : -6.2000;
        const initLng = lastLng ? parseFloat(lastLng) : 106.8166;
        
        // Inisialisasi peta dengan menonaktifkan attribution default
        var map = L.map('map', { 
            zoomControl: false, 
            attributionControl: false, 
            layers: [satLayer],
            minZoom: 3, // Diubah ke 3 agar jangkauan lebih luas tapi tetap aman
            maxBounds: [[-85, -180], [85, 180]], // Batasi area panning (dunia)
            maxBoundsViscosity: 1.0 // Efek pantul saat mentok batas
        }).setView([initLat, initLng], lastLat ? 15 : 13);

        // BUAT PANE KHUSUS: Agar layer NASA (SST, Klorofil) selalu di atas peta dasar
        map.createPane('gibsPane');
        map.getPane('gibsPane').style.zIndex = 250; // Di atas base map (200), di bawah marker (600)
        map.getPane('gibsPane').style.pointerEvents = 'none'; // Biarkan klik menembus layer

        // Tambahkan attribution control baru tanpa prefix "Leaflet"
        L.control.attribution({ prefix: false }).addTo(map);
        // Handle Zoom Effect: Glow & Clustering Logic
        function handleZoomEffect() {
            const zoom = map.getZoom();
            const mapEl = document.getElementById('map');
            
            // 1. Efek Glow Lebar (CSS)
            if(zoom < 14) mapEl.classList.add('zoomed-out');
            else mapEl.classList.remove('zoomed-out');
            
            // 2. Logika Prioritas Marker (Hanya saat Zoom Jauh < 13)
            // "Yang biru/kuning hilang KECUALI tidak ada yang merah di dekatnya"
            if (zoom < 13) { 
                // Cari semua marker merah (Monster)
                const redMarkers = allMarkers.filter(m => m.options.maxWeight >= 10);
                
                allMarkers.forEach(m => {
                    const el = m.getElement();
                    if(!el) return;

                    if (m.options.maxWeight >= 10) {
                        // Marker Merah selalu muncul
                        el.classList.remove('hidden-marker');
                        return;
                    }
                    
                    // Cek jarak pixel ke marker merah terdekat
                    let nearRed = false;
                    const p1 = map.latLngToLayerPoint(m.getLatLng());
                    
                    for (const r of redMarkers) {
                        const p2 = map.latLngToLayerPoint(r.getLatLng());
                        const dist = p1.distanceTo(p2);
                        if (dist < 120) { // Jika dalam radius 120px dari Merah -> Sembunyikan
                            nearRed = true;
                            break;
                        }
                    }
                    
                    if (nearRed) el.classList.add('hidden-marker');
                    else el.classList.remove('hidden-marker');
                });
            } else {
                // Reset: Tampilkan semua saat zoom dekat
                allMarkers.forEach(m => {
                    const el = m.getElement();
                    if(el) el.classList.remove('hidden-marker');
                });
            }
        }
        map.on('zoomend', handleZoomEffect);
        // handleZoomEffect dipanggil setelah marker dimuat
        
        // --- FITUR INFO CUACA USER ---
        function showUserWeatherPanel() {
            if(userLatlng) {
                showLocationPanel(userLatlng);
                map.flyTo(userLatlng, 15); // Fokus ke lokasi user
            } else {
                alert("Lokasi Anda belum ditemukan. Pastikan GPS aktif.");
                // FIX: Tambahkan pengecekan untuk mencegah error jika fungsi belum termuat
                if (typeof getUserWeather === 'function') {
                    getUserWeather();
                } else {
                    console.error("Fungsi 'getUserWeather' tidak ditemukan. Coba refresh halaman.");
                    alert("Fitur cuaca belum siap. Mohon coba lagi sesaat.");
                }
            }
        }

        let tempLatlng = null;
        let currentUser = null;
        let searchMarker = null; // Variabel untuk menyimpan marker pencarian
        let selectionMarker = null; // Marker untuk lokasi yang diklik
        let currentDetailSpot = null; // Data spot yang sedang dibuka detailnya
        let groupedSpots = {}; // Global variable untuk menyimpan data spot yang dikelompokkan
        let isContributionMode = false; // Flag untuk membedakan mode tambah spot vs ulasan
        let allMarkers = []; // Array untuk menyimpan semua marker spot

        // Custom Icon untuk Spot Ikan
        const fishIcon = L.divIcon({
            className: 'custom-fish-icon',
            html: `<div class="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.6)] flex items-center justify-center"><i data-lucide="fish" class="text-white w-5 h-5"></i></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        // Fungsi Pencarian Lokasi
        function handleSearch(e) {
            if(e.key === 'Enter') searchLocation();
        }

        function startVoiceSearch() {
            if (!('webkitSpeechRecognition' in window)) {
                alert("Browser tidak mendukung fitur suara.");
                return;
            }
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'id-ID';
            recognition.start();
            
            const btn = document.getElementById('mic-btn');
            btn.classList.add('text-red-500', 'animate-pulse');

            recognition.onresult = function(event) {
                const text = event.results[0][0].transcript;
                document.getElementById('search-input').value = text;
                searchLocation();
            };
            recognition.onend = () => btn.classList.remove('text-red-500', 'animate-pulse');
        }

        function searchLocation() {
            // FIX: Sembunyikan saran otomatis saat tombol cari/enter ditekan
            hideSuggestions();
            
            // FIX: Hentikan timer pencarian otomatis agar tidak muncul tiba-tiba setelah enter
            if(typeof searchDebounceTimer !== 'undefined') clearTimeout(searchDebounceTimer);
            
            const query = document.getElementById('search-input').value;
            if(!query) return;
            
            const btn = document.getElementById('search-btn');
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>';

            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
                .then(res => res.json())
                .then(data => {
                    if(data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);
                        
                        // 1. Hapus marker pencarian sebelumnya (jika ada) biar map bersih
                        if(searchMarker) map.removeLayer(searchMarker);

                        // 2. Buat Icon Pin Merah ala Google Maps
                        const redPin = L.divIcon({
                            className: 'bg-transparent',
                            html: `<div class="relative -mt-10 flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-2xl"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
                                    <div class="w-4 h-1.5 bg-black/30 blur-sm rounded-full"></div>
                                   </div>`,
                            iconSize: [46, 46],
                            iconAnchor: [23, 46], // Ujung bawah pin pas di koordinat
                            popupAnchor: [0, -45]
                        });

                        // 3. Tambahkan ke Peta & Buka Popup Nama Lokasi
                        searchMarker = L.marker([lat, lon], {icon: redPin}).addTo(map)
                            .bindPopup(`<b class="text-slate-900 text-sm">${data[0].display_name.split(',')[0]}</b>`).openPopup();

                        map.flyTo([lat, lon], 12); // FIX: Zoom out sedikit agar tidak terlalu dekat
                    } else {
                        alert("Lokasi tidak ditemukan");
                    }
                })
                .catch(() => alert("Gagal mencari lokasi"))
                .finally(() => btn.innerHTML = originalContent);
        }

        // --- NEW: AUTOCOMPLETE SEARCH FUNCTIONS ---
        let searchDebounceTimer;

        function handleSearchInput() {
            clearTimeout(searchDebounceTimer);
            const query = document.getElementById('search-input').value;
            
            if (query.length < 3) {
                hideSuggestions();
                return;
            }

            // Tampilkan loading skeleton agar terlihat canggih
            showSearchLoading();

            searchDebounceTimer = setTimeout(() => {
                // Limit dinaikkan jadi 5 agar lebih banyak pilihan
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&addressdetails=1&extratags=1`)
                    .then(res => res.json())
                    .then(data => showSuggestions(data))
                    .catch(err => console.error(err));
            }, 300); // Delay 300ms agar tidak spam API
        }

        function showSearchLoading() {
            let container = document.getElementById('search-suggestions');
            const input = document.getElementById('search-input');
            
            if (!container && input) {
                container = document.createElement('div');
                container.id = 'search-suggestions';
                // Style Solid & Clean (Latar Gelap Pekat agar Mudah Dibaca)
                container.className = "absolute top-full left-0 w-full bg-black border border-neutral-700 rounded-xl mt-2 shadow-2xl z-[5000] overflow-hidden flex flex-col";
                
                if(input.parentNode) {
                    const parentStyle = window.getComputedStyle(input.parentNode);
                    if(parentStyle.position === 'static') input.parentNode.style.position = 'relative';
                    input.parentNode.appendChild(container);
                }
            }
            
            if(container) {
                container.innerHTML = `
                    <div class="p-3 flex items-center gap-3 animate-pulse border-b border-white/5">
                        <div class="w-8 h-8 rounded-full bg-white/10"></div>
                        <div class="flex-1">
                            <div class="h-3 w-1/3 bg-white/10 rounded mb-2"></div>
                            <div class="h-2 w-2/3 bg-white/5 rounded"></div>
                        </div>
                    </div>
                `;
                container.classList.remove('hidden');
            }
        }

        function showSuggestions(data) {
            let container = document.getElementById('search-suggestions');
            
            if (!container) {
                showSearchLoading(); 
                container = document.getElementById('search-suggestions');
            }
            
            container.innerHTML = '';
            
            if (data.length === 0) {
                container.innerHTML = `<div class="p-4 text-center text-xs text-slate-400 italic">Lokasi tidak ditemukan</div>`;
                return;
            }

            const query = document.getElementById('search-input').value.toLowerCase();
            
            // Helper Highlight Text
            const highlight = (text) => {
                if(!text) return '';
                const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(${safeQuery})`, 'gi');
                // Highlight Putih Tebal (Bukan Warna-warni)
                return text.replace(regex, '<span class="text-white font-extrabold">$1</span>');
            };

            data.forEach(item => {
                const div = document.createElement('div');
                div.className = "p-3 hover:bg-neutral-800 cursor-pointer border-b border-neutral-800 last:border-0 flex items-center gap-3 transition-colors group";
                
                // Nama lokasi yang lebih bersih
                const mainName = item.display_name.split(',')[0];
                const subName = item.display_name.replace(mainName + ',', '').trim();

                // Icon Logic (Seragam / Monokrom)
                let iconName = 'map-pin';
                
                // Gunakan ikon berbeda tapi warnanya tetap abu-abu (slate) agar rapi
                if (item.class === 'natural' || item.type === 'water' || item.type === 'bay' || item.type === 'beach') { iconName = 'waves'; }
                else if (item.class === 'tourism') { iconName = 'image'; }

                div.innerHTML = `
                    <div class="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                        <i data-lucide="${iconName}" class="w-4 h-4 text-slate-400 group-hover:text-white transition-colors"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-slate-300 truncate group-hover:text-white transition-colors">${highlight(mainName)}</p>
                        <p class="text-[11px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">${highlight(subName)}</p>
                    </div>
                `;
                
                div.onclick = () => selectSuggestion(item);
                container.appendChild(div);
            });
            
            container.classList.remove('hidden');
            if(window.lucide) lucide.createIcons();
            
            // Close when clicking outside
            document.addEventListener('click', function closeOnClickOutside(e) {
                const input = document.getElementById('search-input');
                if (!container.contains(e.target) && e.target !== input) {
                    hideSuggestions();
                    document.removeEventListener('click', closeOnClickOutside);
                }
            });
        }

        function hideSuggestions() {
            const container = document.getElementById('search-suggestions');
            if (container) container.classList.add('hidden');
        }

        function selectSuggestion(item) {
            const input = document.getElementById('search-input');
            if(input) input.value = item.display_name.split(',')[0];
            
            hideSuggestions();
            
            // Direct Fly-To Logic (Reusing search marker style)
            const lat = parseFloat(item.lat);
            const lon = parseFloat(item.lon);
            
            if(searchMarker) map.removeLayer(searchMarker);

            const redPin = L.divIcon({
                className: 'bg-transparent',
                html: `<div class="relative -mt-10 flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-2xl"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
                        <div class="w-4 h-1.5 bg-black/30 blur-sm rounded-full"></div>
                       </div>`,
                iconSize: [46, 46],
                iconAnchor: [23, 46],
                popupAnchor: [0, -45]
            });

            searchMarker = L.marker([lat, lon], {icon: redPin}).addTo(map)
                .bindPopup(`<b class="text-slate-900 text-sm">${item.display_name.split(',')[0]}</b>`).openPopup();

            map.flyTo([lat, lon], 12); // FIX: Zoom out sedikit agar tidak terlalu dekat
        }

        // Fungsi Street View: Membuka koordinat di Google Street View
        function openStreetView(lat, lng) {
            const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
            window.open(url, '_blank');
        }

        function openStreetViewFromPanel() {
            if(tempLatlng) openStreetView(tempLatlng.lat, tempLatlng.lng);
        }
        
        function openStreetViewFromDetail() {
            if(currentDetailSpot) openStreetView(currentDetailSpot.lat, currentDetailSpot.lng);
        }

        // 3. Auth Logic
        // --- FIREBASE CONFIGURATION ---
        // Login dinonaktifkan, Firebase tidak diinisialisasi.

        // Inisialisasi Firebase
        let auth, db;
        // const firebaseConfig = { ... };
        // if (typeof firebase !== 'undefined') { ... }

        function handleAuth(type) {
            // Login dinonaktifkan.
        }

        // --- AUTO RECONNECT HANDLER (Fitur Baru) ---
        // Mendeteksi saat internet nyala kembali
        window.addEventListener('online', () => {
            console.log("Internet Connected: Refreshing Data...");
            
            // --- FIX: RECOVERY ICON JIKA SEBELUMNYA OFFLINE ---
            if (window.lucide && window.lucide.isFallback) {
                console.log("Reloading Lucide Library...");
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/lucide@latest';
                script.onload = () => {
                    // Library asli termuat, timpa mock object dan render ulang
                    lucide.createIcons(); 
                };
                document.head.appendChild(script);
            }

            // 1. Notifikasi Visual
            const toast = document.createElement('div');
            toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl z-[3000] flex items-center gap-2 animate-bounce";
            toast.innerHTML = `<i data-lucide="wifi" class="w-4 h-4"></i> Online: Memuat Ulang Data...`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
            lucide.createIcons();

            // 2. Coba ambil ulang lokasi & cuaca jika sebelumnya gagal
            getUserWeather();

            // 3. Coba ambil ulang data spot dari Cloud (Google Sheets)
            loadSpots();

            // 4. Coba nyalakan ulang layer peta yang mungkin mati karena offline
            loadLayerPreferences();
            
            // 5. Refresh tampilan peta (Tiles) agar bagian abu-abu hilang
            if(typeof map !== 'undefined') {
                map.eachLayer(layer => {
                    if(layer._url) layer.redraw();
                });
            }
        });

        window.addEventListener('offline', () => {
            const toast = document.createElement('div');
            toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-400 px-4 py-2 rounded-full text-xs font-bold border border-white/10 shadow-xl z-[3000] flex items-center gap-2";
            toast.innerHTML = `<i data-lucide="wifi-off" class="w-4 h-4"></i> Koneksi Terputus`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
            lucide.createIcons();
        });

        function initApp() {
            // LOGIN DINONAKTIFKAN: Langsung masuk sebagai Guest
            console.warn("LOGIN DINONAKTIFKAN: Menjalankan aplikasi dalam Mode Tamu.");
            currentUser = { email: 'Guest', uid: 'guest_user', displayName: 'Guest', photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=guest_user` };
            
            // Update Profile Image di Home
            const profileImg = document.getElementById('home-profile-img');
            if(profileImg) profileImg.src = currentUser.photoURL;

            // Tampilkan konten, sembunyikan login overlay
            document.getElementById('auth-overlay').classList.add('hidden');
            document.getElementById('app-content').classList.remove('hidden');
            
            // Refresh peta agar tidak abu-abu
            setTimeout(() => { if(typeof map !== 'undefined') map.invalidateSize(); }, 100);
            
            // Buat modal untuk peta presipitasi
            if (typeof createPrecipitationModal === 'function') {
                createPrecipitationModal();
            }

            // Pre-load the AI model in the background for faster analysis later
            getAiWorker().postMessage({ type: 'init' });

            // --- NEW: Init Search Autocomplete ---
            const searchInput = document.getElementById('search-input');
            if(searchInput) {
                searchInput.addEventListener('input', handleSearchInput);
            }

            if(typeof getUserWeather === 'function') getUserWeather(); // Ambil cuaca lokasi user saat ini
            loadSpots();
            setTimeout(initScrollDots, 500); // Init dots setelah layout render
            setTimeout(initCompass, 1000); // Inisialisasi Kompas Digital
            setTimeout(loadLayerPreferences, 2000); // Mengembalikan layer peta yang tersimpan
        }

        function logout() {
            // Login dinonaktifkan.
        }

        // --- PROFILE & LOGIN MENU ---
        function openProfile() {
            navigateTo('settings'); // Buka menu pengaturan saat foto profil diklik
        }

        function closeAuthOverlay() {
            document.getElementById('auth-overlay').classList.add('hidden');
        }
        
        // Pastikan fungsi bisa diakses dari HTML (Global Scope)
        window.openProfile = openProfile;
        window.closeAuthOverlay = closeAuthOverlay;

        // 4. Spot Management
        
        // Ganti logika klik peta: Munculkan Panel Cuaca dulu
        map.on('click', e => {
            tempLatlng = e.latlng;
            
            // Tambahkan Marker Pin pada lokasi yang diklik
            if (selectionMarker) map.removeLayer(selectionMarker);
            
            const pinIcon = L.divIcon({
                className: 'bg-transparent',
                html: `<div class="relative -mt-8 flex flex-col items-center animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-lg"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
                        <div class="w-3 h-1 bg-black/30 blur-sm rounded-full mt-[-2px]"></div>
                       </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            });
            selectionMarker = L.marker(e.latlng, {icon: pinIcon}).addTo(map);
            
            // FIX: Langsung navigasi ke tab cuaca agar flow konsisten
            if(typeof navigateTo === 'function') navigateTo('weather');
        });

        // FIX: Pastikan userLatlng global (window) agar bisa diakses weather.js
        window.userLatlng = null;
        // let userLatlng = null; // Hapus deklarasi lokal yang membingungkan
        
        let userLocationMarker = null; // Marker lokasi user custom
        // --- FAVORITE SYSTEM ---
        function toggleFavorite() {
            if(!currentDetailSpot) return;
            
            // Gunakan key unik (lat,lng) untuk identifikasi
            const key = currentDetailSpot.lat + ',' + currentDetailSpot.lng;
            let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
            
            // Cek apakah sudah ada
            const index = favs.findIndex(f => (f.lat + ',' + f.lng) === key);
            
            if(index >= 0) {
                favs.splice(index, 1); // Hapus
            } else {
                favs.push(currentDetailSpot); // Tambah
            }
            
            localStorage.setItem('favorites', JSON.stringify(favs));
            updateFavoriteBtn();
        }

        function updateFavoriteBtn() {
            if(!currentDetailSpot) return;
            const key = currentDetailSpot.lat + ',' + currentDetailSpot.lng;
            const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
            const isFav = favs.some(f => (f.lat + ',' + f.lng) === key);
            
            const btn = document.getElementById('btn-favorite');
            if(isFav) {
                btn.innerHTML = '<i data-lucide="heart" class="w-6 h-6 fill-red-500 text-red-500"></i>';
            } else {
                btn.innerHTML = '<i data-lucide="heart" class="w-6 h-6 text-white"></i>';
            }
            lucide.createIcons();
        }

        // --- FITUR BARU: EKSPOR GPX (Untuk Fishfinder) ---
        function exportFavoritesToGPX() {
            const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
            if(favs.length === 0) {
                alert("Belum ada spot favorit untuk diekspor.");
                return;
            }

            let gpx = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<gpx version="1.1" creator="FishingSpotApp">`;

            favs.forEach(spot => {
                gpx += `
  <wpt lat="${spot.lat}" lon="${spot.lng}">
    <name>${(spot.name || 'Spot').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</name>
    <desc>${spot.comment || 'Spot Mancing'}</desc>
    <sym>Fishing Hot Spot Map Symbol</sym>
  </wpt>`;
            });

            gpx += `
</gpx>`;

            const blob = new Blob([gpx], { type: 'application/gpx+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fishing_spots_${new Date().toISOString().slice(0,10)}.gpx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // --- FAVORITES LIST FUNCTIONS ---
        function openFavorites() {
            const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
            const list = document.getElementById('favorites-list');
            list.innerHTML = '';
            
            if(favs.length === 0) {
                list.innerHTML = '<div class="text-center text-slate-500 py-8 flex flex-col items-center gap-2"><i data-lucide="heart-off" class="w-8 h-8 opacity-50"></i><p>Belum ada spot favorit.<br>Klik ikon hati pada detail spot untuk menyimpan.</p></div>';
            } else {
                // Tambahkan Tombol Export GPX di atas list jika ada data
                const exportBtn = document.createElement('button');
                exportBtn.className = "w-full mb-4 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg";
                exportBtn.innerHTML = '<i data-lucide="download" class="w-4 h-4"></i> Ekspor ke GPX (Garmin/GPS)';
                exportBtn.onclick = exportFavoritesToGPX;
                list.appendChild(exportBtn);

                favs.forEach(spot => {
                    const item = document.createElement('div');
                    item.className = "bg-neutral-800/50 p-3 rounded-xl border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-neutral-700 transition-colors group";
                    item.onclick = () => {
                        closeFavorites();
                        const key = spot.lat + ',' + spot.lng;
                        if(groupedSpots[key]) {
                            openSpotDetail(groupedSpots[key]);
                            map.flyTo([spot.lat, spot.lng], 16);
                        } else {
                            openSpotDetail([spot]);
                            map.flyTo([spot.lat, spot.lng], 16);
                        }
                    };
                    
                    const img = spot.photo || 'https://via.placeholder.com/100?text=Fish';
                    
                    item.innerHTML = `
                        <img src="${img}" class="w-14 h-14 rounded-lg object-cover bg-neutral-900 border border-white/10 group-hover:scale-105 transition-transform">
                        <div>
                            <h4 class="font-bold text-sm text-white line-clamp-1">${spot.name}</h4>
                            <p class="text-[10px] text-slate-400 flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i> ${parseFloat(spot.lat).toFixed(4)}, ${parseFloat(spot.lng).toFixed(4)}</p>
                        </div>
                    `;
                    list.appendChild(item);
                });
            }
            document.getElementById('favoritesModal').classList.remove('translate-y-full');
            lucide.createIcons();
        }

        function closeFavorites() {
            document.getElementById('favoritesModal').classList.add('translate-y-full');
        }

        // --- LEGEND FUNCTIONS ---
        function openLegend() { document.getElementById('legendModal').classList.remove('translate-y-full'); lucide.createIcons(); }
        function closeLegend() { document.getElementById('legendModal').classList.add('translate-y-full'); }

        // Dictionary Kategori Habitat Ikan (Air Tawar vs Air Asin)
        const fishTranslations = {
            // Kategori Air Tawar
            'tench': 'Ikan Air Tawar', 'goldfish': 'Ikan Air Tawar', 'carp': 'Ikan Air Tawar', 
            'trout': 'Ikan Air Tawar', 'pike': 'Ikan Air Tawar', 'sturgeon': 'Ikan Air Tawar', 
            'gar': 'Ikan Air Tawar', 'bass': 'Ikan Air Tawar', 'catfish': 'Ikan Air Tawar',

            // Kategori Air Asin
            'shark': 'Ikan Air Asin', 'ray': 'Ikan Air Asin', 'stingray': 'Ikan Air Asin', 
            'barracouta': 'Ikan Air Asin', 'marlin': 'Ikan Air Asin', 'anemone': 'Ikan Air Asin', 
            'seahorse': 'Ikan Air Asin', 'whaleshark': 'Ikan Air Asin', 'hammerhead': 'Ikan Air Asin', 
            'lionfish': 'Ikan Air Asin', 'puffer': 'Ikan Air Asin', 'eel': 'Ikan Air Asin', 
            'rock beauty': 'Ikan Air Asin', 'clownfish': 'Ikan Air Asin', 'coho': 'Ikan Air Asin', 
            'crab': 'Hewan Air Asin', 'lobster': 'Hewan Air Asin'
        };

        function setRating(n) {
            document.getElementById('spotRating').value = n;
            const stars = document.querySelectorAll('.star-btn');
            stars.forEach((btn, index) => {
                if(index < n) {
                    btn.classList.add('text-yellow-400');
                    btn.classList.remove('text-slate-600');
                } else {
                    btn.classList.remove('text-yellow-400');
                    btn.classList.add('text-slate-600');
                }
            });
        }

        // Helper: Konversi Koordinat DMS (EXIF) ke Desimal
        function convertDMSToDD(dms, ref) {
            if(!dms || dms.length < 3) return null;
            let dd = dms[0] + dms[1]/60 + dms[2]/3600;
            if (ref === "S" || ref === "W") dd = dd * -1;
            return dd;
        }

        function handleNoGPS(svPreview, saveBtn) {
            showCustomAlert(
                "Lokasi GPS Tidak Ditemukan",
                "Foto ini tidak memiliki data lokasi (GPS).<br>Untuk <b>menambah spot baru</b>, foto wajib memiliki informasi lokasi.",
                "map-pin-off",
                "red"
            );
            saveBtn.innerText = "Foto Tidak Valid";
            saveBtn.disabled = true;
            saveBtn.classList.add('bg-slate-600', 'hover:bg-slate-600', 'cursor-not-allowed');
            saveBtn.classList.remove('bg-blue-600', 'hover:bg-blue-500');

            tempLatlng = null;
        }

        // --- IMAGE PREVIEW FUNCTIONS ---
        let currentObjectUrl = null; // Variabel global untuk manajemen memori gambar

        async function previewImage(input) {
            const file = input.files[0];
            if(!file) return;

            // 1. Memory Optimization: Use Blob URL & revoke old one (CRITICAL FOR IPHONE)
            if(currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
            currentObjectUrl = URL.createObjectURL(file);

            // Show preview immediately (lighter than FileReader)
            const imgPreview = document.getElementById('imagePreview');
            imgPreview.src = currentObjectUrl;
            document.getElementById('imagePreviewContainer').classList.remove('hidden');
            document.getElementById('upload-placeholder').classList.add('hidden');

            // 2. Auto-detect fish name (AI) - with resize to prevent crash
            const nameInput = document.getElementById('spotName');
            if (nameInput.value.trim() === '') {
                nameInput.placeholder = isAiReady ? "Menganalisa gambar..." : "Memuat AI & Menganalisa...";
                try {
                    const detectedName = await detectFish(file);
                    if (detectedName) {
                        nameInput.value = detectedName;
                    }
                } catch (e) {
                    console.error("AI detection failed:", e);
                } finally {
                    nameInput.placeholder = "Nama Spot/Ikan";
                }
            }

            // 3. Auto-detect location from photo (EXIF GPS) - ONLY for new spots
            if(!isContributionMode) { 
                const svPreview = document.getElementById('sv-preview');
                const saveBtn = document.getElementById('btnSaveSpot');
                const lang = localStorage.getItem('appLang') || 'id';

                if(svPreview) svPreview.innerHTML = `<div class="flex items-center gap-2 text-yellow-400 animate-pulse"><i data-lucide="loader" class="w-4 h-4 animate-spin"></i> <span class="text-xs font-bold">Mencari lokasi di foto...</span></div>`;
                lucide.createIcons();

                // Add a small delay for UI to render before heavy EXIF processing
                setTimeout(() => {
                    if (typeof EXIF === 'undefined') {
                        console.warn("EXIF library missing");
                        handleNoGPS(svPreview, saveBtn);
                        return;
                    }
                    EXIF.getData(file, function() {
                        const lat = EXIF.getTag(this, "GPSLatitude");
                        const lng = EXIF.getTag(this, "GPSLongitude");
                        
                        if(lat && lng) {
                            const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
                            const lngRef = EXIF.getTag(this, "GPSLongitudeRef") || "E";
                            const latDec = convertDMSToDD(lat, latRef);
                            const lngDec = convertDMSToDD(lng, lngRef);
                            
                            if(latDec && lngDec) {
                                // GPS Found & Valid
                                tempLatlng = { lat: latDec, lng: lngDec };
                                map.flyTo([latDec, lngDec], 16);
                                
                                // Update visual marker
                                if(selectionMarker) map.removeLayer(selectionMarker);
                                const pinIcon = L.divIcon({ className: 'bg-transparent', html: `<div class="relative -mt-8 flex flex-col items-center animate-bounce"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-lg"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg><div class="w-3 h-1 bg-black/30 blur-sm rounded-full mt-[-2px]"></div></div>`, iconSize: [32, 32], iconAnchor: [16, 32] });
                                selectionMarker = L.marker([latDec, lngDec], {icon: pinIcon}).addTo(map);

                                // Enable save button
                                saveBtn.disabled = false;
                                saveBtn.classList.remove('bg-slate-600', 'hover:bg-slate-600', 'cursor-not-allowed');
                                saveBtn.classList.add('bg-blue-600', 'hover:bg-blue-500');
                                saveBtn.innerText = translations[lang].btn_save_cloud;

                                // Reverse geocode to show address
                                fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latDec}&lon=${lngDec}`)
                                    .then(res => res.json())
                                    .then(data => {
                                        const addr = data.display_name ? data.display_name.split(',').slice(0, 2).join(',') : "Alamat tidak ditemukan";
                                        if(svPreview) svPreview.innerHTML = `<p class="text-[10px] text-emerald-400 font-bold uppercase mb-1 flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i> Lokasi Foto Ditemukan!</p><p class="text-[10px] text-white font-bold">${addr}</p><p class="text-[9px] text-slate-500">Koordinat: ${latDec.toFixed(5)}, ${lngDec.toFixed(5)}</p>`;
                                        lucide.createIcons();
                                    })
                                    .catch(() => {
                                        if(svPreview) svPreview.innerHTML = `<p class="text-[10px] text-emerald-400 font-bold uppercase mb-1 flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i> Lokasi dari Foto!</p><p class="text-[10px] text-slate-500">Koordinat: ${latDec.toFixed(5)}, ${lngDec.toFixed(5)}</p>`;
                                        lucide.createIcons();
                                    });
                            } else {
                                handleNoGPS(svPreview, saveBtn);
                            }
                        } else {
                            handleNoGPS(svPreview, saveBtn);
                        }
                    });
                }, 200);
            }
        }

        function clearImage() {
            document.getElementById('spotPhoto').value = ''; // Reset input file
            document.getElementById('imagePreviewContainer').classList.add('hidden');
            document.getElementById('upload-placeholder').classList.remove('hidden');
            if(currentObjectUrl) {
                URL.revokeObjectURL(currentObjectUrl);
                currentObjectUrl = null;
            }
        }

        function openAddModal(isContribution = false) {
            closeLocationPanel(); // Tutup panel bawah
            document.getElementById('addModal').classList.remove('translate-y-full');
            isContributionMode = isContribution; // Set flag mode
            
            const saveBtn = document.getElementById('btnSaveSpot');
            const svPreview = document.getElementById('sv-preview');

            if(!isContribution) {
                // Mode: ADD NEW SPOT
                // Reset form
                document.getElementById('spotName').classList.remove('hidden');
                document.getElementById('spotName').value = '';
                document.getElementById('spotRating').value = '';
                document.getElementById('spotWeight').value = '';
                document.getElementById('spotComment').value = '';
                setRating(0); // Reset stars
                clearImage();
                document.getElementById('addModalTitle').innerHTML = `<i data-lucide="map-pin" class="text-blue-500"></i> <span data-i18n="modal_add_title">Tambah Spot</span>`;
                
                // Disable save button, force user to select photo with GPS
                saveBtn.disabled = true;
                saveBtn.classList.add('bg-slate-600', 'hover:bg-slate-600', 'cursor-not-allowed');
                saveBtn.classList.remove('bg-blue-600', 'hover:bg-blue-500');
                saveBtn.innerText = "Pilih Foto Dengan Lokasi";

                svPreview.classList.remove('hidden');
                svPreview.innerHTML = `<div class="bg-slate-800 p-2 rounded-lg shrink-0"><i data-lucide="alert-circle" class="w-5 h-5 text-yellow-400"></i></div><div><p class="text-xs font-bold text-white uppercase mb-0.5">Wajib Foto dengan GPS</p><p class="text-[10px] text-slate-400 leading-relaxed">Hanya foto yang memiliki data lokasi GPS yang bisa diunggah.</p></div>`;
                lucide.createIcons();
            } else {
                // Mode: ADD REVIEW (spot already exists)
                // Save button must be active
                document.getElementById('spotName').classList.add('hidden');
                saveBtn.disabled = false;
                saveBtn.classList.remove('bg-slate-600', 'hover:bg-slate-600', 'cursor-not-allowed');
                saveBtn.classList.add('bg-blue-600', 'hover:bg-blue-500');
                document.getElementById('btnSaveSpot').innerText = "Posting";
                
                // Sembunyikan info GPS karena tidak wajib untuk ulasan
                svPreview.classList.add('hidden');
            }
            // Re-apply translation to ensure button text is correct
            changeLanguage(localStorage.getItem('appLang') || 'id');
            lucide.createIcons();
        }

        function closeModal() { document.getElementById('addModal').classList.add('translate-y-full'); }

        // Fungsi Kompresi Gambar (Mencegah Crash di iPhone)
        function compressImage(file, maxWidth = 1000, quality = 0.7) {
            return new Promise((resolve, reject) => {
                const img = document.createElement('img');
                const url = URL.createObjectURL(file);
                img.src = url;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height) {
                        if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
                    } else {
                        if (height > maxWidth) { width *= maxWidth / height; height = maxWidth; }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        URL.revokeObjectURL(url);
                        if(blob) resolve(blob);
                        else reject(new Error("Compression failed"));
                    }, 'image/jpeg', quality);
                };
                img.onerror = (e) => {
                    URL.revokeObjectURL(url);
                    reject(e);
                };
            });
        }

        // Fungsi Validasi Lokasi (Cek apakah Air atau Darat)
        async function checkLocationValidity(lat, lng) {
            try {
                // Gunakan Nominatim untuk cek tipe lokasi
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
                const data = await res.json();
                
                const type = (data.type || '').toLowerCase();
                const category = (data.category || '').toLowerCase();
                const displayName = (data.display_name || '').toLowerCase();
                
                // 1. Whitelist: Jika terdeteksi air, langsung lolos
                const waterKeywords = ['water', 'lake', 'river', 'sea', 'ocean', 'pond', 'reservoir', 'stream', 'canal', 'bay', 'coast', 'beach', 'dam', 'wetland', 'harbor', 'wharf', 'pier'];
                const idKeywords = ['danau', 'sungai', 'laut', 'pantai', 'waduk', 'kali', 'bendungan', 'embung', 'rawa', 'teluk', 'samudra', 'air', 'dermaga', 'muara'];
                
                if (waterKeywords.includes(type) || waterKeywords.includes(category)) return { valid: true };
                if (waterKeywords.some(k => displayName.includes(k)) || idKeywords.some(k => displayName.includes(k))) return { valid: true };

                // 2. Blacklist: Jika terdeteksi daratan keras (Gunung, Gedung, Jalan)
                const mountainTypes = ['peak', 'volcano', 'mountain', 'hill', 'ridge', 'cliff', 'saddle', 'wood', 'forest', 'grassland'];
                if (mountainTypes.includes(type)) return { valid: false, reason: `Lokasi terdeteksi sebagai ${type} (Daratan/Gunung). Harap pilih lokasi perairan.` };
                
                if (category === 'building') return { valid: false, reason: "Lokasi terdeteksi sebagai Bangunan." };
                
                return { valid: true }; // Lolos jika tidak masuk blacklist (untuk mengakomodasi GPS yang kurang akurat di pinggir sungai)
            } catch(e) { return { valid: true }; } // Skip jika offline
        }

        async function saveSpotCloud() {
            const name = document.getElementById('spotName').value;
            const rating = document.getElementById('spotRating').value;
            const weight = document.getElementById('spotWeight').value;
            const comment = document.getElementById('spotComment').value;
            const fileInput = document.getElementById('spotPhoto');
            const originalFile = fileInput.files[0];
            let fileToUpload = originalFile;

            if(!name && !isContributionMode) { 
                showCustomAlert("Form Belum Lengkap", "<b>Nama Spot / Ikan</b> wajib diisi.", "pencil", "yellow");
                return;
            }

            // FIX: Jika mode kontribusi (ulasan), gunakan lokasi spot yang sedang dibuka jika tempLatlng kosong
            if(!tempLatlng && isContributionMode && currentDetailSpot) {
                tempLatlng = { lat: Number(currentDetailSpot.lat), lng: Number(currentDetailSpot.lng) };
            }

            if(!tempLatlng) {
                showCustomAlert("Lokasi Belum Dipilih", "Silakan pilih lokasi di peta atau unggah foto dengan data GPS.", "map-pin", "yellow");
                return;
            }

            // For contributions, a comment or a photo is required.
            if(isContributionMode && !comment && !originalFile) {
                showCustomAlert("Ulasan Kosong", "Mohon tambahkan <b>foto atau komentar</b> untuk memberikan ulasan pada spot ini.", "message-square", "yellow");
                return;
            }
            const btn = document.getElementById('btnSaveSpot');
            const oldText = btn.innerText;
            
            // 0.5. Kompresi Gambar (PENTING: Mencegah Crash Memori iPhone)
            if (originalFile) {
                btn.innerText = "Memproses...";
                btn.disabled = true;
                try {
                    // Kompres ke max 1000px, kualitas 0.7 (Sangat ringan & aman untuk upload)
                    fileToUpload = await compressImage(originalFile, 1000, 0.7);
                } catch (e) {
                    console.warn("Gagal kompres, pakai file asli", e);
                }
            }
            
            // 1. Validasi AI (Jika ada file)
            if(fileToUpload) {
                btn.innerHTML = '<i data-lucide="scan" class="w-3 h-3 inline mr-1 animate-pulse"></i> Menganalisa...';
                lucide.createIcons();
                btn.disabled = true;

                try {
                    const isFish = await detectFish(fileToUpload);
                    if(!isFish) {
                        showCustomAlert(
                            "Gambar Ditolak", 
                            "Sistem AI mendeteksi gambar ini <b>bukan ikan</b>.<br>Mohon unggah foto hasil pancingan yang valid.",
                            "shield-x",
                            "red"
                        );
                        btn.innerText = oldText;
                        btn.disabled = false;
                        return; // Stop process
                    }
                } catch(e) {
                    console.error("AI Error, skipping validation:", e);
                }
                btn.innerText = "Menyimpan...";
            }

            // 2. Upload Gambar ke ImgBB (Hosting Gratis)
            let photoUrl = "";
            if (fileToUpload) {
                btn.innerText = "Mengupload Gambar...";
                try {
                    const formData = new FormData();
                    formData.append("image", fileToUpload, "image.jpg"); // Tambahkan nama file untuk Blob
                    
                    // Kirim ke ImgBB
                    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                        method: "POST",
                        body: formData
                    });
                    const data = await res.json();
                    
                    if(data.success) {
                        photoUrl = data.data.url; // Dapat Link Gambar!
                    } else {
                        throw new Error("Gagal upload ke ImgBB");
                    }
                } catch(e) {
                    alert("Gagal upload gambar. Pastikan API Key ImgBB benar.");
                    btn.innerText = "Simpan ke Cloud"; btn.disabled = false;
                    return;
                }
            }

            // 3. Simpan Data ke Google Sheets
            btn.innerText = "Posting...";
            const spotData = {
                name: name,
                lat: tempLatlng.lat,
                lng: tempLatlng.lng,
                photo: photoUrl,
                uid: currentUser.email,
                createdAt: new Date().toISOString(),
                rating: rating,
                comment: comment,
                weight: weight || 0
            };

            // Kirim data ke Google Apps Script
            if(GOOGLE_SCRIPT_URL.startsWith("http")) {
                fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    body: JSON.stringify(spotData)
                }).then(() => {
                    loadSpots(); // Reload semua spot untuk update grouping
                    closeModal();
                    
                    // Tampilkan detail spot baru (ala Instagram)
                    openSpotDetail([spotData]);
                    map.flyTo([spotData.lat, spotData.lng], 16);
                    
                    btn.innerText = "Posting"; btn.disabled = false;
                }).catch(err => {
                    console.error(err);
                    alert("Gagal koneksi ke Google Sheet. Cek URL Script.");
                    btn.innerText = "Posting"; btn.disabled = false;
                });
            } else {
                // Fallback LocalStorage jika URL belum diisi
                let local = JSON.parse(localStorage.getItem('spots') || '[]');
                local.push(spotData);
                localStorage.setItem('spots', JSON.stringify(local));
                loadSpots();
                closeModal();
                
                // Tampilkan detail spot baru (ala Instagram)
                openSpotDetail([spotData]);
                map.flyTo([spotData.lat, spotData.lng], 16);
                
                btn.innerText = "Posting"; btn.disabled = false;
            }
        }

        function detectFish(file) {
            return new Promise((resolve) => {
                const img = document.createElement('img');
                const objectURL = URL.createObjectURL(file);
                img.src = objectURL;
                
                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const MAX_SIZE = 224;
                    
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
                    } else {
                        if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    const imageData = ctx.getImageData(0, 0, width, height);
                    URL.revokeObjectURL(objectURL);

                    const worker = getAiWorker();

                    const handleMessage = (e) => {
                        const { type, predictions, message } = e.data;
                        worker.removeEventListener('message', handleMessage);

                        if (type === 'result') {
                            console.log("AI Predictions:", predictions);
                            const fishKeywords = ['fish', 'shark', 'ray', 'eel', 'trout', 'salmon', 'bass', 'pike', 'carp', 'tench', 'barracouta', 'coho', 'gar', 'sturgeon', 'marlin', 'anemone', 'seahorse', 'goldfish', 'whaleshark', 'hammerhead', 'crab', 'lobster', 'lionfish'];
                            const match = predictions.find(p => fishKeywords.some(k => p.className.toLowerCase().includes(k)));

                            if (match) {
                                if (match.probability < 0.2) { resolve("Ikan (Jenis Tidak Pasti)"); return; }
                                let name = match.className.split(',')[0].toLowerCase();
                                for (const [eng, id] of Object.entries(fishTranslations)) {
                                    if (name.includes(eng)) { name = id; break; }
                                }
                                resolve(name.charAt(0).toUpperCase() + name.slice(1));
                            } else {
                                resolve(null);
                            }
                        } else if (type === 'error') {
                            console.error("AI Worker Error:", message);
                            resolve(null);
                        }
                    };

                    worker.addEventListener('message', handleMessage);
                    worker.postMessage({ imageData: { data: imageData.data, width: imageData.width, height: imageData.height } });
                };
                
                img.onerror = () => {
                    URL.revokeObjectURL(objectURL);
                    resolve(null);
                }
            });
        }

        // Helper: Tentukan Warna & Icon berdasarkan Berat Terbesar
        function getSpotStyle(maxWeight) {
            // Base classes (Solid Colors)
            let solidColor = 'bg-blue-600';
            let ringColor = 'ring-blue-400/80'; // Ring lebih tebal/terang
            let typeClass = 'marker-blue'; // For CSS targeting
            let pulse = '';
            let shadowClass = 'shadow-[0_0_30px_rgba(59,130,246,0.8)]'; // Default Blue Glow Strong
            
            if (maxWeight >= 10) { // Besar (> 10kg) -> MERAH
                solidColor = 'bg-red-600';
                ringColor = 'ring-red-500/80';
                typeClass = 'marker-red';
                pulse = 'animate-pulse';
                shadowClass = 'shadow-[0_0_40px_rgba(225,29,72,0.9)]'; // Red Glow Strong
            } else if (maxWeight >= 3) { // Sedang (3kg - 10kg) -> KUNING/ORANGE
                solidColor = 'bg-yellow-500';
                ringColor = 'ring-yellow-400/80';
                typeClass = 'marker-yellow';
                shadowClass = 'shadow-[0_0_35px_rgba(234,179,8,0.8)]'; // Yellow Glow Strong
            }

            return L.divIcon({
                className: 'custom-fish-icon',
                html: `
                    <div class="relative group flex flex-col items-center">
                        <div class="fish-marker-body ${typeClass} w-11 h-11 ${solidColor} rounded-full border-[3px] border-white ring-4 ${ringColor} ${shadowClass} flex items-center justify-center relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${pulse}">
                            <!-- Glossy Effect -->
                            <div class="absolute inset-0 rounded-full bg-gradient-to-b from-white/50 to-transparent opacity-100 pointer-events-none"></div>
                            <!-- Icon -->
                            <i data-lucide="fish" class="text-white w-6 h-6 drop-shadow-md relative z-20"></i>
                            <!-- Notification Dot for Monster -->
                            ${maxWeight >= 10 ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm z-30"><div class="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></div></div>' : ''}
                        </div>
                        <!-- Pin Point / Shadow -->
                        <div class="w-1 h-3 bg-gradient-to-b from-gray-400 to-transparent opacity-50 -mt-1"></div>
                        <div class="w-8 h-2 bg-black/30 blur-sm rounded-[100%] absolute bottom-[-4px] group-hover:scale-75 transition-transform duration-300"></div>
                    </div>
                `,
                iconSize: [44, 56],
                iconAnchor: [22, 56],
                popupAnchor: [0, -50]
            });
        }

        // Fungsi Render Marker (Updated untuk Grouping)
        function addMarker(key, group) {
            // Ambil data utama dari entri pertama atau yang paling baru
            const mainSpot = group[0];
            const count = group.length;
            
            // Hitung rata-rata rating
            let totalRating = 0;
            let ratingCount = 0;
            
            // Cari Berat Terbesar di Spot Ini
            let maxWeight = 0;

            group.forEach(g => {
                if(g.rating) { totalRating += parseInt(g.rating); ratingCount++; }
                if(g.weight) { 
                    const w = parseFloat(g.weight);
                    if(w > maxWeight) maxWeight = w;
                }
            });
            const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "Baru";

            // Cari foto terbaik (yang ada fotonya)
            const coverPhoto = group.find(g => g.photo)?.photo || '';

            // Tentukan Icon berdasarkan Max Weight
            const dynamicIcon = getSpotStyle(maxWeight);

            // ID unik untuk elemen alamat
            const addrId = 'addr-' + Math.random().toString(36).substr(2, 9);

            const popupHtml = `
                <div class="w-64 bg-neutral-900/90 backdrop-blur-xl rounded-[1.5rem] border border-white/10 shadow-2xl overflow-hidden pb-1">
                    ${coverPhoto ? `<div class="h-36 w-full relative group cursor-pointer" onclick="openSpotDetailByKey('${key}')">
                        <img src="${coverPhoto}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                        <div class="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1"><i data-lucide="image" class="w-3 h-3"></i> ${count}</div>
                    </div>` : '<div class="h-16 bg-gradient-to-r from-blue-600 to-purple-600 relative"><div class="absolute -bottom-6 left-4 w-12 h-12 bg-slate-800 rounded-full border-4 border-slate-900 flex items-center justify-center"><i data-lucide="fish" class="text-blue-400 w-6 h-6"></i></div></div>'}
                    
                    <div class="px-4 pt-3 pb-3">
                        <h4 class="font-black text-lg text-white leading-tight mb-1 truncate">${mainSpot.name}</h4>
                        
                        <div class="flex items-center gap-1 text-[10px] text-slate-400 mb-2">
                            <i data-lucide="map-pin" class="w-3 h-3"></i> <span id="${addrId}">Memuat lokasi...</span>
                        </div>
                        
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-1 text-xs text-yellow-400 font-bold"><i data-lucide="star" class="w-3 h-3 fill-current"></i> ${avgRating}</div>
                            ${maxWeight > 0 ? `<div class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1"><i data-lucide="trophy" class="w-3 h-3"></i> ${maxWeight} kg</div>` : ''}
                        </div>
                        
                        <button onclick="openSpotDetailByKey('${key}')" class="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-blue-300 hover:text-white text-xs py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                            LIHAT DETAIL
                        </button>
                    </div>
                </div>
            `;
            
            // Simpan maxWeight di options marker untuk filtering nanti
            const marker = L.marker([mainSpot.lat, mainSpot.lng], {icon: dynamicIcon, maxWeight: maxWeight}).addTo(map).bindPopup(popupHtml);
            
            // Event saat popup dibuka: Fetch Nama Lokasi
            marker.on('popupopen', () => {
                lucide.createIcons(); // Fix: Render ikon di dalam popup saat dibuka
                const el = document.getElementById(addrId);
                if(el && el.innerText === "Memuat lokasi...") {
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${mainSpot.lat}&lon=${mainSpot.lng}`)
                        .then(res => res.json())
                        .then(data => {
                            const addr = data.address;
                            let locName = "";
                            
                            // Prioritas Nama: Desa > Kecamatan > Kota
                            if(addr.village) locName = addr.village;
                            else if(addr.hamlet) locName = addr.hamlet;
                            else if(addr.town) locName = addr.town;
                            else if(addr.city) locName = addr.city;
                            else if(addr.county) locName = addr.county;
                            
                            // Tambahkan detail kedua jika ada (misal: Desa, Kota)
                            if(locName) {
                                if(addr.city && locName !== addr.city) locName += `, ${addr.city}`;
                                else if(addr.county && locName !== addr.county) locName += `, ${addr.county}`;
                            } else {
                                locName = "Lokasi Terpencil";
                            }

                            el.innerText = locName;
                        })
                        .catch(() => {
                            el.innerText = `${parseFloat(mainSpot.lat).toFixed(4)}, ${parseFloat(mainSpot.lng).toFixed(4)}`;
                        });
                }
            });

            allMarkers.push(marker);
            
            lucide.createIcons(); // Refresh icon di dalam popup
        }

        // Helper function untuk membuka detail dari popup (menggunakan key global)
        function openSpotDetailByKey(key) {
            if(groupedSpots[key]) {
                openSpotDetail(groupedSpots[key]);
            }
        }

        function openSpotDetail(group) {
            const main = group[0];
            currentDetailSpot = main; // Simpan referensi untuk "Tambah Kontribusi"
            
            // Hitung Stats
            let totalR = 0, countR = 0;
            let maxW = 0;
            group.forEach(g => { if(g.rating) { totalR += parseInt(g.rating); countR++; } });
            group.forEach(g => { if(g.weight && parseFloat(g.weight) > maxW) maxW = parseFloat(g.weight); });
            
            const avg = countR > 0 ? (totalR / countR).toFixed(1) : "0.0";
            
            // Populate UI
            document.getElementById('detail-name').innerText = main.name;
            document.getElementById('detail-count').innerText = group.length;
            document.getElementById('detail-max-weight').innerText = maxW > 0 ? maxW + " kg" : "-";
            document.getElementById('detail-rating-text').innerText = `(${avg} dari ${countR} ulasan)`;
            updateFavoriteBtn(); // Update status tombol favorit
            
            document.getElementById('detail-img').src = group.find(g => g.photo)?.photo || 'https://via.placeholder.com/400x200?text=No+Image';
            
            // Render Stars
            const starsContainer = document.getElementById('detail-rating-stars');
            starsContainer.innerHTML = '';
            for(let i=1; i<=5; i++) {
                starsContainer.innerHTML += `<i data-lucide="star" class="w-4 h-4 ${i <= Math.round(avg) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}"></i>`;
            }

            // Render Comments List
            const list = document.getElementById('detail-comments');
            list.innerHTML = '';
            
            // Urutkan dari yang terbaru
            group.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Pisahkan data: Ada Foto vs Hanya Teks
            const withPhotos = group.filter(g => g.photo);
            const textOnly = group.filter(g => !g.photo);

            // 1. BAGIAN KOMENTAR TEKS (Accordion / Bisa dibuka-tutup)
            if(textOnly.length > 0) {
                const accId = 'acc-' + Math.random().toString(36).substr(2,5);
                list.innerHTML += `
                    <div class="mb-6 bg-neutral-900/50 rounded-2xl border border-white/5 overflow-hidden">
                        <button onclick="document.getElementById('${accId}').classList.toggle('hidden')" class="w-full p-4 flex items-center justify-between bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
                            <span class="text-xs font-bold text-slate-300 flex items-center gap-2">
                                <i data-lucide="message-square" class="w-4 h-4 text-blue-400"></i> 
                                Komentar Tanpa Foto (${textOnly.length})
                            </span>
                            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-500"></i>
                        </button>
                        <div id="${accId}" class="hidden divide-y divide-white/5">
                            ${textOnly.map(g => `
                                <div class="p-3">
                                    <div class="flex justify-between items-start mb-1">
                                        <span class="text-[10px] font-bold text-slate-400">${g.uid.split('@')[0]}</span>
                                        <span class="text-[9px] text-slate-600">${new Date(g.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    ${g.rating ? `<div class="flex text-yellow-400 scale-75 origin-left mb-1">${Array(parseInt(g.rating)).fill('<i data-lucide="star" class="w-3 h-3 fill-current"></i>').join('')}</div>` : ''}
                                    <p class="text-xs text-slate-300 mt-1">${g.comment || '-'}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // 2. BAGIAN FOTO (Grid Katalog 2 Kolom)
            if(withPhotos.length > 0) {
                let grid = `<div class="grid grid-cols-2 gap-3">`;
                withPhotos.forEach(g => {
                    const stars = g.rating ? `<div class="flex text-yellow-400 scale-75 origin-left mb-1">${Array(parseInt(g.rating)).fill('<i data-lucide="star" class="w-3 h-3 fill-current"></i>').join('')}</div>` : '';
                    const weight = g.weight && g.weight > 0 ? `<div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-md font-bold border border-emerald-500/30 flex items-center gap-1"><i data-lucide="fish" class="w-3 h-3"></i> ${g.weight}kg</div>` : '';
                    
                    grid += `
                        <div class="bg-neutral-900 rounded-xl border border-white/5 overflow-hidden flex flex-col shadow-lg">
                            <div class="relative aspect-[4/5] bg-neutral-800 group cursor-pointer" onclick="openImageLightbox('${g.photo}')">
                                <img src="${g.photo}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                ${weight}
                                <div class="absolute bottom-2 left-2">
                                    <p class="text-[9px] font-bold text-white shadow-black drop-shadow-md">${g.uid.split('@')[0]}</p>
                                </div>
                            </div>
                            <div class="p-3 flex-1 flex flex-col">
                                ${stars}
                                <p class="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">${g.comment || 'Tanpa keterangan'}</p>
                            </div>
                        </div>
                    `;
                });
                grid += `</div>`;
                list.innerHTML += grid;
            }

            document.getElementById('spotDetailModal').classList.remove('hidden');
            
            // --- FIX: Tombol Close Spot Detail ---
            const modal = document.getElementById('spotDetailModal');
            let closeBtn = document.getElementById('spot-floating-close');
            if (!closeBtn) {
                const originalBtn = modal.querySelector('button[onclick*="closeSpotDetail"]');
                if (originalBtn) {
                    closeBtn = originalBtn;
                    closeBtn.id = 'spot-floating-close';
                    document.body.appendChild(closeBtn);
                    
                    closeBtn.style.position = 'fixed';
                    closeBtn.style.top = '20px';
                    closeBtn.style.right = '20px';
                    closeBtn.style.zIndex = '10000';
                    closeBtn.className = "bg-black/80 backdrop-blur-md border border-white/20 shadow-2xl rounded-full p-2 hover:bg-red-500/20 transition-all text-white";
                }
            }
            if (closeBtn) {
                closeBtn.classList.remove('hidden');
            }
            
            lucide.createIcons();
        }

        function closeSpotDetail() { 
            document.getElementById('spotDetailModal').classList.add('hidden'); 
            const closeBtn = document.getElementById('spot-floating-close');
            if(closeBtn) closeBtn.classList.add('hidden');
        }

        function addContribution() {
            if(currentDetailSpot) {
                document.getElementById('spotName').value = currentDetailSpot.name;
                document.getElementById('spotWeight').value = ''; // Reset berat untuk kontribusi baru
                
                // Update UI Modal untuk Mode Kontribusi
                document.getElementById('addModalTitle').innerHTML = `<i data-lucide="message-circle" class="text-blue-500"></i> Tambah Ulasan`;
                document.getElementById('btnSaveSpot').innerText = "Kirim Ulasan";
                
                closeSpotDetail();
                openAddModal(true); // Pass true menandakan ini mode kontribusi
                
                // FIX: Set tempLatlng kembali setelah openAddModal karena fungsi tersebut memanggil closeLocationPanel -> navigateTo('map') yang mereset tempLatlng jadi null
                tempLatlng = { lat: Number(currentDetailSpot.lat), lng: Number(currentDetailSpot.lng) };
            }
        }

        async function loadSpots() {
            // Bersihkan marker lama (kecuali user & search)
            allMarkers.forEach(m => map.removeLayer(m));
            allMarkers = [];
            
            // Reset grouping global
            groupedSpots = {};

            // 1. Ambil Data LocalStorage (sebagai base)
            let local = JSON.parse(localStorage.getItem('spots') || '[]');
            local.forEach(item => {
                const key = item.spotId || (item.lat + ',' + item.lng);
                if(!groupedSpots[key]) groupedSpots[key] = [];
                groupedSpots[key].push(item);
            });

            // 2. Ambil Data Google Sheets (Async) & Merge
            if(GOOGLE_SCRIPT_URL.startsWith("http")) {
                try {
                    // FIX: Tambahkan timestamp (?t=...) agar data peta selalu update (Like/Komen baru muncul)
                    const res = await fetch(`${GOOGLE_SCRIPT_URL}?t=${Date.now()}`);
                    const data = await res.json();
                    
                    data.forEach(item => {
                        // FIX: Handle Comma in Coordinates (Data Lama)
                        if(typeof item.lat === 'string') item.lat = parseFloat(item.lat.replace(',', '.'));
                        if(typeof item.lng === 'string') item.lng = parseFloat(item.lng.replace(',', '.'));

                        const key = item.spotId || (item.lat + ',' + item.lng);
                        if(!groupedSpots[key]) groupedSpots[key] = [];
                        groupedSpots[key].push(item);
                    });
                    
                } catch(e) { console.log("Gagal load Sheet:", e); }
            }
            
            // 3. Render Semua Marker dari Grouping yang sudah terkumpul
            Object.keys(groupedSpots).forEach(key => addMarker(key, groupedSpots[key]));
            
            lucide.createIcons();
            handleZoomEffect(); // Update tampilan setelah load
        }

        function locateUser() {
            map.locate({setView: true, maxZoom: 15, enableHighAccuracy: true});
        }
        
        map.on('locationfound', e => {
            // Hapus marker lokasi lama jika ada agar tidak menumpuk
            if (userLocationMarker) map.removeLayer(userLocationMarker);
            
            // Cleanup legacy markers (jika ada sisa dari versi lama)
            map.eachLayer(layer => {
                if(layer instanceof L.CircleMarker && layer.options.color === '#3b82f6') {
                    map.removeLayer(layer);
                }
            });

            // Icon Lokasi User Keren (Pulsing Blue Dot)
            const userIcon = L.divIcon({
                className: 'bg-transparent',
                html: `
                    <div class="relative flex items-center justify-center w-16 h-16">
                        <div class="absolute w-12 h-12 bg-blue-500 rounded-full opacity-40 animate-ping"></div>
                        <div class="relative w-5 h-5 bg-blue-600 border-[3px] border-white rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)] z-10"></div>
                    </div>
                `,
                iconSize: [64, 64],
                iconAnchor: [32, 32]
            });

            userLocationMarker = L.marker(e.latlng, {icon: userIcon, zIndexOffset: 1000}).addTo(map);
            
            // PERBAIKAN: Update data cuaca saat lokasi GPS ditemukan via tombol
            // Ini memastikan cuaca tidak lagi menggunakan data IP Address lama
            userLatlng = e.latlng;
            localStorage.setItem('lastLat', e.latlng.lat);
            localStorage.setItem('lastLng', e.latlng.lng);
            fetchUserWeather(e.latlng.lat, e.latlng.lng);
        });

        map.on('locationerror', e => {
            // Handler jika user menolak atau GPS mati saat tombol ditekan
            if (e.code === 1) {
                alert("⚠️ Akses Lokasi Ditolak\n\nBrowser memblokir lokasi. Silakan ketuk ikon gembok di address bar > Izin > Lokasi: Izinkan/Allow, lalu coba lagi.");
            } else {
                alert("⚠️ Lokasi Tidak Ditemukan\n\nPastikan GPS aktif dan sinyal stabil.");
            }
        });

        // --- FITUR BARU: CARI SPOT TERDEKAT ---
        function findNearestSpot() {
            // 1. Cek apakah lokasi user sudah ada
            if (!userLatlng) {
                alert("Lokasi Anda belum ditemukan. Aktifkan GPS dan coba lagi.");
                locateUser(); // Coba aktifkan pencarian lokasi
                return;
            }

            // 2. Cek apakah sudah ada spot di peta
            if (allMarkers.length === 0) {
                alert("Belum ada spot yang dimuat di peta. Mohon tunggu sebentar.");
                return;
            }

            let nearestMarker = null;
            let minDistance = Infinity;

            // 3. Hitung jarak ke setiap spot
            allMarkers.forEach(marker => {
                const spotLatLng = marker.getLatLng();
                const distance = userLatlng.distanceTo(spotLatLng);

                if (distance < minDistance) {
                    minDistance = distance;
                    nearestMarker = marker;
                }
            });

            // 4. Arahkan ke spot terdekat
            if (nearestMarker) {
                const spotLatLng = nearestMarker.getLatLng();
                map.flyTo(spotLatLng, 16); // Zoom lebih dekat
                nearestMarker.openPopup();

                // Gambar garis lurus dari user ke spot
                if(currentRouteLine) map.removeLayer(currentRouteLine);
                currentRouteLine = L.polyline([userLatlng, spotLatLng], { color: '#10b981', weight: 5, opacity: 0.8, dashArray: '10, 5' }).addTo(map);
            } else {
                alert("Tidak dapat menemukan spot terdekat.");
            }
        }

        // --- LIGHTBOX FUNCTIONS ---
        function openImageLightbox(url) {
            document.getElementById('lightbox-img').src = url;
            document.getElementById('lightboxModal').classList.remove('hidden');
        }
        
        function closeImageLightbox() {
            document.getElementById('lightboxModal').classList.add('hidden');
            setTimeout(() => { document.getElementById('lightbox-img').src = ''; }, 300);
        }

        // --- CUSTOM ALERT MODAL ---
        function showCustomAlert(title, message, icon = 'alert-triangle', color = 'red') {
            const modal = document.getElementById('customAlertModal');
            document.getElementById('alert-title').innerText = title;
            document.getElementById('alert-message').innerHTML = message; // Use innerHTML to allow for <b> tags

            const iconEl = document.getElementById('alert-icon');
            iconEl.setAttribute('data-lucide', icon);

            const iconContainer = document.getElementById('alert-icon-container');
            const closeBtn = document.getElementById('alert-button');
            const modalContent = modal.querySelector('.glass');
            
            // Reset classes
            iconContainer.className = 'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4';
            iconEl.className = 'w-8 h-8';
            closeBtn.className = 'w-full py-3 rounded-xl font-bold transition-all shadow-lg text-white';
            modalContent.className = 'glass w-full max-w-sm p-8 rounded-[2rem] animate-in zoom-in-90 duration-300 relative m-4 shadow-2xl text-center';

            if (color === 'red') {
                modalContent.classList.add('border-red-500/30');
                iconContainer.classList.add('bg-red-500/20', 'border-red-500/30');
                iconEl.classList.add('text-red-400');
                closeBtn.classList.add('bg-red-600', 'hover:bg-red-500');
            } else if (color === 'yellow') {
                modalContent.classList.add('border-yellow-500/30');
                iconContainer.classList.add('bg-yellow-500/20', 'border-yellow-500/30');
                iconEl.classList.add('text-yellow-400');
                closeBtn.classList.add('bg-yellow-600', 'hover:bg-yellow-500');
            }

            modal.classList.remove('hidden');
            modal.classList.add('flex');
            lucide.createIcons();
        }

        function closeCustomAlert() {
            const modal = document.getElementById('customAlertModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        // --- SCROLL DOTS INDICATOR ---
        function initScrollDots() {
            const container = document.getElementById('weather-scroll');
            const dotsContainer = document.getElementById('scroll-dots');
            if(!container || !dotsContainer) return;
            
            // Hitung estimasi halaman berdasarkan lebar container dan item
            const itemWidth = 112; // min-w-[100px] + gap (approx)
            const containerWidth = container.clientWidth || window.innerWidth;
            const totalItems = 9; // Jumlah kartu cuaca (Added SST)
            const totalWidth = totalItems * itemWidth;
            const pages = Math.ceil(totalWidth / containerWidth);
            
            let html = '';
            for(let i=0; i<pages; i++) {
                html += `<div class="h-1.5 rounded-full transition-all duration-300 ${i===0 ? 'bg-white w-4' : 'bg-slate-600 w-1.5'}" id="dot-${i}"></div>`;
            }
            dotsContainer.innerHTML = html;
            container.onscroll = updateScrollDots;
        }

        function updateScrollDots() {
            const container = document.getElementById('weather-scroll');
            if(!container) return;
            
            const scrollLeft = container.scrollLeft;
            const width = container.clientWidth;
            const page = Math.round(scrollLeft / width);
            
            const dots = document.getElementById('scroll-dots').children;
            for(let i=0; i<dots.length; i++) {
                if(i === page) {
                    dots[i].classList.remove('bg-slate-600', 'w-1.5');
                    dots[i].classList.add('bg-white', 'w-4');
                } else {
                    dots[i].classList.add('bg-slate-600', 'w-1.5');
                    dots[i].classList.remove('bg-white', 'w-4');
                }
            }
        }
        
        // --- NEW MAP SETTINGS & LAYERS FUNCTIONS ---
        function openMapSettings() {
            document.getElementById('mapSettingsModal').classList.remove('translate-y-full');
            if(typeof updateOfflineList === 'function') updateOfflineList(); // Refresh list saat menu dibuka
            lucide.createIcons();
        }

        function closeMapSettings() {
            document.getElementById('mapSettingsModal').classList.add('translate-y-full');
        }

        // --- FITUR BARU: KOMPAS DIGITAL ---
        function initCompass() {
            // Cek agar tidak double render
            if(document.getElementById('map-compass-control')) return;

            const CompassControl = L.Control.extend({
                options: { position: 'topright' },
                onAdd: function(map) {
                    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                    container.id = 'map-compass-control';
                    container.style.backgroundColor = '#0f172a';
                    container.style.border = '1px solid rgba(255,255,255,0.1)';
                    container.style.borderRadius = '50%';
                    container.style.width = '44px';
                    container.style.height = '44px';
                    container.style.display = 'flex';
                    container.style.alignItems = 'center';
                    container.style.justifyContent = 'center';
                    container.style.cursor = 'pointer';
                    container.style.marginTop = '80px'; // Turunkan posisi agar tidak tertutup search bar
                    container.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    
                    // Ikon Kompas Custom (Jarum Merah = Utara)
                    container.innerHTML = `
                        <div id="compass-icon" class="transition-transform duration-300">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-md">
                                <path d="M12 2L16 12H8L12 2Z" fill="#ef4444"/> <!-- Utara (Merah) -->
                                <path d="M12 22L8 12H16L12 22Z" fill="#e2e8f0"/> <!-- Selatan (Putih) -->
                                <circle cx="12" cy="12" r="2" fill="#0f172a"/>
                                <text x="12" y="7.5" font-family="sans-serif" font-size="3.5" font-weight="900" fill="white" text-anchor="middle">N</text>
                            </svg>
                        </div>`;
                    
                    // Handler Klik (Penting untuk Izin iOS)
                    container.onclick = function() {
                        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                            // Khusus iOS 13+ (Butuh Izin User)
                            DeviceOrientationEvent.requestPermission()
                                .then(response => {
                                    if (response === 'granted') {
                                        window.addEventListener('deviceorientation', handleOrientation);
                                        alert("Kompas Aktif! Putar HP Anda.");
                                    } else {
                                        alert("Izin Kompas Ditolak.");
                                    }
                                })
                                .catch(console.error);
                        } else {
                            // Android / Browser Biasa
                            window.addEventListener('deviceorientation', handleOrientation);
                            alert("Kompas Diaktifkan (Jika sensor tersedia).");
                        }
                    };
                    return container;
                }
            });
            map.addControl(new CompassControl());
            lucide.createIcons();
        }

        function handleOrientation(e) {
            const icon = document.getElementById('compass-icon');
            if(!icon) return;
            
            let heading = 0;
            if(e.webkitCompassHeading) heading = e.webkitCompassHeading; // iOS
            else if(e.alpha) heading = 360 - e.alpha; // Android (Fallback)
            
            // Putar ikon berlawanan arah heading agar jarum selalu menunjuk Utara
            icon.style.transform = `rotate(${-heading}deg)`;
        }

        function setBaseMap(type) {
            if (typeof map === 'undefined') return;
            
            // Update UI Buttons
            const btnSat = document.getElementById('btn-map-sat');
            const btnStreet = document.getElementById('btn-map-street');
            const btnOcean = document.getElementById('btn-map-ocean');

            // Reset borders
            [btnSat, btnStreet, btnOcean].forEach(btn => {
                if(btn) { btn.classList.remove('border-blue-500'); btn.classList.add('border-transparent'); }
            });
            
            if(type === 'satellite') {
                map.removeLayer(streetLayer); map.removeLayer(oceanLayer); map.addLayer(satLayer);
                isSat = true;
                if(btnSat) { btnSat.classList.add('border-blue-500'); btnSat.classList.remove('border-transparent'); }
            } else if(type === 'street') {
                map.removeLayer(satLayer); map.removeLayer(oceanLayer); map.addLayer(streetLayer);
                isSat = false;
                if(btnStreet) { btnStreet.classList.add('border-blue-500'); btnStreet.classList.remove('border-transparent'); }
            } else if(type === 'ocean') {
                map.removeLayer(satLayer); map.removeLayer(streetLayer); map.addLayer(oceanLayer);
                isSat = false;
                if(btnOcean) { btnOcean.classList.add('border-blue-500'); btnOcean.classList.remove('border-transparent'); }
            }
            
            // Re-add overlay if exists (because base layer change might hide it)
            Object.values(activeLayers).forEach(layer => {
                if(layer.bringToFront) layer.bringToFront();
            });
        }

        function getGibsDate(daysAgo = 1) {
            const d = new Date();
            d.setDate(d.getDate() - daysAgo);
            return d.toISOString().split('T')[0];
        }

        // --- LAYER PERSISTENCE (SIMPAN PENGATURAN PETA) ---
        function updateLayerStorage() {
            const active = [];
            document.querySelectorAll('input[id^="toggle-"]').forEach(el => {
                if(el.checked) active.push(el.id.replace('toggle-', ''));
            });
            localStorage.setItem('activeMapLayers', JSON.stringify(active));
        }

        // --- HELPER: LEGEND / INDIKATOR PETA ---
        function showLegend(type) {
            let legend = document.getElementById('map-legend-container');
            if(!legend) {
                legend = document.createElement('div');
                legend.id = 'map-legend-container';
                legend.className = 'fixed bottom-24 left-4 z-[1000] bg-slate-900/90 p-3 rounded-xl border border-white/10 shadow-xl backdrop-blur-md max-w-[200px] animate-in slide-in-from-left-5 duration-300';
                document.body.appendChild(legend);
            }
            
            let content = '';
            if(type === 'sst') {
                content = `
                    <h5 class="text-xs font-bold text-white mb-2 flex items-center gap-1"><i data-lucide="thermometer" class="w-3 h-3 text-red-400"></i> Suhu Laut (SST)</h5>
                    <div class="h-2 w-full bg-gradient-to-r from-purple-600 via-blue-500 to-red-500 rounded-full mb-1"></div>
                    <div class="flex justify-between text-[9px] text-slate-300 font-mono">
                        <span>0°C</span><span>15°</span><span>32°C</span>
                    </div>`;
            } else if(type === 'chlorophyll') {
                content = `
                    <h5 class="text-xs font-bold text-white mb-2 flex items-center gap-1"><i data-lucide="sprout" class="w-3 h-3 text-green-400"></i> Klorofil (Plankton)</h5>
                    <div class="h-2 w-full bg-gradient-to-r from-blue-800 via-green-500 to-yellow-300 rounded-full mb-1"></div>
                    <div class="flex justify-between text-[9px] text-slate-300 font-mono">
                        <span>Sedikit</span><span>Sedang</span><span>Subur</span>
                    </div>`;
            } else if(type === 'sonar') {
                content = `
                    <h5 class="text-xs font-bold text-white mb-2 flex items-center gap-1"><i data-lucide="radar" class="w-3 h-3 text-emerald-400"></i> Legenda Peta Laut</h5>
                    <div class="flex items-center gap-2 mb-1">
                        <div class="w-3 h-3 bg-[#a3c6e6] border border-slate-400 rounded-sm"></div> <span class="text-[9px] text-slate-300">Laut Dangkal</span>
                    </div>
                    <div class="flex items-center gap-2 mb-1">
                        <div class="w-3 h-3 bg-[#1e4e79] border border-slate-400 rounded-sm"></div> <span class="text-[9px] text-slate-300">Laut Dalam</span>
                    </div>
                    <div class="flex items-center gap-2 mb-1">
                        <i data-lucide="activity" class="w-3 h-3 text-slate-400"></i> <span class="text-[9px] text-slate-300">Garis Kontur & Kedalaman</span>
                    </div>`;
            }
            
            if(content) {
                legend.innerHTML = content;
                legend.classList.remove('hidden');
                lucide.createIcons();
            }
        }

        function hideLegend() {
            const legend = document.getElementById('map-legend-container');
            if(legend) legend.classList.add('hidden');
        }

    function loadLayerPreferences() { // FIX: Logic diperbaiki agar layer mau reload saat online kembali
            try {
                const saved = JSON.parse(localStorage.getItem('activeMapLayers') || '[]');
                saved.forEach(type => {
                    const toggle = document.getElementById(`toggle-${type}`);
                if(toggle) {
                    // Force a clean state before re-applying
                    if(activeLayers[type]) {
                        // Hapus handler klik jika ada (untuk radar kapal)
                        if (activeLayers[type].getFeatureInfoHandler) {
                            map.off('click', activeLayers[type].getFeatureInfoHandler);
                        }
                        map.removeLayer(activeLayers[type]);
                        delete activeLayers[type];
                    }
                    // Now, re-apply it
                        toggle.checked = true;
                    toggleLayer(type);
                    }
                });
            } catch(e) { console.log("Error restoring layers", e); }
        }

        async function toggleLayer(type) {
            const toggle = document.getElementById(`toggle-${type}`);
            if(!toggle) return;
            
            const isChecked = toggle.checked;
            updateLayerStorage(); // Simpan status terbaru setiap kali di-klik

            // 1. Jika dimatikan (Uncheck)
            if(!isChecked) {
                if(activeLayers[type]) {
                    // Hapus handler klik jika ada (untuk radar kapal)
                    if (activeLayers[type].getFeatureInfoHandler) {
                        map.off('click', activeLayers[type].getFeatureInfoHandler);
                    }
                    map.removeLayer(activeLayers[type]);
                    delete activeLayers[type];
                }
                // Sembunyikan legenda otomatis
                hideLegend();
                return;
            }

            // 2. Jika dinyalakan (Check)
            // OPENWEATHERMAP LAYERS (Wind) - Butuh API Key
            if(type === 'wind') {
                if(OWM_API_KEY === "YOUR_OWM_API_KEY" || !OWM_API_KEY) {
                    alert("⚠️ Fitur Peta Angin Memerlukan API Key");
                    toggle.checked = false;
                    updateLayerStorage();
                    return;
                }
                
                if(!map.getPane('weatherPane')) {
                    map.createPane('weatherPane');
                    map.getPane('weatherPane').style.zIndex = 300;
                    map.getPane('weatherPane').style.pointerEvents = 'none';
                }

                activeLayers[type] = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`, {
                    pane: 'weatherPane',
                    opacity: 0.7
                }).addTo(map);
                
                const toast = document.createElement('div');
                toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 shadow-xl z-[2000] flex items-center gap-2";
                toast.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-emerald-400"></i> Layer Angin Ditampilkan`;
                document.body.appendChild(toast);
                setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 3000);
                lucide.createIcons();
                return;
            }

            // EARTHQUAKE LAYER (USGS Feed)
            if(type === 'quake') {
                try {
                    // Mengambil data gempa > 2.5 magnitudo dalam 24 jam terakhir
                    const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
                    const data = await res.json();
                    
                    activeLayers[type] = L.geoJSON(data, {
                        pointToLayer: (feature, latlng) => {
                            const mag = feature.properties.mag;
                            // Warna: Merah (>5), Orange (>4), Kuning (Sisanya)
                            const color = mag >= 5 ? '#ef4444' : (mag >= 4 ? '#f97316' : '#eab308');
                            return L.circleMarker(latlng, {
                                radius: Math.max(4, mag * 2.5), // Radius dinamis berdasarkan kekuatan gempa
                                fillColor: color,
                                color: "#fff",
                                weight: 1,
                                opacity: 0.8,
                                fillOpacity: 0.6
                            });
                        },
                        onEachFeature: (feature, layer) => {
                            const p = feature.properties;
                            const d = new Date(p.time).toLocaleString();
                            layer.bindPopup(`<div class="bg-neutral-900/90 backdrop-blur-md p-3 rounded-xl border border-white/10 min-w-[180px] shadow-xl"><h4 class="font-bold text-sm text-white flex items-center gap-2"><i data-lucide="activity" class="w-4 h-4 text-red-500"></i> Gempa M ${p.mag.toFixed(1)}</h4><p class="text-xs text-slate-300 mt-1 leading-relaxed">${p.place}</p><p class="text-[10px] text-slate-500 mt-2 flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${d}</p></div>`);
                            layer.on('popupopen', () => lucide.createIcons());
                        }
                    }).addTo(map);

                    const toast = document.createElement('div');
                    toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 shadow-xl z-[2000] flex items-center gap-2";
                    toast.innerHTML = `<i data-lucide="activity" class="w-4 h-4 text-red-500"></i> Data Gempa Ditampilkan`;
                    document.body.appendChild(toast);
                    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 3000);
                    lucide.createIcons();
                } catch(e) {
                    alert("Gagal memuat data gempa.");
                }
                return;
            }

            // OPENSEAMAP LAYER (Navigasi Laut)
            if(type === 'seamap') {
                activeLayers[type] = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
                    opacity: 1.0
                }).addTo(map);

                const toast = document.createElement('div');
                toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 shadow-xl z-[2000] flex items-center gap-2";
                toast.innerHTML = `<i data-lucide="anchor" class="w-4 h-4 text-orange-400"></i> Peta Navigasi Laut`;
                document.body.appendChild(toast);
                setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 3000);
                lucide.createIcons();
                return;
            }

            // PRESSURE LAYER (Tekanan Udara)
            if(type === 'pressure') {
                if(OWM_API_KEY === "YOUR_OWM_API_KEY" || !OWM_API_KEY) {
                    alert("Fitur ini butuh API Key OpenWeatherMap."); toggle.checked = false; updateLayerStorage(); return;
                }
                activeLayers[type] = L.tileLayer(`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`, {
                    opacity: 0.6
                }).addTo(map);

                const toast = document.createElement('div');
                toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 shadow-xl z-[2000] flex items-center gap-2";
                toast.innerHTML = `<i data-lucide="gauge" class="w-4 h-4 text-purple-400"></i> Peta Tekanan Udara`;
                document.body.appendChild(toast);
                setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 3000);
                lucide.createIcons();
                return;
            }

            // FISH HEATMAP LAYER
            if(type === 'fish_heat') {
                if(!L.heatLayer) {
                    alert("Plugin Heatmap belum dimuat.");
                    toggle.checked = false;
                    updateLayerStorage();
                    return;
                }
                
                let heatPoints = [];
                Object.values(groupedSpots).forEach(group => {
                    group.forEach(spot => {
                        let intensity = 0.5;
                        if(spot.weight && parseFloat(spot.weight) > 0) {
                            intensity = Math.min(parseFloat(spot.weight) / 20, 1.0);
                        }
                        heatPoints.push([spot.lat, spot.lng, intensity]);
                    });
                });

                if(heatPoints.length === 0) {
                    alert("Belum ada data spot untuk membuat heatmap.");
                    toggle.checked = false;
                    updateLayerStorage();
                    return;
                }

                activeLayers[type] = L.heatLayer(heatPoints, { radius: 25, blur: 15, maxZoom: 17, gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'} }).addTo(map);
                
                const toast = document.createElement('div');
                toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 shadow-xl z-[2000] flex items-center gap-2";
                toast.innerHTML = `<i data-lucide="scan-line" class="w-4 h-4 text-pink-400"></i> Heatmap Ikan Aktif`;
                document.body.appendChild(toast);
                setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 3000);
                lucide.createIcons();
                return;
            }

            // SST (Sea Surface Temperature) LAYER - NASA GIBS (Free)
            if(type === 'sst') {
                // Ganti ke Data BULANAN (Monthly) agar pasti berwarna penuh (tidak ada celah data harian)
                const d = new Date(); d.setMonth(d.getMonth() - 1); d.setDate(1); 
                const dateStr = d.toISOString().split('T')[0];

                activeLayers[type] = L.tileLayer(`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_L3_Sea_Surface_Temperature_11u_4km_Month/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`, { 
                    pane: 'gibsPane', // Wajib di pane khusus agar di atas Satelit
                    opacity: 0.75,    // Diperjelas agar warna terlihat
                    maxNativeZoom: 9, // Batas zoom asli tiles NASA
                    maxZoom: 20,      // Izinkan zoom lebih dalam (stretch)
                    attribution: 'NASA GIBS'
                }).addTo(map);
                
                showLegend('sst');
                const toast = document.createElement('div'); toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 shadow-xl z-[2000] flex items-center gap-2"; toast.innerHTML = `<i data-lucide="thermometer-sun" class="w-4 h-4 text-indigo-400"></i> Peta Suhu Aktif`; document.body.appendChild(toast); setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 4000); lucide.createIcons(); return;
            }

            // CHLOROPHYLL LAYER - NASA GIBS (Free)
            if(type === 'chlorophyll') {
                // Gunakan Data BULANAN (Monthly) agar pasti ada isinya (tidak bolong-bolong)
                const d = new Date(); d.setMonth(d.getMonth() - 1); d.setDate(1); // Ambil tanggal 1 bulan lalu
                const dateStr = d.toISOString().split('T')[0];
                
                activeLayers[type] = L.tileLayer(`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_L3_Chlorophyll_a_4km_Month/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`, { 
                    pane: 'gibsPane', // Gunakan pane khusus
                    opacity: 0.75,    // Diperjelas
                    maxNativeZoom: 9,
                    maxZoom: 20,
                    attribution: 'NASA GIBS'
                }).addTo(map);
                
                showLegend('chlorophyll');
                const toast = document.createElement('div'); toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 shadow-xl z-[2000] flex items-center gap-2"; toast.innerHTML = `<i data-lucide="sprout" class="w-4 h-4 text-emerald-400"></i> Peta Klorofil Aktif`; document.body.appendChild(toast); setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 4000); lucide.createIcons(); return;
            }

            // BATHYMETRY LAYER (GEBCO)
            if(type === 'bathymetry') {
                // Gunakan Esri Ocean Basemap sebagai Overlay (Semi-Transparan) - Lebih cepat & detail
                activeLayers[type] = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
                    pane: 'gibsPane', // FIX: Paksa layer ini di atas peta dasar (Satelit)
                    opacity: 0.7,     // Agak tebal agar kontur kedalaman terlihat jelas
                    maxNativeZoom: 10, // PENTING: Paksa ambil tiles dari zoom 10 saat di-zoom in (agar tidak hilang)
                    maxZoom: 20,       // Izinkan stretch sampai zoom 20
                    attribution: 'Esri Ocean'
                }).addTo(map);

                const toast = document.createElement('div');
                toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 shadow-xl z-[2000] flex items-center gap-2";
                toast.innerHTML = `<i data-lucide="waves" class="w-4 h-4 text-cyan-400"></i> Peta Kedalaman Aktif`;
                document.body.appendChild(toast);
                setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 3000);
                lucide.createIcons();
                return;
            }

            // SONAR MAP (New Feature: Struktur + Heatmap Ikan)
            if(type === 'sonar') {
                const layers = [];
                
                // 1. Base Layer: Esri Ocean (High Contrast untuk Struktur)
                if(!map.getPane('sonarPane')) {
                    map.createPane('sonarPane');
                    map.getPane('sonarPane').style.zIndex = 220; // Di atas base map biasa
                    // Hapus filter gelap agar terlihat seperti Peta Laut (Chart) asli yang terang/jelas
                    // map.getPane('sonarPane').style.filter = 'contrast(1.2) saturate(1.2) brightness(0.9)'; 
                }
                
                // Layer 1: Base (Warna Dasar Laut & Daratan)
                const base = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
                    pane: 'sonarPane',
                    opacity: 1.0,
                    maxNativeZoom: 10, // FIX: Batas zoom asli Esri Ocean adalah 10
                    maxZoom: 20,
                    attribution: 'Esri Ocean'
                });
                layers.push(base);

                // Layer 2: Reference (Garis Kontur, Label Kedalaman, Nama Karang) - INI KUNCINYA
                const ref = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}', {
                    pane: 'sonarPane',
                    opacity: 1.0,
                    maxNativeZoom: 10, // FIX: Batas zoom asli Esri Ocean adalah 10
                    maxZoom: 20
                });
                layers.push(ref);

                // Layer 3: Nautical Chart Overlay (Buoy, Lampu, Rambu Laut)
                const seamark = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
                    pane: 'sonarPane', // Tumpuk di pane yang sama
                    opacity: 1.0, 
                    maxNativeZoom: 18, // OpenSeaMap support zoom tinggi
                    maxZoom: 20,
                    attribution: 'OpenSeaMap'
                });
                layers.push(seamark);

                activeLayers[type] = L.layerGroup(layers).addTo(map);
                
                showLegend('sonar'); 
                const toast = document.createElement('div'); toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 shadow-xl z-[2000] flex items-center gap-2"; toast.innerHTML = `<i data-lucide="radar" class="w-4 h-4 text-emerald-400"></i> Peta Laut (Chart) Aktif`; document.body.appendChild(toast); setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 4000); lucide.createIcons(); return;
            }

            // LIVE SHIP RADAR (AIS)
            if(type === 'ship_radar') {
                if(!map.getPane('shipPane')) {
                    map.createPane('shipPane');
                    map.getPane('shipPane').style.zIndex = 450; // Di atas peta, di bawah marker
                }

                // Ganti ke VesselFinder (Tiles) - Menampilkan ikon kapal visual
                const shipLayer = L.tileLayer('https://tiles.vesselfinder.com/tiles/{z}/{x}/{y}.png', {
                    pane: 'shipPane',
                    opacity: 1.0,
                    attribution: '© VesselFinder'
                }).addTo(map);

                activeLayers[type] = shipLayer;

                const toast = document.createElement('div'); toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 shadow-xl z-[2000] flex items-center gap-2"; 
                toast.innerHTML = `<i data-lucide="ship" class="w-4 h-4 text-red-400"></i> Radar Kapal Aktif`; 
                document.body.appendChild(toast); setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 4000); lucide.createIcons();
                return;
            }

            try {
                // REMOVED: Proxy dihapus sesuai permintaan. Ini mungkin menyebabkan error CORS kembali.
                const res = await fetch(`https://api.rainviewer.com/public/weather-maps.json?_=${Date.now()}`);
                const data = await res.json();
                
                // Normalisasi Host
                let host = data.host || 'https://tilecache.rainviewer.com';
                if(host.endsWith('/')) host = host.slice(0, -1);
                
                let tileUrl = '';

                if(type === 'rain') {
                    // Radar: Gunakan frame ke-2 terakhir agar lebih stabil (jika ada)
                    if(data.radar && data.radar.past && data.radar.past.length > 0) {
                        const idx = data.radar.past.length > 1 ? data.radar.past.length - 2 : 0;
                        const item = data.radar.past[idx];
                        tileUrl = `${host}${item.path}/256/{z}/{x}/{y}/2/1_1.png`;
                    }
                } else if(type === 'clouds') {
                    // Satellite: Gunakan frame terakhir
                    if(data.satellite && data.satellite.infrared && data.satellite.infrared.length > 0) {
                        const item = data.satellite.infrared[data.satellite.infrared.length - 1];
                        tileUrl = `${host}${item.path}/256/{z}/{x}/{y}/0/1_1.png`;
                    }
                }

                if(tileUrl) {
                    // FIX: Gunakan Pane khusus agar layer cuaca pasti di atas peta dasar tapi di bawah marker
                    if(!map.getPane('weatherPane')) {
                        map.createPane('weatherPane');
                        map.getPane('weatherPane').style.zIndex = 300; // BaseMap=200, Marker=600
                        map.getPane('weatherPane').style.pointerEvents = 'none'; // Klik tembus ke peta
                    }

                    activeLayers[type] = L.tileLayer(tileUrl, { 
                        pane: 'weatherPane',
                        opacity: 0.7
                    }).addTo(map);

                    // Feedback Visual (Toast)
                    const toast = document.createElement('div');
                    toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 shadow-xl z-[2000] flex items-center gap-2";
                    toast.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-emerald-400"></i> Layer ${type === 'rain' ? 'Hujan' : 'Awan'} Ditampilkan`;
                    document.body.appendChild(toast);
                    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 3000);
                    lucide.createIcons();
                } else {
                    alert("Data cuaca tidak tersedia saat ini.");
                }

            } catch(e) {
                console.error(e);
                alert("Gagal memuat peta cuaca. Cek koneksi internet.");
            }
        }

        // --- WINDY EMBED FUNCTIONS ---
        function openWindy() {
            const center = map.getCenter();
            const url = `https://embed.windy.com/embed2.html?lat=${center.lat}&lon=${center.lng}&detailLat=${center.lat}&detailLon=${center.lng}&width=650&height=450&zoom=${Math.max(3, map.getZoom())}&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`;
            
            document.getElementById('windy-frame').src = url;
            document.getElementById('windyModal').classList.remove('translate-y-full');
            closeMapSettings(); // Tutup menu setting
        }

        function closeWindy() {
            document.getElementById('windyModal').classList.add('translate-y-full');
            setTimeout(() => { document.getElementById('windy-frame').src = ''; }, 300); // Reset iframe agar tidak berat
        }

        // --- PRECIPITATION MAP FUNCTIONS ---
        let largePrecipMap = null;
        // --- NEW: Animation Variables ---
        let precipAnimationInterval = null;
        let precipFrames = [];
        let precipLayers = {}; // Cache layer agar animasi mulus
        let currentPrecipFrameIndex = 0;
        let precipRadarLayer = null; // To easily remove and add new layers
        let isPrecipPlaying = false;
        // --- End Animation Variables ---

        function createPrecipitationModal() {
            // Mencegah duplikasi
            if (document.getElementById('precipModal')) return;

            const modal = document.createElement('div');
            modal.id = 'precipModal';
            // FIX: Full Screen murni (tanpa padding), Z-Index tertinggi
            modal.style.zIndex = "2147483650"; 
            modal.className = "fixed inset-0 bg-black translate-y-full transition-transform duration-300";
            modal.innerHTML = `
                <div class="relative w-full h-full">
                    <div id="precip-map-large" class="w-full h-full bg-black"></div>
                    
                    <!-- Header Floating -->
                    <div class="absolute top-0 left-0 w-full p-4 pt-12 flex items-center justify-between z-[1000] bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                        <button onclick="closePrecipMap()" class="pointer-events-auto bg-neutral-800/50 backdrop-blur-md text-white rounded-full p-3 shadow-lg border border-white/10 hover:bg-neutral-700 transition-all">
                            <i data-lucide="chevron-left" class="w-6 h-6"></i>
                        </button>
                        <div class="pointer-events-auto bg-neutral-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                            <span class="text-xs font-bold text-white flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-[#3b82f6]"></span> Hujan
                                <span class="w-2 h-2 rounded-full bg-[#8b5cf6] ml-1"></span> Lebat
                                <span class="w-2 h-2 rounded-full bg-[#f43f5e] ml-1"></span> Ekstrem
                            </span>
                        </div>
                    </div>

                    <!-- Tombol Lokasi Saya -->
                    <button onclick="centerPrecipMap()" class="absolute bottom-8 right-4 z-[1000] bg-neutral-800/80 backdrop-blur-md text-blue-400 rounded-full p-3 shadow-lg border border-white/10 hover:bg-neutral-700 transition-all">
                        <i data-lucide="navigation" class="w-6 h-6"></i>
                    </button>

                    <!-- NEW: Animation Controls -->
                    <div class="absolute bottom-0 left-0 w-full p-4 z-[1000] pointer-events-none">
                        <div class="bg-neutral-900/70 backdrop-blur-md rounded-xl p-3 flex items-center gap-4 pointer-events-auto border border-white/10 shadow-2xl max-w-2xl mx-auto">
                            <button id="precip-play-pause-btn" onclick="togglePrecipAnimation()" class="text-white hover:bg-neutral-700 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                <i data-lucide="play" class="w-6 h-6"></i>
                            </button>
                            <div class="flex-1 flex flex-col gap-2">
                                <input type="range" id="precip-timeline-slider" min="0" max="10" value="0" class="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer range-sm" oninput="handleSliderInput(this.value)" disabled>
                                <div id="precip-timeline-labels" class="flex justify-between text-[9px] text-slate-400 font-mono">
                                    <span>--:--</span>
                                    <span>Kini</span>
                                    <span>--:--</span>
                                </div>
                            </div>
                            <div id="precip-timestamp" class="text-sm font-bold text-white w-16 text-center tabular-nums">--:--</div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        let precipUserMarker = null; // Marker user di peta besar

        function openPrecipMap(lat, lng) {
            pausePrecipAnimation(); // Reset state on open
            const modal = document.getElementById('precipModal');
            if (!modal) return;

            modal.classList.remove('translate-y-full');
            lucide.createIcons(); // Render ikon tombol close

            // Tunda inisialisasi peta sampai modal terlihat
            setTimeout(async () => {
                if (largePrecipMap) {
                    largePrecipMap.remove();
                    largePrecipMap = null;
                }

                const mapContainer = document.getElementById('precip-map-large');
                if (!mapContainer) return;

                // Gunakan lokasi user global jika ada, jika tidak pakai lokasi yang diklik
                const centerLat = (typeof userLatlng !== 'undefined' && userLatlng) ? userLatlng.lat : lat;
                const centerLng = (typeof userLatlng !== 'undefined' && userLatlng) ? userLatlng.lng : lng;

                largePrecipMap = L.map(mapContainer, {
                    zoomControl: false, // Hilangkan kontrol zoom bawaan (biar clean seperti iPhone)
                    attributionControl: false
                }).setView([centerLat, centerLng], 5); // Zoom level macro (Negara/Pulau)

                // Peta dasar abu-abu gelap
                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: 'abcd',
                    maxZoom: 20
                }).addTo(largePrecipMap);

                // Tambahkan Label Kota (Layer terpisah agar di atas hujan)
                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
                    subdomains: 'abcd',
                    maxZoom: 20,
                    zIndex: 1000 // Pastikan label di atas layer hujan
                }).addTo(largePrecipMap);

                // Marker Lokasi User (Pulsing Blue Dot ala iPhone)
                const userIcon = L.divIcon({
                    className: 'bg-transparent',
                    html: `<div class="relative flex items-center justify-center w-6 h-6">
                            <div class="absolute w-full h-full bg-blue-500/50 rounded-full animate-ping"></div>
                            <div class="relative w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-md"></div>
                           </div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });
                precipUserMarker = L.marker([centerLat, centerLng], {icon: userIcon}).addTo(largePrecipMap);

                // Tambahkan layer hujan dari RainViewer
                const playBtn = document.getElementById('precip-play-pause-btn');
                const slider = document.getElementById('precip-timeline-slider');

                try {
                    const res = await fetch(`https://api.rainviewer.com/public/weather-maps.json?_=${Date.now()}`);
                    const data = await res.json();
                    const host = data.host || 'https://tilecache.rainviewer.com';
                    
                    // Gabungkan frame masa lalu dan prediksi
                    const pastFrames = data.radar.past || [];
                    const futureFrames = data.radar.nowcast || [];
                    precipFrames = [...pastFrames, ...futureFrames];
                    
                    // Pre-create Layers (Caching) untuk animasi mulus
                    precipLayers = {};
                    precipFrames.forEach((frame, i) => {
                        const tileUrl = `${host}${frame.path}/512/{z}/{x}/{y}/5/1_1.png`;
                        precipLayers[i] = L.tileLayer(tileUrl, { 
                            opacity: 0.8, 
                            attribution: 'RainViewer',
                            tileSize: 512, zoomOffset: -1 // Optimasi RainViewer 512px
                        });
                    });

                    if (precipFrames.length > 0) {
                        // Temukan frame "Kini" (frame terakhir dari 'past')
                        currentPrecipFrameIndex = Math.max(0, pastFrames.length - 1);

                        // Konfigurasi Slider & Label
                        slider.max = precipFrames.length - 1;
                        slider.value = currentPrecipFrameIndex;
                        
                        const firstFrameTime = new Date(precipFrames[0].time * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                        const lastFrameTime = new Date(precipFrames[precipFrames.length - 1].time * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                        document.getElementById('precip-timeline-labels').innerHTML = `<span>${firstFrameTime}</span><span>Kini</span><span>${lastFrameTime}</span>`;

                        // Tampilkan frame awal
                        showPrecipFrame(currentPrecipFrameIndex, host);

                        // Aktifkan tombol
                        playBtn.disabled = false;
                        slider.disabled = false;
                    } else {
                        throw new Error("No radar frames available");
                    }
                } catch (e) {
                    console.error("Gagal memuat layer hujan untuk peta besar:", e);
                    document.getElementById('precip-timestamp').innerText = "Error";
                    playBtn.disabled = true;
                    slider.disabled = true;
                }

            }, 300); // Tunggu transisi selesai
        }

        // --- NEW: Animation Control Functions ---
        function showPrecipFrame(index, host) {
            if (index < 0 || index >= precipFrames.length) return;

            const frame = precipFrames[index];
            // Gunakan layer yang sudah dicache
            const newLayer = precipLayers[index];
            if (!newLayer) return;

            // Teknik Double Buffering: Tambah layer baru dulu, baru hapus yang lama
            if (!largePrecipMap.hasLayer(newLayer)) {
                newLayer.addTo(largePrecipMap);
            }
            
            if (precipRadarLayer && precipRadarLayer !== newLayer) {
                largePrecipMap.removeLayer(precipRadarLayer);
            }

            precipRadarLayer = newLayer;

            // Update UI
            const timestamp = new Date(frame.time * 1000);
            document.getElementById('precip-timestamp').innerText = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.getElementById('precip-timeline-slider').value = index;
            currentPrecipFrameIndex = index;
        }

        function playPrecipAnimation() {
            if (precipAnimationInterval) return; // Already playing
            isPrecipPlaying = true;
            document.getElementById('precip-play-pause-btn').innerHTML = '<i data-lucide="pause" class="w-6 h-6"></i>';
            lucide.createIcons();

            precipAnimationInterval = setInterval(() => {
                let nextIndex = currentPrecipFrameIndex + 1;
                if (nextIndex >= precipFrames.length) {
                    nextIndex = 0; // Loop back to start
                }
                showPrecipFrame(nextIndex, precipFrames[0] ? (precipFrames[0].host || 'https://tilecache.rainviewer.com') : 'https://tilecache.rainviewer.com');
            }, 250); // Dipercepat jadi 250ms agar lebih fluid
        }

        function pausePrecipAnimation() {
            if (precipAnimationInterval) {
                clearInterval(precipAnimationInterval);
                precipAnimationInterval = null;
            }
            isPrecipPlaying = false;
            const btn = document.getElementById('precip-play-pause-btn');
            if(btn) {
                btn.innerHTML = '<i data-lucide="play" class="w-6 h-6"></i>';
                lucide.createIcons();
            }
        }

        function togglePrecipAnimation() {
            if (isPrecipPlaying) {
                pausePrecipAnimation();
            } else {
                playPrecipAnimation();
            }
        }

        function handleSliderInput(value) {
            pausePrecipAnimation(); // Stop animation when user interacts with slider
            showPrecipFrame(parseInt(value), precipFrames[0] ? (precipFrames[0].host || 'https://tilecache.rainviewer.com') : 'https://tilecache.rainviewer.com');
        }
        // --- End Animation Control Functions ---

        function centerPrecipMap() {
            if(largePrecipMap && precipUserMarker) {
                largePrecipMap.flyTo(precipUserMarker.getLatLng(), 10);
            }
        }

        function closePrecipMap() {
            const modal = document.getElementById('precipModal');
            pausePrecipAnimation(); // Stop animation on close
            if (modal) modal.classList.add('translate-y-full');
            if (largePrecipMap) {
                setTimeout(() => {
                    largePrecipMap.remove();
                    largePrecipMap = null;
                }, 300);
            }
        }

        async function injectPrecipitationCard(lat, lng) {
            // Target elemen forecast-list (Prakiraan 10 Hari)
            const forecastList = document.getElementById('forecast-list');
            // Cek jika forecastList ada
            if (!forecastList) return;
            
            // Hapus card lama jika ada (untuk refresh lokasi)
            const oldCard = document.getElementById('precip-map-card');
            if(oldCard) oldCard.remove();

            const cardHtml = `
                <div id="precip-map-card" onclick="openPrecipMap(${lat}, ${lng})" class="mx-0 mt-3 bg-neutral-900/30 backdrop-blur-xl rounded-xl border border-white/20 p-2 shadow-lg cursor-pointer group overflow-hidden relative">
                    <div class="px-2 py-2 mb-2 flex items-center gap-2 border-b border-white/5 relative z-10">
                        <i data-lucide="map" class="w-4 h-4 text-slate-400"></i> 
                        <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">Peta Hujan</span>
                    </div>
                    <div id="precip-map-preview" class="w-full h-48 rounded-lg bg-neutral-900 relative overflow-hidden border border-white/5 pointer-events-none">
                        <div class="absolute inset-0 flex items-center justify-center z-0">
                            <i data-lucide="loader" class="w-6 h-6 text-slate-500 animate-spin"></i>
                        </div>
                    </div>
                    <div class="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1 group-hover:bg-blue-600 transition-colors border border-white/10 shadow-xl">
                        <i data-lucide="maximize-2" class="w-3 h-3"></i> Perbesar
                    </div>
                </div>`;
            
            // Insert AFTER forecast-list
            forecastList.insertAdjacentHTML('afterend', cardHtml);
            lucide.createIcons();

            try {
                const res = await fetch(`https://api.rainviewer.com/public/weather-maps.json?_=${Date.now()}`);
                const data = await res.json();
                const host = data.host || 'https://tilecache.rainviewer.com';
                if (data.radar && data.radar.past && data.radar.past.length > 0) {
                    const item = data.radar.past[data.radar.past.length - 1];
                    // Samakan skema warna dengan peta besar (5 - Meteored)
                    const tileUrl = `${host}${item.path}/256/{z}/{x}/{y}/5/1_1.png`;
                    const previewMapContainer = document.getElementById('precip-map-preview');
                    if(previewMapContainer) {
                        previewMapContainer.innerHTML = ''; 
                        const previewMap = L.map(previewMapContainer, { 
                            zoomControl: false, 
                            attributionControl: false, 
                            dragging: false, 
                            scrollWheelZoom: false, 
                            doubleClickZoom: false, 
                            touchZoom: false,
                            boxZoom: false,
                            keyboard: false
                        }).setView([lat, lng], 4);

                        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', { 
                            maxZoom: 20,
                            subdomains: 'abcd'
                        }).addTo(previewMap);

                        L.tileLayer(tileUrl, { opacity: 0.8 }).addTo(previewMap);
                        
                        // Marker User di Preview (Kecil)
                        const userIconSmall = L.divIcon({
                            className: 'bg-transparent',
                            html: `<div class="relative flex items-center justify-center w-3 h-3"><div class="absolute w-full h-full bg-blue-500/50 rounded-full animate-ping"></div><div class="relative w-2 h-2 bg-blue-500 border border-white rounded-full shadow-sm"></div></div>`,
                            iconSize: [12, 12],
                            iconAnchor: [6, 6]
                        });
                        L.marker([lat, lng], {icon: userIconSmall}).addTo(previewMap);
                    }
                } else { throw new Error("No radar data available"); }
            } catch (e) {
                const previewMapContainer = document.getElementById('precip-map-preview');
                if(previewMapContainer) previewMapContainer.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-neutral-800"><i data-lucide="${navigator.onLine ? 'cloud-off' : 'wifi-off'}" class="w-6 h-6 text-slate-600"></i></div>`;
                lucide.createIcons();
            }
        }

        // --- OFFLINE MAP SYSTEM (Service Worker & Downloader) ---
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Gunakan './sw.js' agar kompatibel dengan Vercel (Root) maupun GitHub Pages (Subfolder)
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => {
                        console.log('Service Worker registered!', reg.scope);
                        // FIX: Paksa cek update ke server setiap kali aplikasi dibuka
                        // Ini mengatasi masalah PWA yang "lama update"
                        reg.update();
                    })
                    .catch(err => console.log('Service Worker registration failed:', err));

                // FIX: Auto-reload halaman jika Service Worker baru selesai diinstall
                // User akan melihat loading sebentar lalu aplikasi ter-refresh ke versi baru
                let refreshing;
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    if (refreshing) return;
                    refreshing = true;
                    
                    // Tampilkan notifikasi kecil sebelum reload
                    const toast = document.createElement('div');
                    toast.className = "fixed top-24 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl z-[3000] flex items-center gap-2 animate-bounce";
                    toast.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg> Mengupdate Aplikasi...`;
                    document.body.appendChild(toast);
                    
                    setTimeout(() => window.location.reload(), 1500);
                });
            });
        }

        // Helper: Konversi LatLng ke Tile Coordinate
        function latLngToTile(lat, lng, zoom) {
            const x = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
            const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
            return { x, y };
        }

        async function downloadOfflineMap() {
            const btn = document.getElementById('btn-download-map');
            
            if (!('caches' in window)) {
                alert("Browser tidak mendukung fitur offline (Cache API).");
                return;
            }

            // 1. Input Nama Area
            const name = prompt("Beri nama untuk area ini (misal: Bali Selatan):", "Area " + new Date().toLocaleDateString());
            if (name === null) return; // Batal jika user tekan Cancel
            const mapName = name || "Area Tanpa Nama";

            const originalText = btn.innerHTML;
            
            // 1. Cek Batas Map & Zoom
            const bounds = map.getBounds();
            const minZoom = map.getZoom();
            const maxZoom = Math.min(minZoom + 2, 17); // Download sampai 2 level lebih detail (Max 17)
            
            btn.disabled = true;
            btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Menghitung...`;
            lucide.createIcons();

            const tiles = [];
            
            // 2. Tentukan URL Layer Aktif (Satelit / Laut / Jalan)
            let urlTemplate = "";
            if(isSat) {
                urlTemplate = "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
            } else if (map.hasLayer(oceanLayer)) {
                urlTemplate = "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}";
            } else {
                urlTemplate = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
            }

            // 3. Generate Daftar URL Tile
            for (let z = minZoom; z <= maxZoom; z++) {
                const minTile = latLngToTile(bounds.getNorth(), bounds.getWest(), z);
                const maxTile = latLngToTile(bounds.getSouth(), bounds.getEast(), z);
                
                for (let x = minTile.x; x <= maxTile.x; x++) {
                    for (let y = minTile.y; y <= maxTile.y; y++) {
                        // Gunakan logika subdomain Leaflet (a, b, c) agar cocok dengan request peta
                        const s = ['a','b','c'][(x + y) % 3];
                        const url = urlTemplate.replace('{x}', x).replace('{y}', y).replace('{z}', z).replace('{s}', s);
                        tiles.push(url);
                    }
                }
            }

            // Estimasi Ukuran (Asumsi rata-rata 25KB per tile)
            const estSizeMB = (tiles.length * 25 / 1024).toFixed(1);

            if(tiles.length > 1000) {
                if(!confirm(`Area ini mencakup ${tiles.length} tiles (Estimasi ~${estSizeMB} MB). Lanjutkan download?`)) {
                    btn.innerHTML = originalText; btn.disabled = false; lucide.createIcons(); return;
                }
            }

            // 4. Proses Download & Cache
            try {
                // Gunakan nama cache unik per area agar bisa dihapus terpisah
                const mapId = Date.now();
                const cacheKey = `offline-map-${mapId}`;
                const cache = await caches.open(cacheKey);
                let count = 0;
                const batchSize = 10; // Download per 10 file agar tidak lag
                
                for (let i = 0; i < tiles.length; i += batchSize) {
                    const batch = tiles.slice(i, i + batchSize);
                    await Promise.all(batch.map(url => fetch(url, { mode: 'no-cors' }).then(res => cache.put(url, res))));
                    
                    count += batch.length;
                    btn.innerHTML = `<span class="animate-pulse">Downloading... ${Math.min(count, tiles.length)}/${tiles.length}</span>`;
                }
                
                // Simpan Metadata ke LocalStorage
                const meta = {
                    id: mapId,
                    name: mapName,
                    date: new Date().toLocaleDateString(),
                    count: tiles.length,
                    size: estSizeMB,
                    cacheKey: cacheKey
                };
                const savedMaps = JSON.parse(localStorage.getItem('offlineMaps') || '[]');
                savedMaps.push(meta);
                localStorage.setItem('offlineMaps', JSON.stringify(savedMaps));
                
                if(typeof updateOfflineList === 'function') updateOfflineList(); // Refresh list
                alert(`✅ Area "${mapName}" berhasil didownload!`);
            } catch (e) {
                console.error(e);
                alert("Gagal download. Pastikan koneksi internet stabil saat mendownload.");
            } finally {
                btn.innerHTML = originalText; btn.disabled = false; lucide.createIcons();
            }
        }

        // Fungsi Menampilkan Daftar Peta Offline
        function updateOfflineList() {
            const list = document.getElementById('offline-maps-list');
            if(!list) return;
            
            const maps = JSON.parse(localStorage.getItem('offlineMaps') || '[]');
            list.innerHTML = '';
            
            if(maps.length === 0) {
                list.innerHTML = '<p class="text-[10px] text-slate-500 text-center italic py-2">Belum ada peta offline tersimpan.</p>';
                return;
            }

            maps.forEach(map => {
                const size = map.size || ((map.count * 25) / 1024).toFixed(1);
                const item = document.createElement('div');
                item.className = "bg-neutral-900/50 p-3 rounded-lg border border-white/5 flex items-center justify-between group hover:bg-neutral-800 transition-colors";
                item.innerHTML = `
                    <div>
                        <p class="text-xs font-bold text-white">${map.name}</p>
                        <p class="text-[10px] text-slate-400">${map.count} tiles • ~${size} MB • ${map.date}</p>
                    </div>
                    <button onclick="deleteOfflineMap(${map.id})" class="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors" aria-label="Hapus">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                `;
                list.appendChild(item);
            });
            lucide.createIcons();
        }

        // Fungsi Hapus Peta Offline
        async function deleteOfflineMap(id) {
            if(!confirm("Hapus area offline ini?")) return;
            
            const maps = JSON.parse(localStorage.getItem('offlineMaps') || '[]');
            const target = maps.find(m => m.id === id);
            
            if(target) {
                // 1. Hapus Cache Fisik
                if('caches' in window) {
                    try {
                        await caches.delete(target.cacheKey);
                    } catch(e) { console.log("Cache delete error", e); }
                }
                
                // 2. Hapus Metadata
                const newMaps = maps.filter(m => m.id !== id);
                localStorage.setItem('offlineMaps', JSON.stringify(newMaps));
                
                updateOfflineList();
            }
        }

        // Init dots saat load & resize
        window.addEventListener('resize', initScrollDots);

        // --- ONBOARDING TOUR SYSTEM ---
        let currentTourStep = 0;
        const tourSteps = [
            {
                target: null, // Center screen
                title: "Selamat Datang!",
                desc: "Aplikasi ini membantu Anda menemukan spot mancing terbaik, cek cuaca laut, dan menyimpan lokasi rahasia Anda.",
                icon: "anchor"
            },
            {
                target: "#search-input",
                title: "Cari Lokasi",
                desc: "Ketik nama desa, pantai, atau koordinat untuk langsung menuju lokasi tujuan mancing Anda.",
                icon: "search"
            },
            {
                target: "button[onclick='openMapSettings()']",
                title: "Layer & Offline Map",
                desc: "Ganti tampilan ke Satelit, cek suhu air (SST), atau <b>Download Peta Offline</b> agar aman saat sinyal hilang di laut.",
                icon: "layers"
            },
            {
                target: "button[onclick='showUserWeatherPanel()']",
                title: "Cek Cuaca & Ombak",
                desc: "Lihat prediksi tinggi ombak, kecepatan angin, dan pasang surut air laut sebelum berangkat.",
                icon: "cloud-sun"
            },
            {
                target: "button[onclick='locateUser()']",
                title: "Lokasi Saya",
                desc: "Tekan tombol ini untuk memusatkan peta ke posisi GPS Anda saat ini.",
                icon: "navigation"
            },
            {
                target: "button[onclick='findNearestSpot()']",
                title: "Spot Terdekat",
                desc: "Bingung mau mancing di mana? Biarkan aplikasi mencarikan spot terdekat dari posisi Anda.",
                icon: "locate-fixed"
            },
            {
                target: "button[onclick='openAddModal()']",
                title: "Simpan Spot",
                desc: "Klik tombol ini untuk menyimpan hasil pancingan. Atau <b>Tekan Lama di Peta</b> untuk menandai lokasi secara manual.",
                icon: "map-pin"
            },
            {
                target: "button[onclick='openFavorites()']",
                title: "Favorit",
                desc: "Simpan spot yang Anda sukai agar mudah diakses kembali nanti.",
                icon: "heart"
            },
            {
                target: "button[onclick='openLegend()']",
                title: "Pengaturan",
                desc: "Ubah bahasa, tema tampilan, atau lihat panduan ikon di sini.",
                icon: "settings"
            }
        ];

        function initTour() {
            // Cek apakah user sudah pernah melihat tour
            if(localStorage.getItem('hasSeenTour')) return;
            
            currentTourStep = 0;
            document.getElementById('tour-highlight').classList.remove('hidden');
            document.getElementById('tour-tooltip').classList.remove('hidden');
            showTourStep();
        }

        function showTourStep() {
            const step = tourSteps[currentTourStep];
            const highlight = document.getElementById('tour-highlight');
            const tooltip = document.getElementById('tour-tooltip');
            
            // Update Konten
            document.getElementById('tour-title').innerText = step.title;
            document.getElementById('tour-desc').innerHTML = step.desc;
            document.getElementById('tour-icon').setAttribute('data-lucide', step.icon);
            document.getElementById('tour-step-count').innerText = `${currentTourStep + 1}/${tourSteps.length}`;
            
            // Update Tombol Navigasi (Back & Finish)
            const nextBtn = document.getElementById('tour-next-btn');
            const prevBtn = document.getElementById('tour-prev-btn');
            
            if(currentTourStep === 0) {
                prevBtn.classList.add('hidden');
            } else {
                prevBtn.classList.remove('hidden');
            }

            if(currentTourStep === tourSteps.length - 1) {
                nextBtn.innerText = "Selesai";
                nextBtn.classList.replace('bg-blue-600', 'bg-emerald-600');
                nextBtn.classList.replace('hover:bg-blue-500', 'hover:bg-emerald-500');
            } else {
                nextBtn.innerText = "Lanjut";
                nextBtn.classList.replace('bg-emerald-600', 'bg-blue-600');
                nextBtn.classList.replace('hover:bg-emerald-500', 'hover:bg-blue-500');
            }
            
            lucide.createIcons();

            // Positioning Logic
            if(step.target) {
                const targetEl = document.querySelector(step.target);
                if(targetEl) {
                    const rect = targetEl.getBoundingClientRect();
                    const padding = 8;
                    
                    // Pindahkan Highlight Box
                    highlight.style.top = `${rect.top - padding}px`;
                    highlight.style.left = `${rect.left - padding}px`;
                    highlight.style.width = `${rect.width + (padding*2)}px`;
                    highlight.style.height = `${rect.height + (padding*2)}px`;
                    
                    // Pindahkan Tooltip (Otomatis cari posisi aman)
                    const tooltipRect = tooltip.getBoundingClientRect();
                    let top = rect.top - tooltipRect.height - 20; // Default di atas
                    if(top < 20) top = rect.bottom + 20; // Kalau mentok atas, pindah ke bawah
                    
                    let left = rect.left + (rect.width/2) - (tooltipRect.width/2);
                    // Jaga agar tidak keluar layar kiri/kanan
                    if(left < 10) left = 10;
                    if(left + tooltipRect.width > window.innerWidth) left = window.innerWidth - tooltipRect.width - 10;

                    tooltip.style.top = `${top}px`;
                    tooltip.style.left = `${left}px`;
                    tooltip.style.transform = 'none';
                }
            } else {
                // Posisi Tengah (Welcome Screen)
                highlight.style.top = '50%'; highlight.style.left = '50%'; highlight.style.width = '0px'; highlight.style.height = '0px';
                tooltip.style.top = '50%'; tooltip.style.left = '50%'; tooltip.style.transform = 'translate(-50%, -50%)';
            }
            
            // Animasi Masuk
            tooltip.classList.remove('active');
            setTimeout(() => tooltip.classList.add('active'), 50);
        }

        function nextTourStep() {
            if(currentTourStep < tourSteps.length - 1) {
                currentTourStep++;
                showTourStep();
            } else {
                endTour();
            }
        }

        function prevTourStep() {
            if(currentTourStep > 0) {
                currentTourStep--;
                showTourStep();
            }
        }

        function endTour() {
            document.getElementById('tour-highlight').classList.add('hidden');
            document.getElementById('tour-tooltip').classList.add('hidden');
            localStorage.setItem('hasSeenTour', 'true'); // Simpan status agar tidak muncul lagi
        }

        function resetTour() {
            localStorage.removeItem('hasSeenTour'); // Hapus status "sudah dilihat"
            closeLegend(); // Tutup menu pengaturan
            initTour(); // Mulai tour dari awal
        }

        // --- NAVIGATION SYSTEM (Moved from index.html) ---
        function navigateTo(pageId) {
            // 1. Cek status tab cuaca SEBELUM reset class (untuk logika "klik lagi")
            const weatherView = document.getElementById('view-weather');
            const isWeatherActive = weatherView && weatherView.classList.contains('active');

            // Sembunyikan semua halaman
            document.querySelectorAll('.view-section').forEach(el => { //
                el.classList.remove('active');
            });
            
            // Matikan efek cuaca jika keluar dari halaman cuaca
            if (pageId !== 'weather' && typeof stopWeatherEffect === 'function') { //
                stopWeatherEffect();
            }

            // Reset warna tombol nav
            document.querySelectorAll('.nav-btn').forEach(btn => { //
                btn.classList.remove('text-blue-400');
                btn.classList.add('text-slate-400');
            });
            
            // Tampilkan halaman target
            const target = document.getElementById('view-' + pageId);
            if(target) {
                target.classList.add('active');

                // --- FIX: Refresh Data Home saat Navigasi ---
                if(pageId === 'home') {
                    if(typeof loadHomeFeed === 'function') loadHomeFeed();
                    if(typeof loadHomeWidgetData === 'function') loadHomeWidgetData();
                }
                
                // Highlight tombol nav
                const navBtn = document.getElementById('nav-' + pageId);
                if(navBtn) {
                    navBtn.classList.remove('text-slate-400');
                    navBtn.classList.add('text-blue-400');
                }
                
                // Khusus Peta: Refresh ukuran agar tidak error render
                if(pageId === 'map' && typeof map !== 'undefined') {
                    setTimeout(() => { map.invalidateSize(); }, 100);
                    
                    // FIX: Sembunyikan panel cuaca saat kembali ke peta (sesuai request)
                    const panel = document.getElementById('location-panel');
                    if(panel) panel.classList.add('translate-y-full');

                    // FIX: Reset lokasi pin agar saat kembali ke tab cuaca (lewat navbar), yang muncul adalah GPS
                    tempLatlng = null;
                }
                
                // Khusus Cuaca: Tampilkan panel cuaca untuk lokasi terakhir yang dipilih atau lokasi user
                if(pageId === 'weather') {
                    // Logika Toggle: Pin <-> GPS
                    if (isWeatherActive && tempLatlng) {
                        // Jika sudah di tab cuaca (lihat pin) dan klik lagi -> Reset ke GPS
                        tempLatlng = null;
                        if (typeof showUserWeatherPanel === 'function') showUserWeatherPanel();
                    } else {
                        // Navigasi biasa: Prioritas Pin -> GPS
                        if (tempLatlng && typeof showLocationPanel === 'function') {
                            showLocationPanel(tempLatlng);
                        } else if (typeof showUserWeatherPanel === 'function') {
                            showUserWeatherPanel();
                        }
                    }
                }

                // Khusus Reels: Init jika belum
                if(pageId === 'reels') {
                    if(typeof initReels === 'function') initReels();
                }
            }
        }

        // Pindahkan konten pengaturan ke halaman settings saat load
        document.addEventListener('DOMContentLoaded', function() {
            const settingsContent = document.querySelector('#legendModal .space-y-4');
            if(settingsContent) {
                const placeholder = document.getElementById('settings-content-placeholder');
                if(placeholder) placeholder.appendChild(settingsContent);
            }
            
            // Inisialisasi icon lucide untuk elemen baru
            if(typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // FIX: Jalankan aplikasi utama saat load agar Auth Listener aktif
            initApp();
        });

        // --- REELS FEATURE LOGIC ---
        let reelsInitialized = false;
        let reelsObserver = null;
        let shownReelIds = new Set(); // Melacak video yang sudah ditampilkan agar tidak duplikat
        let isLoadingReels = false; // Lock untuk mencegah loading ganda (L)

        function initReels() {
            if (reelsInitialized) return;
            reelsInitialized = true;

            const container = document.getElementById('reels-container');
            if (!container) return;

            // Setup Observer untuk Autoplay saat scroll
            reelsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target.querySelector('video');
                    if (!video) return;

                    if (entry.isIntersecting) {
                        // Play saat masuk layar
                        // FIX: User request "ga usah mute otomatis"
                        video.muted = false; 
                        video.play().catch(() => {});
                    } else {
                        // Pause & Reset saat keluar layar
                        video.pause();
                        video.currentTime = 0;
                    }
                });
            }, { threshold: 0.6 }); // 60% video terlihat baru play

            // Load batch pertama
            loadReelsBatch();
            
            // Infinite Scroll sederhana
            container.addEventListener('scroll', () => {
                if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
                    loadReelsBatch();
                }
            });
        }

        async function loadReelsBatch() {
            if (isLoadingReels) return;
            isLoadingReels = true;

            const container = document.getElementById('reels-container');
            // Tambah 3 placeholder loading
            for (let i = 0; i < 3; i++) {
                const el = document.createElement('div');
                el.className = "w-full h-full snap-start relative bg-black flex items-center justify-center border-b border-white/10 shrink-0";
                el.innerHTML = '<div class="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>';
                container.appendChild(el);
                fetchReelContent(el);
            }
            
            // Reset lock setelah delay (Loading logic)
            setTimeout(() => { isLoadingReels = false; }, 1500);
        }

        async function fetchReelContent(container) {
            // --- MODIFIED: Randomized Provider Fetch (Pixabay / Pexels / NASA) ---
            // Update: Menambahkan variasi alat pancing & ikan sesuai request
            const queries = [
                "fishing reel", "fishing rod", "fishing lure", "fishing bait", "fishing gear", 
                "fish underwater", "big fish", "fishing boat", "fisherman", "fishing", 
                "ocean fishing", "tackle box", "coral reef fish", "deep sea fishing"
            ];
            const query = queries[Math.floor(Math.random() * queries.length)];
            
            // Helper: HTML Tombol Samping (Agar tidak duplikat kode)
            const getSideActions = (likes, comments) => `
                <div class="absolute right-2 bottom-8 flex flex-col gap-3 items-center z-20 pb-4">
                    <button class="flex flex-col items-center gap-1 group" onclick="const i=this.querySelector('i'); i.classList.toggle('fill-red-500'); i.classList.toggle('text-red-500'); i.classList.toggle('fill-white/10');">
                        <div class="p-2.5 bg-black/40 backdrop-blur-md rounded-full group-active:scale-90 transition-all border border-white/10 hover:bg-black/60">
                            <i data-lucide="heart" class="w-6 h-6 text-white fill-white/10 transition-colors"></i>
                        </div>
                        <span class="text-[10px] font-bold text-white drop-shadow-md">${likes}</span>
                    </button>
                    <button class="flex flex-col items-center gap-1 group">
                        <div class="p-2.5 bg-black/40 backdrop-blur-md rounded-full group-active:scale-90 transition-all border border-white/10 hover:bg-black/60">
                            <i data-lucide="message-circle" class="w-6 h-6 text-white fill-white/10"></i>
                        </div>
                        <span class="text-[10px] font-bold text-white drop-shadow-md">${comments}</span>
                    </button>
                    <button class="flex flex-col items-center gap-1 group">
                        <div class="p-2.5 bg-black/40 backdrop-blur-md rounded-full group-active:scale-90 transition-all border border-white/10 hover:bg-black/60">
                            <i data-lucide="share-2" class="w-6 h-6 text-white"></i>
                        </div>
                        <span class="text-[10px] font-bold text-white drop-shadow-md">Share</span>
                    </button>
                    <button class="flex flex-col items-center gap-1 group mt-2" onclick="const v=this.closest('.relative').querySelector('video'); v.muted=!v.muted; this.querySelector('i').setAttribute('data-lucide', v.muted?'volume-x':'volume-2'); lucide.createIcons();">
                        <div class="p-2.5 bg-black/40 backdrop-blur-md rounded-full group-active:scale-90 transition-all border border-white/10 hover:bg-black/60">
                            <i data-lucide="volume-2" class="w-5 h-5 text-white"></i>
                        </div>
                    </button>
                </div>`;

            // Helper: Render Video ke Container
            const renderVideo = (url, title, user, likes, comments, sourceLabel = 'NASA Archive', thumbnail = '') => {
                const isCreator = sourceLabel !== 'NASA Archive';
                container.innerHTML = `
                    <div class="absolute inset-0 flex items-center justify-center bg-black z-0">
                        <div class="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                    <video src="${url}" poster="${thumbnail}" class="w-full h-full object-cover relative z-10" loop playsinline preload="metadata" onloadeddata="this.previousElementSibling.classList.add('hidden')"></video>
                    <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none"></div>
                    <div class="absolute bottom-0 left-0 w-full p-4 pb-6 z-10 pointer-events-none bg-gradient-to-t from-black/80 to-transparent">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[1.5px]">
                                <div class="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                    ${isCreator ? `<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user}" class="w-full h-full object-cover">` : `<i data-lucide="globe" class="w-5 h-5 text-white"></i>`}
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-white font-bold text-sm drop-shadow-md leading-none">@${user.replace(/\s+/g, '')}</p>
                                <p class="text-[10px] text-slate-300 leading-none mt-0.5">${sourceLabel}</p>
                            </div>
                            <button class="ml-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 pointer-events-auto hover:bg-white/30 transition-colors">Follow</button>
                        </div>
                        <p class="text-white text-sm leading-snug drop-shadow-md font-medium line-clamp-3 pr-16 opacity-90">${title}</p>
                        <div class="flex items-center gap-2 mt-3 text-xs text-white/70">
                            <span class="flex items-center gap-1"><i data-lucide="music" class="w-3 h-3"></i> Original Sound - Fishing Spot</span>
                        </div>
                    </div>
                    ${getSideActions(likes, comments)}`;
                
                reelsObserver.observe(container);
                if(typeof lucide !== 'undefined') lucide.createIcons();
                const v = container.querySelector('video');
                container.onclick = (e) => { if(!e.target.closest('button')) v.paused ? v.play() : v.pause(); };
            };

            // --- PROVIDER FUNCTIONS ---
            const fetchPixabay = async () => {
                const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=pixabay&q=${query}&t=${Date.now()}`, { redirect: 'follow' });
                const data = await res.json();
                if (data.error) throw new Error("GAS Pixabay Error: " + data.error);
                
                if (data && data.hits && data.hits.length > 0) {
                    // Filter video yang sudah tampil
                    let available = data.hits.filter(h => !shownReelIds.has(h.id));
                    if (available.length === 0) available = data.hits; // Fallback jika habis

                    const video = available[Math.floor(Math.random() * available.length)];
                    shownReelIds.add(video.id);

                    // Prioritaskan video kecil/sedang agar loading cepat
                    let videoUrl = video.videos.small.url || video.videos.medium.url || video.videos.large.url;
                    let thumb = video.picture_id ? `https://i.vimeocdn.com/video/${video.picture_id}_640x360.jpg` : '';
                    if (videoUrl) {
                        return {
                            url: videoUrl,
                            title: `Video by ${video.user} on Pixabay. ${video.tags}`,
                            user: video.user,
                            likes: video.likes || Math.floor(Math.random() * 500),
                            comments: video.comments || Math.floor(Math.random() * 50),
                            sourceLabel: 'Pixabay Creator',
                            thumbnail: thumb
                        };
                    }
                }
                throw new Error("Pixabay data empty");
            };

            const fetchPexels = async () => {
                const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=pexels&q=${query}&t=${Date.now()}`, { redirect: 'follow' });
                const data = await res.json();
                if (data.error) throw new Error("GAS Pexels Error: " + data.error);

                if (data && data.videos && data.videos.length > 0) {
                    const video = data.videos[Math.floor(Math.random() * data.videos.length)];
                    let videoFile = video.video_files.find(f => f.quality === 'hd' && f.width < f.height);
                    if (!videoFile) videoFile = video.video_files.find(f => f.quality === 'hd');
                    if (!videoFile) videoFile = video.video_files[0];
                    
                    if (videoFile) {
                        return {
                            url: videoFile.link,
                            title: `Video by ${video.user.name} on Pexels. #fishing #nature`,
                            user: video.user.name,
                            likes: Math.floor(Math.random() * 5000) + 500,
                            comments: Math.floor(Math.random() * 200) + 20,
                            sourceLabel: 'Pexels Creator'
                        };
                    }
                }
                throw new Error("Pexels data empty");
            };

            const fetchNasa = async () => {
                const nasaKeywords = ["ocean life", "coral reef", "sea underwater", "marine biology", "fish"];
                const nasaQuery = nasaKeywords[Math.floor(Math.random() * nasaKeywords.length)];
                const nasaRes = await fetch(`https://images-api.nasa.gov/search?q=${nasaQuery}&media_type=video`);
                const nasaData = await nasaRes.json();
                
                if (nasaData.collection && nasaData.collection.items && nasaData.collection.items.length > 0) {
                    let items = nasaData.collection.items;
                    let available = items.filter(i => i.data && i.data[0] && !shownReelIds.has(i.data[0].nasa_id));
                    if (available.length === 0) available = items;

                    const item = available[Math.floor(Math.random() * available.length)];
                    shownReelIds.add(item.data[0].nasa_id);

                    const meta = item.data[0];
                    const collectionUrl = item.href.replace("http:", "https:");
                    
                    const videoRes = await fetch(collectionUrl);
                    const videoFiles = await videoRes.json();
                    const mp4 = videoFiles.find(f => f.endsWith('~medium.mp4')) || videoFiles.find(f => f.endsWith('.mp4'));
                    
                    const thumb = item.links ? item.links.find(l => l.rel === 'preview')?.href : '';
                    
                    if (mp4) {
                        return {
                            url: mp4.replace("http:", "https:"),
                            title: meta.title,
                            user: "nasa_official",
                            likes: Math.floor(Math.random() * 900) + 100,
                            comments: Math.floor(Math.random() * 100) + 10,
                            sourceLabel: 'NASA Archive',
                            thumbnail: thumb
                        };
                    }
                }
                throw new Error("NASA data empty");
            };

            // --- EXECUTION LOGIC (RANDOMIZED) ---
            const providers = [fetchPixabay, fetchPexels, fetchNasa];
            
            // Fisher-Yates Shuffle untuk mengacak urutan provider
            for (let i = providers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [providers[i], providers[j]] = [providers[j], providers[i]];
            }

            // Coba satu per satu sesuai urutan acak
            for (const provider of providers) {
                try {
                    const result = await provider();
                    if (result) {
                        renderVideo(result.url, result.title, result.user, result.likes, result.comments, result.sourceLabel, result.thumbnail);
                        return; // Sukses, keluar dari fungsi
                    }
                } catch (e) {
                    console.warn("Provider failed, trying next...", e);
                    // Lanjut ke provider berikutnya di loop
                }
            }

            // --- FINAL FALLBACK (Jika semua gagal) ---
            const staticVid = "https://images-assets.nasa.gov/video/ARC_20191025_A_E_SeaIce/ARC_20191025_A_E_SeaIce~medium.mp4";
            renderVideo(staticVid, "Konten Cadangan (Offline Mode)", "System", 0, 0, 'System');
        }

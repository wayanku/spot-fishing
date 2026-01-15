const CACHE_NAME = 'fishing-spot-v31-perfect'; // Naikkan versi
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './weather.js',
    './manifest.json',
    // --- NEW: Pre-cache Audio Assets (Penting untuk Offline) ---
    'https://raw.githubusercontent.com/wayanku/fishing/main/real-rain-sound-379215%20(2).mp3',
    'https://raw.githubusercontent.com/wayanku/fishing/main/loud-thunder-192165.mp3'
];

// 1. Install Service Worker & Cache File Inti
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Langsung aktifkan SW baru
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // FIX: Gunakan { cache: 'reload' } untuk memaksa browser mengambil file terbaru dari server
            // saat versi CACHE_NAME berubah, bukan mengambil dari disk cache browser yang lama.
            const newAssets = ASSETS.map(url => new Request(url, { cache: 'reload' }));
            return cache.addAll(newAssets);
        })
    );
});

// 2. Activate & Hapus Cache Lama (Agar user dapat update terbaru)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

// 3. Fetch Strategy: Cache First, lalu Network (Dynamic Caching)
self.addEventListener('fetch', (event) => {
    // Hanya cache request GET (bukan POST/API upload)
    if(event.request.method !== 'GET') return;

    // Strategi Fallback Navigasi: Jika offline & refresh halaman, kembalikan index.html
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('./index.html');
            })
        );
        return;
    }

    const url = new URL(event.request.url);

    // --- FIX: AUDIO & API BYPASS ---
    if (url.hostname.includes('rainviewer.com') ||
        url.hostname.includes('script.google.com') ||
        url.hostname.includes('upload.wikimedia.org')) { // FIX: Bypass Audio Wiki
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            // 1. Jika ada di cache (termasuk Peta Offline), gunakan itu!
            if (cached) return cached;

            // 2. Jika tidak ada, ambil dari internet
            return fetch(event.request).then((response) => {
                // Validasi respon sebelum cache (Cegah cache error 404/500)
                if (!response || (response.status !== 200 && response.type !== 'opaque')) {
                    return response;
                }

                // 3. Cek apakah URL ini boleh dicache secara otomatis (Dynamic Caching)?
                // Kita mengecualikan Tile Peta & API agar tidak memenuhi memori HP user saat browsing biasa.
                const shouldCache = !url.hostname.includes('rainviewer.com') &&
                                    !url.hostname.includes('openstreetmap.org') &&
                                    !url.hostname.includes('openweathermap.org') &&
                                    !url.hostname.includes('windy.com') &&
                                    !url.hostname.includes('open-meteo.com') &&
                                    !url.hostname.includes('google.com') &&        // Tile Peta (Kecuali offline)
                                    !url.hostname.includes('arcgisonline.com') &&  // Tile Peta (Kecuali offline)
                                    !url.hostname.includes('ipapi.co') && 
                                    !url.hostname.includes('nasa.gov') &&
                                    !url.pathname.endsWith('.mp4'); // FIX: Jangan cache file video MP4

                if (shouldCache) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                
                return response;
            });
        }).catch((err) => {
            // Fallback untuk Gambar saat Offline
            if (event.request.destination === 'image') {
                // Return placeholder SVG sederhana
                return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><title id="offline-title">Offline</title><rect width="100%" height="100%" fill="#1e293b"></rect><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#64748b">Offline Image</text></svg>', { headers: { 'Content-Type': 'image/svg+xml' }});
            }
            // Fallback Terakhir untuk Navigasi (Jika fetch gagal total)
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});

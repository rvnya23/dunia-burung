// ============================================
// AR-CAMERA.JS - Fungsi Kamera AR Lengkap
// VERSI PERBAIKAN:
//  1. Bug sintaks: hapus requestPermissionBtn duplikat di luar fungsi
//  2. Loading screen menunggu event kamera aktif (bukan setTimeout buta)
//  3. Fallback timeout diperpanjang dan lebih robust
// ============================================

// State variables
let isMuted = false;
let currentAudio = null;
let currentBirdKey = null;
let isMarkerDetected = false;
let detectionTimeout = null;

// ============================================
// QUATERNION TOUCH ROTATION STATE
// ============================================
const dragState = {
    active: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    sensitivity: 0.004,          // radian per pixel — turunkan jika terlalu sensitif
    qCurrent: { x:0, y:0, z:0, w:1 }, // quaternion rotasi saat ini
    inertiaVelX: 0,              // kecepatan angular sumbu X (radian/frame)
    inertiaVelY: 0,              // kecepatan angular sumbu Y (radian/frame)
    inertiaFrame: null,
};

document.addEventListener('DOMContentLoaded', () => {
    forceFullscreenAR();
    initARLoadingScreen();
    initARScene();
    initARUI();
    initCameraPermission();
    initMarkerDetection();
    initPopupToggle();
    initARControls();
    initMarkerGuide();
    handleARResize();
    initTouchRotation(); // ← fitur putar dengan sentuhan
});

// ============================================
// FORCE FULLSCREEN AR
// ============================================
function forceFullscreenAR() {
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100%';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';

    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.position = 'fixed';
    document.body.style.top = '0';
    document.body.style.left = '0';

    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
        metaViewport.setAttribute('content',
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
    }
}

// ============================================
// HANDLE AR RESIZE
// ============================================
function handleARResize() {
    let resizeTimer;

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const arScene = document.getElementById('arScene');
            if (arScene && arScene.resize) {
                try { arScene.resize(); } catch (e) { console.log('Resize AR scene:', e); }
            }
            forceFullscreenAR();
        }, 300);
    });

    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            forceFullscreenAR();
            const arScene = document.getElementById('arScene');
            if (arScene && arScene.resize) {
                try { arScene.resize(); } catch (e) {}
            }
        }, 500);
    });

    if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
        document.body.style.paddingTop = 'env(safe-area-inset-top)';
    }
}

// ============================================
// AR LOADING SCREEN
// PERBAIKAN: Menunggu event 'camera-init' dari AR.js, bukan setTimeout buta.
// Fallback timeout 8 detik jika event tidak muncul (misal browser lama).
// ============================================
function initARLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;

    let loadingDone = false;

    function hideLoading() {
        if (loadingDone) return;
        loadingDone = true;
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            if (loadingScreen.parentNode) loadingScreen.remove();
        }, 500);
    }

    const arScene = document.getElementById('arScene');

    if (arScene) {
        // Event 'camera-init' dipanggil AR.js saat kamera berhasil diaktifkan
        arScene.addEventListener('camera-init', () => {
            console.log('📷 Kamera AR aktif!');
            hideLoading();
        });

        // Event 'loaded' sebagai fallback pertama (A-Frame scene selesai load)
        arScene.addEventListener('loaded', () => {
            console.log('✅ A-Frame scene loaded');
            // Beri jeda singkat agar AR.js sempat init kamera
            setTimeout(hideLoading, 1500);
        });
    }

    // Fallback kedua: paksa hide setelah 8 detik jika event tidak ada
    setTimeout(hideLoading, 8000);
}

// ============================================
// AR SCENE INITIALIZATION
// ============================================
function initARScene() {
    const arScene = document.getElementById('arScene');
    if (!arScene) return;

    arScene.addEventListener('loaded', () => {
        console.log('✅ AR Scene loaded successfully');
        if (arScene.resize) {
            setTimeout(() => {
                try { arScene.resize(); } catch (e) { console.log('Resize after load:', e); }
            }, 500);
        }
    });

    arScene.addEventListener('arError', (event) => {
        console.error('❌ AR Error:', event.detail);
        showToast('⚠️ Gagal mengakses kamera. Pastikan menggunakan HTTPS dan izinkan kamera.');
    });

    // Handle camera permission via Permissions API
    if (navigator.permissions) {
        navigator.permissions.query({ name: 'camera' }).then(result => {
            if (result.state === 'denied') showPermissionOverlay();
            result.addEventListener('change', () => {
                if (result.state === 'denied') showPermissionOverlay();
            });
        }).catch(() => {
            // Permissions API tidak didukung — biarkan AR.js yang handle
        });
    }
}

// ============================================
// AR UI INITIALIZATION
// ============================================
function initARUI() {
    const arUIOverlay = document.getElementById('arUIOverlay');
    if (!arUIOverlay) return;
    arUIOverlay.style.zIndex = '10';
}

// ============================================
// CAMERA PERMISSION
// PERBAIKAN: Hapus blok addEventListener duplikat yang sebelumnya
// berada di luar fungsi (orphaned code) — sumber error fatal JS.
// ============================================
function initCameraPermission() {
    const permissionOverlay = document.getElementById('permissionOverlay');
    const requestPermissionBtn = document.getElementById('requestPermissionBtn');

    if (!permissionOverlay || !requestPermissionBtn) return;

    // Sembunyikan overlay dulu, biarkan AR.js yang handle kamera
    hidePermissionOverlay();

    // Hanya tampilkan jika permission benar-benar denied
    if (navigator.permissions) {
        navigator.permissions.query({ name: 'camera' }).then(result => {
            if (result.state === 'denied') showPermissionOverlay();
            result.addEventListener('change', () => {
                if (result.state === 'denied') showPermissionOverlay();
                else hidePermissionOverlay();
            });
        }).catch(() => {});
    }

    // PERBAIKAN: Hanya satu event listener untuk tombol izin kamera
    requestPermissionBtn.addEventListener('click', () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast('⚠️ Browser tidak mendukung akses kamera.');
            return;
        }
        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        })
        .then(stream => {
            // Hentikan stream sementara, biarkan AR.js yang kelola
            stream.getTracks().forEach(track => track.stop());
            hidePermissionOverlay();
            location.reload();
        })
        .catch(() => {
            showToast('⚠️ Tidak dapat mengakses kamera. Periksa pengaturan izin.');
        });
    });
}

function showPermissionOverlay() {
    const overlay = document.getElementById('permissionOverlay');
    if (overlay) overlay.classList.remove('hidden');
}

function hidePermissionOverlay() {
    const overlay = document.getElementById('permissionOverlay');
    if (overlay) overlay.classList.add('hidden');
}

// ============================================
// MARKER DETECTION SETUP
// ============================================
function initMarkerDetection() {
    console.log("📡 Memulai inisialisasi marker detection...");

    const markers = [
        { id: 'markerlovebird',     birdKey: 'lovebird' },
        { id: 'markerToucan',       birdKey: 'toucan' },
        { id: 'markerKingfisher',   birdKey: 'kingfisher' },
        { id: 'markerDodo',         birdKey: 'dodo' },
        { id: 'markerMerpatiPutih', birdKey: 'merpati' },
        { id: 'markerRobin',        birdKey: 'robin' },
    ];

    markers.forEach(({ id, birdKey }) => {
        const marker = document.getElementById(id);

        if (!marker) {
            console.error(`❌ Marker ${id} tidak ditemukan di DOM!`);
            return;
        }

        console.log(`✅ Marker ${id} ditemukan, memasang event listener`);

        marker.addEventListener('markerFound', () => {
            console.log(`🎉 MARKER FOUND: ${birdKey}`);
            // Simpan referensi langsung ke model entity via data-bird (paling reliable)
            window.activeModelEl = document.querySelector(`.ar-model[data-bird="${birdKey}"]`);
            console.log(`✅ activeModelEl set:`, window.activeModelEl ? window.activeModelEl.getAttribute('data-bird') : 'null');
            handleMarkerFound(birdKey);
        });

        marker.addEventListener('markerLost', () => {
            console.log(`👋 Marker lost: ${birdKey}`);
            window.activeModelEl = null;
            handleMarkerLost();
        });
    });

    observeMarkerVisibility();
}

function observeMarkerVisibility() {
    const modelElements = document.querySelectorAll('.ar-model');
    console.log(`🔍 Menemukan ${modelElements.length} model AR`);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'visible') {
                const model = mutation.target;
                const isVisible = model.getAttribute('visible');
                const birdKey = model.getAttribute('data-bird');

                if (isVisible === 'true' && birdKey) {
                    console.log(`👁️ Model ${birdKey} menjadi VISIBLE`);
                    handleMarkerFound(birdKey);
                } else if (isVisible === 'false') {
                    console.log(`🙈 Model menjadi HIDDEN`);
                    handleMarkerLost();
                }
            }
        });
    });

    modelElements.forEach(model => {
        observer.observe(model, { attributes: true, attributeFilter: ['visible'] });
    });
}

// ============================================
// MARKER EVENT HANDLERS
// ============================================
function handleMarkerFound(birdKey) {
    if (isMarkerDetected && currentBirdKey === birdKey) return;

    isMarkerDetected = true;
    currentBirdKey = birdKey;

    hideIndicator();
    showDetectedBadge();
    updatePopupInfo(birdKey);
    playBirdSound(birdKey);
    saveProgress(birdKey, 'scanned');

    // Tampilkan hint putar hanya sekali selama sesi
    if (!window._touchHintShown) {
        window._touchHintShown = true;
        setTimeout(() => {
            showToast('👆 Geser layar untuk memutar burung!', 3000);
        }, 1500);
    }

    clearTimeout(detectionTimeout);

    console.log('✅ Marker terdeteksi:', birdKey);
}

function handleMarkerLost() {
    clearTimeout(detectionTimeout);
    detectionTimeout = setTimeout(() => {
        isMarkerDetected = false;
        currentBirdKey = null;

        showIndicator();
        hideDetectedBadge();
        stopBirdSound();

        console.log('⬜ Marker hilang');
    }, 500);
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================
function showIndicator() {
    const indicator = document.getElementById('arIndicator');
    if (indicator) {
        indicator.style.opacity = '1';
        indicator.style.transition = 'opacity 0.3s ease';
    }
}

function hideIndicator() {
    const indicator = document.getElementById('arIndicator');
    if (indicator) {
        indicator.style.opacity = '0';
    }
}

function showDetectedBadge() {
    const badge = document.getElementById('arDetectedBadge');
    if (badge) {
        badge.classList.add('show');
        setTimeout(() => {
            if (!isMarkerDetected) badge.classList.remove('show');
        }, 3000);
    }
}

function hideDetectedBadge() {
    const badge = document.getElementById('arDetectedBadge');
    if (badge) badge.classList.remove('show');
}

// ============================================
// POPUP TOGGLE
// ============================================
function initPopupToggle() {
    const popupToggleBtn = document.getElementById('popupToggleBtn');
    const popupContentWrapper = document.getElementById('popupContentWrapper');

    if (!popupToggleBtn || !popupContentWrapper) return;

    popupToggleBtn.addEventListener('click', () => {
        popupToggleBtn.classList.toggle('open');
        popupContentWrapper.classList.toggle('open');
    });
}

function updatePopupInfo(birdKey) {
    const bird = birdsData.find(b => b.name.toLowerCase().includes(birdKey.toLowerCase()));
    if (!bird) return;

    const elements = {
        popupBirdName: bird.name,
        popupBirdLatin: bird.latinName,
        popupWingSpan: bird.wingSpan,
        popupFlightHeight: bird.flightHeight,
        popupHabitat: bird.habitat,
        popupFunFact: bird.funFact
    };

    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });

    const popupToggleBtn = document.getElementById('popupToggleBtn');
    const popupContentWrapper = document.getElementById('popupContentWrapper');

    if (popupToggleBtn && popupContentWrapper && !popupContentWrapper.classList.contains('open')) {
        setTimeout(() => {
            popupToggleBtn.classList.add('open');
            popupContentWrapper.classList.add('open');
        }, 800);
    }
}

// ============================================
// AR CONTROL BUTTONS
// ============================================
function initARControls() {
    const muteBtn = document.getElementById('muteBtn');
    if (muteBtn) muteBtn.addEventListener('click', toggleMute);

    const screenshotBtn = document.getElementById('screenshotBtn');
    if (screenshotBtn) screenshotBtn.addEventListener('click', takeScreenshot);

    const markerGuideBtn = document.getElementById('markerGuideBtn');
    if (markerGuideBtn) markerGuideBtn.addEventListener('click', openMarkerGuide);
}

function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('muteBtn');

    if (muteBtn) {
        const icon = muteBtn.querySelector('.ctrl-icon');
        if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
    }

    if (isMuted && currentAudio) {
        currentAudio.pause();
    } else if (!isMuted && currentAudio && isMarkerDetected) {
        currentAudio.play().catch(() => {});
    }

    showToast(isMuted ? '🔇 Suara dimatikan' : '🔊 Suara dinyalakan');
}

function takeScreenshot() {
    const arSceneWrapper = document.getElementById('arSceneWrapper');
    if (!arSceneWrapper) return;

    const canvas = arSceneWrapper.querySelector('canvas');
    if (!canvas) {
        showToast('📸 Tidak dapat mengambil screenshot');
        return;
    }

    try {
        const screenshot = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `birdar-screenshot-${Date.now()}.png`;
        link.href = screenshot;
        link.click();
        showToast('📸 Screenshot berhasil disimpan!');
    } catch (e) {
        showToast('⚠️ Gagal mengambil screenshot');
    }
}

// ============================================
// MARKER GUIDE MODAL
// ============================================
function initMarkerGuide() {
    const markerGuideModal = document.getElementById('markerGuideModal');
    const closeMarkerGuide = document.getElementById('closeMarkerGuide');

    if (!markerGuideModal) return;

    if (closeMarkerGuide) {
        closeMarkerGuide.addEventListener('click', () => {
            markerGuideModal.classList.remove('active');
        });
    }

    markerGuideModal.addEventListener('click', (e) => {
        if (e.target === markerGuideModal) markerGuideModal.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && markerGuideModal.classList.contains('active')) {
            markerGuideModal.classList.remove('active');
        }
    });
}

function openMarkerGuide() {
    const markerGuideModal = document.getElementById('markerGuideModal');
    if (markerGuideModal) markerGuideModal.classList.add('active');
}

// ============================================
// AUDIO FUNCTIONS
// ============================================
function playBirdSound(birdKey) {
    if (isMuted) return;

    stopBirdSound();

    const bird = birdsData.find(b => b.name.toLowerCase().includes(birdKey.toLowerCase()));
    if (!bird) return;

    try {
        currentAudio = new Audio(`assets/audio/${bird.soundFile}`);
        currentAudio.loop = false;
        currentAudio.volume = 0.7;

        currentAudio.play().catch(err => {
            console.log('Audio play failed (perlu interaksi user dulu):', err);
            // Coba putar saat user tap layar
            document.addEventListener('click', function playOnClick() {
                if (currentAudio) currentAudio.play().catch(() => {});
                document.removeEventListener('click', playOnClick);
            }, { once: true });
        });

        currentAudio.onended = () => {
            if (isMarkerDetected && !isMuted) {
                setTimeout(() => {
                    if (isMarkerDetected && !isMuted) playBirdSound(birdKey);
                }, 2000);
            }
        };
    } catch (e) {
        console.log('Audio error:', e);
    }
}

function stopBirdSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

// ============================================
// SAVE PROGRESS
// ============================================
function saveProgress(birdKey, type) {
    try {
        const progress = JSON.parse(localStorage.getItem('birdAR_progress') || '{}');

        if (type === 'scanned') {
            progress[`scanned_${birdKey}`] = true;
            progress[`scanned_${birdKey}_date`] = new Date().toISOString();
            progress[`learned_${birdKey}`] = true;
        }

        progress.lastActivity = new Date().toISOString();
        progress.lastActivityType = 'ar_scan';

        localStorage.setItem('birdAR_progress', JSON.stringify(progress));
    } catch (e) {
        console.warn('LocalStorage tidak tersedia');
    }
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, duration = 2500) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.id = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ============================================
// QUATERNION MATH HELPERS
// Quaternion memungkinkan rotasi 360° bebas ke
// segala arah tanpa gimbal lock.
// ============================================

// Kalikan dua quaternion: q = a * b
function quatMultiply(a, b) {
    return {
        x:  a.w*b.x + a.x*b.w + a.y*b.z - a.z*b.y,
        y:  a.w*b.y - a.x*b.z + a.y*b.w + a.z*b.x,
        z:  a.w*b.z + a.x*b.y - a.y*b.x + a.z*b.w,
        w:  a.w*b.w - a.x*b.x - a.y*b.y - a.z*b.z,
    };
}

// Normalisasi quaternion (jaga presisi numerik)
function quatNormalize(q) {
    const len = Math.sqrt(q.x*q.x + q.y*q.y + q.z*q.z + q.w*q.w);
    if (len === 0) return { x:0, y:0, z:0, w:1 };
    return { x: q.x/len, y: q.y/len, z: q.z/len, w: q.w/len };
}

// Buat quaternion dari axis (nx,ny,nz harus normalized) dan sudut radian
function quatFromAxisAngle(nx, ny, nz, angle) {
    const s = Math.sin(angle / 2);
    return { x: nx*s, y: ny*s, z: nz*s, w: Math.cos(angle / 2) };
}

// Konversi quaternion ke euler degrees (untuk setAttribute A-Frame)
function quatToEulerDeg(q) {
    const { x, y, z, w } = q;
    // Roll (X)
    const sinr_cosp = 2*(w*x + y*z);
    const cosr_cosp = 1 - 2*(x*x + y*y);
    const rx = Math.atan2(sinr_cosp, cosr_cosp);
    // Pitch (Y)
    const sinp = 2*(w*y - z*x);
    const ry = Math.abs(sinp) >= 1
        ? Math.sign(sinp) * Math.PI/2
        : Math.asin(sinp);
    // Yaw (Z)
    const siny_cosp = 2*(w*z + x*y);
    const cosy_cosp = 1 - 2*(y*y + z*z);
    const rz = Math.atan2(siny_cosp, cosy_cosp);

    const r2d = 180 / Math.PI;
    return { x: rx*r2d, y: ry*r2d, z: rz*r2d };
}

// Konversi euler degrees ke quaternion
function eulerDegToQuat(ex, ey, ez) {
    const d2r = Math.PI / 180;
    const cx = Math.cos(ex*d2r/2), sx = Math.sin(ex*d2r/2);
    const cy = Math.cos(ey*d2r/2), sy = Math.sin(ey*d2r/2);
    const cz = Math.cos(ez*d2r/2), sz = Math.sin(ez*d2r/2);
    return {
        x: sx*cy*cz + cx*sy*sz,
        y: cx*sy*cz - sx*cy*sz,
        z: cx*cy*sz + sx*sy*cz,
        w: cx*cy*cz - sx*sy*sz,
    };
}

// Referensi model yang sedang aktif di atas marker
// Di-set oleh marker event listener di initMarkerDetection()
window.activeModelEl = null;

// ============================================
// QUATERNION TOUCH ROTATION — 360° BEBAS
// Fix root cause: animation-mixer GLB override rotasi setiap frame.
// Solusi: pause mixer saat drag, set rotasi via object3D langsung
// (bypass attribute system A-Frame), resume mixer setelah selesai.
// ============================================
function initTouchRotation() {
    // Retry sampai canvas A-Frame benar-benar ada di DOM
    const canvas = document.querySelector('a-scene canvas');
    if (!canvas) {
        setTimeout(initTouchRotation, 500);
        return;
    }

    console.log('✅ Touch rotation siap');

    const floatMap = {
        lovebird:   { from: '0.009 0.513 0.281',  to: '0.009 0.713 0.281'  },
        toucan:     { from: '0.0 0.344 0.08',      to: '0.0 0.544 0.08'     },
        kingfisher: { from: '0.0 0.164 0.163',     to: '0.0 0.364 0.163'    },
        dodo:       { from: '-0.004 0.718 -0.298', to: '-0.004 0.918 -0.298'},
        merpati:    { from: '-0.014 0.395 0.395',  to: '-0.014 0.595 0.395' },
        robin:      { from: '0.0 0.528 0.324',     to: '0.0 0.728 0.324'    },
    };

    // Gunakan window.activeModelEl yang di-set langsung oleh marker event
    function getActiveModel() {
        return window.activeModelEl || null;
    }

    function restoreFloat(model) {
        if (!model) return;
        const key = model.getAttribute('data-bird');
        const f = floatMap[key];
        if (!f) return;
        model.setAttribute('animation__float', {
            property: 'position', from: f.from, to: f.to,
            dir: 'alternate', loop: true, dur: 2000, easing: 'easeInOutSine'
        });
    }

    function stopInertia() {
        if (dragState.inertiaFrame) {
            cancelAnimationFrame(dragState.inertiaFrame);
            dragState.inertiaFrame = null;
        }
        dragState.inertiaVelX = 0;
        dragState.inertiaVelY = 0;
    }

    // Set rotasi langsung ke Three.js object3D, BUKAN lewat setAttribute
    // setAttribute akan di-override oleh animation-mixer setiap frame
    function applyQuat(model, q) {
        const obj = model.object3D;
        if (!obj) return;
        // Set quaternion langsung ke Three.js — paling tepat dan tidak bisa di-override
        obj.quaternion.set(q.x, q.y, q.z, q.w);
    }

    // Pause animation-mixer agar tidak override quaternion saat drag
    function pauseAnimMixer(model) {
        try {
            const mixer = model.components['animation-mixer'];
            if (mixer && mixer.mixer) mixer.mixer.timeScale = 0;
        } catch(e) {}
    }

    // Resume animation-mixer setelah drag/inersia selesai
    function resumeAnimMixer(model) {
        try {
            const mixer = model.components['animation-mixer'];
            if (mixer && mixer.mixer) mixer.mixer.timeScale = 1;
        } catch(e) {}
    }

    function startInertia(model) {
        const FRICTION = 0.90;
        const MIN_VEL  = 0.0008;

        function loop() {
            if (Math.abs(dragState.inertiaVelX) < MIN_VEL &&
                Math.abs(dragState.inertiaVelY) < MIN_VEL) {
                stopInertia();
                resumeAnimMixer(model);
                restoreFloat(model);
                return;
            }
            dragState.inertiaVelX *= FRICTION;
            dragState.inertiaVelY *= FRICTION;
            const dqY = quatFromAxisAngle(0, 1, 0, dragState.inertiaVelY);
            const dqX = quatFromAxisAngle(1, 0, 0, dragState.inertiaVelX);
            dragState.qCurrent = quatNormalize(
                quatMultiply(quatMultiply(dqY, dqX), dragState.qCurrent)
            );
            applyQuat(model, dragState.qCurrent);
            dragState.inertiaFrame = requestAnimationFrame(loop);
        }
        dragState.inertiaFrame = requestAnimationFrame(loop);
    }

    // PERBAIKAN 3: Cek apakah target adalah elemen UI — jika ya, skip.
    // Canvas A-Frame BUKAN UI, jadi sentuhan di atasnya akan lolos.
    function isTouchOnUI(target) {
        return !!(
            target.closest('.ar-ctrl-btn') ||
            target.closest('.ar-info-popup') ||
            target.closest('.ar-top-bar') ||
            target.closest('.ar-modal-overlay') ||
            target.closest('.ar-detected-badge') ||
            target.closest('.ar-back-btn')
        );
    }

    // ── TOUCH START ──
    document.addEventListener('touchstart', (e) => {
        if (isTouchOnUI(e.target)) return;

        const model = getActiveModel();
        if (!model) {
            console.log('⚠️ Touch: tidak ada model aktif');
            return;
        }

        stopInertia();

        const touch = e.touches[0];
        dragState.active = true;
        dragState.startX = touch.clientX;
        dragState.startY = touch.clientY;
        dragState.lastX  = touch.clientX;
        dragState.lastY  = touch.clientY;

        // KUNCI: Pause animation-mixer dulu agar tidak override rotasi kita
        pauseAnimMixer(model);

        // Baca quaternion LANGSUNG dari object3D Three.js (paling akurat)
        const obj = model.object3D;
        if (obj) {
            const q3 = obj.quaternion;
            dragState.qCurrent = { x: q3.x, y: q3.y, z: q3.z, w: q3.w };
        } else {
            const rot = model.getAttribute('rotation') || { x: 270, y: 0, z: 0 };
            dragState.qCurrent = eulerDegToQuat(
                parseFloat(rot.x) || 270,
                parseFloat(rot.y) || 0,
                parseFloat(rot.z) || 0
            );
        }

        // Pause animasi float agar tidak bentrok dengan rotasi
        model.removeAttribute('animation__float');

        console.log(`🖐️ Touch start: ${model.getAttribute('data-bird')}`);

    }, { passive: true });

    // ── TOUCH MOVE ──
    document.addEventListener('touchmove', (e) => {
        if (!dragState.active) return;

        const model = getActiveModel();
        if (!model) return;

        const touch = e.touches[0];
        const dx = touch.clientX - dragState.lastX;
        const dy = touch.clientY - dragState.lastY;
        dragState.lastX = touch.clientX;
        dragState.lastY = touch.clientY;

        if (dx === 0 && dy === 0) return;

        const angleY = dx * dragState.sensitivity;
        const angleX = dy * dragState.sensitivity;

        dragState.inertiaVelY = angleY;
        dragState.inertiaVelX = angleX;

        const dqY = quatFromAxisAngle(0, 1, 0, angleY);
        const dqX = quatFromAxisAngle(1, 0, 0, angleX);
        dragState.qCurrent = quatNormalize(
            quatMultiply(quatMultiply(dqY, dqX), dragState.qCurrent)
        );
        applyQuat(model, dragState.qCurrent);

    }, { passive: true });

    // ── TOUCH END ──
    document.addEventListener('touchend', (e) => {
        if (!dragState.active) return;
        dragState.active = false;

        const model = getActiveModel();
        if (!model) return;

        const movedX = Math.abs(e.changedTouches[0].clientX - dragState.startX);
        const movedY = Math.abs(e.changedTouches[0].clientY - dragState.startY);

        if (movedX > 8 || movedY > 8) {
            // Inersia: mixer resume setelah inersia berhenti (di dalam loop)
            startInertia(model);
        } else {
            // Tap biasa: langsung resume mixer dan float
            resumeAnimMixer(model);
            restoreFloat(model);
        }
    }, { passive: true });

    // ── TOUCH CANCEL ──
    document.addEventListener('touchcancel', () => {
        dragState.active = false;
    }, { passive: true });

    window._touchHintShown = false;
}

// ============================================
// CLEANUP
// ============================================
window.addEventListener('beforeunload', () => {
    stopBirdSound();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (currentAudio && !currentAudio.paused) currentAudio.pause();
    } else {
        if (currentAudio && currentAudio.paused && isMarkerDetected && !isMuted) {
            currentAudio.play().catch(() => {});
        }
    }
});
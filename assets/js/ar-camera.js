// ============================================
// AR-CAMERA.JS - Fungsi Kamera AR Lengkap
// ============================================

let isMuted = false;
let currentAudio = null;
let currentBirdKey = null;
let isMarkerDetected = false;
let detectionTimeout = null;

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
}

// ============================================
// AR LOADING SCREEN
// ============================================
function initARLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;

    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            if (loadingScreen.parentNode) loadingScreen.remove();
        }, 500);
    }, 3000);
}

// ============================================
// AR SCENE INITIALIZATION
// ============================================
function initARScene() {
    const arScene = document.getElementById('arScene');
    if (!arScene) return;

    arScene.addEventListener('loaded', () => {
        console.log('✅ AR Scene loaded successfully');
        console.log('📦 Menunggu model GLB selesai preload...');
    });

    // Log saat semua asset selesai diload
    const assets = arScene.querySelector('a-assets');
    if (assets) {
        assets.addEventListener('loaded', () => {
            console.log('✅ Semua asset GLB selesai dipreload! Siap scan marker.');
        });
        assets.addEventListener('timeout', () => {
            console.warn('⚠️ Asset timeout - beberapa GLB mungkin gagal load');
        });
    }

    arScene.addEventListener('arError', (event) => {
        console.error('❌ AR Error:', event.detail);
        showToast('⚠️ Gagal mengakses kamera. Pastikan menggunakan HTTPS dan izinkan kamera.');
    });

    if (navigator.permissions) {
        navigator.permissions.query({ name: 'camera' }).then(result => {
            if (result.state === 'denied') showPermissionOverlay();
            result.addEventListener('change', () => {
                if (result.state === 'denied') showPermissionOverlay();
            });
        }).catch(() => {});
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
// ============================================
function initCameraPermission() {
    const permissionOverlay = document.getElementById('permissionOverlay');
    const requestPermissionBtn = document.getElementById('requestPermissionBtn');

    if (!permissionOverlay || !requestPermissionBtn) return;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } }
        })
        .then(stream => {
            stream.getTracks().forEach(track => track.stop());
            hidePermissionOverlay();
        })
        .catch(err => {
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                showPermissionOverlay();
            }
        });
    }

    requestPermissionBtn.addEventListener('click', () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
            .then(stream => {
                stream.getTracks().forEach(track => track.stop());
                hidePermissionOverlay();
                location.reload();
            })
            .catch(() => {
                showToast('⚠️ Tidak dapat mengakses kamera. Periksa pengaturan izin.');
            });
        }
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
// MARKER DETECTION — PAKAI CUSTOM WINDOW EVENT
// Ini solusi utama agar bisa berjalan di Android Chrome
// ============================================
function initMarkerDetection() {
    console.log("📡 Memulai inisialisasi marker detection via window events...");

    // Dengarkan event dari komponen marker-handler di HTML
    window.addEventListener('birdMarkerFound', (e) => {
        const birdKey = e.detail.birdKey;
        console.log('🎉🎉🎉 BIRD MARKER FOUND:', birdKey);
        handleMarkerFound(birdKey);
    });

    window.addEventListener('birdMarkerLost', (e) => {
        const birdKey = e.detail.birdKey;
        console.log('👋 BIRD MARKER LOST:', birdKey);
        handleMarkerLost();
    });

    // Fallback: juga pasang langsung ke elemen marker
    const markerList = [
        { id: 'markerLovebird',   birdKey: 'lovebird' },
        { id: 'markerToucan',     birdKey: 'toucan' },
        { id: 'markerKingfisher', birdKey: 'kingfisher' }
    ];

    const arScene = document.getElementById('arScene');

    // Tunggu scene loaded sebelum pasang listener langsung
    const attachListeners = () => {
        markerList.forEach(({ id, birdKey }) => {
            const marker = document.getElementById(id);
            if (!marker) {
                console.error(`❌ Marker element tidak ditemukan: ${id}`);
                return;
            }
            console.log(`✅ Pasang listener langsung ke: ${id}`);

            marker.addEventListener('markerFound', () => {
                console.log(`🎯 markerFound event langsung: ${birdKey}`);
                handleMarkerFound(birdKey);
            });

            marker.addEventListener('markerLost', () => {
                console.log(`🔲 markerLost event langsung: ${birdKey}`);
                handleMarkerLost();
            });
        });

        // Fallback polling: cek visibilitas model setiap 500ms
        startVisibilityPolling(markerList);
    };

    if (arScene) {
        arScene.addEventListener('loaded', attachListeners);
    } else {
        document.addEventListener('DOMContentLoaded', attachListeners);
    }
}

// ============================================
// FALLBACK POLLING — Cek visible attribute model
// Jika event markerFound tidak terpicu, ini yang mendeteksi
// ============================================
function startVisibilityPolling(markerList) {
    console.log('🔄 Memulai visibility polling sebagai fallback...');

    setInterval(() => {
        markerList.forEach(({ id, birdKey }) => {
            const marker = document.getElementById(id);
            if (!marker) return;

            // AR.js menyembunyikan marker element saat tidak terdeteksi
            // dengan mengubah object3D visibility
            const obj3D = marker.object3D;
            if (!obj3D) return;

            const isVisible = obj3D.visible;

            if (isVisible && currentBirdKey !== birdKey) {
                console.log(`👁️ POLLING DETECTED: ${birdKey} visible!`);
                handleMarkerFound(birdKey);
            } else if (!isVisible && currentBirdKey === birdKey) {
                // Marker yang sedang aktif jadi tidak visible
                handleMarkerLost();
            }
        });
    }, 300);
}

// ============================================
// MARKER EVENT HANDLERS
// ============================================
function handleMarkerFound(birdKey) {
    if (isMarkerDetected && currentBirdKey === birdKey) return;

    isMarkerDetected = true;
    currentBirdKey = birdKey;

    clearTimeout(detectionTimeout);
    hideIndicator();
    showDetectedBadge();
    updatePopupInfo(birdKey);
    playBirdSound(birdKey);
    saveProgress(birdKey, 'scanned');

    console.log('✅ handleMarkerFound selesai:', birdKey);
}

function handleMarkerLost() {
    clearTimeout(detectionTimeout);
    detectionTimeout = setTimeout(() => {
        isMarkerDetected = false;
        currentBirdKey = null;

        showIndicator();
        hideDetectedBadge();
        stopBirdSound();

        console.log('⬜ Marker hilang, reset state');
    }, 1000);
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
    if (indicator) indicator.style.opacity = '0';
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
    if (!bird) {
        console.warn('⚠️ Data burung tidak ditemukan untuk key:', birdKey);
        return;
    }

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
    const canvas = document.querySelector('#arSceneWrapper canvas');
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
            console.log('Audio play failed:', err);
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
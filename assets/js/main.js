// ============================================
// MAIN.JS - Fungsi Utama Website BirdAR
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Prioritas 1: Sembunyikan loading screen terlebih dahulu
    hideLoadingScreen();
    
    // Prioritas 2: Inisialisasi fungsi lainnya
    initHamburgerMenu();
    initBackToTop();
    initSmoothScroll();
    initSoundEffects();
    initPageTransitions();
    initNavbarScroll();
    initBirdCardListeners();
    initModalListeners();
    initActiveNavLink();
    initMobileFixes();
});

// ============================================
// LOADING SCREEN - DIPERBAIKI
// ============================================
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;
    
    // Force hide setelah maksimal 2 detik
    const forceHideTimeout = setTimeout(() => {
        if (loadingScreen && loadingScreen.parentNode) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
            }, 500);
        }
    }, 2000);
    
    // Sembunyikan saat halaman sudah fully loaded
    window.addEventListener('load', () => {
        clearTimeout(forceHideTimeout);
        
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.remove();
                    }
                }, 500);
            }
        }, 800);
    });
    
    // Fallback: sembunyikan setelah DOM ready
    setTimeout(() => {
        if (loadingScreen && loadingScreen.parentNode && !loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                if (loadingScreen && loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
            }, 500);
        }
    }, 2500);
}

// ============================================
// MOBILE FIXES - Mencegah Horizontal Scroll
// ============================================
function initMobileFixes() {
    // Pastikan body dan html tidak overflow
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.width = '100%';
    document.body.style.width = '100%';
    document.documentElement.style.maxWidth = '100%';
    document.body.style.maxWidth = '100%';
    
    // Fix untuk iOS Safari
    document.documentElement.style.position = 'relative';
    
    // Perbaiki viewport untuk mobile
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (!metaViewport) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
            document.head.appendChild(meta);
        }
    }
    
    // Cegah double-tap zoom pada tombol
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('a')) {
            // Jangan prevent default untuk link dan button
        }
    }, { passive: true });
}

// ============================================
// HAMBURGER MENU & SIDEBAR OVERLAY (MOBILE)
// ============================================
function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburgerBtn || !navMenu) return;
    
    // Buat overlay element
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.id = 'mobileNavOverlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
    
    // Fungsi untuk membuka sidebar
    function openSidebar() {
        hamburgerBtn.classList.add('active');
        navMenu.classList.add('active');
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('nav-open');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
    
    // Fungsi untuk menutup sidebar
    function closeSidebar() {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
    
    // Fungsi toggle sidebar
    function toggleSidebar() {
        if (navMenu.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
    
    // Event: Klik tombol hamburger
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleSidebar();
    });
    
    // Event: Klik overlay untuk menutup sidebar
    overlay.addEventListener('click', (e) => {
        e.preventDefault();
        closeSidebar();
    });
    
    // Event: Klik link navigasi di dalam sidebar
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                closeSidebar();
            }, 150);
        });
    });
    
    // Event: Tutup sidebar dengan tombol Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeSidebar();
        }
    });
    
    // Event: Tutup sidebar saat resize ke desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeSidebar();
            }
        }, 250);
    });
    
    // Event: Tutup sidebar saat swipe ke kanan (gesture)
    let touchStartX = 0;
    let touchEndX = 0;
    
    navMenu.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    navMenu.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance > 50) {
            closeSidebar();
        }
    }, { passive: true });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 50);
    }, { passive: true });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        playClickSound();
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// SOUND EFFECTS
// ============================================
function initSoundEffects() {
    const interactiveElements = document.querySelectorAll(
        '.btn, .nav-link, .feature-card, .bird-card, .quiz-option-btn, .ar-ctrl-btn'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('click', (e) => {
            if (el.tagName === 'A' && el.getAttribute('href') && !el.getAttribute('href').startsWith('#')) {
                return;
            }
            playClickSound();
        });
    });
}

function playClickSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
        
        gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        // Audio tidak didukung
    }
}

// ============================================
// PAGE TRANSITIONS
// ============================================
function initPageTransitions() {
    document.body.style.opacity = '1';
    
    document.querySelectorAll('a[href]:not([href^="#"]):not([target]):not([download])').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('mailto') || 
                href.startsWith('tel') || href.startsWith('javascript')) {
                return;
            }
            if (href.endsWith('.png') || href.endsWith('.pdf') || href.endsWith('.zip') ||
                href.endsWith('.patt') || href.endsWith('.glb') || href.endsWith('.mp3')) {
                return;
            }
            
            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 100) {
                    navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.06)';
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ============================================
// BIRD CARD LISTENERS
// ============================================
function initBirdCardListeners() {
    const birdCards = document.querySelectorAll('.bird-card');
    const birdModal = document.getElementById('birdModal');
    const closeModal = document.getElementById('closeModal');
    const detailButtons = document.querySelectorAll('.btn-detail');
    
    if (!birdModal) return;
    
    function openBirdModal(birdKey) {
        const bird = birdsData.find(b => 
            b.name.toLowerCase().includes(birdKey.toLowerCase())
        );
        if (!bird) return;
        
        const elements = {
            modalBirdEmoji: bird.avatar,
            modalBirdName: bird.name,
            modalBirdLatin: `<em>${bird.latinName}</em>`,
            modalWingSpan: bird.wingSpan,
            modalFlightHeight: bird.flightHeight,
            modalHabitat: bird.habitat,
            modalDescription: bird.description,
            modalFunFact: bird.funFact
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = value;
        });
        
        const birdAudio = document.getElementById('birdAudio');
        const playSoundBtn = document.getElementById('playSoundBtn');
        
        if (birdAudio) {
            birdAudio.src = `assets/audio/${bird.soundFile}`;
            birdAudio.load();
        }
        
        if (playSoundBtn) {
            playSoundBtn.onclick = () => {
                if (birdAudio) {
                    if (birdAudio.paused) {
                        birdAudio.play().catch(() => {
                            showToast('🔇 Suara tidak tersedia');
                        });
                        playSoundBtn.innerHTML = '<span class="sound-icon">⏸️</span> Jeda Suara';
                    } else {
                        birdAudio.pause();
                        playSoundBtn.innerHTML = '<span class="sound-icon">🔊</span> Dengar Suara Asli';
                    }
                }
            };
            if (birdAudio) {
                birdAudio.onended = () => {
                    playSoundBtn.innerHTML = '<span class="sound-icon">🔊</span> Dengar Suara Asli';
                };
            }
        }
        
        const downloadMarkerBtn = document.getElementById('downloadMarkerBtn');
        if (downloadMarkerBtn) {
            downloadMarkerBtn.onclick = () => {
                downloadMarker(bird.markerFile, bird.name);
            };
        }
        
        saveProgress(bird.name, 'learned');
        
        birdModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    detailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const birdKey = btn.getAttribute('data-bird');
            openBirdModal(birdKey);
        });
    });
    
    birdCards.forEach(card => {
        card.addEventListener('click', () => {
            const birdId = card.getAttribute('data-bird-id');
            const bird = birdsData.find(b => b.id === parseInt(birdId));
            if (bird) {
                openBirdModal(bird.name.toLowerCase().split(' ')[0]);
            }
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', closeBirdModal);
    }
    
    birdModal.addEventListener('click', (e) => {
        if (e.target === birdModal) {
            closeBirdModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && birdModal.classList.contains('active')) {
            closeBirdModal();
        }
    });
}

function closeBirdModal() {
    const birdModal = document.getElementById('birdModal');
    const birdAudio = document.getElementById('birdAudio');
    const playSoundBtn = document.getElementById('playSoundBtn');
    
    if (birdModal) {
        birdModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (birdAudio) {
        birdAudio.pause();
        birdAudio.currentTime = 0;
    }
    
    if (playSoundBtn) {
        playSoundBtn.innerHTML = '<span class="sound-icon">🔊</span> Dengar Suara Asli';
    }
}

function downloadMarker(markerFile, birdName) {
    const link = document.createElement('a');
    link.href = `assets/markers/${markerFile}`;
    link.download = `marker-${birdName.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✅ Marker berhasil diunduh! Cetak dan gunakan untuk AR.');
}

// ============================================
// MODAL LISTENERS
// ============================================
function initModalListeners() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModals = document.querySelectorAll('.modal-overlay.active, .ar-modal-overlay.active');
            activeModals.forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

// ============================================
// ACTIVE NAV LINK
// ============================================
function initActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || 
            (currentPath === '' && href === 'index.html') ||
            (currentPath === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
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
// LOCAL STORAGE HELPERS
// ============================================
function saveProgress(birdName, type) {
    try {
        const progress = JSON.parse(localStorage.getItem('birdAR_progress') || '{}');
        const birdKey = birdName.toLowerCase().split(' ')[0];
        
        if (type === 'learned') {
            progress[`learned_${birdKey}`] = true;
            progress[`learned_${birdKey}_date`] = new Date().toISOString();
        } else if (type === 'scanned') {
            progress[`scanned_${birdKey}`] = true;
            progress[`scanned_${birdKey}_date`] = new Date().toISOString();
        }
        
        progress.lastActivity = new Date().toISOString();
        progress.lastActivityType = type;
        
        localStorage.setItem('birdAR_progress', JSON.stringify(progress));
    } catch (e) {
        console.warn('LocalStorage tidak tersedia');
    }
}
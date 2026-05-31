// ============================================
// PROGRESS.JS - Fungsi Tracking Progress Lengkap
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi
    initLoadingScreen();
    
    // Load semua data progress
    loadAllProgress();
    
    // Setup reset button
    initResetButton();
    
    // Setup interval refresh (setiap 30 detik)
    setInterval(loadAllProgress, 30000);
});

// ============================================
// LOADING SCREEN
// ============================================
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.remove();
            }
        }, 500);
    }, 1000);
}

// ============================================
// LOAD ALL PROGRESS
// ============================================
function loadAllProgress() {
    const progress = getProgressData();
    
    // Update overall progress circle
    updateOverallProgress(progress);
    
    // Update stats cards
    updateStatsCards(progress);
    
    // Update checklist
    updateChecklist(progress);
    
    // Update badges
    updateBadges(progress);
    
    // Update activity log
    updateActivityLog(progress);
}

function getProgressData() {
    try {
        return JSON.parse(localStorage.getItem('birdAR_progress') || '{}');
    } catch (e) {
        return {};
    }
}

// ============================================
// OVERALL PROGRESS
// ============================================
function updateOverallProgress(progress) {
    let learnedCount = 0;
    let scannedCount = 0;
    
    birdsData.forEach(bird => {
        const birdKey = bird.name.toLowerCase().split(' ')[0];
        if (progress[`learned_${birdKey}`]) learnedCount++;
        if (progress[`scanned_${birdKey}`]) scannedCount++;
    });
    
    const totalBirds = birdsData.length;
    const percentage = totalBirds > 0 ? Math.round((learnedCount / totalBirds) * 100) : 0;
    
    // Update percentage text
    const overallPercentage = document.getElementById('overallPercentage');
    if (overallPercentage) {
        overallPercentage.textContent = percentage + '%';
    }
    
    // Update progress circle
    const mainProgressCircle = document.getElementById('mainProgressCircle');
    if (mainProgressCircle) {
        const circumference = 2 * Math.PI * 70; // r = 70
        const offset = circumference - (percentage / 100) * circumference;
        mainProgressCircle.style.strokeDasharray = circumference;
        mainProgressCircle.style.strokeDashoffset = offset;
    }
}

// ============================================
// STATS CARDS
// ============================================
function updateStatsCards(progress) {
    let learnedCount = 0;
    let scannedCount = 0;
    
    birdsData.forEach(bird => {
        const birdKey = bird.name.toLowerCase().split(' ')[0];
        if (progress[`learned_${birdKey}`]) learnedCount++;
        if (progress[`scanned_${birdKey}`]) scannedCount++;
    });
    
    const quizHighScore = progress.quizHighScore || 0;
    
    // Update DOM elements
    const learnedCountEl = document.getElementById('learnedCount');
    const scannedCountEl = document.getElementById('scannedCount');
    const quizHighScoreEl = document.getElementById('quizHighScore');
    
    if (learnedCountEl) learnedCountEl.textContent = learnedCount;
    if (scannedCountEl) scannedCountEl.textContent = scannedCount;
    if (quizHighScoreEl) quizHighScoreEl.textContent = quizHighScore;
    
    // Animasi angka (count up)
    animateNumber(learnedCountEl, learnedCount);
    animateNumber(quizHighScoreEl, quizHighScore);
}

function animateNumber(element, target) {
    if (!element) return;
    
    const current = parseInt(element.textContent) || 0;
    if (current === target) return;
    
    const duration = 800;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(current + (target - current) * eased);
        
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// ============================================
// CHECKLIST
// ============================================
function updateChecklist(progress) {
    const checklistContainer = document.getElementById('checklistContainer');
    if (!checklistContainer) return;
    
    checklistContainer.innerHTML = '';
    
    birdsData.forEach(bird => {
        const birdKey = bird.name.toLowerCase().split(' ')[0];
        const isLearned = progress[`learned_${birdKey}`] || false;
        const isScanned = progress[`scanned_${birdKey}`] || false;
        
        let statusText = 'Belum dipelajari';
        let statusClass = 'pending';
        let statusIcon = '⬜';
        
        if (isScanned) {
            statusText = '✅ Sudah di-scan AR';
            statusClass = 'completed';
            statusIcon = '✅';
        } else if (isLearned) {
            statusText = '📚 Sudah dipelajari';
            statusClass = 'completed';
            statusIcon = '✅';
        }
        
        const checklistItem = document.createElement('div');
        checklistItem.className = `checklist-item ${statusClass}`;
        checklistItem.innerHTML = `
            <span class="check-status-icon">${statusIcon}</span>
            <span class="check-bird-emoji">${bird.avatar}</span>
            <div class="check-info">
                <span class="check-name">${bird.name}</span>
                <span class="check-status-text">${statusText}</span>
            </div>
            <div class="check-actions">
                ${!isLearned ? `
                    <a href="birds.html" class="btn btn-small btn-primary">📚 Pelajari</a>
                ` : ''}
                ${isLearned && !isScanned ? `
                    <a href="ar-camera.html" class="btn btn-small btn-accent">📷 Scan AR</a>
                ` : ''}
            </div>
        `;
        
        checklistContainer.appendChild(checklistItem);
    });
    
    // Jika semua sudah dipelajari
    const allLearned = birdsData.every(bird => {
        const birdKey = bird.name.toLowerCase().split(' ')[0];
        return progress[`learned_${birdKey}`];
    });
    
    if (allLearned && birdsData.length > 0) {
        const congratsMsg = document.createElement('div');
        congratsMsg.style.cssText = `
            text-align: center;
            padding: 16px;
            margin-top: 12px;
            background: linear-gradient(135deg, #E8F8F0, #FFF9E6);
            border-radius: 12px;
            font-weight: 700;
        `;
        congratsMsg.innerHTML = '🎉 Selamat! Kamu sudah mempelajari semua burung! Kamar hebat! 🌟';
        checklistContainer.appendChild(congratsMsg);
    }
}

// ============================================
// BADGES
// ============================================
function updateBadges(progress) {
    const badgesGrid = document.getElementById('badgesGrid');
    if (!badgesGrid) return;
    
    let learnedCount = 0;
    let scannedCount = 0;
    
    birdsData.forEach(bird => {
        const birdKey = bird.name.toLowerCase().split(' ')[0];
        if (progress[`learned_${birdKey}`]) learnedCount++;
        if (progress[`scanned_${birdKey}`]) scannedCount++;
    });
    
    const quizHighScore = progress.quizHighScore || 0;
    
    const badges = [
        {
            icon: '🐣',
            name: 'Penjelajah Pemula',
            desc: 'Pelajari 1 burung',
            unlocked: learnedCount >= 1,
            color: '#FF6B6B'
        },
        {
            icon: '🐥',
            name: 'Pelajar Cilik',
            desc: 'Pelajari 2 burung',
            unlocked: learnedCount >= 2,
            color: '#FFE66D'
        },
        {
            icon: '🦅',
            name: 'Ahli Burung',
            desc: 'Pelajari semua burung',
            unlocked: learnedCount >= 3,
            color: '#4ECDC4'
        },
        {
            icon: '📷',
            name: 'AR Explorer',
            desc: 'Scan AR pertama',
            unlocked: scannedCount >= 1,
            color: '#3498DB'
        },
        {
            icon: '🎯',
            name: 'Bintang Quiz',
            desc: 'Skor quiz 60+',
            unlocked: quizHighScore >= 60,
            color: '#A78BFA'
        },
        {
            icon: '🏆',
            name: 'Juara Quiz',
            desc: 'Skor quiz sempurna!',
            unlocked: quizHighScore === 100,
            color: '#F39C12'
        }
    ];
    
    badgesGrid.innerHTML = '';
    
    badges.forEach(badge => {
        const badgeItem = document.createElement('div');
        badgeItem.className = `badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`;
        badgeItem.innerHTML = `
            <span class="badge-icon-display">${badge.unlocked ? badge.icon : '🔒'}</span>
            <span class="badge-name-display">${badge.name}</span>
            <span class="badge-desc-display">${badge.desc}</span>
        `;
        
        if (badge.unlocked) {
            badgeItem.style.borderTop = `3px solid ${badge.color}`;
        }
        
        badgesGrid.appendChild(badgeItem);
    });
}

// ============================================
// ACTIVITY LOG
// ============================================
function updateActivityLog(progress) {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    const activities = [];
    
    // Kumpulkan semua aktivitas
    birdsData.forEach(bird => {
        const birdKey = bird.name.toLowerCase().split(' ')[0];
        
        if (progress[`learned_${birdKey}_date`]) {
            activities.push({
                type: 'learned',
                bird: bird,
                date: new Date(progress[`learned_${birdKey}_date`]),
                icon: '📚',
                text: `Mempelajari ${bird.name}`
            });
        }
        
        if (progress[`scanned_${birdKey}_date`]) {
            activities.push({
                type: 'scanned',
                bird: bird,
                date: new Date(progress[`scanned_${birdKey}_date`]),
                icon: '📷',
                text: `Scan AR ${bird.name}`
            });
        }
    });
    
    // Quiz activity
    if (progress.lastQuizDate) {
        activities.push({
            type: 'quiz',
            date: new Date(progress.lastQuizDate),
            icon: '🎯',
            text: `Mengerjakan Quiz (Skor: ${progress.lastQuizScore || progress.quizHighScore || 0})`
        });
    }
    
    // Sort by date (newest first)
    activities.sort((a, b) => b.date - a.date);
    
    // Tampilkan 5 aktivitas terbaru
    const recentActivities = activities.slice(0, 5);
    
    activityList.innerHTML = '';
    
    if (recentActivities.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item empty">
                <span class="activity-icon">📝</span>
                <p>Belum ada aktivitas. Mulai belajar sekarang!</p>
                <a href="birds.html" class="btn btn-primary btn-small">🚀 Mulai Belajar</a>
            </div>
        `;
        return;
    }
    
    recentActivities.forEach(activity => {
        const timeAgo = getTimeAgo(activity.date);
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <span class="activity-icon">${activity.icon}</span>
            <span class="activity-text">${activity.text}</span>
            <span class="activity-time">${timeAgo}</span>
        `;
        
        activityList.appendChild(activityItem);
    });
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;
    
    return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
}

// ============================================
// RESET BUTTON
// ============================================
function initResetButton() {
    const resetBtn = document.getElementById('resetProgressBtn');
    if (!resetBtn) return;
    
    resetBtn.addEventListener('click', () => {
        // Konfirmasi sebelum reset
        const confirmed = confirm(
            '⚠️ Apakah kamu yakin ingin mereset SEMUA progress belajar?\n\n' +
            'Data yang akan dihapus:\n' +
            '• Burung yang sudah dipelajari\n' +
            '• Riwayat scan AR\n' +
            '• Skor quiz tertinggi\n' +
            '• Semua badge & pencapaian\n\n' +
            'Tindakan ini tidak bisa dibatalkan!'
        );
        
        if (confirmed) {
            // Double confirm untuk keamanan
            const doubleConfirm = confirm(
                '🔴 KONFIRMASI TERAKHIR\n\n' +
                'Benar-benar yakin ingin mereset progress?'
            );
            
            if (doubleConfirm) {
                resetAllProgress();
            }
        }
    });
}

function resetAllProgress() {
    try {
        // Hapus dari localStorage
        localStorage.removeItem('birdAR_progress');
        
        // Reload halaman untuk memperbarui tampilan
        showToast('✅ Progress berhasil direset!');
        
        setTimeout(() => {
            location.reload();
        }, 1000);
    } catch (e) {
        showToast('❌ Gagal mereset progress. Coba lagi.');
    }
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) {
        const newToast = document.createElement('div');
        newToast.className = 'toast';
        newToast.id = 'toast';
        document.body.appendChild(newToast);
        setTimeout(() => showToast(message, duration), 50);
        return;
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ============================================
// HANDLE STORAGE EVENTS (Sync antar tab)
// ============================================
window.addEventListener('storage', (event) => {
    if (event.key === 'birdAR_progress') {
        // Reload progress jika ada perubahan dari tab lain
        loadAllProgress();
    }
});
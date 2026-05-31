// ============================================
// QUIZ.JS - Fungsi Quiz Interaktif Lengkap
// ============================================

// State variables
let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let totalQuestions = 0;
let quizStartTime = null;
let questionStartTime = null;
let totalTimeSpent = 0;
let isQuizActive = false;

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi
    initLoadingScreen();
    initQuizStart();
    initQuizNavigation();
    updateQuestionCount();
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
// QUIZ INITIALIZATION
// ============================================
function initQuizStart() {
    totalQuestions = quizData.length;
    
    const startQuizBtn = document.getElementById('startQuizBtn');
    const retryQuizBtn = document.getElementById('retryQuizBtn');
    
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }
    
    if (retryQuizBtn) {
        retryQuizBtn.addEventListener('click', resetAndStartQuiz);
    }
}

function startQuiz() {
    // Reset state
    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    quizStartTime = Date.now();
    isQuizActive = true;
    
    // Switch screens
    switchQuizScreen('start', 'active');
    
    // Load first question
    loadQuestion(currentQuestionIndex);
    updateProgressBar();
    updateScoreDisplay();
    
    // Enable skip button
    const skipBtn = document.getElementById('skipBtn');
    if (skipBtn) skipBtn.disabled = false;
    
    playSound('start');
}

function resetAndStartQuiz() {
    // Reset semua state
    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    totalTimeSpent = 0;
    quizStartTime = Date.now();
    isQuizActive = true;
    
    // Switch dari result ke active screen
    switchQuizScreen('result', 'active');
    
    // Load first question
    loadQuestion(currentQuestionIndex);
    updateProgressBar();
    updateScoreDisplay();
    
    const skipBtn = document.getElementById('skipBtn');
    if (skipBtn) skipBtn.disabled = false;
    
    // Reset timer display
    const quizTimer = document.getElementById('quizTimer');
    if (quizTimer) quizTimer.textContent = '⏱️ 0 detik';
    
    playSound('start');
}

// ============================================
// SCREEN SWITCHING
// ============================================
function switchQuizScreen(from, to) {
    const screens = {
        start: document.getElementById('quizStartScreen'),
        active: document.getElementById('quizActiveScreen'),
        result: document.getElementById('quizResultScreen')
    };
    
    if (from && screens[from]) {
        screens[from].classList.remove('active');
    }
    
    if (to && screens[to]) {
        screens[to].classList.add('active');
    }
}

// ============================================
// LOAD QUESTION
// ============================================
function loadQuestion(index) {
    if (index >= totalQuestions) {
        endQuiz();
        return;
    }
    
    const question = quizData[index];
    questionStartTime = Date.now();
    
    // Update question display
    const questionEmoji = document.getElementById('questionEmoji');
    const questionText = document.getElementById('questionText');
    const optionsGrid = document.getElementById('optionsGrid');
    const feedbackArea = document.getElementById('feedbackArea');
    const questionCounter = document.getElementById('questionCounter');
    
    if (questionEmoji) questionEmoji.textContent = question.emoji;
    if (questionText) questionText.textContent = question.question;
    if (feedbackArea) feedbackArea.innerHTML = '';
    if (questionCounter) questionCounter.textContent = `Pertanyaan ${index + 1}/${totalQuestions}`;
    
    // Clear options
    if (optionsGrid) {
        optionsGrid.innerHTML = '';
        
        const letters = ['A', 'B', 'C', 'D'];
        
        question.options.forEach((option, optIndex) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'quiz-option-btn';
            optionBtn.innerHTML = `
                <span class="option-letter-badge">${letters[optIndex]}</span>
                <span class="option-text">${option}</span>
            `;
            
            optionBtn.addEventListener('click', () => {
                selectAnswer(optIndex, question);
            });
            
            optionsGrid.appendChild(optionBtn);
        });
    }
    
    // Update progress bar
    updateProgressBar();
    
    // Scroll to question
    const questionArea = document.querySelector('.quiz-question-area');
    if (questionArea) {
        questionArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ============================================
// SELECT ANSWER
// ============================================
function selectAnswer(selectedIndex, question) {
    if (!isQuizActive) return;
    isQuizActive = false; // Prevent double answer
    
    const optionsGrid = document.getElementById('optionsGrid');
    const feedbackArea = document.getElementById('feedbackArea');
    const skipBtn = document.getElementById('skipBtn');
    
    if (!optionsGrid || !feedbackArea) return;
    
    const isCorrect = selectedIndex === question.correctIndex;
    const optionButtons = optionsGrid.querySelectorAll('.quiz-option-btn');
    
    // Hitung waktu yang dihabiskan untuk pertanyaan ini
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    totalTimeSpent += timeSpent;
    
    // Disable all buttons
    optionButtons.forEach(btn => {
        btn.style.pointerEvents = 'none';
        btn.disabled = true;
    });
    
    // Highlight correct answer
    optionButtons[question.correctIndex].classList.add('correct');
    
    // Highlight wrong answer jika salah
    if (!isCorrect) {
        optionButtons[selectedIndex].classList.add('wrong');
    }
    
    // Update score
    if (isCorrect) {
        score += Math.round(100 / totalQuestions);
        correctCount++;
        feedbackArea.innerHTML = '<span style="color: #2ECC71; font-size: 20px;">✅ Benar! Hebat! 🎉</span>';
        playSound('correct');
        
        // Animasi kecil di feedback
        feedbackArea.style.animation = 'none';
        feedbackArea.offsetHeight; // Trigger reflow
        feedbackArea.style.animation = 'fadeInUp 0.4s ease forwards';
    } else {
        wrongCount++;
        feedbackArea.innerHTML = `
            <span style="color: #E74C3C;">❌ Oops! Salah nih...</span>
            <br>
            <span style="font-size: 14px; color: var(--text-medium);">💡 ${question.explanation}</span>
        `;
        playSound('wrong');
    }
    
    // Update score display
    updateScoreDisplay();
    
    // Disable skip button
    if (skipBtn) skipBtn.disabled = true;
    
    // Lanjut ke pertanyaan berikutnya setelah delay
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex >= totalQuestions) {
            endQuiz();
        } else {
            loadQuestion(currentQuestionIndex);
            isQuizActive = true;
            if (skipBtn) skipBtn.disabled = false;
        }
    }, 1800);
}

// ============================================
// SKIP QUESTION
// ============================================
function initQuizNavigation() {
    const skipBtn = document.getElementById('skipBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', skipQuestion);
    }
}

function skipQuestion() {
    if (!isQuizActive) return;
    
    const question = quizData[currentQuestionIndex];
    const feedbackArea = document.getElementById('feedbackArea');
    const optionsGrid = document.getElementById('optionsGrid');
    
    if (feedbackArea) {
        feedbackArea.innerHTML = `
            <span style="color: var(--warning);">⏭️ Pertanyaan dilewati</span>
            <br>
            <span style="font-size: 14px; color: var(--text-medium);">💡 ${question.explanation}</span>
        `;
    }
    
    // Highlight correct answer
    if (optionsGrid) {
        const optionButtons = optionsGrid.querySelectorAll('.quiz-option-btn');
        optionButtons.forEach(btn => btn.style.pointerEvents = 'none');
        if (optionButtons[question.correctIndex]) {
            optionButtons[question.correctIndex].classList.add('correct');
        }
    }
    
    wrongCount++;
    
    const skipBtn = document.getElementById('skipBtn');
    if (skipBtn) skipBtn.disabled = true;
    
    // Hitung waktu
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    totalTimeSpent += timeSpent;
    
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex >= totalQuestions) {
            endQuiz();
        } else {
            loadQuestion(currentQuestionIndex);
            isQuizActive = true;
            if (skipBtn) skipBtn.disabled = false;
        }
    }, 1500);
}

// ============================================
// END QUIZ
// ============================================
function endQuiz() {
    isQuizActive = false;
    
    // Hitung total waktu
    const totalQuizTime = Math.round((Date.now() - quizStartTime) / 1000);
    
    // Switch to result screen
    switchQuizScreen('active', 'result');
    
    // Update progress bar ke 100%
    const progressFill = document.getElementById('quizProgressFill');
    if (progressFill) progressFill.style.width = '100%';
    
    // Update result elements
    updateResultScreen(score, correctCount, wrongCount, totalQuizTime);
    
    // Simpan progress
    saveQuizScore(score);
    
    // Trigger confetti untuk skor tinggi
    if (score >= 80) {
        createConfetti();
    }
    
    playSound('complete');
}

function updateResultScreen(finalScore, correct, wrong, totalTime) {
    // Update score circle
    const resultCircleFill = document.getElementById('resultCircleFill');
    const finalScoreEl = document.getElementById('finalScore');
    const correctCountEl = document.getElementById('correctCount');
    const wrongCountEl = document.getElementById('wrongCount');
    const totalTimeEl = document.getElementById('totalTime');
    const resultMessage = document.getElementById('resultMessage');
    const resultEmojiDisplay = document.getElementById('resultEmojiDisplay');
    const resultBadgeDisplay = document.getElementById('resultBadgeDisplay');
    
    if (resultCircleFill) {
        const circumference = 2 * Math.PI * 62;
        const offset = circumference - (finalScore / 100) * circumference;
        resultCircleFill.style.strokeDasharray = circumference;
        resultCircleFill.style.strokeDashoffset = offset;
    }
    
    if (finalScoreEl) finalScoreEl.textContent = finalScore;
    if (correctCountEl) correctCountEl.textContent = correct;
    if (wrongCountEl) wrongCountEl.textContent = wrong;
    if (totalTimeEl) totalTimeEl.textContent = `${totalTime} detik`;
    
    // Set message and emoji based on score
    let message = '';
    let emoji = '';
    let badgeHTML = '';
    
    if (finalScore === 100) {
        message = '🌟 Sempurna! Kamu benar-benar ahli burung!';
        emoji = '🏆';
        badgeHTML = '<div style="font-size: 50px;">🥇</div><p style="font-weight: 800; color: var(--warning);">Badge Emas!</p>';
    } else if (finalScore >= 80) {
        message = '🎉 Hebat! Kamu tahu banyak tentang burung!';
        emoji = '🌟';
        badgeHTML = '<div style="font-size: 50px;">🥈</div><p style="font-weight: 800; color: var(--text-medium);">Badge Perak!</p>';
    } else if (finalScore >= 60) {
        message = '👏 Bagus! Terus belajar ya!';
        emoji = '💪';
        badgeHTML = '<div style="font-size: 50px;">🥉</div><p style="font-weight: 800; color: var(--accent2);">Badge Perunggu!</p>';
    } else if (finalScore >= 40) {
        message = '📚 Lumayan! Yuk belajar lagi biar makin jago!';
        emoji = '📖';
        badgeHTML = '<p style="font-size: 14px; color: var(--text-medium);">Belum dapat badge. Coba lagi ya!</p>';
    } else {
        message = '🌱 Semangat! Coba lagi dan pelajari burung-burungnya!';
        emoji = '🌱';
        badgeHTML = '<p style="font-size: 14px; color: var(--text-medium);">Mulai dari awal, tidak apa-apa!</p>';
    }
    
    if (resultMessage) resultMessage.textContent = message;
    if (resultEmojiDisplay) resultEmojiDisplay.textContent = emoji;
    if (resultBadgeDisplay) resultBadgeDisplay.innerHTML = badgeHTML;
}

// ============================================
// PROGRESS & SCORE HELPERS
// ============================================
function updateProgressBar() {
    const progressFill = document.getElementById('quizProgressFill');
    if (progressFill) {
        const percentage = (currentQuestionIndex / totalQuestions) * 100;
        progressFill.style.width = percentage + '%';
    }
}

function updateScoreDisplay() {
    const currentScore = document.getElementById('currentScore');
    if (currentScore) {
        currentScore.textContent = score;
    }
}

function updateQuestionCount() {
    const questionCounter = document.getElementById('questionCounter');
    if (questionCounter) {
        questionCounter.textContent = `Pertanyaan 1/${totalQuestions}`;
    }
}

// ============================================
// AUDIO FUNCTIONS
// ============================================
function playSound(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        switch(type) {
            case 'start':
                playTone(audioCtx, 523, 0.1, 'sine');
                setTimeout(() => playTone(audioCtx, 659, 0.1, 'sine'), 100);
                setTimeout(() => playTone(audioCtx, 784, 0.15, 'sine'), 200);
                break;
            case 'correct':
                playTone(audioCtx, 523, 0.1, 'sine');
                setTimeout(() => playTone(audioCtx, 659, 0.08, 'sine'), 80);
                setTimeout(() => playTone(audioCtx, 784, 0.12, 'sine'), 160);
                setTimeout(() => playTone(audioCtx, 1047, 0.2, 'sine'), 240);
                break;
            case 'wrong':
                playTone(audioCtx, 200, 0.15, 'sawtooth');
                setTimeout(() => playTone(audioCtx, 150, 0.2, 'sawtooth'), 150);
                break;
            case 'complete':
                const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
                notes.forEach((freq, i) => {
                    setTimeout(() => playTone(audioCtx, freq, 0.15, 'sine'), i * 100);
                });
                break;
        }
    } catch (e) {
        // Audio not supported
    }
}

function playTone(audioCtx, frequency, duration, type = 'sine') {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
}

// ============================================
// CONFETTI EFFECT
// ============================================
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8E72', '#A78BFA', '#2ECC71', '#3498DB', '#F39C12'];
    const shapes = ['square', 'circle'];
    
    container.innerHTML = '';
    
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 3;
        const size = 8 + Math.random() * 10;
        
        confetti.style.cssText = `
            left: ${left}%;
            width: ${size}px;
            height: ${shape === 'circle' ? size : size * 0.6}px;
            background: ${color};
            border-radius: ${shape === 'circle' ? '50%' : '2px'};
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;
        
        container.appendChild(confetti);
    }
    
    // Clean up confetti after animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// ============================================
// SAVE QUIZ SCORE
// ============================================
function saveQuizScore(score) {
    try {
        const progress = JSON.parse(localStorage.getItem('birdAR_progress') || '{}');
        const previousHigh = progress.quizHighScore || 0;
        
        if (score > previousHigh) {
            progress.quizHighScore = score;
        }
        
        progress.lastQuizScore = score;
        progress.lastQuizDate = new Date().toISOString();
        progress.lastActivity = new Date().toISOString();
        progress.lastActivityType = 'quiz';
        
        localStorage.setItem('birdAR_progress', JSON.stringify(progress));
    } catch (e) {
        console.warn('LocalStorage tidak tersedia');
    }
}

// ============================================
// TIMER DISPLAY UPDATE
// ============================================
setInterval(() => {
    if (isQuizActive && quizStartTime) {
        const elapsed = Math.round((Date.now() - quizStartTime) / 1000);
        const quizTimer = document.getElementById('quizTimer');
        if (quizTimer) {
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            quizTimer.textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}, 1000);
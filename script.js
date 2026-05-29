// ============================================
// GAME STATE
// ============================================
let score = 0;
let chances = 3;
let streak = 0;
let ballPosition = -1;
let gameActive = true;

// ============================================
// DOM ELEMENTS
// ============================================
const gameBoard = document.getElementById('gameBoard');
const feedback = document.getElementById('feedback');
const resetBtn = document.getElementById('resetBtn');
const scoreEl = document.getElementById('score');
const chancesEl = document.getElementById('chances');
const streakEl = document.getElementById('streak');

// ============================================
// INITIALIZE GAME
// ============================================
function initGame() {
    gameActive = true;
    chances = 3;
    ballPosition = Math.floor(Math.random() * 9);
    
    // Clear and rebuild board
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const box = document.createElement('button');
        box.className = 'box';
        box.setAttribute('data-index', i);
        box.setAttribute('aria-label', `Box ${i + 1}`);
        box.addEventListener('click', handleBoxClick);
        gameBoard.appendChild(box);
    }
    
    updateStats();
    feedback.textContent = 'Make your guess! Tap any box.';
    feedback.className = 'feedback';
    resetBtn.style.display = 'none';
}

// ============================================
// HANDLE BOX CLICK
// ============================================
function handleBoxClick(e) {
    if (!gameActive) return;
    
    const box = e.currentTarget;
    const index = parseInt(box.getAttribute('data-index'));
    
    // Disable this box to prevent re-clicks
    box.disabled = true;
    
    if (index === ballPosition) {
        // ✅ CORRECT GUESS
        box.classList.add('correct');
        
        // Bonus points for remaining chances
        const pointsEarned = 10 * chances;
        score += pointsEarned;
        streak++;
        gameActive = false;
        
        feedback.textContent = `🎉 Amazing! +${pointsEarned} points! Streak: ${streak}`;
        feedback.className = 'feedback success';
        
        // Auto-reset after 2 seconds
        setTimeout(() => {
            initGame();
        }, 2000);
        
    } else {
        // ❌ WRONG GUESS
        box.classList.add('wrong');
        chances--;
        streak = 0; // Reset streak on wrong guess
        
        if (chances > 0) {
            // Still have chances left
            feedback.textContent = `❌ Not there! ${chances} chance${chances > 1 ? 's' : ''} left`;
            feedback.className = 'feedback error';
        } else {
            // GAME OVER
            gameActive = false;
            revealBall();
            feedback.textContent = `😢 Game Over! The ball was in box ${ballPosition + 1}`;
            feedback.className = 'feedback game-over';
            resetBtn.style.display = 'block';
        }
    }
    
    updateStats();
}

// ============================================
// REVEAL BALL POSITION (Game Over)
// ============================================
function revealBall() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => box.disabled = true);
    boxes[ballPosition].classList.add('correct');
}

// ============================================
// UPDATE STATS DISPLAY
// ============================================
function updateStats() {
    scoreEl.textContent = score;
    chancesEl.textContent = chances;
    streakEl.textContent = streak;
}

// ============================================
// RESET BUTTON HANDLER
// ============================================
resetBtn.addEventListener('click', () => {
    initGame();
});

// ============================================
// START GAME ON PAGE LOAD
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    // Check if all DOM elements exist
    if (!gameBoard || !feedback || !resetBtn || !scoreEl || !chancesEl || !streakEl) {
        console.error('Required DOM elements not found!');
        return;
    }
    
    initGame();
});

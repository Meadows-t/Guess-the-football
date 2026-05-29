// ==============================================
// GAME STATE
// ==============================================
let score = 0;
let level = 1;
let chances = 3;
let ballPosition = -1;
let gameActive = true;
const maxLevels = 5;

// ==============================================
// DOM ELEMENTS
// ==============================================
const gameBoard = document.getElementById('gameBoard');
const feedback = document.getElementById('feedback');
const resetBtn = document.getElementById('resetBtn');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const chancesEl = document.getElementById('chances');
const roundImage = document.getElementById('roundImage');

// ==============================================
// INITIALIZE GAME
// ==============================================
function initGame() {
    gameActive = true;
    chances = 3;
    ballPosition = Math.floor(Math.random() * 9);
    
    // Update round image
    updateRoundImage();
    
    // Clear and rebuild board
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const box = document.createElement('button');
        box.className = 'box';
        box.textContent = '?';
        box.setAttribute('data-index', i);
        box.setAttribute('aria-label', `Box ${i + 1}`);
        box.addEventListener('click', handleBoxClick);
        gameBoard.appendChild(box);
    }
    
    updateStats();
    feedback.textContent = `Round ${level} - Make your guess!`;
    feedback.className = 'feedback';
}

// ==============================================
// UPDATE ROUND IMAGE
// ==============================================
function updateRoundImage() {
    const imageNumber = Math.min(level, maxLevels);
    roundImage.src = `images/round${imageNumber}.jpg`;
    roundImage.alt = `Round ${imageNumber} background`;
    
    // Fallback if image fails to load
    roundImage.onerror = function() {
        console.warn(`Image round${imageNumber}.jpg not found`);
        this.style.display = 'none';
    };
}

// ==============================================
// HANDLE BOX CLICK
// ==============================================
function handleBoxClick(e) {
    if (!gameActive) return;
    
    const box = e.currentTarget;
    const index = parseInt(box.getAttribute('data-index'));
    
    // Disable this box
    box.disabled = true;
    
    if (index === ballPosition) {
        // ✅ CORRECT GUESS
        handleCorrectGuess(box);
    } else {
        // ❌ WRONG GUESS
        handleWrongGuess(box);
    }
    
    updateStats();
}

// ==============================================
// HANDLE CORRECT GUESS
// ==============================================
function handleCorrectGuess(box) {
    box.classList.add('correct');
    gameActive = false;
    
    // Clear box content and add ball image
    box.textContent = '';
    const ballImg = document.createElement('img');
    ballImg.src = 'images/ball_marker.png';
    ballImg.alt = 'Football found!';
    ballImg.className = 'ball-image';
    
    // Fallback if image fails
    ballImg.onerror = function() {
        box.textContent = '⚽';
    };
    
    box.appendChild(ballImg);
    
    // Calculate points (bonus for remaining chances)
    const pointsEarned = 10 * chances;
    score += pointsEarned;
    
    // Check if game is complete
    if (level >= maxLevels) {
        feedback.textContent = `🏆 Victory! Final Score: ${score} points!`;
        feedback.className = 'feedback victory';
        setTimeout(() => {
            if (confirm(`Congratulations! You scored ${score} points!\n\nPlay again?`)) {
                resetGame();
            }
        }, 1500);
    } else {
        feedback.textContent = `🎉 Found it! +${pointsEarned} points!`;
        feedback.className = 'feedback success';
        
        // Auto-advance to next level
        setTimeout(() => {
            level++;
            initGame();
        }, 2000);
    }
}

// ==============================================
// HANDLE WRONG GUESS
// ==============================================
function handleWrongGuess(box) {
    box.classList.add('wrong');
    box.textContent = '❌';
    chances--;
    
    if (chances > 0) {
        feedback.textContent = `❌ Wrong! ${chances} chance${chances > 1 ? 's' : ''} left`;
        feedback.className = 'feedback error';
    } else {
        // GAME OVER
        gameActive = false;
        revealBall();
        feedback.textContent = `😢 Game Over! Ball was in box ${ballPosition + 1}`;
        feedback.className = 'feedback game-over';
        
        setTimeout(() => {
            if (confirm(`Game Over! You reached Round ${level} with ${score} points.\n\nTry again?`)) {
                resetGame();
            }
        }, 1500);
    }
}

// ==============================================
// REVEAL BALL (Game Over)
// ==============================================
function revealBall() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach((box, index) => {
        box.disabled = true;
        if (index === ballPosition) {
            box.classList.add('correct');
            box.textContent = '';
            
            const ballImg = document.createElement('img');
            ballImg.src = 'images/ball_marker.png';
            ballImg.alt = 'Football location';
            ballImg.className = 'ball-image';
            
            ballImg.onerror = function() {
                box.textContent = '⚽';
            };
            
            box.appendChild(ballImg);
        }
    });
}

// ==============================================
// UPDATE STATS DISPLAY
// ==============================================
function updateStats() {
    scoreEl.textContent = score;
    levelEl.textContent = level;
    chancesEl.textContent = chances;
}

// ==============================================
// RESET GAME
// ==============================================
function resetGame() {
    score = 0;
    level = 1;
    chances = 3;
    initGame();
}

// ==============================================
// RESET BUTTON HANDLER
// ==============================================
resetBtn.addEventListener('click', () => {
    if (confirm('Start a new game? Your progress will be lost.')) {
        resetGame();
    }
});

// ==============================================
// START GAME ON PAGE LOAD
// ==============================================
window.addEventListener('DOMContentLoaded', () => {
    // Verify all required DOM elements exist
    if (!gameBoard || !feedback || !resetBtn || !scoreEl || !levelEl || !chancesEl || !roundImage) {
        console.error('Critical: Required DOM elements not found!');
        document.body.innerHTML = '<div style="padding:20px;text-align:center;"><h1>Error Loading Game</h1><p>Please refresh the page.</p></div>';
        return;
    }
    
    console.log('Game initialized successfully');
    initGame();
});

// ==============================================
// ERROR HANDLING
// ==============================================
window.addEventListener('error', (e) => {
    console.error('Runtime error:', e.message);
});

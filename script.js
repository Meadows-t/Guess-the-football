// ============================================
// HANDLE BOX CLICK (MODIFIED)
// ============================================
function handleBoxClick(e) {
    if (!gameActive) return;
    
    const box = e.currentTarget;
    const index = parseInt(box.getAttribute('data-index'));
    
    box.disabled = true;
    
    if (index === ballPosition) {
        // ✅ CORRECT GUESS
        box.classList.add('correct');
        
        // ⚡ NEW: Dynamically load ball image
        loadBallImage(box);
        
        const pointsEarned = 10 * chances;
        score += pointsEarned;
        streak++;
        gameActive = false;
        
        feedback.textContent = `🎉 Amazing! +${pointsEarned} points! Streak: ${streak}`;
        feedback.className = 'feedback success';
        
        setTimeout(() => {
            initGame();
        }, 2000);
        
    } else {
        // ❌ WRONG GUESS
        box.classList.add('wrong');
        chances--;
        streak = 0;
        
        if (chances > 0) {
            feedback.textContent = `❌ Not there! ${chances} chance${chances > 1 ? 's' : ''} left`;
            feedback.className = 'feedback error';
        } else {
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
// ⚡ NEW: LOAD BALL IMAGE INTO BOX
// ============================================
function loadBallImage(boxElement) {
    // Clear any existing content
    boxElement.innerHTML = '';
    
    // Create image element
    const img = document.createElement('img');
    
    // ⚠️ CRITICAL: Use relative path for GitHub Pages project sites
    img.src = 'images/ball_marker.png';
    img.alt = 'Football found!';
    img.style.width = '70%';
    img.style.height = '70%';
    img.style.objectFit = 'contain';
    img.style.animation = 'bounce 0.6s ease';
    
    boxElement.appendChild(img);
}

// ============================================
// REVEAL BALL POSITION (MODIFIED)
// ============================================
function revealBall() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => box.disabled = true);
    boxes[ballPosition].classList.add('correct');
    
    // ⚡ NEW: Show ball image on game over
    loadBallImage(boxes[ballPosition]);
}

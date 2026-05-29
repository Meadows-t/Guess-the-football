// Quiz rounds configuration: image path and true ball (x,y) coords for each round (placeholder values)
const rounds = [
  { image: "images/round1.jpg", ballX: 150, ballY: 100 },
  { image: "images/round2.jpg", ballX: 200, ballY: 180 },
  { image: "images/round3.jpg", ballX: 75,  ballY: 220 },
  { image: "images/round4.jpg", ballX: 300, ballY: 140 },
  { image: "images/round5.jpg", ballX: 250, ballY: 90 }
];
const markerImgSrc = "images/ball_marker.png";  // path to football icon for guess marker (placeholder)

// State variables
let currentRound = 0;
let totalScore = 0;
let roundActive = true;       // whether user can still move/confirm guess in current round
let guessMarker = null;       // <img> element for user's guess marker (football icon)
let actualMarker = null;      // <img> element for actual ball marker (shown after confirm)
let lineElement = null;       // <div> element for the red dotted line (shown after confirm)

// Get references to elements defined in HTML
const imageContainer  = document.getElementById("image-container");
const gameImage       = document.getElementById("game-image");
const roundNumSpan    = document.getElementById("round-num");
const scoreTotalSpan  = document.getElementById("score-total");
const instructionText = document.getElementById("instruction");
const confirmBtn      = document.getElementById("confirm-btn");
const nextBtn         = document.getElementById("next-btn");
const resultDiv       = document.getElementById("result");

// Initialize the game: set up first round
startRound(0);

// Function to set up a given round by index
function startRound(index) {
  currentRound = index;
  roundActive = true;
  // Update scoreboard round number and current total score
  roundNumSpan.textContent = currentRound + 1;
  scoreTotalSpan.textContent = totalScore;
  // Set the round image (by updating the src attribute)
  gameImage.src = rounds[currentRound].image;
  // Remove any leftover markers or lines from previous round
  if (guessMarker) { guessMarker.remove(); guessMarker = null; }
  if (actualMarker) { actualMarker.remove(); actualMarker = null; }
  if (lineElement) { lineElement.remove(); lineElement = null; }
  // Reset instruction and result text, adjust button visibility
  instructionText.style.display = "block";
  instructionText.textContent = 'Tap/click the image to place your guess, then press "Confirm Guess".';
  resultDiv.textContent = "";
  confirmBtn.style.display = "none";
  confirmBtn.disabled = true;
  nextBtn.style.display = "none";
}

// Event: user taps/clicks the image to place or move a guess
gameImage.addEventListener("click", function(event) {
  if (!roundActive) return;  // ignore if guess already confirmed for this round
  // Calculate click coordinates relative to the image container 
  const rect = imageContainer.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  // If guess marker exists, simply move it. Otherwise, create a new marker.
  if (guessMarker) {
    guessMarker.style.left = (clickX - 15) + "px";
    guessMarker.style.top  = (clickY - 15) + "px";
  } else {
    guessMarker = document.createElement("img");
    guessMarker.src = markerImgSrc;
    guessMarker.className = "marker guess";
    // Place marker centered at click position (offset by half the marker size, 15px)
    guessMarker.style.left = (clickX - 15) + "px";
    guessMarker.style.top  = (clickY - 15) + "px";
    imageContainer.appendChild(guessMarker);
  }
  // Now that a guess is placed, enable and show the Confirm button
  confirmBtn.disabled = false;
  confirmBtn.style.display = "inline-block";
});

// Event: user clicks "Confirm Guess" to finalize their guess for the round
confirmBtn.addEventListener("click", function() {
  if (!guessMarker) return;  // safety check: nothing to confirm if no guess
  roundActive = false;       // lock the round (prevent further repositioning)
  instructionText.style.display = "none"; // hide instruction text after confirming
  confirmBtn.style.display = "none";      // hide confirm button after use

  // Compute guess coordinates (marker center) within image container
  const guessCenterX = parseFloat(guessMarker.style.left) + 15;
  const guessCenterY = parseFloat(guessMarker.style.top) + 15;
  // Determine actual ball's displayed coordinates, factoring in any image scaling
  // We use naturalWidth/naturalHeight to get original image size and container width for scaling.
  const displayWidth = imageContainer.clientWidth;
  const displayHeight = imageContainer.clientHeight;
  const actualX = (rounds[currentRound].ballX / gameImage.naturalWidth) * displayWidth;
  const actualY = (rounds[currentRound].ballY / gameImage.naturalHeight) * displayHeight;

  // Calculate distance in pixels between guess and actual point (Euclidean)
  const dx = guessCenterX - actualX;
  const dy = guessCenterY - actualY;
  const distance = Math.sqrt(dx*dx + dy*dy);

  // Assign points based on distance (closer guess yields more points)
  let roundPoints = 0;
  if (distance < 20)       roundPoints = 10;
  else if (distance < 50)  roundPoints = 5;
  else if (distance < 100) roundPoints = 2;
  else                     roundPoints = 0;
  totalScore += roundPoints;
  scoreTotalSpan.textContent = totalScore;  // update score on scoreboard

  // Place marker for actual ball position (with red border to distinguish)
  actualMarker = document.createElement("img");
  actualMarker.src = markerImgSrc;
  actualMarker.className = "marker actual";
  actualMarker.style.left = (actualX - 15) + "px";
  actualMarker.style.top  = (actualY - 15) + "px";
  imageContainer.appendChild(actualMarker);

  // Draw a red dotted line from the guess to the actual ball for feedback
  const angle = Math.atan2(actualY - guessCenterY, actualX - guessCenterX);
  const distancePx = Math.sqrt(dx*dx + dy*dy);  // length of line
  lineElement = document.createElement("div");
  lineElement.className = "dotted-line";
  lineElement.style.width = distancePx + "px";
  lineElement.style.left  = guessCenterX + "px";
  lineElement.style.top   = guessCenterY + "px";
  lineElement.style.transform = "rotate(" + (angle * 180 / Math.PI) + "deg)";
  imageContainer.appendChild(lineElement);
  // Re-append markers to ensure they appear on top of the line (optional reordering)
  imageContainer.appendChild(guessMarker);
  imageContainer.appendChild(actualMarker);

  // Show round feedback and handle final vs non-final round UI
  if (currentRound === rounds.length - 1) {
    // Final round: calculate 1–5 final rating based on totalScore
    let finalRating;
    if (totalScore >= 40) finalRating = 5;
    else if (totalScore >= 30) finalRating = 4;
    else if (totalScore >= 20) finalRating = 3;
    else if (totalScore >= 10) finalRating = 2;
    else finalRating = 1;
    resultDiv.textContent = `Game Over! Total Score: ${totalScore}. Your final result: ${finalRating} out of 5.`;
    resultDiv.style.display = "block";
    nextBtn.style.display = "none";  // no next round button after final
  } else {
    // Not last round: show distance/points feedback and enable Next Round button
    resultDiv.textContent = `You were ${Math.round(distance)} px away, scoring ${roundPoints} point${roundPoints !== 1 ? 's' : ''} this round.`;
    resultDiv.style.display = "block";
    nextBtn.style.display = "inline-block";
  }
});

// Event: user clicks "Next Round" to proceed to the following round
nextBtn.addEventListener("click", function() {
  startRound(currentRound + 1);
});

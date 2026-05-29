// Quiz setup: images and true ball coordinates per round (placeholder values)
const rounds = [
  { image: "images/round1.jpg", ballX: 150, ballY: 100 },
  { image: "images/round2.jpg", ballX: 200, ballY: 180 },
  { image: "images/round3.jpg", ballX: 75,  ballY: 220 },
  { image: "images/round4.jpg", ballX: 300, ballY: 140 },
  { image: "images/round5.jpg", ballX: 250, ballY: 90 }
];
const markerImgSrc = "images/ball_marker.png";  // Football icon for markers (placeholder path)

let currentRound = 0;
let totalScore = 0;
let roundActive = true;       // allows guess placement until confirmed
let guessMarker, actualMarker, lineElement;

const imageContainer  = document.getElementById("image-container");
const gameImage       = document.createElement("img");      // create the image element in JS
gameImage.id          = "game-image";
gameImage.src         = rounds[currentRound].image;
gameImage.alt         = "Round image";
imageContainer.appendChild(gameImage);                      // append image into container
// (We create the <img> via script for clarity; could also place it directly in HTML.)

const roundNumSpan    = document.getElementById("round-num");
const scoreTotalSpan  = document.getElementById("score-total");
const instructionText = document.getElementById("instruction");
const confirmBtn      = document.getElementById("confirm-btn");
const nextBtn         = document.getElementById("next-btn");
const resultDiv       = document.getElementById("result");

// Initialize first round display
startRound(0);

function startRound(index) {
  currentRound = index;
  roundActive = true;
  // Set scoreboard and image for this round
  roundNumSpan.textContent = currentRound + 1;
  scoreTotalSpan.textContent = totalScore;
  gameImage.src = rounds[currentRound].image;
  // Remove old markers/lines
  if (guessMarker) { guessMarker.remove(); guessMarker = null; }
  if (actualMarker) { actualMarker.remove(); actualMarker = null; }
  if (lineElement) { lineElement.remove(); lineElement = null; }
  // Reset text and buttons for new round
  instructionText.style.display = "block";
  instructionText.textContent = 'Tap/click the image to place your guess, then press "Confirm Guess".';
  resultDiv.textContent = "";
  confirmBtn.style.display = "none";
  confirmBtn.disabled = true;
  nextBtn.style.display = "none";
}

// When user taps/clicks the image, (re)position the guess marker
gameImage.addEventListener("click", function(event) {
  if (!roundActive) return;  // ignore clicks after guess is confirmed
  // Coordinates relative to the image (offsetX/Y are relative to event.target, i.e., the <img>【1†L58-L66】)
  const clickX = event.offsetX;
  const clickY = event.offsetY;
  // Create or move the guess marker (football icon) centered at the clicked point
  const halfSize = 10;  // half the marker size (20px) for centering
  if (guessMarker) {
    // Marker exists, just move it
    guessMarker.style.left = (clickX - halfSize) + "px";
    guessMarker.style.top  = (clickY - halfSize) + "px";
  } else {
    // Create a new guess marker
    guessMarker = document.createElement("img");
    guessMarker.src = markerImgSrc;
    guessMarker.className = "marker guess";
    guessMarker.style.left = (clickX - halfSize) + "px";
    guessMarker.style.top  = (clickY - halfSize) + "px";
    imageContainer.appendChild(guessMarker);
  }
  // Enable and show Confirm button now that a guess is placed
  confirmBtn.disabled = false;
  confirmBtn.style.display = "inline-block";
});

// Confirm guess: finalize score and show feedback (actual position, line, points)
confirmBtn.addEventListener("click", function() {
  if (!guessMarker) return;
  roundActive = false;  // lock further guessing
  instructionText.style.display = "none";
  confirmBtn.style.display = "none";

  // Calculate guess coordinates (center of guess marker) in current image
  const guessX = parseFloat(guessMarker.style.left) + 10;
  const guessY = parseFloat(guessMarker.style.top) + 10;
  // Compute actual ball position relative to displayed image size
  const displayWidth = gameImage.clientWidth;
  const displayHeight = gameImage.clientHeight;
  const actualX = (rounds[currentRound].ballX / gameImage.naturalWidth) * displayWidth;
  const actualY = (rounds[currentRound].ballY / gameImage.naturalHeight) * displayHeight;
  // Calculate distance between guess and actual (Euclidean distance)
  const dx = guessX - actualX;
  const dy = guessY - actualY;
  const distance = Math.sqrt(dx*dx + dy*dy);
  // Score points based on distance thresholds (closer guess = more points)
  let roundPoints;
  if (distance < 20) roundPoints = 10;
  else if (distance < 50) roundPoints = 5;
  else if (distance < 100) roundPoints = 2;
  else roundPoints = 0;
  totalScore += roundPoints;
  scoreTotalSpan.textContent = totalScore;

  // Show actual ball marker (different style, red outline)
  actualMarker = document.createElement("img");
  actualMarker.src = markerImgSrc;
  actualMarker.className = "marker actual";
  actualMarker.style.left = (actualX - 10) + "px";
  actualMarker.style.top  = (actualY - 10) + "px";
  imageContainer.appendChild(actualMarker);

  // Draw a red dotted line between guess and actual positions
  const angle = Math.atan2(actualY - guessY, actualX - guessX);
  const lineLength = Math.sqrt(dx*dx + dy*dy);  // same as 'distance'
  lineElement = document.createElement("div");
  lineElement.className = "dotted-line";
  lineElement.style.width = lineLength + "px";
  lineElement.style.left  = guessX + "px";
  lineElement.style.top   = guessY + "px";
  lineElement.style.transform = "rotate(" + (angle * 180 / Math.PI) + "deg)";
  imageContainer.appendChild(lineElement);
  // Bring markers to front again (in case line overlaps them)
  imageContainer.appendChild(guessMarker);
  imageContainer.appendChild(actualMarker);

  // Display round feedback and handle final vs. intermediate round
  if (currentRound === rounds.length - 1) {
    // Final round: determine final rating out of 5
    let finalRating;
    if (totalScore >= 40) finalRating = 5;
    else if (totalScore >= 30) finalRating = 4;
    else if (totalScore >= 20) finalRating = 3;
    else if (totalScore >= 10) finalRating = 2;
    else finalRating = 1;
    resultDiv.textContent = `Game Over! You scored ${totalScore} points. Final result: ${finalRating} out of 5.`;
    nextBtn.style.display = "none";
  } else {
    resultDiv.textContent = `You were ${Math.round(distance)} px away; ${roundPoints} point(s) this round.`;
    nextBtn.style.display = "inline-block";
  }
  resultDiv.style.display = "block";
});

// Next round: set up the next image or end the game
nextBtn.addEventListener("click", function() {
  startRound(currentRound + 1);
});

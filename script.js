// Define the quiz rounds: each round has an image and the true ball coordinates (relative to the image's top-left corner).
// TODO: Replace the image file names and ball coordinates with your actual images and measured positions.
const rounds = [
  { image: "images/round1.jpg", ballX: 150, ballY: 100 }, // example coordinates (in pixels)
  { image: "images/round2.jpg", ballX: 200, ballY: 180 },
  { image: "images/round3.jpg", ballX: 75,  ballY: 220 },
  { image: "images/round4.jpg", ballX: 300, ballY: 140 },
  { image: "images/round5.jpg", ballX: 250, ballY: 90 }
];

// State variables to track current round and scores.
let currentRound = 0;
let totalScore = 0;
let roundActive = true;  // to prevent multiple clicks per round

// Get references to DOM elements.
const roundNumSpan = document.getElementById("round-num");
const scoreTotalSpan = document.getElementById("score-total");
const gameImage = document.getElementById("game-image");
const instructionText = document.getElementById("instruction");
const nextButton = document.getElementById("next-btn");
const resultDiv = document.getElementById("result");

// Start the game at round 0.
startRound(0);

// Function to initialize a given round (set image, update text, reset state).
function startRound(index) {
  currentRound = index;
  roundActive = true;
  // Update the round number and image source.
  roundNumSpan.textContent = currentRound + 1;  // Display 1-indexed round number
  gameImage.src = rounds[currentRound].image;
  // Clear any previous feedback and hide next button.
  resultDiv.style.display = "none";
  resultDiv.textContent = "";
  nextButton.style.display = "none";
  // Show the instruction text for the new round.
  instructionText.style.display = "block";
}

// Event handler for clicking on the game image.
gameImage.addEventListener("click", function (event) {
  if (!roundActive) return;  // ignore extra clicks if round already answered

  roundActive = false;       // disable further clicks for this round
  instructionText.style.display = "none"; // hide instruction after a guess

  // Compute click coordinates relative to the image.
  // offsetX and offsetY give the position of the click relative to the image's top-left corner.
  const clickX = event.offsetX;
  const clickY = event.offsetY;
  
  // Retrieve the actual ball position for this round (as defined in the rounds array).
  const actualX = rounds[currentRound].ballX;
  const actualY = rounds[currentRound].ballY;
  
  // Calculate the distance between the click and the actual ball position using the Euclidean distance formula.
  const dx = clickX - actualX;
  const dy = clickY - actualY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Scoring: Determine points for this round based on how close the guess was.
  let roundPoints;
  if (distance < 20) {
    roundPoints = 10;         // very close guess
  } else if (distance < 50) {
    roundPoints = 5;          // moderately close
  } else if (distance < 100) {
    roundPoints = 2;          // somewhat far
  } else {
    roundPoints = 0;          // very far off
  }
  
  // Update total score and UI.
  totalScore += roundPoints;
  scoreTotalSpan.textContent = totalScore;
  
  // Show round result feedback to the user.
  resultDiv.style.display = "block";
  if (currentRound === rounds.length - 1) {
    // If this was the last round, calculate final overall result (1 to 5 points).
    let finalRating;
    if (totalScore >= 40) {
      finalRating = 5;
    } else if (totalScore >= 30) {
      finalRating = 4;
    } else if (totalScore >= 20) {
      finalRating = 3;
    } else if (totalScore >= 10) {
      finalRating = 2;
    } else {
      finalRating = 1;
    }
    // Display the final result to the user.
    resultDiv.textContent = 
      "Game Over! You scored " + totalScore + " points in total. " +
      "Your final result is " + finalRating + " out of 5.";
    nextButton.style.display = "none";  // No next round, game ends here.
    // Optionally, you could also hide the image or offer a "Restart" button here.
  } else {
    // If not the last round, show feedback and reveal the Next Round button.
    resultDiv.textContent = "Round " + (currentRound + 1) + " complete! " +
      "You were " + Math.round(distance) + " pixels away and scored " + roundPoints + " points.";
    nextButton.style.display = "inline-block";
  }
  
  // Optionally, you can show a small marker on the image to indicate the actual ball position:
  // (Uncomment the following lines if you'd like to display a marker)
  /*
  const marker = document.createElement("div");
  marker.className = "marker";
  marker.style.left = actualX - 6 + "px"; // adjust by half marker width (approx 6px) so it centers on the position
  marker.style.top = actualY - 6 + "px";
  document.getElementById("image-container").appendChild(marker);
  */
});

// Event handler for Next Round button clicks.
nextButton.addEventListener("click", function () {
  // Proceed to the next round.
  startRound(currentRound + 1);
});
# Spot the Ball Quiz (Static Web Game)

**Spot the Ball Quiz** is a fun, mobile‑friendly game where you guess the hidden football (soccer ball) in a series of images. Built with **HTML, CSS, and JavaScript** and hosted on **GitHub Pages**, the game runs entirely in your browser — no accounts, no backend, no databases.

---

## 🎮 How to Play

1. **Rounds**  
   The game has **5 rounds**. Each round shows a football still image **with the ball removed**.

2. **Place Your Guess**  
   Tap or click on the image where you think the ball should be.  
   A small **football marker** appears. You can tap/click again to move it.

3. **Confirm Guess**  
   Press **Confirm Guess** to lock in your answer.

4. **See the Result**  
   - The **actual ball location** appears  
   - A **red dotted line** connects your guess to the real position  
   - You see how far away you were and how many points you scored

5. **Next Round**  
   Press **Next Round** to continue.

6. **Final Score**  
   After 5 rounds, your total score is converted into a **final rating from 1–5**  
   (5 = excellent accuracy).

---

## 🧠 Scoring

Points are awarded based on how close your guess is:

- Very close → **10 points**
- Close → **5 points**
- Somewhat close → **2 points**
- Far away → **0 points**

Your total score determines your final 1–5 rating.

---

## 📁 Project Structure.
├── index.html          # Main page
├── style.css           # Styling
├── script.js           # Game logic
└── images/
├── round1.jpg
├── round2.jpg
├── round3.jpg
├── round4.jpg
├── round5.jpg
└── ball_marker.png

---

## 🚀 Running the Game

### On GitHub Pages (Recommended)

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Select:
   - Branch: `main`
   - Folder: `/root`
4. Save and open the provided URL  
   Example:  
   `https://your-username.github.io/your-repo-name/`

### Locally

You can also run it locally by opening `index.html` in your browser.

---

## 🛠 Customising the Quiz

### 1. Change the Images
Replace the images in the `images/` folder:
images/round1.jpg
images/round2.jpg
...
images/round5.jpg

These should be football stills **with the ball removed**.

---

### 2. Set the Ball Positions

Open `script.js` and update the `rounds` array:

```js
const rounds = [
  { image: "images/round1.jpg", ballX: 150, ballY: 100 },
  { image: "images/round2.jpg", ballX: 200, ballY: 180 },
  ...
];

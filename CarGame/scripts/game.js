const bgMusic = new Audio("audio/background.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;

const crashSound = new Audio("audio/crash.mp3");
crashSound.volume = 1.0;

let crashed = false;

function startDriving() {
  crashed = false;
  crashSound.pause();
  crashSound.currentTime = 0;
  bgMusic.currentTime = 0;
  bgMusic.play().catch(err => {
    console.warn("Autoplay blockiert – warte auf Benutzerinteraktion.");
  });
}

function handleCrash() {
  if (crashed) return;
  crashed = true;
  bgMusic.pause();
  bgMusic.currentTime = 0;
  crashSound.pause();
  crashSound.currentTime = 0;
  crashSound.play().catch(err => console.warn("Crash sound play error:", err));
}

document.addEventListener("keydown", () => {
  if (!crashed && bgMusic.paused) {
    startDriving();
  }
}, { once: true });

document.addEventListener("click", () => {
  if (!crashed && bgMusic.paused) {
    startDriving();
  }
}, { once: true });

// === BILDER ===
const carImage = new Image();
carImage.src = "pics/car.png";

const enemyImage = new Image();
enemyImage.src = "pics/enemyCar.png";

window.handleCrash = handleCrash;
window.startDriving = startDriving;
window.carImage = carImage;
window.enemyImage = enemyImage;
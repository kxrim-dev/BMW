const car = document.getElementById("car");
const gameContainer = document.querySelector(".game-container");
const gameOverText = document.getElementById("game-over");
const startMessage = document.getElementById("start-message");

let carPositionX = 450;
let carPositionY = 200;
let speed = 5;
let gameStarted = false;
let carSpawnInterval;
let carSpeed = 3;
let survivalTime = 0;
let survivalInterval;
let highscore = 0;
highscore = localStorage.getItem("highscore") || 0;

const keys = {};

function moveCar() {
  if (!gameStarted) return;

  if ((keys["ArrowLeft"] || keys["a"]) && carPositionX > 30) {
    carPositionX -= speed;
  }
  if ((keys["ArrowRight"] || keys["d"]) && carPositionX < 900) {
    carPositionX += speed;
  }
  if ((keys["ArrowUp"] || keys["w"]) && carPositionY < 500) {
    carPositionY += speed;
  }
  if ((keys["ArrowDown"] || keys["s"]) && carPositionY > 0) {
    carPositionY -= speed;
  }

  car.style.left = carPositionX + "px";
  car.style.bottom = carPositionY + "px";

  requestAnimationFrame(moveCar);
}

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  if (e.key === "Enter" && !gameStarted) {
    startGame();
  } else if ((e.key === "r" || e.key === "R") && !gameStarted) {
    resetGame();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function createRandomCar() {
  const carLane = Math.random() * (gameContainer.clientWidth - 60); 
  const newCar = document.createElement("div");
  newCar.classList.add("other-car");
  newCar.style.left = carLane + "px"; 
  newCar.style.top = "-100px"; 
  newCar.style.width = "100px"; 
  newCar.style.height = "200px"; 
  newCar.style.backgroundImage = "url('enemyCar.png')"; 
  newCar.style.transform = "rotate(180deg)";
  newCar.style.position = "absolute"; 
  gameContainer.appendChild(newCar); 

  let carPosY = -100; 

  function moveRandomCar() {
    if (!gameStarted) return;

    carPosY += carSpeed;
    newCar.style.top = carPosY + "px";

    if (carPosY > gameContainer.clientHeight) {
      newCar.remove();
      return;
    }

    if (checkCollision(newCar)) {
      gameOver();
    } else {
      requestAnimationFrame(moveRandomCar);
    }
  }

  moveRandomCar();
}

function checkCollision(otherCar) {
  const carRect = car.getBoundingClientRect();
  const otherCarRect = otherCar.getBoundingClientRect();

  return !(carRect.right < otherCarRect.left || 
           carRect.left > otherCarRect.right || 
           carRect.bottom < otherCarRect.top || 
           carRect.top > otherCarRect.bottom);
}

function gameOver() {
  gameOverText.style.display = "block";
  gameStarted = false;
  clearInterval(carSpawnInterval);
  stopSurvivalTimer();
}

function startGame() {
  startMessage.style.display = "none";
  gameOverText.style.display = "none";
  gameStarted = true;
  startSurvivalTimer();
  carSpawnInterval = setInterval(createRandomCar, 2000);
  setInterval(() => {
    carSpeed += 1;
    speed += 0.1;
  }, 3000);
  requestAnimationFrame(moveCar);
}

function stopSurvivalTimer() {
  clearInterval(survivalInterval);

  if (survivalTime > highscore) {
    highscore = survivalTime;
    localStorage.setItem("highscore", highscore);
  }

  const finalScore = document.getElementById("final-score");
  finalScore.innerText = `Überlebenszeit: ${survivalTime}s | Highscore: ${highscore}s`;
}

function startSurvivalTimer() {
  survivalTime = 0;
  survivalInterval = setInterval(() => {
    survivalTime += 1;
  }, 1000);
}

function resetGame() {
  carPositionX = 450;
  carPositionY = 200;
  speed = 5;
  carSpeed = 3;
  document.querySelectorAll(".other-car").forEach(car => car.remove());
  survivalTime = 0;
  moveCar();
  startGame();
}

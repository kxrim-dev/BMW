const car = document.getElementById("car");
const gameContainer = document.querySelector(".game-container");
const gameOverText = document.getElementById("game-over");
const highscoreText = document.getElementById("high-score");
const startMessage = document.getElementById("start-message");

let carPositionX = 120;
let carPositionY = 400;
let speed = 10;
let moving = false;
let gameStarted = false;
let carSpawnInterval;
let carSpeed = 3;

function moveCar() {
  car.style.left = carPositionX + "px";
  car.style.bottom = carPositionY + "px";
}

function updatePosition() {
  if (moving) {
    moveCar();
    requestAnimationFrame(updatePosition);
  }
}

document.addEventListener("keydown", (e) => {
  if (!gameStarted) return;

  if (e.key === "ArrowLeft" && carPositionX > 30) {
    carPositionX -= speed;
    if (!moving) {
      moving = true;
      requestAnimationFrame(updatePosition);
    }
  } else if (e.key === "ArrowRight" && carPositionX < 900) {
    carPositionX += speed;
    if (!moving) {
      moving = true;
      requestAnimationFrame(updatePosition);
    }
  } else if (e.key === "ArrowUp" && carPositionY > 0) {
    carPositionY += speed;
    if (!moving) {
      moving = true;
      requestAnimationFrame(updatePosition);
    }
  } else if (e.key === "ArrowDown" && carPositionY < 500) {
    carPositionY -= speed;
    if (!moving) {
      moving = true;
      requestAnimationFrame(updatePosition);
    }
  }
});

function createRandomCar() {
  const carLane = Math.random() * (gameContainer.clientWidth - 60); 
  const newCar = document.createElement("div");
  newCar.classList.add("otherCar");
  newCar.style.left = carLane + "px"; 
  newCar.style.top = "-100px"; 
  newCar.style.width = "60px"; 
  newCar.style.height = "100px"; 
  newCar.style.backgroundColor = "red"; 
  newCar.style.position = "absolute"; 
  gameContainer.appendChild(newCar); 

  let carPosY = -100; 

  function moveRandomCar() {
    carPosY += carSpeed; 
    newCar.style.top = carPosY + "px"; 

    if (carPosY > gameContainer.clientHeight) {
      newCar.remove();
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
  moving = false;
  stopSurvivalTimer();
  clearInterval(carSpawnInterval);
}

function highscore() {
    highscoreTextisplay = "block";
    gameStarted = false;
    moving = false;
    clearInterval(carSpawnInterval);
  }

function startGame() {
  startMessage.style.display = "none";
  gameStarted = true;
  startSurvivalTimer();
  carSpawnInterval = setInterval(createRandomCar, 2000);
  setInterval(() => {
    carSpeed += 0.1;
    speed += 0.1;
  }, 3000);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !gameStarted) {
    startGame();
  }
});

let survivalTime = 0;
let survivalInterval;

function startSurvivalTimer() {
  survivalTime = 0;
  survivalInterval = setInterval(() => {
    survivalTime += 1;
    console.log(`Survival Time: ${survivalTime} seconds`);
  }, 1000);
}

function stopSurvivalTimer() {
  clearInterval(survivalInterval);
  survivalTime = document.getElementById("survival-time").innerText = survivalTime;
  console.log(`Final Survival Time: ${survivalTime} seconds`);
}



const car = document.getElementById("car");
const gameContainer = document.querySelector(".game-container");
const gameOverText = document.getElementById("game-over");
const startMessage = document.getElementById("start-message");

let carPositionX = 120;
let carPositionY = 400;
let speed = 10;
let moving = false;
let gameStarted = false;
let carSpawnInterval;
let carSpeed = 3;
let survivalTime = 0;
let survivalInterval;
let highscore = 0;
highscore = localStorage.getItem("highscore") || 0;


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
  moving = false;
  clearInterval(carSpawnInterval);
  stopSurvivalTimer();
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

function stopSurvivalTimer() {
  clearInterval(survivalInterval);

  if (survivalTime > highscore) {
    highscore = survivalTime;
    localStorage.setItem("highscore", highscore);
  }

  const finalScore = document.getElementById("final-score");
  finalScore.innerText = `Überlebenszeit: ${survivalTime}s | Highscore: ${highscore}s`;

  console.log(`Final Survival Time: ${survivalTime} seconds`);
}

function startSurvivalTimer() {
  survivalTime = 0;
  survivalInterval = setInterval(() => {
    survivalTime += 1;
    console.log(`Survival Time: ${survivalTime} seconds`);
  }, 1000);
}

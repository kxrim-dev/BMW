// === KLASSEN ===
class Hitbox {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Car {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.hitbox = new Hitbox(x, y, width, height);
  }
  draw(ctx) {
    if (window.carImage && window.carImage.complete) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(Math.PI / 2); // 270°
      ctx.drawImage(window.carImage, -this.height / 2, -this.width / 2, this.height, this.width);
      ctx.restore();
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  move() {
    // Bewegung wird jetzt in der Game-Loop gemacht
    this.x = lanes[playerLane];
    if (upPressed && this.y > 0) {
      this.y -= this.speed;
    }
    if (downPressed && this.y < canvas.height - this.height) {
      this.y += this.speed;
    }
    this.hitbox.x = this.x + this.width * 0.175;
    this.hitbox.y = this.y + this.height * 0.05;
    this.hitbox.width = this.width * 0.65;
    this.hitbox.height = this.height * 0.9;
  }
}

class EnemyCar {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.hitbox = new Hitbox(x, y, width, height);
  }
  draw(ctx) {
    if (window.enemyImage && window.enemyImage.complete) {
      ctx.drawImage(window.enemyImage, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = "gray";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  update() {
    this.y += this.speed;
    this.hitbox.x = this.x + this.width * 0.175;
    this.hitbox.y = this.y + this.height * 0.05;
    this.hitbox.width = this.width * 0.65;
    this.hitbox.height = this.height * 0.85;
  }
}

function checkCollision(a, b) {
  return (
    a.hitbox.x < b.hitbox.x + b.hitbox.width &&
    a.hitbox.x + a.hitbox.width > b.hitbox.x &&
    a.hitbox.y < b.hitbox.y + b.hitbox.height &&
    a.hitbox.y + a.hitbox.height > b.hitbox.y
  );
}

// === SPIELLOGIK ===

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  alert("Nicht eingeloggt – zurück zur Login-Seite");
  window.location.href = "login.html";
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const laneCount = 4;
const laneWidth = canvas.width / laneCount;
const carWidth = 100;
const carHeight = 95;
const lanes = [];

for (let i = 0; i < laneCount; i++) {
  lanes.push(i * laneWidth + (laneWidth - carWidth) / 2);
}

let playerLane = 1;
const playerCar = new Car(lanes[playerLane], 300, carWidth, carHeight, 5);
playerCar.hitbox.height *= 0.9;
playerCar.hitbox.width *= 0.65;

const enemyCars = [];
let enemySpawnTimer = 0;
let enemySpeed = 2;
let score = 0;
let gameRunning = true;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

// Taste gedrückt/losgelassen merken
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.code === "ArrowLeft" || e.code === "KeyA") leftPressed = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") rightPressed = true;
  if (e.code === "ArrowUp" || e.code === "KeyW") upPressed = true;
  if (e.code === "ArrowDown" || e.code === "KeyS") downPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") leftPressed = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") rightPressed = false;
  if (e.code === "ArrowUp" || e.code === "KeyW") upPressed = false;
  if (e.code === "ArrowDown" || e.code === "KeyS") downPressed = false;
});

// Lane-Wechsel in der Game-Loop
function handleLaneChange() {
  if (leftPressed && playerLane > 0) {
    playerLane--;
    leftPressed = false;
  }
  if (rightPressed && playerLane < laneCount - 1) {
    playerLane++;
    rightPressed = false;
  }
}

setInterval(() => {
  if (!gameRunning) return;
  score++;
  document.getElementById("score").textContent = "Score: " + score;
  if (enemySpeed < 10) enemySpeed += 0.1;
  sendHighscore(score); // Score immer senden
}, 500);

// Leaderboard regelmäßig abfragen
setInterval(() => {
  socket.send(JSON.stringify({ type: "getUsers" }));
}, 1000);

function spawnEnemy() {
  const laneIndex = Math.floor(Math.random() * lanes.length);
  const x = lanes[laneIndex];
  const enemy = new EnemyCar(x, -carHeight, carWidth, carHeight, enemySpeed);
  enemy.hitbox.height *= 0.85;
  enemy.hitbox.width *= 0.65;
  enemyCars.push(enemy);
}

function drawLanes() {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.setLineDash([15, 15]);
  for (let i = 1; i < lanes.length; i++) {
    const x = (lanes[i] + lanes[i - 1]) / 2 + 20;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function updateGame() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLanes();

  handleLaneChange(); // Lane-Wechsel hier!

  playerCar.move();
  playerCar.draw(ctx);

  enemySpawnTimer++;
  if (enemySpawnTimer > 90) {
    spawnEnemy();
    enemySpawnTimer = 0;
  }

  for (let i = enemyCars.length - 1; i >= 0; i--) {
    const enemy = enemyCars[i];
    enemy.update();
    enemy.draw(ctx);
    if (checkCollision(playerCar, enemy)) {
      gameOver();
      window.handleCrash && window.handleCrash();
    }
    if (enemy.y > canvas.height) {
      enemyCars.splice(i, 1);
    }
  }
  requestAnimationFrame(updateGame);
}

// WebSocket & Leaderboard
const socket = new WebSocket("ws://193.170.158.243:3000");
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "users") {
    updateLeaderboard(data.users);
  }
};

function sendHighscore(score) {
  socket.send(JSON.stringify({
    type: "updateScore",
    username: currentUser,
    score: score
  }));
}

function updateLeaderboard(users) {
  const leaderboard = Object.entries(users)
    .map(([name, data]) => ({ name, score: data.highscore ?? 0 }))
    .sort((a, b) => b.score - a.score);

  const leaderboardDiv = document.getElementById("leaderboard");
  leaderboardDiv.innerHTML = "";
  leaderboard.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "leaderboard-row" + (entry.name === currentUser ? " current-user" : "");
    row.innerHTML = `<span>${index + 1}. ${entry.name}</span> <span>${entry.score}</span>`;
    leaderboardDiv.appendChild(row);
  });
}

function gameOver() {
  gameRunning = false;
  const gameOverBox = document.createElement("div");
  gameOverBox.id = "gameOverBox";
  gameOverBox.innerHTML = `
      <h2>Game Over!</h2>
      <p>Score: ${score}</p>
      <button id="retryBtn">Try Again</button>
  `;
  document.body.appendChild(gameOverBox);
  document.getElementById("retryBtn").onclick = () => {
    document.body.removeChild(gameOverBox);
    resetGame();
  };
  sendHighscore(score);
}

function resetGame() {
  score = 0;
  enemyCars.length = 0;
  enemySpeed = 2;
  playerLane = 1;
  playerCar.x = lanes[playerLane];
  playerCar.y = 300;
  gameRunning = true;
  document.getElementById("score").textContent = "Score: 0";
  updateGame();
  if (window.startDriving) window.startDriving();
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Start the game loop
updateGame();
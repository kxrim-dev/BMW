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

setInterval(() => {
    if (!gameRunning) return;
    score++;
    document.getElementById("score").textContent = "Score: " + score;
    if (enemySpeed < 10) enemySpeed += 0.1;
}, 500);

function spawnEnemy() {
    const laneIndex = Math.floor(Math.random() * lanes.length);
    const x = lanes[laneIndex];
    const enemy = new EnemyCar(x, -carHeight, carWidth, carHeight, enemySpeed);
    enemy.hitbox.height *= 0.85;
    enemy.hitbox.width *= 0.65;
    enemyCars.push(enemy);
}

function checkCollision(a, b) {
    return (
        a.hitbox.x < b.hitbox.x + b.hitbox.width &&
        a.hitbox.x + a.hitbox.width > b.hitbox.x &&
        a.hitbox.y < b.hitbox.y + b.hitbox.height &&
        a.hitbox.y + a.hitbox.height > b.hitbox.y
    );
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
        document.location.reload();
    };
}

function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLanes();

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
            return;
        }

        if (enemy.y > canvas.height) {
            enemyCars.splice(i, 1);
        }
    }

    requestAnimationFrame(updateGame);
}

updateGame();

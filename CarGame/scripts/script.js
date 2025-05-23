const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  alert("Nicht eingeloggt – zurück zur Login-Seite");
  window.location.href = "login.html";
}

const socket = new WebSocket("ws://localhost:3000");

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
    row.textContent = `#${index + 1} – ${entry.name}: ${entry.score}`;
    if (entry.name === currentUser) {
      row.style.color = "gold";
      row.style.fontWeight = "bold";
    }
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
    document.location.reload();
    startDriving();
  };

  sendHighscore(score);
}
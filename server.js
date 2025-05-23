const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const DATA_FILE = path.join(__dirname, "CarGame", "data", "userData.json");

app.use(express.static(__dirname));
app.use(express.json());

wss.on("connection", (ws) => {
  console.log("📡 Neuer WebSocket-Client verbunden");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    const type = data.type;

    if (type === "getUsers") {
      try {
        const users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        ws.send(JSON.stringify({ type: "users", users }));
      } catch (err) {
        console.error("Fehler beim Lesen der userData.json:", err);
      }
    }

    if (type === "updateScore") {
      const { username, score } = data;
      try {
        let users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        if (users[username] && typeof score === "number") {
          if (score > (users[username].highscore ?? 0)) {
            users[username].highscore = score;
            fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
            console.log(`🔥 Highscore für ${username} auf ${score} gesetzt`);
          }
        }

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "users", users }));
          }
        });
      } catch (err) {
        console.error("Fehler beim Schreiben in userData.json:", err);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server läuft mit WebSocket unter http://localhost:${PORT}`);
});
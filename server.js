// ==== server.js (mit WebSocket) ====
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

  // Beim Verbinden gleich Daten schicken
  try {
    const users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    ws.send(JSON.stringify({ type: "users", users }));
  } catch (err) {
    console.error("Fehler beim Initiallesen der userData.json:", err);
  }

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

app.post("/api/users", (req, res) => {
  const { username, password, score, register } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username fehlt" });
  }

  let users = {};

  if (!fs.existsSync(DATA_FILE)) {
    console.log("⚠️  userData.json nicht gefunden – wird neu erstellt.");
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
  }

  try {
    users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    console.error("❌ Fehler beim Parsen der userData.json:", err);
    users = {};
  }

  if (register) {
    if (users[username]) {
      return res.status(409).json({ error: "Benutzername bereits vergeben" });
    }
    users[username] = { password, highscore: 0 };
    console.log(`✅ Neuer Benutzer registriert: ${username}`);
  } else {
    if (!users[username]) {
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }

    if (password && users[username].password !== password) {
      return res.status(401).json({ error: "Falsches Passwort" });
    }

    if (typeof score === "number") {
      const current = users[username].highscore ?? 0;
      if (score > current) {
        users[username].highscore = score;
        console.log(`🔥 Highscore für ${username} auf ${score} gesetzt`);
      }
    }
  }

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("Fehler beim Schreiben in userData.json:", err);
    res.status(500).json({ error: "Fehler beim Speichern" });
  }
});

server.listen(PORT, () => {
  console.log(`✅ Server läuft mit WebSocket unter http://localhost:${PORT}`);
});
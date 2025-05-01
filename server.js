const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "CarGame", "data", "userData.json");

app.use(express.static(__dirname));

app.use(express.json());

app.get("/api/users", (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    res.json(users);
  } catch (err) {
    console.error("Fehler beim Lesen der userData.json:", err);
    res.status(500).json({ error: "Serverfehler beim Laden der Benutzerdaten" });
  }
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
  }

  else {
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

app.listen(PORT, () => {
  console.log(`✅ Server läuft unter http://localhost:${PORT}`);
});

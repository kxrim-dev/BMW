const form = document.getElementById("authForm");
const registerBtn = document.getElementById("registerBtn");
const messageBox = document.getElementById("message");

function showMessage(text, isError = false) {
    messageBox.textContent = text;
    messageBox.style.color = isError ? "tomato" : "lightgreen";
    messageBox.style.visibility = "visible";
    setTimeout(() => {
      messageBox.style.visibility = "hidden";
    }, 3000);
  }
  

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    showMessage("Bitte alle Felder ausfüllen!", true);
    return;
  }

  try {
    const res = await fetch("/api/users");
    const users = await res.json();

    if (!users[username] || users[username].password !== password) {
      showMessage("❌ Falsche Login-Daten!", true);
      return;
    }

    localStorage.setItem("currentUser", username);
    window.location.href = "index.html";
  } catch (err) {
    showMessage("Serverfehler beim Login!", true);
    console.error(err);
  }
});

registerBtn.addEventListener("click", async () => {
  const username = document.querySelector('.sign-up-form input[placeholder="Benutzername"]').value.trim();
  const password = document.querySelector('.sign-up-form input[placeholder="Passwort"]').value;

  if (!username || !password) {
    showMessage("Bitte alle Felder ausfüllen!", true);
    return;
  }

  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, register: true }),
    });

    if (res.status === 409) {
      showMessage("Benutzername bereits vergeben!", true);
      return;
    }

    showMessage("Registrierung erfolgreich!");
  } catch (err) {
    showMessage("Serverfehler bei Registrierung!", true);
    console.error(err);
  }
});


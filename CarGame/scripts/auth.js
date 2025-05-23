document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("authForm");
  const registerForm = document.getElementById("registerForm");
  const loginMessage = document.getElementById("login-message");
  const registerMessage = document.getElementById("register-message");

  function showMessage(element, text, isError = false) {
    element.textContent = text;
    element.classList.remove("success", "error");
    element.classList.add(isError ? "error" : "success");
    element.style.display = "block";

    setTimeout(() => {
      element.style.display = "none";
    }, 1500);
  }

  // LOGIN
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      showMessage(loginMessage, "Bitte alle Felder ausfüllen!", true);
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, register: false }),
      });

      const result = await res.json();

      if (!res.ok) {
        const msg = result.error || "❌ Login fehlgeschlagen";
        showMessage(loginMessage, msg, true);
        return;
      }

      localStorage.setItem("currentUser", username);
      showMessage(loginMessage, "✅ Login erfolgreich!");
      setTimeout(() => window.location.href = "index.html", 1500);
    } catch (err) {
      console.error(err);
      showMessage(loginMessage, "❌ Serverfehler beim Login", true);
    }
  });


  // REGISTER
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = registerForm.querySelector('input[placeholder="Benutzername"]').value.trim();
    const password = registerForm.querySelector('input[placeholder="Passwort"]').value;

    if (!username || !password) {
      showMessage(registerMessage, "Bitte alle Felder ausfüllen!", true);
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, register: true }),
      });

      if (res.status === 409) {
        showMessage(registerMessage, "❌ Benutzername schon vergeben", true);
        return;
      }

      if (!res.ok) {
        showMessage(registerMessage, "❌ Fehler bei Registrierung", true);
        return;
      }

      localStorage.setItem("currentUser", username);
      showMessage(registerMessage, "✅ Registrierung erfolgreich!");
      setTimeout(() => window.location.href = "index.html", 1500);
    } catch (err) {
      console.error(err);
      showMessage(registerMessage, "❌ Serverfehler bei Registrierung", true);
    }
  });
});

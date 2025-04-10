document.addEventListener("DOMContentLoaded", async () => {
    const input = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("resultsContainer");

    // Lade die automatisch generierte Liste
    const pages = await fetch("../scripts/pages.json").then(res => res.json());

    input.addEventListener("input", async () => {
        const query = input.value.toLowerCase().trim();
        if (query === "") {
            location.reload(); // zurücksetzen
            return;
        }

        resultsContainer.innerHTML = "<p>Suche läuft...</p>";
        const results = [];

        for (const url of pages) {
            try {
                const response = await fetch(`../${url}`);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, "text/html");

                const title = doc.querySelector("title")?.innerText || url;
                const bodyText = doc.body.innerText.toLowerCase();

                if (bodyText.includes(query)) {
                    const snippet = bodyText.substring(bodyText.indexOf(query), bodyText.indexOf(query) + 200).replace(/\s+/g, ' ') + "...";
                    results.push({ title, url: `../${url}`, snippet });
                }
            } catch (e) {
                console.error("Fehler beim Laden:", url, e);
            }
        }

        if (results.length === 0) {
            resultsContainer.innerHTML = "<p>Keine Ergebnisse gefunden.</p>";
        } else {
            resultsContainer.innerHTML = "";
            results.forEach(res => {
                const card = document.createElement("div");
                card.className = "card mb-3";
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${res.title}</h5>
                        <p class="card-text">${res.snippet}</p>
                        <a href="${res.url}" class="btn btn-primary">Zur Seite</a>
                    </div>
                `;
                resultsContainer.appendChild(card);
            });
        }
    });
});

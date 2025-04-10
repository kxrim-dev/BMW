document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("results");

    const pages = [
        { url: "../index.html" },
        { url: "../bmw-car/x-models.html" },
        { url: "../bmw-car/engines.html" },
        { url: "../bmw-car/e-models.html" },
        { url: "../bmw-car/special.html" },
        { url: "../bmw-car/index.html" },
        { url: "../infos-bmw/index.html" },
        { url: "../infos-bmw/history.html" },
        { url: "../infos-bmw/sustainability.html" },
        { url: "../infos-bmw/cooperation.html" },
        { url: "../about-us/index.html" }
    ];

    input.addEventListener("input", async () => {
        const query = input.value.toLowerCase().trim();
        resultsContainer.innerHTML = "";

        if (query === "") return;

        const results = [];

        for (const page of pages) {
            try {
                const response = await fetch(page.url);
                const text = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(text, "text/html");

                const title = doc.querySelector("title")?.innerText || page.url;
                const bodyText = doc.body.innerText.toLowerCase();

                if (bodyText.includes(query)) {
                    const snippetIndex = bodyText.indexOf(query);
                    const snippet = bodyText.substring(snippetIndex, snippetIndex + 200) + "...";

                    results.push({
                        title: title,
                        url: page.url,
                        snippet: snippet
                    });
                }
            } catch (err) {
                console.error("Fehler beim Laden:", page.url, err);
            }
        }

        if (results.length === 0) {
            resultsContainer.innerHTML = "<p>Keine Ergebnisse gefunden.</p>";
        } else {
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

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('form');
    const searchInput = document.querySelector('input[type="search"]');
    const resultContainer = document.getElementById("search-results");

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        resultContainer.style.display = "none";
        resultContainer.innerHTML = '';

        try {
            const response = await fetch('../data/index.json');
            const data = await response.json();

            const results = data.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            );

            if (results.length === 0) {
                resultContainer.innerHTML = '<p class="text-white">Keine Ergebnisse gefunden.</p>';
                resultContainer.style.display = "block";
                return;
            }

            const row = document.createElement('div');
            row.className = 'row g-4';

            results.forEach(result => {
                const col = document.createElement('div');
                col.className = 'col-lg-3 col-md-4 col-sm-6';

                col.innerHTML = `
                    <div class="card bg-dark text-white h-100">
                        <div class="card-body">
                            <h5 class="card-title">${result.title}</h5>
                            <p class="card-text clamp-2">${result.description}</p>
                            <a href="${result.link}" class="btn btn-outline-light btn-sm">Zur Seite</a>
                        </div>
                    </div>
                `;

                row.appendChild(col);
            });

            resultContainer.appendChild(row);
            resultContainer.style.display = "block";
            resultContainer.scrollIntoView({ behavior: "smooth" });

        } catch (err) {
            console.error("Fehler beim Laden der Daten:", err);
            resultContainer.innerHTML = '<p class="text-danger">Fehler beim Laden der Ergebnisse.</p>';
            resultContainer.style.display = "block";
        }
    });
});

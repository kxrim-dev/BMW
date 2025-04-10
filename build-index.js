const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const directories = ["bmw-car", "infos-bmw", "about-us"];
const output = [];
const basePath = "./";

directories.forEach((dir) => {
    const dirPath = path.join(basePath, dir);
    fs.readdirSync(dirPath).forEach(file => {
        if (file.endsWith(".html")) {
            const filePath = path.join(dirPath, file);
            const html = fs.readFileSync(filePath, "utf-8");
            const dom = new JSDOM(html);
            const doc = dom.window.document;

            const title = doc.querySelector("title")?.textContent.trim() || file;

            // 🔄 Alle Karten-Titel und Texte sammeln
            const cards = [...doc.querySelectorAll(".card")];
            const descriptions = cards.map(card => {
                const cardTitle = card.querySelector(".card-title")?.textContent.trim() || "";
                const cardText = card.querySelector(".card-text")?.textContent.trim() || "";
                return `${cardTitle}: ${cardText}`;
            }).filter(Boolean);

            // Falls keine Karten gefunden wurden: versuch's mit <meta name="description">
            const description = descriptions.length > 0
                ? descriptions.join(" | ")
                : doc.querySelector("meta[name='description']")?.getAttribute("content") || "";

            output.push({
                title,
                description: description.trim(),
                link: path.join(dir, file).replace(/\\/g, "/")
            });
        }
    });
});

// 📁 "data"-Ordner anlegen, falls noch nicht vorhanden
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/index.json", JSON.stringify(output, null, 2));
console.log("✅ index.json erstellt mit", output.length, "Einträgen.");

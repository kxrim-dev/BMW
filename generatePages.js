const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, "../");
const outputFile = path.resolve(__dirname, "pages.json");

const pages = [];

function walk(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith(".html")) {
            const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
            pages.push(relativePath);
        }
    }
}

walk(baseDir);

fs.writeFileSync(outputFile, JSON.stringify(pages, null, 2));
console.log(`✅ ${pages.length} HTML-Seiten gefunden und in pages.json gespeichert.`);

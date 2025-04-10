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
            const card = doc.querySelector(".card");
            const description = card
                ? card.querySelector(".card-text")?.textContent.trim()
                : doc.querySelector("meta[name='description']")?.getAttribute("content") || "";

            output.push({
                title,
                description,
                link: path.join(dir, file).replace(/\\/g, "/")
            });
        }
    });
});

fs.writeFileSync("data/index.json", JSON.stringify(output, null, 2));
console.log("✅ index.json erstellt mit", output.length, "Einträgen.");

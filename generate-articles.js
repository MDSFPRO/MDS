const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const marked = require("marked");

// Helper pour générer le HTML à partir d'un .md + template
function generateHtml(mdPath, templatePath, destDir) {
  const mdText = fs.readFileSync(mdPath, "utf-8");
  const template = fs.readFileSync(templatePath, "utf-8");

  const match = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/m.exec(mdText);
  if (!match) throw new Error(`Frontmatter invalide dans ${mdPath}`);
  const front = yaml.load(match[1]);
  const bodyMd = match[2];

  let html = template;
  html = html.replace(/id="article-title">.*?</, `id="article-title">${front.title || ""}<`);
  html = html.replace(/id="article-date">.*?</, `id="article-date">${(front.date || "").split('T')[0]}<`);
  html = html.replace(/id="article-summary">.*?</, `id="article-summary">${front.summary || ""}<`);
  html = html.replace(/id="article-image" src=".*?"/, `id="article-image" src="${front.image || "../../images/articles/default.jpg"}"`);
  html = html.replace(/id="article-body">[\s\S]*?<\/article>/, `id="article-body">${marked.parse(bodyMd)}</article>`);

  const destName = path.basename(mdPath, ".md") + ".html";
  fs.writeFileSync(path.join(destDir, destName), html);
}

// Génère pour tous les actu
fs.readdirSync("./articles/actu").filter(f => f.endsWith(".md")).forEach(file => {
  generateHtml(
    `./articles/actu/${file}`,
    "./templates/template-actu.html",
    "./articles/actu"
  );
});

// Génère pour tous les conseil
fs.readdirSync("./articles/conseil").filter(f => f.endsWith(".md")).forEach(file => {
  generateHtml(
    `./articles/conseil/${file}`,
    "./templates/template-conseil.html",
    "./articles/conseil"
  );
});

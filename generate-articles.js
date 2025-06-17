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
  // Injection frontmatter
  html = html.replace(/id="article-title">.*?</, `id="article-title">${front.title || ""}<`);
  
  // Correction ici : gestion date string ou object
  let dateStr = "";
  if (front.date) {
    dateStr = typeof front.date === "string"
      ? front.date.split('T')[0]
      : new Date(front.date).toISOString().split('T')[0];
  }
  html = html.replace(/id="article-date">.*?</, `id="article-date">${dateStr}<`);

  html = html.replace(/id="article-summary">.*?</, `id="article-summary">${front.summary || ""}<`);
  // Image : toujours chemin absolu MDS
  html = html.replace(/id="article-image" src=".*?"/, `id="article-image" src="${front.image ? `/MDS/${front.image.replace(/^\/|MDS\//, "")}` : "/MDS/images/articles/default.jpg"}"`);
  // Contenu markdown
  html = html.replace(/id="article-body">[\s\S]*?<\/article>/, `id="article-body">${marked.parse(bodyMd)}</article>`);

  const destName = path.basename(mdPath, ".md") + ".html";
  fs.writeFileSync(path.join(destDir, destName), html);
}

// Génère pour tous les actu
fs.readdirSync("./articles/actu").filter(f => f.endsWith(".md")).forEach(file => {
  generateHtml(
    `./articles/actu/${file}`,
    "./articles/templates/template-actu.html",
    "./articles/actu"
  );
});

// Génère pour tous les Conseil (majuscule !)
fs.readdirSync("./articles/Conseil").filter(f => f.endsWith(".md")).forEach(file => {
  generateHtml(
    `./articles/Conseil/${file}`,
    "./articles/templates/template-conseil.html",
    "./articles/Conseil"
  );
});

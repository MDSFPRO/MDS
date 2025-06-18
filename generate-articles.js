const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const marked = require("marked");
const { JSDOM } = require("jsdom");

function generateHtml(mdPath, templatePath, destDir) {
  const mdText = fs.readFileSync(mdPath, "utf-8");
  const template = fs.readFileSync(templatePath, "utf-8");

  const match = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/m.exec(mdText);
  if (!match) throw new Error(`Frontmatter invalide dans ${mdPath}`);
  const front = yaml.load(match[1]);
  const bodyMd = match[2];

  // Utilise jsdom pour manipuler le HTML du template
  const dom = new JSDOM(template);
  const document = dom.window.document;

  // Injection frontmatter
  document.title = `${front.title} – Marc Da Silva`;
  document.getElementById("page-title").textContent = `${front.title} – Marc Da Silva`;
  document.getElementById("meta-desc").setAttribute('content', front.summary || "");
  document.getElementById("article-title").textContent = front.title || "";
  document.getElementById("article-date").textContent = front.date
    ? (typeof front.date === "string" ? front.date.split('T')[0] : new Date(front.date).toISOString().split('T')[0])
    : "";
  document.getElementById("article-summary").textContent = front.summary || "";
  document.getElementById("article-image").src = front.image ? `/MDS/${front.image.replace(/^\/|MDS\//, "")}` : "/MDS/images/articles/default.jpg";
  document.getElementById("article-body").innerHTML = marked.parse(bodyMd);

  const destName = path.basename(mdPath, ".md") + ".html";
  fs.writeFileSync(path.join(destDir, destName), dom.serialize());
}

// Génère pour tous les actu
fs.readdirSync("./articles/actu").filter(f => f.endsWith(".md")).forEach(file => {
  generateHtml(
    `./articles/actu/${file}`,
    "./articles/templates/template-actu.html",
    "./articles/actu"
  );
});

// Génère pour tous les Conseil
fs.readdirSync("./articles/Conseil").filter(f => f.endsWith(".md")).forEach(file => {
  generateHtml(
    `./articles/Conseil/${file}`,
    "./articles/templates/template-conseil.html",
    "./articles/Conseil"
  );
});

// Après la génération des .html...

function slugFromFilename(folder, file) {
  return `${folder}/${path.basename(file, '.md')}`;
}

function extractFrontmatter(mdPath) {
  const mdText = fs.readFileSync(mdPath, "utf-8");
  const match = /^---\n([\s\S]+?)\n---/m.exec(mdText);
  if (!match) throw new Error(`Frontmatter invalide dans ${mdPath}`);
  return yaml.load(match[1]);
}

let articles = [];

// Pour Conseil
fs.readdirSync("./articles/Conseil").filter(f => f.endsWith(".md")).forEach(file => {
  const front = extractFrontmatter(`./articles/Conseil/${file}`);
  articles.push({
    title: front.title || "",
    date: (typeof front.date === "string" ? front.date.split('T')[0] : new Date(front.date).toISOString().split('T')[0]) || "",
    category: front.category || "Conseil IT",
    summary: front.summary || "",
    image: (front.image || "images/articles/default.jpg").replace(/^\/?MDS\//, ""),
    slug: slugFromFilename("Conseil", file)
  });
});

// Pour Actu
fs.readdirSync("./articles/actu").filter(f => f.endsWith(".md")).forEach(file => {
  const front = extractFrontmatter(`./articles/actu/${file}`);
  articles.push({
    title: front.title || "",
    date: (typeof front.date === "string" ? front.date.split('T')[0] : new Date(front.date).toISOString().split('T')[0]) || "",
    category: front.category || "Actualité",
    summary: front.summary || "",
    image: (front.image || "images/articles/default.jpg").replace(/^\/?MDS\//, ""),
    slug: slugFromFilename("actu", file)
  });
});

// Trie par date décroissante (plus récent en premier)
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

// Génère le fichier articles.json
fs.writeFileSync("./articles/articles.json", JSON.stringify(articles, null, 2), "utf-8");


const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const marked = require("marked");
const { JSDOM } = require("jsdom");

// Fonction robuste d'extraction frontmatter (supporte \n et \r\n)
function extractFrontmatter(mdPath) {
  const mdText = fs.readFileSync(mdPath, "utf-8");
  const match = /^---\r?\n([\s\S]+?)\r?\n---/m.exec(mdText);
  if (!match) {
    console.log('Frontmatter invalide dans', mdPath);
    console.log(mdText.slice(0, 120)); // Affiche début du fichier pour debug
    throw new Error(`Frontmatter invalide dans ${mdPath}`);
  }
  return yaml.load(match[1]);
}

// Suppression des .html orphelins (si le .md n'existe plus)
function cleanOrphanHtml(dir) {
  const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith(".html"));
  htmlFiles.forEach(htmlFile => {
    const mdFile = htmlFile.replace(/\.html$/, ".md");
    if (!fs.existsSync(path.join(dir, mdFile))) {
      fs.unlinkSync(path.join(dir, htmlFile));
      console.log(`Suppression de l'HTML orphelin : ${path.join(dir, htmlFile)}`);
    }
  });
}

// Nettoyage AVANT génération
cleanOrphanHtml("./articles/conseil");
cleanOrphanHtml("./articles/actu");

// Génération d'un article HTML à partir d'un .md
function generateHtml(mdPath, templatePath, destDir) {
  const mdText = fs.readFileSync(mdPath, "utf-8");
  const template = fs.readFileSync(templatePath, "utf-8");
  const match = /^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/m.exec(mdText);
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
    ? (typeof front.date === "string" ? front.date.slice(0, 10) : new Date(front.date).toISOString().slice(0, 10))
    : "";
  document.getElementById("article-summary").textContent = front.summary || "";
  document.getElementById("article-image").src = front.image ? `/MDS/${front.image.replace(/^\/|MDS\//, "")}` : "/MDS/images/articles/default.jpg";
  document.getElementById("article-body").innerHTML = marked.parse(bodyMd);

  const destName = path.basename(mdPath, ".md") + ".html";
  fs.writeFileSync(path.join(destDir, destName), dom.serialize());
}

// Debug : affiche les fichiers trouvés
console.log("Fichiers conseil :", fs.readdirSync("./articles/conseil"));
console.log("Fichiers actu :", fs.readdirSync("./articles/actu"));

// Génère pour tous les actu
fs.readdirSync("./articles/actu").filter(f => f.endsWith(".md")).forEach(file => {
  try {
    generateHtml(
      `./articles/actu/${file}`,
      "./articles/templates/template-actu.html",
      "./articles/actu"
    );
  } catch (e) {
    console.log("Erreur de génération HTML (actu):", file, e.message);
  }
});

// Génère pour tous les conseil
fs.readdirSync("./articles/conseil").filter(f => f.endsWith(".md")).forEach(file => {
  try {
    generateHtml(
      `./articles/conseil/${file}`,
      "./articles/templates/template-conseil.html",
      "./articles/conseil"
    );
  } catch (e) {
    console.log("Erreur de génération HTML (conseil):", file, e.message);
  }
});

// Fonction pour générer le slug
function slugFromFilename(folder, file) {
  return `${folder}/${path.basename(file, '.md')}`;
}

let articles = [];

// Remplissage JSON - Conseil
fs.readdirSync("./articles/conseil").filter(f => f.endsWith(".md")).forEach(file => {
  try {
    const front = extractFrontmatter(`./articles/conseil/${file}`);
    articles.push({
      title: front.title || "",
      // Date complète (YYYY-MM-DDTHH:mm) pour un tri précis mais lisible
      date: (typeof front.date === "string"
        ? front.date.slice(0,16)
        : new Date(front.date).toISOString().slice(0,16)
      ) || "",
      category: front.category || "Conseil IT",
      summary: front.summary || "",
      image: (front.image || "images/articles/default.jpg").replace(/^\/?MDS\//, ""),
      slug: slugFromFilename("conseil", file)
    });
  } catch (e) {
    console.log("Erreur de frontmatter (conseil):", file, e.message);
  }
});

// Remplissage JSON - Actu
fs.readdirSync("./articles/actu").filter(f => f.endsWith(".md")).forEach(file => {
  try {
    const front = extractFrontmatter(`./articles/actu/${file}`);
    articles.push({
      title: front.title || "",
      date: (typeof front.date === "string"
        ? front.date.slice(0,16)
        : new Date(front.date).toISOString().slice(0,16)
      ) || "",
      category: front.category || "Actualité",
      summary: front.summary || "",
      image: (front.image || "images/articles/default.jpg").replace(/^\/?MDS\//, ""),
      slug: slugFromFilename("actu", file)
    });
  } catch (e) {
    console.log("Erreur de frontmatter (actu):", file, e.message);
  }
});

// Trie par date décroissante (fonctionne maintenant à la minute près)
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

// Génère le fichier articles.json
fs.writeFileSync("./articles/articles.json", JSON.stringify(articles, null, 2), "utf-8");

// Pour debug : affiche la taille finale du tableau JSON généré
console.log("Nombre d'articles dans le JSON :", articles.length);

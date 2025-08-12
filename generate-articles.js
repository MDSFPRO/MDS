// generate-articles.js
// Convertit les .md (Decap) en HTML avec template + génère articles.json
// - Préfixe automatiquement /MDS/ sur tous les assets internes dans le corps (img, a, video, source, srcset…)
// - Normalise l'image de couverture
// - Nettoie les HTML orphelins

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const marked = require("marked");
const { JSDOM } = require("jsdom");

// ---------- Utils ----------

// Frontmatter: supporte \n et \r\n
function extractFrontmatter(mdPath) {
  const mdText = fs.readFileSync(mdPath, "utf-8");
  const match = /^---\r?\n([\s\S]+?)\r?\n---/m.exec(mdText);
  if (!match) {
    console.log("Frontmatter invalide dans", mdPath);
    console.log(mdText.slice(0, 120));
    throw new Error(`Frontmatter invalide dans ${mdPath}`);
  }
  return yaml.load(match[1]);
}

// Nettoie les .html sans .md correspondant
function cleanOrphanHtml(dir) {
  if (!fs.existsSync(dir)) return;
  const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith(".html"));
  htmlFiles.forEach(htmlFile => {
    const mdFile = htmlFile.replace(/\.html$/, ".md");
    if (!fs.existsSync(path.join(dir, mdFile))) {
      fs.unlinkSync(path.join(dir, htmlFile));
      console.log(`Suppression de l'HTML orphelin : ${path.join(dir, htmlFile)}`);
    }
  });
}

// Normalise un chemin public pour GitHub Pages projet (/MDS/)
function withRepoPrefix(url) {
  if (!url) return url;

  // Ne pas toucher aux URLs absolues externes, mailto, tel, ancres
  if (/^(https?:)?\/\//i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url) || url.startsWith("#"))
    return url;

  // Si l'URL commence déjà par /MDS/, ok
  if (url.startsWith("/MDS/")) return url;

  // Si c'est un chemin absolu /xxx => /MDS/xxx (en évitant /MDS/MDS)
  if (url.startsWith("/")) return "/MDS" + url.replace(/^\/MDS\//, "/");

  // Chemins relatifs d'assets courants produits par Markdown/éditeur
  if (
    url.startsWith("images/") ||
    url.startsWith("img/") ||
    url.startsWith("assets/") ||
    url.startsWith("css/") ||
    url.startsWith("js/")
  ) {
    return "/MDS/" + url.replace(/^MDS\//, "");
  }

  // Autres chemins relatifs (vers d'autres pages) : on laisse tel quel
  return url;
}

// Retire /MDS/ en tête pour stocker un chemin "repo-agnostic" (utile pour JSON)
function stripRepoPrefix(url) {
  if (!url) return url;
  return url.replace(/^\/?MDS\//, "");
}

// ---------- Pré-nettoyage ----------
cleanOrphanHtml("./articles/conseil");
cleanOrphanHtml("./articles/actu");

// ---------- Génération HTML ----------
function generateHtml(mdPath, templatePath, destDir) {
  const mdText = fs.readFileSync(mdPath, "utf-8");
  const template = fs.readFileSync(templatePath, "utf-8");
  const match = /^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/m.exec(mdText);
  if (!match) throw new Error(`Frontmatter invalide dans ${mdPath}`);

  const front = yaml.load(match[1]) || {};
  const bodyMd = match[2] || "";

  // Parse template
  const dom = new JSDOM(template);
  const document = dom.window.document;

  // Injection frontmatter
  const title = front.title || "";
  const dateStr =
    front.date
      ? (typeof front.date === "string" ? front.date.slice(0, 10) : new Date(front.date).toISOString().slice(0, 10))
      : "";
  const summary = front.summary || "";

  document.title = `${title} – Marc Da Silva`;

  const elPageTitle = document.getElementById("page-title");
  if (elPageTitle) elPageTitle.textContent = `${title} – Marc Da Silva`;

  const elMetaDesc = document.getElementById("meta-desc");
  if (elMetaDesc) elMetaDesc.setAttribute("content", summary);

  const elArticleTitle = document.getElementById("article-title");
  if (elArticleTitle) elArticleTitle.textContent = title;

  const elArticleDate = document.getElementById("article-date");
  if (elArticleDate) elArticleDate.textContent = dateStr;

  const elArticleSummary = document.getElementById("article-summary");
  if (elArticleSummary) elArticleSummary.textContent = summary;

  // Couverture : accepte "images/...", "/images/...", "/MDS/images/..."
  const cover = front.image
    ? "/MDS/" + stripRepoPrefix(front.image)
    : "/MDS/images/articles/default.jpg";
  const elArticleImage = document.getElementById("article-image");
  if (elArticleImage) elArticleImage.src = cover;

  // Corps Markdown -> HTML
  const bodyHtml = marked.parse(bodyMd);
  const elBody = document.getElementById("article-body");
  if (elBody) elBody.innerHTML = bodyHtml;

  // Post-traitement : préfixer les URLs internes dans le corps
  if (elBody) {
    // src, href, poster, data-src
    elBody.querySelectorAll("[src], [href], [poster], [data-src]").forEach(el => {
      ["src", "href", "poster", "data-src"].forEach(attr => {
        if (el.hasAttribute(attr)) {
          const fixed = withRepoPrefix(el.getAttribute(attr));
          el.setAttribute(attr, fixed);
        }
      });
    });

    // srcset (picture/source/img)
    elBody.querySelectorAll("[srcset]").forEach(el => {
      const raw = el.getAttribute("srcset") || "";
      const fixed = raw
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .map(entry => {
          const [u, d] = entry.split(/\s+/);
          const prefixed = withRepoPrefix(u);
          return d ? `${prefixed} ${d}` : prefixed;
        })
        .join(", ");
      el.setAttribute("srcset", fixed);
    });
  }

  // Écrit le fichier HTML
  const destName = path.basename(mdPath, ".md") + ".html";
  fs.writeFileSync(path.join(destDir, destName), dom.serialize());
  console.log("Généré :", path.join(destDir, destName));
}

// Debug : fichiers trouvés
console.log("Fichiers conseil :", fs.existsSync("./articles/conseil") ? fs.readdirSync("./articles/conseil") : []);
console.log("Fichiers actu :", fs.existsSync("./articles/actu") ? fs.readdirSync("./articles/actu") : []);

// Génère ACTU
if (fs.existsSync("./articles/actu")) {
  fs.readdirSync("./articles/actu")
    .filter(f => f.endsWith(".md"))
    .forEach(file => {
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
}

// Génère CONSEIL
if (fs.existsSync("./articles/conseil")) {
  fs.readdirSync("./articles/conseil")
    .filter(f => f.endsWith(".md"))
    .forEach(file => {
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
}

// ---------- Génération du JSON d'index ----------
function slugFromFilename(folder, file) {
  return `${folder}/${path.basename(file, ".md")}`;
}

let articles = [];

// Conseil
if (fs.existsSync("./articles/conseil")) {
  fs.readdirSync("./articles/conseil")
    .filter(f => f.endsWith(".md"))
    .forEach(file => {
      try {
        const front = extractFrontmatter(`./articles/conseil/${file}`) || {};
        const dateStr =
          front.date
            ? (typeof front.date === "string" ? front.date.slice(0, 16) : new Date(front.date).toISOString().slice(0, 16))
            : "";
        articles.push({
          title: front.title || "",
          date: dateStr,
          category: front.category || "Conseil IT",
          summary: front.summary || "",
          // On stocke SANS /MDS/ pour rester agnostique ; le front ajoutera /MDS/ à l'affichage
          image: stripRepoPrefix(front.image || "images/articles/default.jpg"),
          slug: slugFromFilename("conseil", file)
        });
      } catch (e) {
        console.log("Erreur de frontmatter (conseil):", file, e.message);
      }
    });
}

// Actu
if (fs.existsSync("./articles/actu")) {
  fs.readdirSync("./articles/actu")
    .filter(f => f.endsWith(".md"))
    .forEach(file => {
      try {
        const front = extractFrontmatter(`./articles/actu/${file}`) || {};
        const dateStr =
          front.date
            ? (typeof front.date === "string" ? front.date.slice(0, 16) : new Date(front.date).toISOString().slice(0, 16))
            : "";
        articles.push({
          title: front.title || "",
          date: dateStr,
          category: front.category || "Actualité",
          summary: front.summary || "",
          image: stripRepoPrefix(front.image || "images/articles/default.jpg"),
          slug: slugFromFilename("actu", file)
        });
      } catch (e) {
        console.log("Erreur de frontmatter (actu):", file, e.message);
      }
    });
}

// Tri décroissant
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

// Écrit articles.json
fs.writeFileSync("./articles/articles.json", JSON.stringify(articles, null, 2), "utf-8");
console.log("Nombre d'articles dans le JSON :", articles.length);

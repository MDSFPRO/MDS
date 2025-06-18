const pathParts = window.location.pathname.split('/');
const rawSlug = pathParts.slice(-2).join('/').replace('.html', '');
const slug = decodeURIComponent(rawSlug);

const slugify = s =>
  (s || "")
    .toLowerCase()
    .replace(/^\/+/, '')
    .replace(/\.html?$/, '')
    .replace(/\s+/g, '-')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const currentSlug = slugify(slug);

fetch('../../articles/articles.json?v=' + Date.now())
  .then(res => res.json())
  .then(articles => {
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    // Debug :
    console.log('slug courant:', currentSlug);
    console.log('slugs JSON:', articles.map(a => slugify(a.slug)));

    const suggestions = articles
      .filter(a => slugify(a.slug) !== currentSlug)
      .slice(0, 3);

    const container = document.getElementById('last-articles');
    if (!container) return;
    suggestions.forEach(article => {
      const card = document.createElement('a');
      card.href = '../' + article.slug + '.html';
      card.className = "flex flex-col gap-3 bg-white/5 hover:bg-teal-900/20 p-4 rounded-2xl shadow transition card-hover";
      card.innerHTML = `
        <img src="../../${article.image || 'images/articles/default.webp'}" alt="${article.title}" class="w-full h-32 object-cover rounded-xl mb-2 shadow" />
        <div>
            <div class="text-teal-400 font-semibold text-xs mb-1">${article.category || ''} • ${new Date(article.date).toLocaleDateString('fr-FR')}</div>
            <h3 class="text-lg font-bold text-white mb-1 line-clamp-2">${article.title}</h3>
            <span class="text-teal-500 text-sm font-semibold hover:underline">Lire l’article →</span>
        </div>
      `;
      container.appendChild(card);
    });
  })
  .catch(e => {
    const container = document.getElementById('last-articles');
    if (container) {
      container.innerHTML = `<div class="text-red-500 text-sm">Suggestions indisponibles<br>${e.message}</div>`;
    }
    console.error("Erreur suggestions articles :", e);
  });


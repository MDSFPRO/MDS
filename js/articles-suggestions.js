// /js/article-suggestions.js

// Trouve le slug courant à exclure des suggestions (gère conseil/actu)
const pathParts = window.location.pathname.split('/');
const slug = pathParts.slice(-2).join('/').replace('.html', ''); // ex: 'conseil/2024-06-mfa'

// Charge les articles.json (1 dossier au-dessus de conseil/actu)
fetch('../articles.json')
  .then(res => res.json())
  .then(articles => {
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    // Exclut l'article courant
    const suggestions = articles.filter(a => a.slug !== slug).slice(0, 3);
    const container = document.getElementById('last-articles');
    if (!container) return;
    suggestions.forEach(article => {
      const card = document.createElement('a');
      card.href = '../' + article.slug + '.html';
      card.className = "flex flex-col gap-3 bg-white/5 hover:bg-teal-900/20 p-4 rounded-2xl shadow transition card-hover";
        card.innerHTML = `
        <img src="../../${article.image || 'images/articles/default.jpg'}" alt="${article.title}" class="w-full h-32 object-cover rounded-xl mb-2 shadow" />
        <div>
            <div class="text-teal-400 font-semibold text-xs mb-1">${article.category || ''} • ${new Date(article.date).toLocaleDateString('fr-FR')}</div>
            <h3 class="text-lg font-bold text-white mb-1 line-clamp-2">${article.title}</h3>
            <span class="text-teal-500 text-sm font-semibold hover:underline">Lire l’article →</span>
        </div>
        `;
      container.appendChild(card);
    });
  });

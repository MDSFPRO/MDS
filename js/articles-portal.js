// /js/articles-portal.js

let articles = [];
let currentFilter = "all";
const list = document.getElementById('articles-list');

// Charger la liste d’articles depuis articles.json
fetch('articles.json')
  .then(res => res.json())
  .then(data => {
    articles = data;
    // Trier du plus récent au plus ancien
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    displayArticles();
    // Init filtre dynamique
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.dataset.category;
        displayArticles();
        // Réinitialise TOUS les boutons en gris
        btns.forEach(b => {
          b.classList.remove('bg-teal-500', 'text-black');
          b.classList.add('bg-white/10', 'text-white');
        });
        // Passe le bouton cliqué en teal
        btn.classList.remove('bg-white/10', 'text-white');
        btn.classList.add('bg-teal-500', 'text-black');
      });
    });
    // Par défaut : bouton "Tous" en teal, les autres restent gris
    btns[0].classList.remove('bg-white/10', 'text-white');
    btns[0].classList.add('bg-teal-500', 'text-black');
  });

function displayArticles() {
  list.innerHTML = "";
  let filtered = currentFilter === "all"
    ? articles
    : articles.filter(a => a.category === currentFilter);
  if (filtered.length === 0) {
    list.innerHTML = '<div class="text-white/70 text-lg text-center">Aucun article pour cette catégorie.</div>';
  } else {
    filtered.forEach(article => {
      const card = document.createElement('a');
      card.href = article.slug + '.html';
      card.className =
        'glass-card card-hover flex flex-col gap-4 p-7 rounded-3xl shadow-lg transition hover:bg-teal-900/10 fade';
      card.innerHTML = `
        <img src="../${article.image || 'images/articles/default.jpg'}" alt="${article.title}" class="w-full h-48 object-cover rounded-2xl shadow-lg mb-2"/>
        <div>
          <div class="text-teal-400 font-semibold text-sm mb-1">${article.category || 'Conseil IT'} • ${new Date(article.date).toLocaleDateString('fr-FR')}</div>
          <h2 class="text-2xl font-bold mb-2 glass-title">${article.title}</h2>
          <p class="text-white/80 mb-3">${article.summary || ''}</p>
          <span class="text-teal-500 text-base font-semibold hover:underline">Lire l’article →</span>
        </div>
      `;
      list.appendChild(card);
    });
  }
  // Animation .fade sur les cards
  setTimeout(() => {
    document.querySelectorAll('.fade').forEach(el => el.classList.add('visible'));
  }, 100);
  lucide.createIcons();
}

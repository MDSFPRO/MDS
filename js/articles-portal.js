let articles = [];
let currentFilter = "all";
let currentPage = 1;
const articlesPerPage = 9; // Nombre d'articles par page

const list = document.getElementById('articles-list');
const pagination = document.createElement('div');
pagination.className = "flex gap-2 justify-center my-8";
list.parentNode.appendChild(pagination);

// === ANTI-CACHE ===
fetch('articles.json?v=' + Date.now())
  .then(res => {
    if (!res.ok) throw new Error("Erreur de chargement articles.json : " + res.statusText);
    return res.json();
  })
  .then(data => {
    articles = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    displayArticles();
    // Init filtre dynamique
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.dataset.category;
        currentPage = 1; // Reset à la première page quand on filtre
        displayArticles();
        btns.forEach(b => {
          b.classList.remove('bg-teal-500', 'text-black');
          b.classList.add('bg-white/10', 'text-white');
        });
        btn.classList.remove('bg-white/10', 'text-white');
        btn.classList.add('bg-teal-500', 'text-black');
      });
    });
    btns[0].classList.remove('bg-white/10', 'text-white');
    btns[0].classList.add('bg-teal-500', 'text-black');
  })
  .catch(e => {
    console.error("Erreur chargement ou parsing articles.json :", e);
    list.innerHTML = `<div class="text-red-500 text-lg text-center">Impossible de charger les articles.<br>${e.message}</div>`;
    pagination.innerHTML = '';
  });

function displayArticles() {
  list.innerHTML = "";
  let filtered = currentFilter === "all"
    ? articles
    : articles.filter(a => a.category === currentFilter);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / articlesPerPage));
  const start = (currentPage - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  const toShow = filtered.slice(start, end);

  if (toShow.length === 0) {
    list.innerHTML = '<div class="text-white/70 text-lg text-center">Aucun article pour cette catégorie.</div>';
    pagination.innerHTML = '';
  } else {
    toShow.forEach(article => {
      const card = document.createElement('a');
      // Le href doit pointer vers le bon sous-dossier (slug = Conseil/xxxx ou actu/xxxx)
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
    renderPagination(totalPages);
  }
  setTimeout(() => {
    document.querySelectorAll('.fade').forEach(el => el.classList.add('visible'));
  }, 100);
  if (window.lucide) lucide.createIcons();
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  let html = '';
  if (currentPage > 1) {
    html += `<button class="px-3 py-1 rounded-xl bg-white/10 text-white hover:bg-teal-400 hover:text-black transition" onclick="goToPage(${currentPage - 1})">←</button>`;
  }
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="px-3 py-1 mx-1 rounded-xl ${i === currentPage ? 'bg-teal-500 text-black' : 'bg-white/10 text-white hover:bg-teal-400 hover:text-black'} transition" onclick="goToPage(${i})">${i}</button>`;
  }
  if (currentPage < totalPages) {
    html += `<button class="px-3 py-1 rounded-xl bg-white/10 text-white hover:bg-teal-400 hover:text-black transition" onclick="goToPage(${currentPage + 1})">→</button>`;
  }
  pagination.innerHTML = html;
}

window.goToPage = function(page) {
  currentPage = page;
  displayArticles();
};

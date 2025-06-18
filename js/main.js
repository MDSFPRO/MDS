document.addEventListener('DOMContentLoaded', () => {
  // Init Lucide icons
  lucide.createIcons();

  // === Header hide/show on scroll ===
  let lastScrollY = window.scrollY;
  const header = document.querySelector('header');
  header.classList.add('header-show');
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY + 10 && window.scrollY > 10) {
      header.classList.remove('header-show');
      header.classList.add('header-hide');
    } else if (window.scrollY < lastScrollY - 5) {
      header.classList.remove('header-hide');
      header.classList.add('header-show');
    }
    lastScrollY = window.scrollY;
  });

  // === Animations .fade stagger ===
  document.querySelectorAll('.section-anim').forEach(section => {
    section.querySelectorAll('.fade').forEach((el, i) => {
      el.style.transitionDelay = (i * 80) + 'ms';
    });
  });

  // === Cascade anim des .fade à l'entrée en vue ===
  document.querySelectorAll('.section-anim').forEach(section => {
    const fades = section.querySelectorAll('.fade');
    let hasAnimated = false;
    function checkAndAnimate() {
      const rect = section.getBoundingClientRect();
      if (!hasAnimated && rect.top < window.innerHeight - 120) {
        fades.forEach((el, i) => {
          setTimeout(() => { el.classList.add('visible'); }, i * 80);
        });
        hasAnimated = true;
      }
    }
    window.addEventListener('scroll', checkAndAnimate);
    checkAndAnimate();
  });

  // === Scroll Animations classiques ===
  const handleFade = () => {
    document.querySelectorAll('.fade').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 120) {
        el.classList.add('visible');
      }
    });
  };
  const handleActiveSection = () => {
    const sections = document.querySelectorAll('.section-anim');
    let found = false;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (!found && rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 3) {
        section.classList.add('active');
        found = true;
      } else {
        section.classList.remove('active');
      }
    });
  };
  window.addEventListener('scroll', () => {
    handleFade();
    handleActiveSection();
  });
  handleFade();
  handleActiveSection();

// Remplace toute la fonction par :
function lockBodyScroll(lock) {
  if (lock) {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
}

  // === Burger Menu ===
  const burgerBtn = document.getElementById('burger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const closeBtn = document.getElementById('close-nav');
  const menuAnimationDelay = 250;
  const openMobileNav = () => {
    burgerBtn.classList.add('open');
    mobileNav.classList.remove('hidden');
    setTimeout(() => {
      mobileNav.classList.add('show');
      lockBodyScroll(true);
      lucide.createIcons();
    }, menuAnimationDelay);
  };
  const closeMobileNav = () => {
    burgerBtn.classList.remove('open');
    mobileNav.classList.remove('show');
    setTimeout(() => {
      mobileNav.classList.add('hidden');
      lockBodyScroll(false);
    }, 300);
  };
  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });
  closeBtn?.addEventListener('click', closeMobileNav);
  document.querySelectorAll('#mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // === Carrousel Logos infini ===
  const marquee = document.getElementById('marquee-track');
  if (marquee) {
    marquee.innerHTML += marquee.innerHTML; // duplication simple pour effet infini CSS
  }

  // === Compteur animé pour les chiffres ===
  function animateCounter(counter, target, duration = 1500) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    function update() {
      current += increment;
      if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
        counter.textContent = target.toLocaleString('fr-FR');
      } else {
        counter.textContent = Math.round(current).toLocaleString('fr-FR');
        requestAnimationFrame(update);
      }
    }
    update();
  }
  function initCountersWhenVisible() {
    const counters = document.querySelectorAll('.counter');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            const target = parseInt(entry.target.dataset.target, 10);
            if (!isNaN(target)) {
              animateCounter(entry.target, target);
              entry.target.dataset.animated = "true";
              obs.unobserve(entry.target);
            }
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(counter => { observer.observe(counter); });
    } else {
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        if (!isNaN(target)) {
          animateCounter(counter, target);
          counter.dataset.animated = "true";
        }
      });
    }
  }
  initCountersWhenVisible();

  // === Hero Section Animation (staggered) ===
  setTimeout(() => document.getElementById('hero-logo')?.classList.add('opacity-100', 'scale-100'), 100);
  setTimeout(() => document.getElementById('hero-txt1')?.classList.add('opacity-100', 'translate-y-0'), 300);
  setTimeout(() => document.getElementById('hero-txt2')?.classList.add('opacity-100', 'translate-y-0'), 500);
  setTimeout(() => document.getElementById('hero-txt3')?.classList.add('opacity-100', 'translate-y-0'), 700);
  setTimeout(() => document.getElementById('hero-txt4')?.classList.add('opacity-100', 'translate-y-0'), 900);
  setTimeout(() => document.getElementById('hero-txt5')?.classList.add('opacity-100', 'translate-y-0'), 1100);
  setTimeout(() => document.getElementById('hero-txt6')?.classList.add('opacity-100', 'translate-y-0'), 1300);
});

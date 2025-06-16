document.addEventListener('DOMContentLoaded', () => {
  // Init Lucide icons
  lucide.createIcons();

  // === Transition delay automatique (stagger effect sur les .fade) ===
  document.querySelectorAll('.section-anim').forEach(section => {
    section.querySelectorAll('.fade').forEach((el, i) => {
      el.style.transitionDelay = (i * 80) + 'ms';
    });
  });

  // === Cascade anim sur toutes les cards d'une section quand la section entre dans la vue ===
  document.querySelectorAll('.section-anim').forEach(section => {
    const fades = section.querySelectorAll('.fade');
    let hasAnimated = false;
    function checkAndAnimate() {
      const rect = section.getBoundingClientRect();
      if (!hasAnimated && rect.top < window.innerHeight - 120) {
        fades.forEach((el, i) => {
          setTimeout(() => {
            el.classList.add('visible');
          }, i * 80);
        });
        hasAnimated = true;
      }
    }
    window.addEventListener('scroll', checkAndAnimate);
    // Pour déclencher si la section est déjà visible au load :
    checkAndAnimate();
  });

  // === Scroll Animations classiques (pour les titres, etc) ===
  const handleFade = () => {
    document.querySelectorAll('.fade').forEach(el => {
      const rect = el.getBoundingClientRect();
      // On ne retire plus visible ici pour éviter de "casser" la cascade sur les cards
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
      document.body.style.overflow = 'hidden';
      lucide.createIcons(); // IMPORTANT pour injecter la croix
    }, menuAnimationDelay);
  };

  const closeMobileNav = () => {
    burgerBtn.classList.remove('open');
    mobileNav.classList.remove('show');
    setTimeout(() => {
      mobileNav.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  };

  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });

  closeBtn?.addEventListener('click', closeMobileNav);

  document.querySelectorAll('#mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // === Logos Marquee ===
  const marquee = document.getElementById('marquee-track');
  if (marquee) {
    const logoCount = marquee.children.length;
    const speed = 0.6;

    for (let i = 0; i < logoCount; i++) {
      marquee.appendChild(marquee.children[i].cloneNode(true));
    }

    let px = 0;
    let paused = false;

    const animate = () => {
      if (!paused) {
        px -= speed;
        if (Math.abs(px) >= marquee.scrollWidth / 2) {
          px = 0;
        }
        marquee.style.transform = `translateX(${px}px)`;
      }
      requestAnimationFrame(animate);
    };

    marquee.parentElement.addEventListener('mouseenter', () => paused = true);
    marquee.parentElement.addEventListener('mouseleave', () => paused = false);
    animate();
  }

  // === Compteur animé pour les chiffres (activation uniquement quand visible) ===
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
              obs.unobserve(entry.target); // plus besoin d'observer après animation
            }
          }
        });
      }, {
        threshold: 0.4 // Commence quand 40% du chiffre est visible
      });
      counters.forEach(counter => {
        observer.observe(counter);
      });
    } else {
      // Fallback pour vieux navigateurs : lance direct
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

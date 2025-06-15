document.addEventListener('DOMContentLoaded', () => {
  // Init Lucide icons
  lucide.createIcons();

  // === Scroll Animations ===
  const handleFade = () => {
    document.querySelectorAll('.fade').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 120) {
        setTimeout(() => {
          el.classList.add('visible');
        }, parseInt(el.style.transitionDelay || 0));
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

  // === Hero Section Animation (staggered) ===
  setTimeout(() => document.getElementById('hero-logo')?.classList.add('opacity-100', 'scale-100'), 100);
  setTimeout(() => document.getElementById('hero-txt1')?.classList.add('opacity-100', 'translate-y-0'), 300);
  setTimeout(() => document.getElementById('hero-txt2')?.classList.add('opacity-100', 'translate-y-0'), 500);
  setTimeout(() => document.getElementById('hero-txt3')?.classList.add('opacity-100', 'translate-y-0'), 700);
  setTimeout(() => document.getElementById('hero-txt4')?.classList.add('opacity-100', 'translate-y-0'), 900);
  setTimeout(() => document.getElementById('hero-txt5')?.classList.add('opacity-100', 'translate-y-0'), 1100);
  setTimeout(() => document.getElementById('hero-txt6')?.classList.add('opacity-100', 'translate-y-0'), 1300);
});

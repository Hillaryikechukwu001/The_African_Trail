(function () {
  'use strict';

  /* ---- NAV SCROLL ---- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ---- MOBILE MENU ---- */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* ---- STAT COUNTER ---- */
  function animateCounter(el, target, duration) {
    const start   = performance.now();
    const isLarge = target >= 1000;

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      el.textContent = isLarge && current >= 1000
        ? (current / 1000).toFixed(current % 1000 === 0 ? 0 : 1) + 'k+'
        : current;

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  let countersStarted = false;
  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target, 10), 1800);
    });
  }

  /* ---- SINGLE INTERSECTION OBSERVER FOR ALL REVEALS ---- */
  // Collects every element that needs a reveal animation into ONE observer
  // This avoids class name conflicts from multiple observer instances
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const index = parseInt(el.dataset.index || '0', 10);
      const delay = index * 100;

      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Assign stagger index and register every animated element
  function registerElements(selector) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.dataset.index = i;
      revealObserver.observe(el);
    });
  }

  // Counter trigger — observe hero section
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(startCounters, 1200);
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  /* ---- INIT ON DOM READY ---- */
  function init() {
    registerElements('[data-aos]');
    registerElements('.dest-card');
    registerElements('.feat-card');

    const hero = document.getElementById('hero');
    if (hero) counterObserver.observe(hero);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('nav').offsetHeight;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- SCROLL HINT HIDE ---- */
  const scrollHint = document.getElementById('scrollHint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      scrollHint.style.opacity = '0';
    }, { passive: true, once: true });
  }

})();
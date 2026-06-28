(function () {
  'use strict';

  /* ---- NAV SCROLL ---- */
  const cnav = document.getElementById('cnav');
  window.addEventListener('scroll', () => {
    cnav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });

  /* ---- MOBILE MENU ---- */
  const hamburger   = document.getElementById('cHamburger');
  const mobile      = document.getElementById('cMobile');
  const closeBtn    = document.getElementById('cClose');
  const mobileLinks = document.querySelectorAll('.cmobile-link');

  function openMenu()  { mobile.classList.add('open');    document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobile.classList.remove('open'); document.body.style.overflow = ''; }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = cnav ? cnav.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- ACTIVE NAV HIGHLIGHT ---- */
  const siteLinks = document.querySelectorAll('.cnav__sites a');
  const sections  = document.querySelectorAll('.csite');

  function setActiveLink() {
    let current = '';
    const scrollY = window.scrollY + (cnav ? cnav.offsetHeight : 72) + 80;
    sections.forEach(section => {
      if (section.offsetTop <= scrollY) current = '#' + section.id;
    });
    siteLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === current);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ---- SCROLL REVEAL ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  /* ---- SCROLL HINT HIDE ---- */
  const scrollHint = document.querySelector('.chero__scroll');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      scrollHint.style.opacity = '0';
    }, { passive: true, once: true });
  }

  /* ---- INIT ---- */
  function init() {
    document.querySelectorAll('.csite').forEach(el => revealObserver.observe(el));
    setActiveLink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
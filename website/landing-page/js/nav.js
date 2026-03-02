// nav.js
// Handles JS class detection, nav scroll density toggling, and active section
// tracking via IntersectionObserver.

(function() {

  // Replace 'no-js' with 'js' on the root element so CSS can distinguish
  document.documentElement.classList.replace('no-js', 'js');

  // Nav scroll density: add .dense to .nav when the user has scrolled down
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('dense', window.scrollY > 20);
  }, {passive: true});

  // Active section tracking: observe each section and update .nav-active on
  // the corresponding nav link when the section enters the viewport
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sectionIds = ['how-it-works', 'features', 'testimonials', 'faq', 'pricing'];
  const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('nav-active'));
        const link = document.querySelector(`.nav-links .nav-link[href="#${e.target.id}"]`);
        if (link) link.classList.add('nav-active');
      }
    });
  }, {threshold: 0.35, rootMargin: '-60px 0px -40% 0px'});

  sectionEls.forEach(s => sectionObserver.observe(s));

  // Mobile hamburger menu toggle
  const burger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('nav-mobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a mobile link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

})();

// animations.js
// Handles:
//   1. Hero blur-dissolve entrance (body class toggle)
//   2. Reveal: adds .in to .reveal elements on scroll
//   3. Counter: animates [data-count] from 0 to target

(function() {

  // ── Hero blur-dissolve entrance ──
  // Elements start hidden via .hero-animate CSS defaults.
  // After 50ms, body.hero-loaded triggers transitions to visible state.
  function initHeroEntrance() {
    document.body.classList.add('preload');

    // Allow app window to rise from below the hero section
    var hero = document.querySelector('.hero');
    if (hero) hero.style.overflow = 'visible';

    setTimeout(function() {
      document.body.classList.add('hero-loaded');

      // Restore overflow after app rise completes (700ms delay + 2.5s duration)
      setTimeout(function() {
        document.body.classList.remove('preload');
        if (hero) hero.style.overflow = '';
      }, 3500);
    }, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroEntrance);
  } else {
    initHeroEntrance();
  }

  // ── Reveal on scroll ──
  // Observe .reveal elements and add .in when they cross
  // the 0.12 intersection threshold, then stop observing
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.15, rootMargin: '-60px 0px -60px 0px'});

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Counter animation: rAF loop with cubic ease-out (1 - (1-t)^3) over 1600 ms
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function update(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = Math.round(target * ease);
      el.textContent = (val >= 1000 ? val.toLocaleString() : val) + suffix;
      if (t < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // Reveal parent .mcard simultaneously with counter start
        var card = e.target.closest('.mcard');
        if (card) card.classList.add('in');
        animateCount(e.target);
        countObs.unobserve(e.target);
      }
    });
  }, {threshold: 0.4});

  document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

  // ── HIW stacked cards — click to pop out ──
  document.querySelectorAll('.hiw-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var wasActive = card.classList.contains('active');
      document.querySelectorAll('.hiw-card').forEach(function(c) {
        c.classList.remove('active');
      });
      if (!wasActive) card.classList.add('active');
    });
  });

})();

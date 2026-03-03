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
  // Two observers: headings get a deeper trigger zone, everything else standard
  function makeObserver(opts) {
    return new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          this.unobserve(e.target);
        }
      }, this);
    }, opts);
  }

  // Headings — higher threshold, deeper trigger
  var ioHead = makeObserver({threshold: 0.2, rootMargin: '-60px 0px 0px 0px'});
  // Cards, body text, labels — standard
  var io = makeObserver({threshold: 0.15, rootMargin: '-40px 0px 0px 0px'});
  // Widgets — low threshold (they're tall), generous trigger
  var ioWidget = makeObserver({threshold: 0.1, rootMargin: '-40px 0px 0px 0px'});

  document.querySelectorAll('.reveal-h').forEach(function(el) { ioHead.observe(el); });
  document.querySelectorAll('.reveal, .reveal-f, .reveal-l').forEach(function(el) {
    if (!el.classList.contains('hiw-cards')) io.observe(el);
  });
  document.querySelectorAll('.reveal-w').forEach(function(el) { ioWidget.observe(el); });

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

  // ── HIW scroll-linked drop entrance ──
  // Each card drops into place as user scrolls, one by one. Once all locked, hand off to CSS.
  var hiwContainer = document.querySelector('.hiw-cards');
  if (hiwContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var hiwCards = hiwContainer.querySelectorAll('.hiw-card');
    var hiwSettled = false;
    var hiwTicking = false;
    var useMobile = window.matchMedia('(max-width:720px)').matches;

    // End positions must match CSS .in rules exactly
    // Each card visible throughout its drop — start positions kept within reasonable range
    var desktopData = [
      { sy: -320, ey: -165, sx: -100, ex: -82, skew: -8 },
      { sy: -200, ey: -50,  sx: 0,    ex: 0,   skew: -8 },
      { sy: -60,  ey: 40,   sx: 96,   ex: 82,  skew: -8 }
    ];
    var mobileData = [
      { sy: -70, ey: 0,  sx: 0,  ex: 0,  skew: 0 },
      { sy: -40, ey: 20, sx: 20, ex: 20, skew: 0 },
      { sy: -10, ey: 40, sx: 40, ex: 40, skew: 0 }
    ];

    // Stagger — wide enough to see each card's moment clearly
    var hiwStagger = [0, 0.22, 0.42];
    // Individual durations — card 1 longest float, card 3 tightest
    var hiwCardRange = [0.58, 0.43, 0.28];
    // Per-card easing power — card 1 heaviest (gentle float), card 3 crispest
    var hiwEasePower = [2.5, 3, 3.5];

    function hiwUpdate() {
      if (hiwSettled) { hiwTicking = false; return; }

      var rect = hiwContainer.getBoundingClientRect();
      var viewH = window.innerHeight;

      // 0 when container is 10% below viewport bottom, 1 at 15% from top — starts just before visible
      var progress = Math.max(0, Math.min(1,
        (viewH * 1.1 - rect.top) / (viewH * 0.95)
      ));

      var data = useMobile ? mobileData : desktopData;
      var allDone = true;

      hiwCards.forEach(function(card, i) {
        if (i >= data.length) return;
        if (card.dataset.settled) return;
        var d = data[i];

        var lp = Math.max(0, Math.min(1, (progress - hiwStagger[i]) / hiwCardRange[i]));

        // Card landed — lock permanently
        if (lp >= 1) {
          var fp = [];
          if (d.skew) fp.push('skewY(' + d.skew + 'deg)');
          if (d.ex) fp.push('translateX(' + d.ex + 'px)');
          fp.push('translateY(' + d.ey + 'px)');
          card.style.transform = fp.join(' ');
          card.style.opacity = '1';
          card.dataset.settled = '1';
          return;
        }

        allDone = false;

        // Per-card easing — card 1 floats gently (2.5), card 3 snaps crisper (3.5)
        var ep = 1 - Math.pow(1 - lp, hiwEasePower[i]);
        var y = d.sy + (d.ey - d.sy) * ep;
        var x = d.sx + (d.ex - d.sx) * ep;
        var parts = [];
        if (d.skew) parts.push('skewY(' + d.skew + 'deg)');
        if (x) parts.push('translateX(' + x + 'px)');
        parts.push('translateY(' + y + 'px)');

        card.style.transform = parts.join(' ');
        card.style.opacity = Math.min(1, lp * 2.5);
      });

      // All settled — hand off to CSS
      if (allDone) {
        hiwSettled = true;
        window.removeEventListener('scroll', hiwOnScroll);
        hiwCards.forEach(function(card) { card.style.transition = 'none'; });
        hiwContainer.classList.add('in');
        hiwCards.forEach(function(card) {
          card.style.transform = '';
          card.style.opacity = '';
          delete card.dataset.settled;
        });
        void hiwContainer.offsetHeight;
        hiwCards.forEach(function(card) { card.style.transition = ''; });
      }

      hiwTicking = false;
    }

    function hiwOnScroll() {
      if (!hiwTicking) {
        requestAnimationFrame(hiwUpdate);
        hiwTicking = true;
      }
    }

    var hiwStartObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          window.addEventListener('scroll', hiwOnScroll, { passive: true });
          hiwUpdate();
          hiwStartObs.unobserve(hiwContainer);
        }
      });
    }, { rootMargin: '0px 0px 800px 0px' });

    hiwStartObs.observe(hiwContainer);
    initHiwClick();

  } else if (hiwContainer) {
    // Reduced motion — show immediately
    hiwContainer.classList.add('in');
    initHiwClick();
  }

  // ── HIW stacked cards — click toggles individual card, scroll resets ──
  // Click a card to activate it (de-skew, full color). Click again or scroll to reset.
  function initHiwClick() {
    var hiwCards = document.querySelectorAll('.hiw-card');
    var activeCard = null;

    function resetActive() {
      if (activeCard) {
        activeCard.classList.remove('active');
        activeCard = null;
      }
    }

    hiwCards.forEach(function(card) {
      card.addEventListener('click', function() {
        if (card === activeCard) {
          // Click same card again — deactivate
          resetActive();
        } else {
          // Deactivate previous, activate clicked
          resetActive();
          card.classList.add('active');
          activeCard = card;
        }
      });
    });

    // Scroll resets active card back to stacked position
    var scrollTimer;
    window.addEventListener('scroll', function() {
      if (!activeCard) return;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function() {
        resetActive();
      }, 80);
    }, { passive: true });
  }

})();

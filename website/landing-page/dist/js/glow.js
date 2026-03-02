// glow.js
// Mouse-following conic gradient glow on cards.
// Adapted from the GlowingEffect React component for vanilla JS.

(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Target cards that should have the glow effect
  var selectors = '.ui-frame';
  var cards = document.querySelectorAll(selectors);
  if (!cards.length) return;

  var rafId = 0;
  var mouseX = 0;
  var mouseY = 0;

  // Add glow overlay to each card
  cards.forEach(function(card) {
    card.style.position = 'relative';
    card.style.overflow = 'hidden';

    var glow = document.createElement('div');
    glow.className = 'card-glow';
    glow.setAttribute('aria-hidden', 'true');
    card.appendChild(glow);
  });

  document.body.addEventListener('pointermove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateGlows);
  }, { passive: true });

  function updateGlows() {
    cards.forEach(function(card) {
      var rect = card.getBoundingClientRect();
      var glow = card.querySelector('.card-glow');
      if (!glow) return;

      var proximity = 120;
      var isNear =
        mouseX > rect.left - proximity &&
        mouseX < rect.right + proximity &&
        mouseY > rect.top - proximity &&
        mouseY < rect.bottom + proximity;

      if (!isNear) {
        glow.style.opacity = '0';
        return;
      }

      var cx = rect.left + rect.width * 0.5;
      var cy = rect.top + rect.height * 0.5;
      var angle = Math.atan2(mouseY - cy, mouseX - cx) * (180 / Math.PI) + 90;

      glow.style.opacity = '1';
      glow.style.setProperty('--glow-angle', angle + 'deg');
    });
  }
})();

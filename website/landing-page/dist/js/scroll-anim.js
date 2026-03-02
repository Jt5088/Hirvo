// scroll-anim.js
// Scroll-triggered 3D perspective animation for the hero app window.
// As user scrolls past the hero, the app window rotates from 3D angle to flat.

(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var appWrap = document.querySelector('.app-wrap');
  if (!appWrap) return;

  var appWin = appWrap.querySelector('.app-win');
  if (!appWin) return;

  var ticking = false;

  function updateTransform() {
    var rect = appWrap.getBoundingClientRect();
    var viewH = window.innerHeight;

    // Progress: 0 when app-wrap enters viewport, 1 when it reaches center
    var progress = 1 - Math.max(0, Math.min(1, (rect.top - viewH * 0.3) / (viewH * 0.5)));

    // Rotate from 8deg to 0, scale from 0.95 to 1
    var rotateX = 8 * (1 - progress);
    var scale = 0.95 + 0.05 * progress;

    appWin.style.transform = 'perspective(1200px) rotateX(' + rotateX + 'deg) scale(' + scale + ')';
    appWin.style.transformOrigin = 'center bottom';

    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateTransform);
      ticking = true;
    }
  }, { passive: true });

  // Initial state
  updateTransform();
})();

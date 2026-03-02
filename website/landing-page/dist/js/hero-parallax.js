// hero-parallax.js
// Mouse parallax effect for the hero section: translates .hero-glow by up to
// ±18 px on the X axis and ±8 px on the Y axis based on cursor position.
// Respects prefers-reduced-motion and uses a lerp-based damping loop for
// smooth, jank-free motion (rAF instead of direct transform on every event).

(function() {

  const heroGlow = document.querySelector('.hero-glow');
  if (!heroGlow) return;

  // Bail out entirely for users who prefer reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId = null;

  // Lerp factor — smaller = smoother/slower follow, larger = snappier
  const LERP = 0.08;

  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 18;
    targetY = (e.clientY / window.innerHeight - 0.5) * 8;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, {passive: true});

  function tick() {
    // Exponential smoothing toward target
    currentX += (targetX - currentX) * LERP;
    currentY += (targetY - currentY) * LERP;

    heroGlow.style.transform = `translate(${currentX.toFixed(3)}px, ${currentY.toFixed(3)}px)`;

    const dx = Math.abs(targetX - currentX);
    const dy = Math.abs(targetY - currentY);

    // Keep looping while there is still meaningful movement
    if (dx > 0.05 || dy > 0.05) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

})();

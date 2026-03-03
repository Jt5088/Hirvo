/* Feature Grid — mouse-following border glow
   Injects a .fcard-glow child into each .fcard, tracks pointer position,
   computes angle from card center → cursor, and smoothly animates a
   conic-gradient spotlight around the card border.
   Ported from GlowingEffect React component to vanilla JS. */
(function () {
  'use strict';

  var cards = document.querySelectorAll('.fcard');
  if (!cards.length) return;

  var PROXIMITY = 120;
  var INACTIVE_ZONE = 0.01;
  var SPREAD = 55;
  var BORDER = 1;
  var LERP = 0.12;

  var glows = [];
  var states = [];

  /* Inject glow element into each card */
  for (var i = 0; i < cards.length; i++) {
    var el = document.createElement('div');
    el.className = 'fcard-glow';
    el.style.setProperty('--fg-spread', String(SPREAD));
    el.style.setProperty('--fg-border', BORDER + 'px');
    el.style.setProperty('--fg-active', '0');
    el.style.setProperty('--fg-start', '0');
    cards[i].appendChild(el);
    glows.push(el);
    states.push({ angle: 0, active: false });
  }

  var mx = 0, my = 0;
  var rafId = null;

  function tick() {
    var anyActive = false;

    for (var i = 0; i < cards.length; i++) {
      var rect = cards[i].getBoundingClientRect();
      var cx = rect.left + rect.width * 0.5;
      var cy = rect.top + rect.height * 0.5;

      /* Dead zone at card center */
      var dist = Math.hypot(mx - cx, my - cy);
      var deadR = 0.5 * Math.min(rect.width, rect.height) * INACTIVE_ZONE;

      if (dist < deadR) {
        glows[i].style.setProperty('--fg-active', '0');
        states[i].active = false;
        continue;
      }

      /* Proximity check */
      var near = mx > rect.left - PROXIMITY &&
                 mx < rect.right + PROXIMITY &&
                 my > rect.top - PROXIMITY &&
                 my < rect.bottom + PROXIMITY;

      states[i].active = near;
      glows[i].style.setProperty('--fg-active', near ? '1' : '0');

      if (!near) continue;
      anyActive = true;

      /* Compute target angle (degrees, 0 = top) */
      var target = Math.atan2(my - cy, mx - cx) * (180 / Math.PI) + 90;

      /* Shortest-path angle difference */
      var diff = ((target - states[i].angle + 180) % 360) - 180;
      states[i].angle += diff * LERP;

      glows[i].style.setProperty('--fg-start', states[i].angle.toFixed(1));
    }

    rafId = anyActive ? requestAnimationFrame(tick) : null;
  }

  function onMove(e) {
    mx = e.clientX;
    my = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function onScroll() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  document.body.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
})();

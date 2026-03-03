/* Testimonials — JS-driven marquee
   Hover = gradual slow-down. Click = center clicked card with glow.
   Mouse leaves marquee → resumes scrolling. */
(function () {
  var track = document.querySelector('.t-track');
  var marquee = document.querySelector('.t-marquee');
  if (!track || !marquee) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  track.style.animation = 'none';

  var halfW = track.scrollWidth / 2;
  var pos = 0;
  var baseSpeed = halfW / (40 * 60);
  var cruiseSpeed = baseSpeed * 1.1;
  var speed = cruiseSpeed;
  var targetSpeed = cruiseSpeed;

  /* Centering animation state */
  var animStart = null;
  var animFrom = 0;
  var animTo = 0;
  var animDuration = 900;
  var animating = false;

  var cards = marquee.querySelectorAll('.tcard');
  var focusedCard = null;

  /* EaseInOutCubic — gentle start, smooth glide, soft landing */
  function ease(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function unfocus() {
    if (focusedCard) focusedCard.classList.remove('expanded');
    focusedCard = null;
    animating = false;
    animStart = null;
    targetSpeed = cruiseSpeed;
  }

  function centerOnCard(card) {
    if (focusedCard) focusedCard.classList.remove('expanded');
    card.classList.add('expanded');
    focusedCard = card;
    targetSpeed = 0;

    var cardCenter = card.offsetLeft + card.offsetWidth / 2;
    var viewCenter = marquee.offsetWidth / 2;
    var rawTarget = -(cardCenter - viewCenter);

    /* Shortest path wrapping */
    var diff = rawTarget - pos;
    diff = diff - halfW * Math.round(diff / halfW);

    animFrom = pos;
    animTo = pos + diff;

    /* Duration scales with distance — generous timing for smooth glide */
    var absDiff = Math.abs(diff);
    animDuration = Math.max(900, Math.min(1400, absDiff * 2.2));

    animStart = null;
    animating = true;
    speed = 0;
  }

  /* Hover = gradual slow-down */
  marquee.addEventListener('mouseenter', function () {
    if (!focusedCard) targetSpeed = cruiseSpeed * 0.06;
  });
  marquee.addEventListener('mouseleave', function () {
    unfocus();
  });

  /* Click = center the clicked card directly */
  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.stopPropagation();

      if (focusedCard === card) {
        /* Clicking the same card again — release */
        unfocus();
      } else {
        /* Center on whichever card was clicked */
        centerOnCard(card);
      }
    });
  });

  /* Seamless wrap — keeps pos in [-halfW, 0) range */
  function wrap() {
    if (pos <= -halfW) {
      pos += halfW;
      animFrom += halfW;
      animTo += halfW;
    } else if (pos > 0) {
      pos -= halfW;
      animFrom -= halfW;
      animTo -= halfW;
    }
  }

  /* rAF loop */
  function tick(now) {
    if (animating) {
      if (animStart === null) animStart = now;
      var elapsed = now - animStart;
      var t = Math.min(1, elapsed / animDuration);
      var eased = ease(t);

      pos = animFrom + (animTo - animFrom) * eased;

      if (t >= 1) {
        pos = animTo;
        animating = false;
        animStart = null;
        speed = 0;
      }
    } else {
      /* Smooth speed transitions */
      speed += (targetSpeed - speed) * 0.06;
      pos -= speed;
    }

    wrap();
    track.style.transform = 'translateX(' + pos + 'px)';
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

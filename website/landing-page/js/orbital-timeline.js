/* Orbital Timeline — recruiter screening visualization
   Renders orbital nodes around the CPU architecture SVG center.
   Nodes auto-rotate; clicking a node centers it and shows detail card.
   Lines connect each node to the center CPU. */
(function () {
  'use strict';

  var container = document.getElementById('orbital-timeline');
  if (!container) return;

  /* ── Timeline data ── */
  var data = [
    {
      id: 1,
      title: 'ATS Parse',
      step: 'Step 1',
      content: 'Your resume enters the applicant tracking system. Workday, Greenhouse, or Lever parses every field \u2014 and silently drops what it can\u2019t read.',
      status: 'completed',
      energy: 100,
      relatedIds: [2],
      icon: 'file'
    },
    {
      id: 2,
      title: 'Recruiter Skim',
      step: 'Step 2',
      content: '6\u201310 seconds. The recruiter scans your headline, current role, and company names. That\u2019s all they see before the first gut call.',
      status: 'completed',
      energy: 85,
      relatedIds: [1, 3],
      icon: 'eye'
    },
    {
      id: 3,
      title: 'Keyword Match',
      step: 'Step 3',
      content: 'The job req has must-have skills. Your resume either hits them or it doesn\u2019t. Most don\u2019t \u2014 and you never find out which ones you missed.',
      status: 'in-progress',
      energy: 60,
      relatedIds: [2, 4],
      icon: 'search'
    },
    {
      id: 4,
      title: 'Experience Check',
      step: 'Step 4',
      content: 'Years of experience, industry fit, career trajectory \u2014 measured against a hidden checklist that shifts with every recruiter.',
      status: 'pending',
      energy: 35,
      relatedIds: [3, 5],
      icon: 'filter'
    },
    {
      id: 5,
      title: 'Final Verdict',
      step: 'Step 5',
      content: 'Pass, borderline, or reject. Decided in under 30 seconds. No explanation sent back \u2014 just silence or a template email.',
      status: 'pending',
      energy: 10,
      relatedIds: [4],
      icon: 'verdict'
    }
  ];

  /* ── SVG icons (16 x 16, stroke-based) ── */
  var icons = {
    file: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5L9 1z"/><path d="M9 1v4h4"/><line x1="6" y1="8" x2="10" y2="8"/><line x1="6" y1="11" x2="10" y2="11"/></svg>',
    eye: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="6.5" r="4"/><line x1="14" y1="14" x2="10" y2="10"/></svg>',
    filter: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="2" y1="4" x2="14" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="6" y1="12" x2="10" y2="12"/></svg>',
    verdict: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8.5 6.5 12 13 4"/></svg>'
  };

  var arrowSvg = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  var linkSvg = '<svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3L3 6l3 3"/><path d="M3 6h7a3 3 0 013 3v1"/></svg>';

  /* ── State ── */
  var angle = 0;
  var targetAngle = null;
  var autoRotate = true;
  var activeId = null;
  var nodeEls = {};
  var lineEls = {};
  var glowLineEls = {};
  var linesSvg = null;
  var rafId = null;

  /* ── Glow colors — one per node (intentional per-component palette) ── */
  var glowColors = ['#8B9CC2', '#A8B4A0', '#C4A882', '#9BAAB5', '#B8A9C4'];

  /* Glow timing — slow fill from chip → just before node icon border */
  var FILL_DUR = 2793;  /* ms to fill (another 30% faster) */
  var HOLD_DUR = 294;   /* ms to hold at full before fading */
  var FADE_DUR = 588;   /* ms to fade out after hold */
  var NODE_DUR = FILL_DUR + HOLD_DUR + FADE_DUR; /* 7500ms total per node */
  var STAGGER = NODE_DUR + 1100; /* wait 1.1s after previous finishes */
  var FULL_CYCLE = data.length * STAGGER; /* ~43s full sequence */
  var GLOW_PEAK = 0.65; /* intensity */
  var GLOW_DEPTH_FLOOR = 0.55;
  var NODE_GAP = 35;  /* icon 46px outer + label offsets icon center from node center */

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Chip edge helper ──
     Ray-rect intersection: where line from center → node exits HIRVO chip.
     Chip SVG: rect x=85 y=40 w=30 h=20 in viewBox 0 0 200 100.
     .ot-cpu width set by CSS (600/400/280px). Scale = cpuWidth / 200. */
  var cpuEl = container.querySelector('.ot-cpu');
  var cachedCpuW = cpuEl ? cpuEl.offsetWidth : 600;
  function getChipEdge(cx, cy, dx, dy) {
    var scale = cachedCpuW / 200;
    var hw = 15 * scale; /* half chip width in pixels (30/2 SVG units) */
    var hh = 10 * scale; /* half chip height in pixels (20/2 SVG units) */
    var absDx = Math.abs(dx);
    var absDy = Math.abs(dy);
    var tx = absDx > 0.01 ? hw / absDx : 9999;
    var ty = absDy > 0.01 ? hh / absDy : 9999;
    var t = Math.min(tx, ty);
    return { x: cx + dx * t, y: cy + dy * t };
  }

  /* ── Helpers ── */
  function getRadius() {
    var w = container.offsetWidth;
    if (w < 400) return 180;
    if (w < 600) return 220;
    if (w < 800) return 260;
    return 330;
  }

  function statusLabel(s) {
    if (s === 'completed') return 'Complete';
    if (s === 'in-progress') return 'In Progress';
    return 'Pending';
  }

  function updateLinesViewBox() {
    if (!linesSvg) return;
    linesSvg.setAttribute('viewBox', '0 0 ' + container.offsetWidth + ' ' + container.offsetHeight);
  }

  /* ── Build DOM — nodes + connector lines (SVG + ring are in HTML) ── */
  function build() {
    /* Create connector-lines SVG */
    linesSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    linesSvg.setAttribute('class', 'ot-lines');
    updateLinesViewBox();

    for (var k = 0; k < data.length; k++) {
      /* Base connector line (dashed) */
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('stroke', 'rgba(255,255,255,0.18)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '4 3');
      line.style.transition = 'stroke 0.4s ease, stroke-width 0.4s ease';
      linesSvg.appendChild(line);
      lineEls[data[k].id] = line;

      /* Glow string — subtle colored line, 45% narrower (1.65px) */
      var glowLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      glowLine.setAttribute('stroke', glowColors[k]);
      glowLine.setAttribute('stroke-width', '2');
      glowLine.setAttribute('stroke-linecap', 'round');
      glowLine.setAttribute('opacity', '0');
      linesSvg.appendChild(glowLine);
      glowLineEls[data[k].id] = glowLine;
    }

    /* Insert lines SVG before the ring */
    var ringEl = document.getElementById('ot-ring');
    container.insertBefore(linesSvg, ringEl);

    /* Build node HTML */
    var h = '';

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      h += '<div class="ot-node" data-id="' + item.id + '">';

      /* Glow aura */
      var glowSize = item.energy * 0.6 + 50;
      h += '<div class="ot-node-glow" style="width:' + glowSize + 'px;height:' + glowSize + 'px"></div>';

      /* Icon */
      h += '<div class="ot-node-icon">' + icons[item.icon] + '</div>';

      /* Label */
      h += '<div class="ot-node-label">' + item.title + '</div>';

      /* Expanded card */
      h += '<div class="ot-card">';
      h += '<div class="ot-card-head">';
      h += '<span class="ot-badge ot-badge-' + item.status + '">' + statusLabel(item.status) + '</span>';
      h += '<span class="ot-card-date">' + item.step + '</span>';
      h += '</div>';
      h += '<div class="ot-card-title">' + item.title + '</div>';
      h += '<div class="ot-card-desc">' + item.content + '</div>';

      /* Energy bar */
      h += '<div class="ot-energy">';
      h += '<div class="ot-energy-head"><span>Screening weight</span><span>' + item.energy + '%</span></div>';
      h += '<div class="ot-energy-bar"><div class="ot-energy-fill" style="width:' + item.energy + '%"></div></div>';
      h += '</div>';

      /* Connected nodes */
      if (item.relatedIds.length > 0) {
        h += '<div class="ot-connected">';
        h += '<div class="ot-connected-lbl">' + linkSvg + ' Connected Steps</div>';
        h += '<div>';
        for (var r = 0; r < item.relatedIds.length; r++) {
          var rid = item.relatedIds[r];
          var rel = null;
          for (var d = 0; d < data.length; d++) { if (data[d].id === rid) { rel = data[d]; break; } }
          if (rel) {
            h += '<button class="ot-connected-btn" data-goto="' + rid + '">' + rel.title + arrowSvg + '</button>';
          }
        }
        h += '</div></div>';
      }

      h += '</div>'; /* .ot-card */
      h += '</div>'; /* .ot-node */
    }

    /* Append nodes (preserves SVG, lines, and ring already in HTML) */
    container.insertAdjacentHTML('beforeend', h);

    /* Cache node elements */
    for (var n = 0; n < data.length; n++) {
      nodeEls[data[n].id] = container.querySelector('[data-id="' + data[n].id + '"]');
    }

    /* Event delegation */
    container.addEventListener('click', handleClick);
  }

  /* ── Click handler ── */
  function handleClick(e) {
    var gotoBtn = e.target.closest('.ot-connected-btn');
    if (gotoBtn) {
      e.stopPropagation();
      activateNode(parseInt(gotoBtn.getAttribute('data-goto')));
      return;
    }

    if (e.target.closest('.ot-card')) return;

    var nodeEl = e.target.closest('.ot-node');
    if (nodeEl) {
      var id = parseInt(nodeEl.getAttribute('data-id'));
      if (activeId === id) {
        deactivateAll();
      } else {
        activateNode(id);
      }
      return;
    }

    deactivateAll();
  }

  /* ── Activate / deactivate ── */
  function activateNode(id) {
    activeId = id;
    autoRotate = false;

    var relatedIds = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) { relatedIds = data[i].relatedIds; break; }
    }

    for (var j = 0; j < data.length; j++) {
      var el = nodeEls[data[j].id];
      if (!el) continue;
      el.classList.remove('active', 'related');
      if (data[j].id === id) el.classList.add('active');
      else if (relatedIds.indexOf(data[j].id) !== -1) el.classList.add('related');
    }

    centerOnNode(id);
  }

  function deactivateAll() {
    activeId = null;
    autoRotate = true;
    targetAngle = null;
    for (var i = 0; i < data.length; i++) {
      var el = nodeEls[data[i].id];
      if (el) el.classList.remove('active', 'related');
    }
  }

  function centerOnNode(id) {
    var idx = -1;
    for (var i = 0; i < data.length; i++) { if (data[i].id === id) { idx = i; break; } }
    if (idx === -1) return;

    var nodeBaseAngle = (idx / data.length) * 360;
    var target = (270 - nodeBaseAngle + 3600) % 360;

    var diff = target - angle;
    if (diff > 180) target -= 360;
    else if (diff < -180) target += 360;

    targetAngle = target;
  }

  /* ── Position nodes + update connector lines ── */
  function positionNodes(now) {
    var radius = getRadius();
    var total = data.length;
    var cx = container.offsetWidth / 2;
    var cy = container.offsetHeight / 2;

    /* Size ring to match orbit */
    var ring = document.getElementById('ot-ring');
    if (ring) {
      ring.style.width = (radius * 2) + 'px';
      ring.style.height = (radius * 2) + 'px';
    }

    for (var i = 0; i < data.length; i++) {
      var el = nodeEls[data[i].id];
      if (!el) continue;

      var nodeAngle = ((i / total) * 360 + angle) % 360;
      var radian = (nodeAngle * Math.PI) / 180;

      var x = radius * Math.cos(radian);
      var y = radius * Math.sin(radian);

      /* Depth: top = bright (front), bottom = dim (back) */
      var depthOpacity = 0.35 + 0.65 * ((1 - Math.sin(radian)) / 2);
      var zIndex = Math.round(100 - 50 * Math.sin(radian));

      var isActive = el.classList.contains('active');
      var isRelated = el.classList.contains('related');

      el.style.transform = 'translate(calc(-50% + ' + x.toFixed(1) + 'px), calc(-50% + ' + y.toFixed(1) + 'px))';
      el.style.zIndex = isActive ? 200 : zIndex;
      el.style.opacity = isActive ? 1 : depthOpacity;

      /* Chip edge — lines start from HIRVO rectangle border, not literal center */
      var edge = getChipEdge(cx, cy, x, y);
      var x2 = cx + x, y2 = cy + y;

      /* Update base connector line */
      var lineEl = lineEls[data[i].id];
      if (lineEl) {
        lineEl.setAttribute('x1', edge.x.toFixed(1));
        lineEl.setAttribute('y1', edge.y.toFixed(1));
        lineEl.setAttribute('x2', x2.toFixed(1));
        lineEl.setAttribute('y2', y2.toFixed(1));

        if (isActive) {
          lineEl.setAttribute('stroke', 'rgba(52,211,153,0.45)');
          lineEl.setAttribute('stroke-width', '1.5');
          lineEl.setAttribute('stroke-dasharray', 'none');
        } else if (isRelated) {
          lineEl.setAttribute('stroke', 'rgba(52,211,153,0.25)');
          lineEl.setAttribute('stroke-width', '1');
          lineEl.setAttribute('stroke-dasharray', '6 4');
        } else {
          lineEl.setAttribute('stroke', 'rgba(255,255,255,0.18)');
          lineEl.setAttribute('stroke-width', '1');
          lineEl.setAttribute('stroke-dasharray', '4 3');
        }
        lineEl.setAttribute('opacity', isActive ? 1 : depthOpacity);
      }

      /* Animate glow — slow fill from chip edge → node surface */
      var glowLine = glowLineEls[data[i].id];
      if (glowLine && now) {
        /* Line from chip edge to node surface (not through it) */
        var dx = x2 - edge.x;
        var dy = y2 - edge.y;
        var fullLen = Math.sqrt(dx * dx + dy * dy);
        var maxLen = Math.max(0, fullLen - NODE_GAP);
        /* Pull the endpoint back to node surface */
        var endX = fullLen > 0.1 ? edge.x + dx * (maxLen / fullLen) : x2;
        var endY = fullLen > 0.1 ? edge.y + dy * (maxLen / fullLen) : y2;

        /* Where is this node in the staggered sequence? */
        var nodeStart = i * STAGGER;
        var t = ((now % FULL_CYCLE) - nodeStart + FULL_CYCLE) % FULL_CYCLE;

        var glowDepth = Math.max(depthOpacity, GLOW_DEPTH_FLOOR);
        var fillLen = 0;
        var opacity = 0;

        if (t < NODE_DUR) {
          if (t < FILL_DUR) {
            /* Filling phase — smoothstep easing for fluid motion */
            var p = t / FILL_DUR;
            var eased = p * p * (3 - 2 * p); /* smoothstep: 0→1, zero derivative at both ends */
            fillLen = maxLen * eased;
            /* Smooth fade-in over first 15% using same smoothstep */
            var fadeIn = Math.min(1, p / 0.15);
            opacity = GLOW_PEAK * (fadeIn * fadeIn * (3 - 2 * fadeIn)) * glowDepth;
          } else if (t < FILL_DUR + HOLD_DUR) {
            /* Hold at full — line touches node surface */
            fillLen = maxLen;
            opacity = GLOW_PEAK * glowDepth;
          } else {
            /* Fade out — smooth ease-out curve */
            var fp = (t - FILL_DUR - HOLD_DUR) / FADE_DUR;
            var fadeOut = 1 - fp * fp; /* ease-out quadratic */
            fillLen = maxLen;
            opacity = GLOW_PEAK * fadeOut * glowDepth;
          }
        }

        /* Position glow line to node surface, clip fill with dasharray */
        glowLine.setAttribute('x1', edge.x.toFixed(1));
        glowLine.setAttribute('y1', edge.y.toFixed(1));
        glowLine.setAttribute('x2', endX.toFixed(1));
        glowLine.setAttribute('y2', endY.toFixed(1));
        glowLine.setAttribute('stroke-dasharray',
          fillLen.toFixed(1) + ' ' + (maxLen + 10).toFixed(1));
        glowLine.setAttribute('opacity', opacity.toFixed(3));
      }
    }
  }

  /* ── Animation loop ── */
  function tick() {
    var now = performance.now();

    if (targetAngle !== null) {
      var diff = targetAngle - angle;
      if (Math.abs(diff) < 0.3) {
        angle = targetAngle;
        targetAngle = null;
      } else {
        angle += diff * 0.08;
      }
    } else if (autoRotate && !prefersReducedMotion) {
      angle = (angle + 0.15) % 360;
    }

    positionNodes(now);
    rafId = requestAnimationFrame(tick);
  }

  /* ── IntersectionObserver — only animate when visible ── */
  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        if (!rafId) rafId = requestAnimationFrame(tick);
      } else {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    }
  }, { threshold: 0.1 });

  /* ── Init ── */
  build();
  positionNodes();
  observer.observe(container);

  /* ── Resize ── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      cachedCpuW = cpuEl ? cpuEl.offsetWidth : 600;
      updateLinesViewBox();
      positionNodes(performance.now());
    }, 100);
  });
})();

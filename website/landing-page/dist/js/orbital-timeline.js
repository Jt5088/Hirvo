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
  var rotVelocity = 0;
  var autoRotate = true;
  var rotationStartTime = 0;     /* timestamp when rotation begins */
  var ROTATION_RAMP = 2000;      /* ms to ease into full rotation speed */
  var activeId = null;
  var nodeEls = {};
  var iconEls = {};
  var pulsedNodes = {};
  var glowLineEls = {};
  var linesSvg = null;
  var rafId = null;
  var hoveredId = null;       /* node currently hovered (null = none) */
  var hoverWireT = {};        /* per-node hover wire animation progress 0→1 */
  var hoverWireDir = {};      /* per-node: 1 = filling in, -1 = fading out */

  /* ── Wire colors — warm gradient progression ── */
  var glowColors = ['#E8A87C', '#D4789C', '#B878B8', '#8C8CC8', '#A8B4C0'];

  function hexToRgb(hex) {
    return parseInt(hex.slice(1,3),16)+','+parseInt(hex.slice(3,5),16)+','+parseInt(hex.slice(5,7),16);
  }
  var glowRgbs = [];
  for (var g = 0; g < glowColors.length; g++) {
    glowRgbs.push(hexToRgb(glowColors[g]));
  }

  /* Glow timing */
  var FILL_DUR = 2730;  /* ms to fill (was 3212) */
  var HOLD_DUR = 287;   /* ms to hold near orb (was 338) */
  var FADE_DUR = 575;   /* ms to fade out (was 676) */
  var NODE_DUR = FILL_DUR + HOLD_DUR + FADE_DUR;
  var STAGGER = NODE_DUR + 935;
  var FULL_CYCLE = data.length * STAGGER;
  var GLOW_PEAK = 0.61; /* +10% intensity */
  var GLOW_DEPTH_FLOOR = 0.50;
  /* Asymptote: wire reaches (1 - e^-7) = 99.91% of maxLen — sub-pixel gap, never 100% */
  var ASYM = 1 - Math.exp(-7);
  var ICON_RADIUS = 24; /* 23px half-icon + 1px border — stops exactly at outer edge */
  var ICON_OFFSET = 13; /* icon center offset above node center (label pushes it up) */

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Intro entrance sequence ── */
  var introPlayed = false;
  var introActive = false;
  var introStart = 0;
  var glowBaseTime = 0;
  var INTRO_RING_DUR = 2800;    /* slow, smooth ring draw */
  var INTRO_RING_START = 500;   /* ring starts at this offset */
  var INTRO_WIRE_DELAY = INTRO_RING_START + INTRO_RING_DUR + 350; /* gentle pause after ring, then wires */
  var INTRO_WIRE_DUR = 2000;    /* leisurely beam travel */
  var INTRO_WIRE_STAGGER = 0;   /* all wires fire simultaneously */
  var INTRO_HOLD = 800;
  var introFadeStart = 0;
  var INTRO_CROSSFADE = 1200; /* ms for intro wires to gently dim after intro ends */
  var ringCircleEl = null;
  var RING_CIRCUMFERENCE = 2 * Math.PI * 49.5; /* ~311.02, matches SVG r=49.5 */
  var glowEnabled = true;       /* normal glow wires active */
  var glowEnableTime = 0;       /* timestamp when glow wires fade in */
  var GLOW_ENTER_DELAY = 200;   /* ms of pure rotation before glow wires appear */
  var GLOW_FADE_IN = 600;       /* ms for glow wires to fade in from 0 */
  var introRingDone = false;

  /* ── Chip edge helper ──
     Ray-rect intersection: where line from center → node exits HIRVO chip.
     Chip SVG: rect x=75 y=36 w=50 h=28 in viewBox 0 0 200 100.
     .ot-cpu width set by CSS (420/320/220px). Scale = cpuWidth / 200. */
  var cpuEl = container.querySelector('.ot-cpu');
  var cachedCpuW = cpuEl ? cpuEl.offsetWidth : 420;
  var shimmerGrad = document.getElementById('cpu-text-gradient');
  function getChipEdge(cx, cy, dx, dy) {
    var scale = cachedCpuW / 200;
    var hw = 25 * scale; /* half chip width in pixels (50/2 SVG units) */
    var hh = 14 * scale; /* half chip height in pixels (28/2 SVG units) */
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
    if (w < 400) return 140;
    if (w < 600) return 175;
    if (w < 800) return 210;
    return 250;
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

    /* SVG filter: crisp 1px core + soft halo behind it */
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var filt = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filt.setAttribute('id', 'ot-wire-glow');
    filt.setAttribute('x', '-100%'); filt.setAttribute('y', '-100%');
    filt.setAttribute('width', '300%'); filt.setAttribute('height', '300%');
    var blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('stdDeviation', '2');
    blur.setAttribute('result', 'blur');
    var merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    var mn1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    mn1.setAttribute('in', 'blur');
    var mn2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    mn2.setAttribute('in', 'SourceGraphic');
    merge.appendChild(mn1); merge.appendChild(mn2);
    filt.appendChild(blur); filt.appendChild(merge);
    defs.appendChild(filt);
    linesSvg.appendChild(defs);

    for (var k = 0; k < data.length; k++) {
      /* Thin crisp wire with soft halo via filter */
      var glowLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      glowLine.setAttribute('stroke', glowColors[k]);
      glowLine.setAttribute('stroke-width', '1');
      glowLine.setAttribute('stroke-linecap', 'round');
      glowLine.setAttribute('filter', 'url(#ot-wire-glow)');
      glowLine.setAttribute('opacity', '0');
      linesSvg.appendChild(glowLine);
      glowLineEls[data[k].id] = glowLine;
    }

    /* Insert lines SVG before the ring */
    var ringEl = document.getElementById('ot-ring');
    container.insertBefore(linesSvg, ringEl);

    /* Replace CSS border with SVG circle (enables stroke draw animation) */
    if (ringEl) {
      ringEl.style.borderColor = 'transparent';
      var ringSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      ringSvg.setAttribute('class', 'ot-ring-svg');
      ringSvg.setAttribute('viewBox', '0 0 100 100');
      ringCircleEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ringCircleEl.setAttribute('cx', '50');
      ringCircleEl.setAttribute('cy', '50');
      ringCircleEl.setAttribute('r', '49.5');
      ringCircleEl.setAttribute('fill', 'none');
      ringCircleEl.setAttribute('stroke', 'rgba(255,255,255,0.07)');
      ringCircleEl.setAttribute('stroke-width', '0.15');
      ringCircleEl.setAttribute('stroke-linecap', 'round');
      ringCircleEl.setAttribute('stroke-dasharray', RING_CIRCUMFERENCE.toFixed(2));
      /* Rotate so draw starts from top (12 o'clock) */
      ringCircleEl.setAttribute('transform', 'rotate(-90 50 50)');
      if (!prefersReducedMotion) {
        /* Start hidden — will animate to 0 during intro */
        ringCircleEl.setAttribute('stroke-dashoffset', RING_CIRCUMFERENCE.toFixed(2));
      }
      ringSvg.appendChild(ringCircleEl);
      ringEl.appendChild(ringSvg);
    }

    /* Intro: hide nodes before they're appended (prevents flash) */
    if (!prefersReducedMotion) container.classList.add('ot-intro');

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

    /* Cache node + icon elements, set per-node glow color as CSS variable */
    for (var n = 0; n < data.length; n++) {
      nodeEls[data[n].id] = container.querySelector('[data-id="' + data[n].id + '"]');
      if (nodeEls[data[n].id]) {
        nodeEls[data[n].id].style.setProperty('--node-glow-rgb', glowRgbs[n]);
        nodeEls[data[n].id].style.setProperty('--breathe-delay', (n * 0.9) + 's');
        iconEls[data[n].id] = nodeEls[data[n].id].querySelector('.ot-node-icon');
      }
    }

    /* Event delegation */
    container.addEventListener('click', handleClick);

    /* Hover wire — mouseenter/leave on each node */
    for (var m = 0; m < data.length; m++) {
      (function (id) {
        var el = nodeEls[id];
        if (!el) return;
        hoverWireT[id] = 0;
        hoverWireDir[id] = 0;
        el.addEventListener('mouseenter', function () {
          hoveredId = id;
          hoverWireDir[id] = 1;
        });
        el.addEventListener('mouseleave', function () {
          if (hoveredId === id) hoveredId = null;
          hoverWireDir[id] = -1;
        });
      })(data[m].id);
    }
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
    rotVelocity = 0;
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

      /* Animate glow — slow fill from chip edge → node surface */
      var glowLine = glowLineEls[data[i].id];
      if (glowLine && now) {
        /* Target the icon center (offset above node center due to label) */
        var iconX = x2;
        var iconY = y2 - ICON_OFFSET;
        var dx = iconX - edge.x;
        var dy = iconY - edge.y;
        var distToIcon = Math.sqrt(dx * dx + dy * dy);
        /* Stop exactly at icon outer border; recomputed every frame for moving orb */
        var maxLen = Math.max(0, distToIcon - ICON_RADIUS);
        var safeLen = maxLen * ASYM; /* asymptotic target — sub-pixel short of border */
        var endX = distToIcon > ICON_RADIUS ? edge.x + dx * (safeLen / distToIcon) : edge.x;
        var endY = distToIcon > ICON_RADIUS ? edge.y + dy * (safeLen / distToIcon) : edge.y;

        var fillLen = 0;
        var lineOp = 0;

        if (introActive) {
          /* ── Intro: all wires fire in rapid succession from CPU ── */
          var elapsed = now - introStart;
          var wireStart = INTRO_WIRE_DELAY + i * INTRO_WIRE_STAGGER;
          var wireT = elapsed - wireStart;

          if (wireT > 0) {
            if (wireT < INTRO_WIRE_DUR) {
              var wp = wireT / INTRO_WIRE_DUR;
              /* Smooth ease-out — gentle deceleration into icon */
              var we = 1 - Math.pow(1 - wp, 3);
              fillLen = safeLen * we;
              /* Opacity fades in over first 30% then holds */
              var wFade = Math.min(1, wp / 0.3);
              lineOp = 0.52 * (wFade * wFade * (3 - 2 * wFade));
            } else {
              fillLen = safeLen;
              var holdT = wireT - INTRO_WIRE_DUR;
              if (holdT < INTRO_HOLD) {
                lineOp = 0.32;
              } else {
                /* Gentle linear fade — crossfade catches the rest */
                var hfp = Math.min(1, (holdT - INTRO_HOLD) / 800);
                lineOp = 0.32 * (1 - hfp);
              }
            }
            /* Light up node when beam touches the icon edge */
            if (fillLen >= safeLen * 0.95 && !el.classList.contains('ot-lit')) {
              el.classList.add('ot-lit');
            }
          }
        } else if (glowEnabled) {
          /* ── Normal: staggered glow cycle with fade-in after intro ── */
          var glowFadeIn = glowEnableTime > 0
            ? Math.min(1, (now - glowEnableTime) / GLOW_FADE_IN) : 1;
          var glowTime = now - glowBaseTime;
          var nodeStart = i * STAGGER;
          var t = ((glowTime % FULL_CYCLE) - nodeStart + FULL_CYCLE) % FULL_CYCLE;
          var glowDepth = Math.max(depthOpacity, GLOW_DEPTH_FLOOR);

          if (t < NODE_DUR) {
            if (t < FILL_DUR) {
              var p = t / FILL_DUR;
              fillLen = safeLen * (1 - Math.exp(-7 * p));
              var fadeIn = Math.min(1, p / 0.20);
              lineOp = GLOW_PEAK * (fadeIn * fadeIn * (3 - 2 * fadeIn)) * glowDepth * glowFadeIn;
            } else if (t < FILL_DUR + HOLD_DUR) {
              fillLen = safeLen;
              lineOp = GLOW_PEAK * glowDepth * glowFadeIn;
            } else {
              var fp = (t - FILL_DUR - HOLD_DUR) / FADE_DUR;
              fillLen = safeLen;
              lineOp = GLOW_PEAK * (1 - fp * fp) * glowDepth * glowFadeIn;
            }
          }

          /* Node icon pulse — expand + glow when beam arrives */
          var pulseIcon = iconEls[data[i].id];
          if (pulseIcon && !isActive) {
            var pulseOn = t >= FILL_DUR * 0.88
              && t < FILL_DUR + HOLD_DUR + FADE_DUR * 0.5;
            if (pulseOn && !pulsedNodes[data[i].id]) {
              pulsedNodes[data[i].id] = true;
              pulseIcon.style.transform = 'scale(1.1)';
              pulseIcon.style.boxShadow =
                '0 0 12px 3px rgba(' + glowRgbs[i] + ',0.22),'
                + '0 0 5px 1px rgba(' + glowRgbs[i] + ',0.12)';
            } else if (!pulseOn && pulsedNodes[data[i].id]) {
              pulsedNodes[data[i].id] = false;
              pulseIcon.style.transform = '';
              pulseIcon.style.boxShadow = '';
            }
          }
        }

        /* Crossfade: intro wires dim gently after intro ends */
        if (introFadeStart > 0 && now < introFadeStart + INTRO_CROSSFADE) {
          var cf = (now - introFadeStart) / INTRO_CROSSFADE;
          var fadeFloor = 0.24 * (1 - cf) * (1 - cf);
          if (fadeFloor > lineOp) {
            lineOp = fadeFloor;
            fillLen = safeLen;
          }
        } else if (introFadeStart > 0 && i === data.length - 1) {
          introFadeStart = 0;
        }

        /* ── Hover wire overlay — smooth fill/fade on mouseenter/leave ── */
        var hId = data[i].id;
        var hDir = hoverWireDir[hId] || 0;
        if (hDir !== 0) {
          /* ~400ms fill, ~500ms fade — frame-rate independent */
          var hSpeed = hDir > 0 ? (16.67 / 400) : (16.67 / 500);
          hoverWireT[hId] = Math.max(0, Math.min(1, (hoverWireT[hId] || 0) + hDir * hSpeed));
          if (hoverWireT[hId] <= 0) hoverWireDir[hId] = 0;
        }
        var ht = hoverWireT[hId] || 0;
        if (ht > 0) {
          /* Smoothstep easing */
          var he = ht * ht * (3 - 2 * ht);
          var hoverFill = safeLen * he;
          var hoverOp = 0.55 * he;
          if (hoverFill > fillLen) fillLen = hoverFill;
          if (hoverOp > lineOp) lineOp = hoverOp;
        }

        glowLine.setAttribute('x1', edge.x.toFixed(1));
        glowLine.setAttribute('y1', edge.y.toFixed(1));
        glowLine.setAttribute('x2', endX.toFixed(1));
        glowLine.setAttribute('y2', endY.toFixed(1));
        glowLine.setAttribute('stroke-dasharray',
          fillLen.toFixed(2) + ' ' + (safeLen + 10).toFixed(1));
        glowLine.setAttribute('opacity', lineOp.toFixed(3));
      }
    }

    /* ── HIRVO text shimmer — continuous circulation (starts as soon as ring completes) ── */
    if (shimmerGrad && now && introPlayed && (introRingDone || !introActive)) {
      var st = (now - glowBaseTime) % STAGGER;
      var sx;
      if (st < FILL_DUR) {
        /* Forward sweep H → O during wire fill */
        var fp = st / FILL_DUR;
        var fe = fp * fp * (3 - 2 * fp);
        sx = -0.45 + 0.9 * fe;
      } else {
        /* Return sweep O → H between wires — continuous circulation */
        var rp = (st - FILL_DUR) / (STAGGER - FILL_DUR);
        var re = rp * rp * (3 - 2 * rp);
        sx = 0.45 - 0.9 * re;
      }
      shimmerGrad.setAttribute('gradientTransform', 'translate(' + sx.toFixed(3) + ', 0)');
    }
  }

  /* ── Animation loop ── */
  function tick() {
    var now = performance.now();

    /* ── Intro phase management ── */
    if (introActive) {
      var elapsed = now - introStart;

      /* Phase 0: Chip outline fades in (200ms in) */
      if (elapsed >= 200 && !container.classList.contains('ot-cpu-visible')) {
        container.classList.add('ot-cpu-visible');
      }

      /* Phase 1: Ring draws + HIRVO text fades in synced to ring progress */
      var ringElapsed = Math.max(0, elapsed - INTRO_RING_START);
      var ringProgress = 0;
      if (ringCircleEl) {
        if (ringElapsed < INTRO_RING_DUR) {
          var rp = ringElapsed / INTRO_RING_DUR;
          /* Smooth ease-in-out */
          ringProgress = rp < 0.5
            ? 2 * rp * rp
            : 1 - 2 * (1 - rp) * (1 - rp);
          ringCircleEl.setAttribute('stroke-dashoffset',
            (RING_CIRCUMFERENCE * (1 - ringProgress)).toFixed(2));
        } else {
          ringProgress = 1;
          ringCircleEl.setAttribute('stroke-dashoffset', '0');
        }
      }

      /* HIRVO text opacity tracks ring progress — slightly delayed start, catches up */
      if (elapsed >= INTRO_RING_START) {
        var textProgress = Math.min(1, ringProgress * 1.25); /* text finishes at 80% ring */
        var textEase = textProgress * textProgress * (3 - 2 * textProgress);
        var cpuSvgText = container.querySelectorAll('.ot-cpu-svg text');
        for (var ti = 0; ti < cpuSvgText.length; ti++) {
          cpuSvgText[ti].style.opacity = textEase.toFixed(3);
        }
        /* Shimmer sweep synced to ring — matches circulation range exactly (-0.45 → +0.45) */
        if (shimmerGrad && !introRingDone) {
          shimmerGrad.setAttribute('gradientTransform',
            'translate(' + (-0.45 + 0.9 * ringProgress).toFixed(3) + ', 0)');
        }
      }

      /* Ring just completed — hand off to continuous shimmer seamlessly */
      if (!introRingDone && ringElapsed >= INTRO_RING_DUR) {
        introRingDone = true;
        /* Set glowBaseTime so circulation picks up at +0.45 (end of forward sweep)
           — it will naturally continue into the return sweep, no direction reversal */
        glowBaseTime = now - FILL_DUR;
      }

      /* Phase 2: CPU glows when wires start firing */
      if (elapsed >= INTRO_WIRE_DELAY && !container.classList.contains('ot-intro-firing')) {
        container.classList.add('ot-intro-firing');
      }
      if (elapsed >= INTRO_WIRE_DELAY + data.length * INTRO_WIRE_STAGGER + 400) {
        container.classList.remove('ot-intro-firing');
      }

      /* End intro after last wire completes + fade */
      var lastWireEnd = INTRO_WIRE_DELAY + (data.length - 1) * INTRO_WIRE_STAGGER
        + INTRO_WIRE_DUR + INTRO_HOLD + 150;
      if (elapsed > lastWireEnd) {
        introActive = false;
        introFadeStart = now;
        /* Enable continuous glow wire cycle — shimmer keeps its base time for seamless handoff */
        glowEnabled = true;
        glowEnableTime = now;
        container.classList.remove('ot-intro', 'ot-intro-bright', 'ot-intro-firing');
        /* Clear inline text opacity so it stays at full */
        var cpuTexts = container.querySelectorAll('.ot-cpu-svg text');
        for (var ti2 = 0; ti2 < cpuTexts.length; ti2++) {
          cpuTexts[ti2].style.opacity = '';
        }
        for (var n = 0; n < data.length; n++) {
          if (nodeEls[data[n].id]) nodeEls[data[n].id].classList.remove('ot-lit');
        }
      }
    }

    /* Continuous glow wires cycle after intro */

    /* ── Rotation — starts once all nodes are lit, ramps up smoothly ── */
    var canRotate = !introActive;
    if (introActive) {
      /* Check if all nodes have lit up */
      canRotate = true;
      for (var c = 0; c < data.length; c++) {
        if (nodeEls[data[c].id] && !nodeEls[data[c].id].classList.contains('ot-lit')) {
          canRotate = false;
          break;
        }
      }
      /* Mark the moment rotation first becomes possible */
      if (canRotate && rotationStartTime === 0) {
        rotationStartTime = now;
      }
    }
    if (canRotate) {
      if (targetAngle !== null) {
        /* Critically damped spring — smooth ease-in-out, no oscillation */
        var diff = targetAngle - angle;
        rotVelocity += diff * 0.005;
        rotVelocity *= 0.85;
        angle += rotVelocity;
        if (Math.abs(diff) < 0.15 && Math.abs(rotVelocity) < 0.05) {
          angle = targetAngle;
          targetAngle = null;
          rotVelocity = 0;
        }
      } else if (autoRotate && !prefersReducedMotion) {
        /* Smooth ramp from 0 to full speed */
        var rampT = rotationStartTime > 0
          ? Math.min(1, (now - rotationStartTime) / ROTATION_RAMP) : 1;
        var rampEase = rampT * rampT * (3 - 2 * rampT); /* smoothstep */
        angle = (angle + 0.15 * rampEase) % 360;
      }
    }

    positionNodes(now);
    rafId = requestAnimationFrame(tick);
  }

  /* ── IntersectionObserver — only animate when visible ── */
  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        if (!rafId) rafId = requestAnimationFrame(tick);
        /* Trigger intro on first intersection */
        if (!introPlayed && !prefersReducedMotion) {
          introPlayed = true;
          introActive = true;
          introStart = performance.now();
          /* Reset shimmer to pre-sweep position (matches circulation range start) */
          if (shimmerGrad) shimmerGrad.setAttribute('gradientTransform', 'translate(-0.45, 0)');
        }
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
      cachedCpuW = cpuEl ? cpuEl.offsetWidth : 420;
      updateLinesViewBox();
      positionNodes(performance.now());
    }, 100);
  });
})();

// app-window.js
// All interactive logic for the hero app window demo:
//   - HTML view templates (resume, ats, interview, recruiter, progress)
//   - animateScoreBars(): transitions score bar widths after render
//   - bindRecruiterRows(): click-to-activate recruiter profile rows
//   - bindRerun(): re-animates score bars on Re-run button click
//   - bindChatInput(): cycles through canned chat responses on send
//   - switchView(): fades out/in app-main content and re-binds handlers
//   - Sidebar tab click handlers and initial render

(function() {

  const appMain = document.getElementById('app-main');

  // ── View HTML templates ────────────────────────────────────────────────────

  const viewHTML = {
    resume: `
      <div class="app-main-hd">
        <span class="app-title">Resume Scan &mdash; Early Career Tech Recruiter</span>
        <div class="app-actions">
          <div class="chip chip-warn"><svg width="7" height="7" viewBox="0 0 7 7" fill="none"><circle cx="3.5" cy="3.5" r="2.5" fill="var(--amber)"/></svg>Borderline &mdash; Likely Skip</div>
          <div class="chip-rerun" id="rerun-btn" style="cursor:pointer;user-select:none;">Re-run</div>
        </div>
      </div>
      <div>
        <div class="score-sec-label">Score Overview</div>
        <div class="score-rows">
          <div class="score-row">
            <span class="score-name">ATS Pass Score</span>
            <div class="score-track"><div class="score-fill fill-green" data-target="74%"></div></div>
            <span class="score-val" style="color:var(--green);">74 / 100</span>
          </div>
          <div class="score-row">
            <span class="score-name">Human Readability</span>
            <div class="score-track"><div class="score-fill fill-amber" data-target="52%"></div></div>
            <span class="score-val" style="color:var(--amber);">52 / 100</span>
          </div>
          <div class="score-row">
            <span class="score-name">Signal Strength</span>
            <div class="score-track"><div class="score-fill fill-red" data-target="41%"></div></div>
            <span class="score-val" style="color:var(--red);">41 / 100</span>
          </div>
        </div>
      </div>
      <div>
        <div class="fb-sec-label">Recruiter Feedback</div>
        <div class="fb-cards">
          <div class="fb-card red">
            <div class="fb-card-hd">Why I stopped reading</div>
            <div class="fb-quote">"This project reads like coursework, not applied work. No ownership signal whatsoever."</div>
            <div class="fb-quote">"Impact metrics are vague. 'Improved performance' means nothing &mdash; by how much, compared to what?"</div>
          </div>
          <div class="fb-card purple">
            <div class="fb-card-hd">What would change my mind</div>
            <div class="fb-quote">"One deployed project with a live URL and real numbers would move this from borderline to strong."</div>
          </div>
        </div>
      </div>`,

    ats: `
      <div class="app-main-hd">
        <span class="app-title">ATS vs. Human &mdash; Side by Side</span>
        <div class="app-actions">
          <div class="chip" style="background:rgba(52,211,153,0.1);color:var(--green);border:1px solid rgba(52,211,153,0.3);">ATS: Pass</div>
          <div class="chip" style="background:rgba(248,113,113,0.1);color:var(--red);border:1px solid rgba(248,113,113,0.25);">Human: Stopped</div>
        </div>
      </div>
      <div class="uf-micro" style="margin-bottom:6px;">Resume evaluation</div>
      <div class="ats-grid">
        <div class="ats-col">
          <div class="ats-col-hd" style="color:var(--acc2);">ATS View &mdash; Keyword scan</div>
          <div class="ats-r g"></div><div class="ats-r g" style="width:80%;"></div>
          <div class="ats-r" style="width:60%;"></div><div class="ats-r g"></div>
          <div class="ats-r g" style="width:90%;"></div><div class="ats-r" style="width:55%;"></div>
          <div class="ats-r g" style="width:75%;"></div>
          <div class="ats-verdict pass">PASS &mdash; 74/100</div>
        </div>
        <div class="ats-col">
          <div class="ats-col-hd" style="color:var(--red);">Human View &mdash; 8-second skim</div>
          <div class="ats-r"></div><div class="ats-r r" style="width:80%;"></div>
          <div class="ats-r" style="width:65%;"></div><div class="ats-r r"></div>
          <div class="ats-r" style="width:70%;"></div><div class="ats-r r" style="width:90%;"></div>
          <div class="ats-r" style="width:45%;"></div>
          <div class="ats-verdict fail">STOPPED AT 6s</div>
        </div>
      </div>
      <div class="fb-card red" style="margin-top:8px;">
        <div class="fb-card-hd">The gap</div>
        <div class="fb-quote">"Your resume passes the bot. It fails the human. This is the most common and expensive mistake candidates make."</div>
      </div>`,

    interview: `
      <div class="app-main-hd">
        <span class="app-title">Screening Interview &mdash; HR Screen Mode</span>
        <div class="app-actions"><span style="font-size:11px;color:var(--t3);">Q 2 of 6</span></div>
      </div>
      <div class="chat-msgs" id="chat-msgs">
        <div class="chat-row ai">
          <div class="chat-av">HR</div>
          <div class="chat-bubble ai">Your resume says you "improved API response time by 40%." Can you walk me through what that actually looked like?</div>
        </div>
        <div class="chat-row usr">
          <div class="chat-bubble usr">I optimized some database queries and the PM mentioned it was faster...</div>
          <span class="chat-you">YOU</span>
        </div>
        <div class="chat-row ai">
          <div class="chat-av">HR</div>
          <div class="chat-bubble ai red">So you don't have a measurement? The 40% figure &mdash; where did that number come from?</div>
        </div>
      </div>
      <div class="chat-input-row" id="chat-input-area" style="cursor:text;" tabindex="0">
        <span class="ci-placeholder" id="ci-ph">Type your response...<span class="typing-cursor"></span></span>
        <div class="ci-send" id="ci-send-btn" style="cursor:pointer;"><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 5.5h9M6.5 2l3.5 3.5L6.5 9" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      </div>`,

    recruiter: `
      <div class="app-main-hd">
        <span class="app-title">Recruiter Lens &mdash; Select Profile</span>
      </div>
      <div class="uf-micro" style="margin-bottom:8px;">Click a profile to activate</div>
      <div class="rp-list" id="recruiter-list">
        <div class="rp-row active" data-profile="0">
          <div class="rp-av">SH</div>
          <div class="rp-info"><span class="rp-rname">Startup Hiring Manager</span><span class="rp-rmeta">Speed-focused &middot; Low process tolerance</span></div>
          <div class="rp-tag-active">Active</div>
        </div>
        <div class="rp-row" data-profile="1">
          <div class="rp-av">ET</div>
          <div class="rp-info"><span class="rp-rname">Early Career Tech</span><span class="rp-rmeta">Brand-conscious &middot; ATS-heavy</span></div>
        </div>
        <div class="rp-row" data-profile="2">
          <div class="rp-av">HR</div>
          <div class="rp-info"><span class="rp-rname">HR Screener</span><span class="rp-rmeta">Checklist-driven &middot; Risk-averse</span></div>
        </div>
        <div class="rp-row" data-profile="3">
          <div class="rp-av">UR</div>
          <div class="rp-info"><span class="rp-rname">University Recruiter</span><span class="rp-rmeta">GPA-aware &middot; Pipeline focus</span></div>
        </div>
        <div class="rp-row" data-profile="4">
          <div class="rp-av">EN</div>
          <div class="rp-info"><span class="rp-rname">Enterprise Non-Tech</span><span class="rp-rmeta">Process-heavy &middot; Gap-sensitive</span></div>
        </div>
      </div>`,

    progress: `
      <div class="app-main-hd">
        <span class="app-title">Progress &mdash; Resume v1 vs v2</span>
        <div class="app-actions">
          <div class="chip" style="background:rgba(52,211,153,0.1);color:var(--green);border:1px solid rgba(52,211,153,0.3);">+18 pts overall</div>
        </div>
      </div>
      <div class="score-sec-label">Before &rarr; After</div>
      <div class="score-rows">
        <div class="score-row" style="flex-direction:column;align-items:flex-start;gap:5px;">
          <div style="display:flex;width:100%;justify-content:space-between;"><span class="score-name">ATS Pass Score</span><span style="color:var(--green);font-size:11.5px;font-weight:600;">56 &rarr; 74</span></div>
          <div style="display:flex;width:100%;gap:6px;align-items:center;">
            <div class="score-track" style="flex:1;"><div class="score-fill fill-amber" data-target="56%"></div></div>
            <span style="font-size:9px;color:var(--t4);">&rarr;</span>
            <div class="score-track" style="flex:1;"><div class="score-fill fill-green" data-target="74%"></div></div>
          </div>
        </div>
        <div class="score-row" style="flex-direction:column;align-items:flex-start;gap:5px;">
          <div style="display:flex;width:100%;justify-content:space-between;"><span class="score-name">Human Readability</span><span style="color:var(--amber);font-size:11.5px;font-weight:600;">38 &rarr; 52</span></div>
          <div style="display:flex;width:100%;gap:6px;align-items:center;">
            <div class="score-track" style="flex:1;"><div class="score-fill fill-red" data-target="38%"></div></div>
            <span style="font-size:9px;color:var(--t4);">&rarr;</span>
            <div class="score-track" style="flex:1;"><div class="score-fill fill-amber" data-target="52%"></div></div>
          </div>
        </div>
        <div class="score-row" style="flex-direction:column;align-items:flex-start;gap:5px;">
          <div style="display:flex;width:100%;justify-content:space-between;"><span class="score-name">Signal Strength</span><span style="color:var(--amber);font-size:11.5px;font-weight:600;">29 &rarr; 41</span></div>
          <div style="display:flex;width:100%;gap:6px;align-items:center;">
            <div class="score-track" style="flex:1;"><div class="score-fill fill-red" data-target="29%"></div></div>
            <span style="font-size:9px;color:var(--t4);">&rarr;</span>
            <div class="score-track" style="flex:1;"><div class="score-fill fill-amber" data-target="41%"></div></div>
          </div>
        </div>
      </div>
      <div class="fb-card purple" style="margin-top:4px;">
        <div class="fb-card-hd">What changed</div>
        <div class="fb-quote">"Quantified the API optimization bullet. Added a live project URL. ATS score jumped 18 points."</div>
      </div>`
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  // Animate score bars using CSS scaleX transform (composited property).
  // Each bar's static width is set from data-target; the transform goes 0→1.
  function animateScoreBars(container) {
    container.querySelectorAll('.score-fill[data-target]').forEach(bar => {
      // Set the static width to the target proportion; no width animation
      bar.style.width = bar.dataset.target;
      // Ensure we start from scaleX(0) — remove any lingering .animate class
      bar.classList.remove('animate');
    });
    // Trigger scaleX(0→1) transition after the browser has painted initial state
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        container.querySelectorAll('.score-fill[data-target]').forEach(bar => {
          bar.classList.add('animate');
        });
      });
    });
  }

  // Wire up click-to-activate behaviour on recruiter profile rows
  function bindRecruiterRows() {
    const list = document.getElementById('recruiter-list');
    if (!list) return;

    list.querySelectorAll('.rp-row').forEach(row => {
      row.addEventListener('click', () => {
        // Reset all rows to inactive styling
        list.querySelectorAll('.rp-row').forEach(r => {
          r.classList.remove('active');
          const existingTag = r.querySelector('.rp-tag-active');
          if (existingTag) existingTag.remove();
        });

        // Apply active styling via CSS class
        row.classList.add('active');

        if (!row.querySelector('.rp-tag-active')) {
          const tag = document.createElement('div');
          tag.className   = 'rp-tag-active';
          tag.textContent = 'Active';
          row.appendChild(tag);
        }
      });
    });
  }

  // Wire up the Re-run button: reset scaleX to 0, then re-animate to 1
  function bindRerun() {
    const btn = document.getElementById('rerun-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const bars = appMain.querySelectorAll('.score-fill[data-target]');
      // Remove .animate to reset transform to scaleX(0) without transition
      bars.forEach(b => {
        b.style.transition = 'none';
        b.classList.remove('animate');
      });
      // Re-enable transition and trigger animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bars.forEach(b => {
            b.style.transition = '';
            b.classList.add('animate');
          });
        });
      });
    });
  }

  // Wire up the chat send button to cycle through canned AI/user message pairs
  function bindChatInput() {
    const area    = document.getElementById('chat-input-area');
    const ph      = document.getElementById('ci-ph');
    const sendBtn = document.getElementById('ci-send-btn');
    const msgs    = document.getElementById('chat-msgs');
    if (!area || !ph || !sendBtn || !msgs) return;

    const responses = [
      "The 40% came from our monitoring dashboard — I compared p95 latency before and after deploying the query optimization.",
      "I used New Relic to measure it. Pre-deploy: 240ms average. Post-deploy: 145ms. That's roughly 40%.",
      "Actually, I need to be honest — the PM mentioned it felt faster but I don't have a precise measurement. The bullet was imprecise."
    ];
    let respIndex = 0;

    sendBtn.addEventListener('click', () => {
      if (respIndex >= responses.length) return;

      const userRow = document.createElement('div');
      userRow.className = 'chat-row usr';
      userRow.innerHTML = `<div class="chat-bubble usr">${responses[respIndex]}</div><span class="chat-you">YOU</span>`;
      msgs.appendChild(userRow);
      respIndex++;
      msgs.scrollTop = msgs.scrollHeight;

      setTimeout(() => {
        const aiRow = document.createElement('div');
        aiRow.className = 'chat-row ai';
        aiRow.innerHTML = `<div class="chat-av">HR</div><div class="chat-bubble ai">Noted. Let's move on — tell me about a time you had a conflict with a teammate.</div>`;
        msgs.appendChild(aiRow);
        msgs.scrollTop = msgs.scrollHeight;
      }, 900);
    });
  }

  // ── View switcher ──────────────────────────────────────────────────────────

  // Read --d2 token value from the document root for JS-driven transitions
  function getToken(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function switchView(view) {
    if (!appMain) return;

    // Skip motion if user prefers reduced motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const d2 = reducedMotion ? '0ms' : getToken('--d2');
    const ease = reducedMotion ? 'linear' : (getToken('--ease') || 'cubic-bezier(0.16,1,0.3,1)');

    // Fade out current view using composited properties only
    appMain.style.transition = `opacity ${d2} ${ease}, transform ${d2} ${ease}`;
    appMain.style.opacity    = '0';
    appMain.style.transform  = 'translateY(6px)';

    // Swap content after fade-out completes, then fade in
    const delay = reducedMotion ? 0 : 150;
    setTimeout(() => {
      appMain.innerHTML = viewHTML[view] || viewHTML.resume;
      // Force a reflow so the initial state is painted before the transition
      void appMain.offsetHeight;
      appMain.style.transition = `opacity ${d2} ${ease}, transform ${d2} ${ease}`;
      appMain.style.opacity    = '1';
      appMain.style.transform  = 'translateY(0)';
      animateScoreBars(appMain);
      bindRecruiterRows();
      bindRerun();
      bindChatInput();
    }, delay);
  }

  // ── Initial render ─────────────────────────────────────────────────────────

  if (appMain) {
    const d2   = getToken('--d2') || '250ms';
    const ease = getToken('--ease') || 'cubic-bezier(0.16,1,0.3,1)';
    appMain.style.transition = `opacity ${d2} ${ease}, transform ${d2} ${ease}`;
    appMain.innerHTML = viewHTML.resume;
    // Start score bars 1s earlier — fills while widget is still rising
    setTimeout(function() {
      animateScoreBars(appMain);
    }, 1200);
    bindRerun();
  }

  // ── Sidebar tab click handlers ─────────────────────────────────────────────

  document.querySelectorAll('.app-sb .sb-item[data-view]').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.app-sb .sb-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      switchView(item.dataset.view);
    });
  });

})();

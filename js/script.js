/* ============================================================
   CONVERGE — Shared JavaScript
   convergecourtship-site/js/script.js
   ============================================================ */

'use strict';

/* ────────────────────────────────────────────────────────────
   LANDING PAGE
   Runs only when #hero is present (index.html)
   ──────────────────────────────────────────────────────────── */
function initLanding() {
  if (!document.getElementById('hero')) return;
  // Nothing beyond CSS animations needed for landing page.
  // Placeholder for future enhancements (smooth scroll, etc.)
}


/* ────────────────────────────────────────────────────────────
   APPLICATION PAGE
   Runs only when #screen-preamble is present (application.html)
   ──────────────────────────────────────────────────────────── */

// ── DATA ─────────────────────────────────────────────────────
const SECTIONS = [
  'Intention & Readiness',
  'History & Awareness',
  'Values & Life Design',
  'Personality Snapshot',
  'Practical Alignment',
  'Conduct Agreement'
];

const VALUES_LIST = [
  'Family', 'Stability', 'Ambition', 'Faith / Spirituality',
  'Adventure', 'Health', 'Community', 'Intellectual growth',
  'Financial security', 'Creativity', 'Service', 'Simplicity'
];

const LIKERT_STATEMENTS = [
  'I remain calm under pressure.',
  'I prefer structure over spontaneity.',
  'I recover quickly after conflict.',
  'I am comfortable expressing vulnerability to someone I trust.',
  'I make decisions quickly and commit to them.',
  'I find it easy to acknowledge when I am wrong.',
  'I prioritize long-term outcomes over short-term comfort.',
  'I am comfortable with periods of silence in a relationship.',
  'I express care through action more than words.',
  'I approach uncertainty with equanimity rather than anxiety.',
  'I am at ease with my own company for extended periods.',
  'I tend to over-explain when I feel misunderstood.'
];

const CONFLICT_SCENARIOS = [
  {
    q: 'Your partner says something that stings during an otherwise minor disagreement. Your instinct is to:',
    opts: [
      'Name it immediately and address it directly.',
      'Say nothing in the moment and return to it later when calmer.',
      'Let it pass — context matters, and it was probably not intentional.',
      'Withdraw briefly, then re-engage when you have gathered your thoughts.'
    ]
  },
  {
    q: 'A misunderstanding has escalated beyond what you intended. The other person is visibly upset. You:',
    opts: [
      'Pause the conversation and ask for a defined break before continuing.',
      'Stay with the discomfort and work through it in real time.',
      'Focus on resolving the immediate situation, even if deeper issues remain.',
      'Acknowledge your part first, then address the larger issue.'
    ]
  },
  {
    q: 'You realize you have been wrong about something significant in the relationship. You:',
    opts: [
      'Say so directly and without qualification.',
      'Acknowledge it but contextualize it within broader circumstances.',
      'Wait until the right moment rather than raising it immediately.',
      'Demonstrate change through behavior rather than explicit acknowledgment.'
    ]
  },
  {
    q: 'Your partner needs more emotional support than you are accustomed to giving. You:',
    opts: [
      'Stretch toward their needs while being clear about your own limits.',
      'Address the pattern directly — this is data about compatibility.',
      'Adapt without comment, prioritizing their immediate need.',
      'Ask them to help you understand what support looks like to them.'
    ]
  },
  {
    q: 'An important disagreement has gone unresolved for several days. You:',
    opts: [
      'Raise it — time does not resolve tension, it compresses it.',
      'Wait for a natural opening rather than forcing a conversation.',
      'Write out your thoughts first, then request a conversation.',
      'Gauge whether the other person is ready before initiating.'
    ]
  }
];

// ── STATE ─────────────────────────────────────────────────────
let currentSection = -1;
let rankOrder      = [...VALUES_LIST];
let draggingEl     = null;
let draggingIdx    = null;

// ── INIT APP ──────────────────────────────────────────────────
function initApp() {
  if (!document.getElementById('screen-preamble')) return;

  buildProgressBar();
  buildRankList();
  buildLikert();
  buildConflictQuestions();
  bindConditionalWatchers();
}

// ── CONDITIONAL WATCHERS ──────────────────────────────────────
function bindConditionalWatchers() {
  // Q1: unsure note
  document.querySelectorAll('input[name="q1"]').forEach(r => {
    r.addEventListener('change', () => {
      const v = document.querySelector('input[name="q1"]:checked')?.value;
      const note = document.getElementById('q1-note');
      if (note) note.style.display = (v === 'unsure') ? 'block' : 'none';
    });
  });

  // Q8: other text area
  document.querySelectorAll('input[name="q8"]').forEach(r => {
    r.addEventListener('change', () => {
      const v = document.querySelector('input[name="q8"]:checked')?.value;
      const wrap = document.getElementById('q8-other-wrap');
      if (wrap) wrap.style.display = (v === 'other') ? 'block' : 'none';
    });
  });

  // Q17: exclusivity warning
  document.querySelectorAll('input[name="q17"]').forEach(r => {
    r.addEventListener('change', () => {
      const v = document.querySelector('input[name="q17"]:checked')?.value;
      const warn = document.getElementById('q17-warn');
      if (warn) warn.style.display = (v === 'no') ? 'block' : 'none';
    });
  });
}

// ── PROGRESS BAR ──────────────────────────────────────────────
function buildProgressBar() {
  const wrap = document.getElementById('progress-steps');
  if (!wrap) return;
  wrap.innerHTML = '';
  SECTIONS.forEach((s, i) => {
    if (i > 0) {
      const conn = document.createElement('div');
      conn.className = 'step-connector';
      wrap.appendChild(conn);
    }
    const step = document.createElement('div');
    step.className = 'progress-step';
    step.id = `pstep-${i}`;
    step.innerHTML = `<div class="step-dot"></div><span class="step-label">${s}</span>`;
    wrap.appendChild(step);
  });
}

function updateProgress(sectionIdx) {
  const pct = sectionIdx < 0 ? 0 : Math.round(((sectionIdx + 1) / 6) * 100);
  const pctEl = document.getElementById('progress-pct');
  if (pctEl) pctEl.textContent = sectionIdx < 0 ? '0%' : `${pct}%`;

  SECTIONS.forEach((_, i) => {
    const el = document.getElementById(`pstep-${i}`);
    if (!el) return;
    el.classList.remove('active', 'complete');
    if (i < sectionIdx)      el.classList.add('complete');
    else if (i === sectionIdx) el.classList.add('active');
  });

  const nameEl = document.getElementById('header-section-name');
  if (nameEl) {
    nameEl.textContent = sectionIdx >= 0 ? SECTIONS[sectionIdx] : 'Application for Membership';
  }
}

// ── NAVIGATION ────────────────────────────────────────────────
function hideAll() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active', 'screen-fade'));
}

function goToPreamble() {
  hideAll();
  const pre = document.getElementById('screen-preamble');
  if (pre) { pre.classList.add('active'); }
  currentSection = -1;
  updateProgress(-1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToSection(idx) {
  hideAll();
  const screen = document.getElementById(`screen-${idx}`);
  if (screen) {
    screen.classList.add('active', 'screen-fade');
  }
  currentSection = idx;
  updateProgress(idx);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function submitApplication() {
  // Validate all agreements checked
  const checkboxes  = document.querySelectorAll('.agreement-list input[type="checkbox"]');
  const affirmation = document.getElementById('final-affirmation');
  let allChecked    = true;

  checkboxes.forEach(cb => { if (!cb.checked) allChecked = false; });
  if (affirmation && !affirmation.checked) allChecked = false;

  if (!allChecked) {
    alert('Please confirm all statements before submitting.');
    return;
  }

  hideAll();
  const confirm = document.getElementById('screen-confirm');
  if (confirm) confirm.classList.add('active');

  const pctEl = document.getElementById('progress-pct');
  if (pctEl) pctEl.textContent = '100%';

  SECTIONS.forEach((_, i) => {
    const el = document.getElementById(`pstep-${i}`);
    if (el) { el.classList.remove('active'); el.classList.add('complete'); }
  });

  const nameEl = document.getElementById('header-section-name');
  if (nameEl) nameEl.textContent = 'Application Submitted';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── RADIO HELPERS ─────────────────────────────────────────────
function selectRadio(groupId, val) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
  const cb = group.querySelector(`input[value="${val}"]`);
  if (cb) {
    cb.checked = true;
    cb.closest('.radio-card')?.classList.add('selected');
  }
}

function selectPill(groupId, el) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.radio-pill').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  const inp = el.querySelector('input');
  if (inp) inp.checked = true;
}

function toggleAgreement(el) {
  const cb = el.querySelector('input[type="checkbox"]');
  if (!cb) return;
  cb.checked = !cb.checked;
  el.classList.toggle('checked', cb.checked);
}

// ── WORD COUNT ────────────────────────────────────────────────
function countWords(textarea, counterId, min, max) {
  const raw   = textarea.value.trim();
  const words = raw.length === 0 ? 0 : raw.split(/\s+/).filter(w => w.length > 0).length;
  const el    = document.getElementById(counterId);
  if (!el) return;
  el.textContent = `${words} word${words !== 1 ? 's' : ''}`;
  el.classList.remove('warn', 'over');
  if (max > 0 && words > max)           el.classList.add('over');
  else if (min > 0 && words < min && words > 0) el.classList.add('warn');
}

// ── RANK LIST (drag & drop) ───────────────────────────────────
function buildRankList() {
  const list = document.getElementById('rank-list');
  if (!list) return;
  list.innerHTML = '';

  rankOrder.forEach((val, i) => {
    const item = document.createElement('div');
    item.className   = 'rank-item';
    item.draggable   = true;
    item.dataset.idx = i;
    item.innerHTML   = `
      <div class="rank-handle">
        <span></span><span></span><span></span>
      </div>
      <span class="rank-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="rank-name">${val}</span>
    `;
    item.addEventListener('dragstart', onDragStart);
    item.addEventListener('dragover',  onDragOver);
    item.addEventListener('drop',      onDrop);
    item.addEventListener('dragend',   onDragEnd);
    list.appendChild(item);
  });
}

function onDragStart(e) {
  draggingEl  = e.currentTarget;
  draggingIdx = parseInt(draggingEl.dataset.idx);
  setTimeout(() => draggingEl.classList.add('dragging'), 0);
}
function onDragOver(e) {
  e.preventDefault();
  document.querySelectorAll('.rank-item').forEach(el => el.classList.remove('drag-over'));
  e.currentTarget.classList.add('drag-over');
}
function onDrop(e) {
  e.preventDefault();
  const targetIdx = parseInt(e.currentTarget.dataset.idx);
  if (targetIdx === draggingIdx) return;
  const moved = rankOrder.splice(draggingIdx, 1)[0];
  rankOrder.splice(targetIdx, 0, moved);
  buildRankList();
}
function onDragEnd() {
  document.querySelectorAll('.rank-item').forEach(el => {
    el.classList.remove('dragging', 'drag-over');
  });
  draggingEl = null;
}

// ── LIKERT TABLE ──────────────────────────────────────────────
function buildLikert() {
  const tbody = document.getElementById('likert-body');
  if (!tbody) return;

  LIKERT_STATEMENTS.forEach((stmt, i) => {
    const tr = document.createElement('tr');
    let cells = `<td>${stmt}</td>`;
    for (let v = 1; v <= 5; v++) {
      cells += `<td><input type="radio" name="likert-${i}" value="${v}" aria-label="Rating ${v}"/></td>`;
    }
    tr.innerHTML = cells;
    tbody.appendChild(tr);
  });
}

// ── CONFLICT QUESTIONS ────────────────────────────────────────
function buildConflictQuestions() {
  const wrap = document.getElementById('conflict-questions');
  if (!wrap) return;

  CONFLICT_SCENARIOS.forEach((scenario, si) => {
    const div = document.createElement('div');

    const p = document.createElement('p');
    p.style.cssText = 'font-family:"Cormorant Garamond",serif;font-size:18px;color:var(--navy);margin-bottom:16px;line-height:1.5;font-weight:400';
    p.textContent = scenario.q;
    div.appendChild(p);

    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group';
    radioGroup.id = `cs-group-${si}`;

    scenario.opts.forEach((opt, oi) => {
      const card = document.createElement('label');
      card.className = 'radio-card';

      const input = document.createElement('input');
      input.type  = 'radio';
      input.name  = `cs-${si}`;
      input.value = oi;

      const labelText = document.createElement('div');
      labelText.className = 'radio-card-label';
      labelText.textContent = opt;

      card.appendChild(input);
      card.appendChild(labelText);

      card.addEventListener('click', () => {
        radioGroup.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        input.checked = true;
      });

      radioGroup.appendChild(card);
    });

    div.appendChild(radioGroup);
    wrap.appendChild(div);
  });
}


/* ────────────────────────────────────────────────────────────
   BOOT
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLanding();
  initApp();
});
/* ============================================================
   NAV HAMBURGER MENU
   Add this to the bottom of js/script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  if (hamburger && mobileMenu) {

    // Toggle menu open/closed
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });

  }

  // Highlight active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

});
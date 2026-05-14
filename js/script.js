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
  // Placeholder for future enhancements
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
      'Name it and address it directly.',
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

// ── LOCAL STORAGE KEY ─────────────────────────────────────────
const STORAGE_KEY = 'converge_application_draft';

// ── SAVE DRAFT TO LOCAL STORAGE ───────────────────────────────
function saveDraft() {
  try {
    const draft = collectAllAnswers();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch(e) {
    // Fail silently — saving draft is best effort
  }
}

// ── CLEAR DRAFT FROM LOCAL STORAGE ───────────────────────────
function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch(e) {}
}

// ── COLLECT ALL ANSWERS ───────────────────────────────────────
function collectAllAnswers() {
  const data = {};

  // Section 1
  const q1 = document.querySelector('input[name="q1"]:checked');
  data['intent'] = q1 ? q1.value : '';

  const q2 = document.querySelector('input[name="q2"]:checked');
  data['timeline'] = q2 ? q2.value : '';

  const q3 = document.querySelector('input[name="q3"]:checked');
  data['open_to_relocation'] = q3 ? q3.value : '';

  data['why_converge'] = document.getElementById('q4-text')?.value || '';

  // Section 2
  data['most_recent_relationship'] = document.getElementById('q5-text')?.value || '';
  data['personal_accountability']  = document.getElementById('q6-text')?.value || '';
  data['pattern_working_on']       = document.getElementById('q7-text')?.value || '';

  const q8 = document.querySelector('input[name="q8"]:checked');
  data['conflict_style'] = q8 ? q8.value : '';
  data['conflict_style_other'] = document.getElementById('q8-other')?.value || '';

  data['love_growing_up'] = document.getElementById('q9-text')?.value || '';

  // Section 3
  data['values_ranking'] = rankOrder.join(', ');
  data['location']       = document.getElementById('q10-loc')?.value || '';

  const q11 = document.querySelector('input[name="q11"]:checked');
  data['wants_children'] = q11 ? q11.value : '';

  const q11b = document.querySelector('input[name="q11b"]:checked');
  data['has_children'] = q11b ? q11b.value : '';

  const q11c = document.querySelector('input[name="q11c"]:checked');
  data['open_to_partner_with_children'] = q11c ? q11c.value : '';

  data['stable_life_definition'] = document.getElementById('q12-text')?.value || '';
  data['non_negotiable_1']       = document.getElementById('nn1')?.value || '';
  data['non_negotiable_2']       = document.getElementById('nn2')?.value || '';
  data['non_negotiable_3']       = document.getElementById('nn3')?.value || '';
  data['false_preference']       = document.getElementById('q13-text')?.value || '';

  // Section 4 — Likert
  LIKERT_STATEMENTS.forEach((stmt, i) => {
    const r = document.querySelector(`input[name="likert-${i}"]:checked`);
    data[`likert_${i + 1}`] = r ? r.value : '';
  });

  // Section 4 — Conflict scenarios
  CONFLICT_SCENARIOS.forEach((_, si) => {
    const r = document.querySelector(`input[name="cs-${si}"]:checked`);
    data[`conflict_scenario_${si + 1}`] = r ? CONFLICT_SCENARIOS[si].opts[parseInt(r.value)] : '';
  });

  // Section 5
  const q14 = document.querySelector('input[name="q14"]:checked');
  data['work_style'] = q14 ? q14.value : '';

  const q15 = document.querySelector('input[name="q15"]:checked');
  data['schedule_flexibility'] = q15 ? q15.value : '';

  const q17 = document.querySelector('input[name="q17"]:checked');
  data['exclusivity_ready'] = q17 ? q17.value : '';

  // Section 6
  data['first_name'] = document.getElementById('fname')?.value || '';
  data['last_name']  = document.getElementById('lname')?.value || '';
  data['email']      = document.getElementById('email')?.value || '';

  data['submission_date'] = new Date().toISOString();

  return data;
}

// ── INIT APP ──────────────────────────────────────────────────
function initApp() {
  if (!document.getElementById('screen-preamble')) return;

  buildProgressBar();
  buildRankList();
  buildLikert();
  buildConflictQuestions();
  bindConditionalWatchers();
  bindDraftSaving();
}

// ── BIND DRAFT SAVING ─────────────────────────────────────────
// Auto-saves draft every time user moves between sections
function bindDraftSaving() {
  // Save on any input change
  document.addEventListener('change', saveDraft);
  document.addEventListener('input',  saveDraft);
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

  // Q8: show other textarea when "other" selected — FIXED
  document.querySelectorAll('input[name="q8"]').forEach(r => {
    r.addEventListener('change', () => {
      const v = document.querySelector('input[name="q8"]:checked')?.value;
      const wrap = document.getElementById('q8-other-wrap');
      if (wrap) {
        wrap.style.display = (v === 'other') ? 'block' : 'none';
        // Focus the textarea when it appears
        if (v === 'other') {
          const ta = document.getElementById('q8-other');
          if (ta) setTimeout(() => ta.focus(), 50);
        }
      }
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
    if (i < sectionIdx)        el.classList.add('complete');
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
  saveDraft(); // Save before moving
  hideAll();
  const screen = document.getElementById(`screen-${idx}`);
  if (screen) {
    screen.classList.add('active', 'screen-fade');
  }
  currentSection = idx;
  updateProgress(idx);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── SUBMIT APPLICATION ────────────────────────────────────────
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

  // Validate email and name
  const fname = document.getElementById('fname')?.value.trim();
  const lname = document.getElementById('lname')?.value.trim();
  const email = document.getElementById('email')?.value.trim();

  if (!fname || !lname || !email) {
    alert('Please provide your first name, last name, and email address before submitting.');
    return;
  }

  // Collect all answers
  const data = collectAllAnswers();

  // Show loading state on button
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
  }

  // Build form data for Netlify
  const formData = new FormData();
  formData.append('form-name', 'converge-application');
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // Submit to Netlify
  fetch('/', {
    method: 'POST',
    headers: { 'Accept': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(formData).toString()
  })
  .then(response => {
    if (response.ok) {
      // Success — clear draft, show confirmation
      clearDraft();
      showConfirmation();
    } else {
      throw new Error('Submission failed');
    }
  })
  .catch(() => {
    // Network error — draft is already saved locally
    if (submitBtn) {
      submitBtn.textContent = 'Apply for Cohort Review';
      submitBtn.disabled = false;
    }
    alert(
      'We were unable to submit your application due to a connection issue. ' +
      'Your answers have been saved in your browser. ' +
      'Please check your connection and try again — you will not lose your progress.'
    );
  });
}

// ── SHOW CONFIRMATION ─────────────────────────────────────────
function showConfirmation() {
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
  if (max > 0 && words > max)                    el.classList.add('over');
  else if (min > 0 && words < min && words > 0)  el.classList.add('warn');
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
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  if (hamburger && mobileMenu) {

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  }

  // Highlight active nav link
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

});
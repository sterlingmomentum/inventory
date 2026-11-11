/* =====================================================================
   LWCI Short Form microsite: page logic
   - Questions:    content/questionnaire.js   (wording, choices, order)
   - Labels:       content/results-labels.js  (results/print only)
   - Page copy:    content/site-copy.js
   - Rules:        rules/feedback-rules-v2.2.js
   Answers are processed in this browser only. They are kept in
   sessionStorage for this tab so a refresh does not lose progress, and are
   never sent anywhere. See COLLECTION below for the future opt-in hook.
   ===================================================================== */
(function () {
"use strict";

const QN = window.LWCI_QUESTIONNAIRE;
const LABELS = window.LWCI_RESULTS_LABELS;
const COPY = window.LWCI_SITE_COPY;
const RULES = window.LWCI_RULES;

/* ---------- Future, consent-based collection (NOT active) ----------
   Initial launch: enabled is false and there is no submit function, so
   nothing is ever transmitted. A future phase can add a consent step and
   set submit to a function that sends buildRecord() to an approved,
   secure endpoint. Declining must still lead to the full results page.
   This requires separate Sterling Momentum approval before any change. */
const COLLECTION = { enabled: false, submit: null };

const STORAGE_KEY = "lwci-short-form-v1";
const Q5_ZERO = "0 days";

const stage = document.getElementById("stage");
const brandContext = document.getElementById("brand-context");

const byId = {};
QN.questions.forEach(q => { byId[q.id] = q; });
QN.context_questions.forEach(q => { byId[q.id] = q; });
const sectionOf = {};
QN.sections.forEach(s => s.question_ids.forEach(id => { sectionOf[id] = s.title; }));
const ITEM_IDS = QN.questions.map(q => q.id);          // Q1..Q30
const TOTAL = ITEM_IDS.length;

const fresh = () => ({ v: 1, screen: "welcome", step: 0, answers: {} });
let state = fresh();

/* ---------- Storage (sessionStorage, this tab only) ---------- */
function save() {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable: keep going in memory */ }
}
function load() {
  try {
    const s = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    if (s && s.v === 1 && s.answers && typeof s.answers === "object") return s;
  } catch (e) { /* ignore unreadable saved state */ }
  return null;
}
function clearSaved() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

/* ---------- Helpers ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const arrow = '<span class="arrow" aria-hidden="true">&rarr;</span>';
// Display-only: show "1 — Very poor" as "Very poor". Stored values and rule mappings are unchanged.
const displayChoice = c => String(c).replace(/^\d+\s*—\s*/, "");
const fmt = (t, vars) => t.replace(/\{(\w+)\}/g, (_, k) => vars[k]);

// Q6 is not asked when Q5 = "0 days" (pending research approval).
const skipQ6 = a => a.Q5 === Q5_ZERO;

// The ordered steps a participant actually sees: Q1..Q30 then the context screen.
function steps() {
  const list = ITEM_IDS.filter(id => !(id === "Q6" && skipQ6(state.answers)));
  list.push("CTX");
  return list;
}

function isAnswered(id, a) {
  const q = byId[id];
  if (q.type === "energy-grid") return !!(a[id] && q.rows.every(r => q.choices.includes(a[id][r])));
  return q.choices.includes(a[id]);
}
function firstMissing(a) {
  for (const id of ITEM_IDS) {
    if (id === "Q6" && skipQ6(a)) continue;
    if (!isAnswered(id, a)) return id;
  }
  if (!isAnswered("CTX1", a)) return "CTX";
  return null;
}

function show(html, focusSelector) {
  stage.innerHTML = html;
  brandContext.hidden = state.screen === "welcome";
  window.scrollTo(0, 0);
  const target = focusSelector && stage.querySelector(focusSelector);
  if (target) target.focus({ preventScroll: true });
}

/* ---------- Welcome ---------- */
function privacyHtml() {
  return `<section class="privacy" aria-labelledby="privacy-title">
    <h2 id="privacy-title">${esc(COPY.privacy.heading)}</h2>
    <p class="small muted">${esc(COPY.privacy.body)}</p>
  </section>`;
}

function renderWelcome(moveFocus) {
  state.screen = "welcome";
  const W = COPY.welcome;
  const inProgress = Object.keys(state.answers).length > 0;
  show(`
    <section class="screen welcome" aria-labelledby="welcome-title">
      <p class="eyebrow">${esc(QN.short_name)}</p>
      <h1 class="display" id="welcome-title" tabindex="-1">${esc(QN.instrument_name)}</h1>
      <div class="facts"><span>${esc(fmt(W.timeLabel, { minutes: QN.estimated_minutes }))}</span><span>${TOTAL} questions</span></div>
      <hr class="rule">
      <div class="prose"><p>${esc(QN.intro)}</p><p class="muted">${esc(W.noScores)}</p></div>
      <div class="instructions"><p>${esc(QN.instructions)}</p></div>
      ${inProgress ? `
      <div class="resume" role="status">
        <p>You have answers in progress in this tab.</p>
        <div class="row">
          <button type="button" class="btn" id="resume">Continue where I left off ${arrow}</button>
          <button type="button" class="btn btn-quiet" id="restart">Start over</button>
        </div>
      </div>` : `
      <div class="welcome-cta">
        <button type="button" class="btn pulse" id="start">${esc(W.button)} ${arrow}</button>
      </div>`}
      ${privacyHtml()}
    </section>`, moveFocus ? "#welcome-title" : null);

  const startBtn = document.getElementById("start");
  if (startBtn) startBtn.addEventListener("click", () => goStep(0));
  const resume = document.getElementById("resume");
  if (resume) resume.addEventListener("click", () => {
    const miss = firstMissing(state.answers);
    if (!miss) return renderResults();
    goStep(steps().indexOf(miss));
  });
  const restart = document.getElementById("restart");
  if (restart) restart.addEventListener("click", () => { clearSaved(); state = fresh(); save(); renderWelcome(true); });
}

/* ---------- Questions ---------- */
function goStep(n) {
  const list = steps();
  state.step = Math.max(0, Math.min(n, list.length - 1));
  const id = list[state.step];
  state.screen = id === "CTX" ? "context" : "question";
  save();
  if (id === "CTX") renderContext(); else renderQuestion(id);
}

function optionHtml(name, value, idx, selected) {
  return `<label class="opt">
    <input type="radio" name="${esc(name)}" id="${esc(name)}-${idx}" value="${esc(value)}"${selected === value ? " checked" : ""}>
    <span class="opt-face"><span class="dot" aria-hidden="true"></span><span>${esc(displayChoice(value))}</span></span>
  </label>`;
}

// Short 5-point scales sit side by side on wide screens; longer or wordier lists stack.
function layoutFor(q) {
  const longest = Math.max(...q.choices.map(c => c.length));
  if (q.choices.length === 5 && longest <= 22) return "scale";
  if (q.choices.length === 8) return "list two-col";
  return "list";
}

function progressHtml(id) {
  const label = id === "CTX" ? COPY.quiz.contextLabel : fmt(COPY.quiz.progressLabel, { n: ITEM_IDS.indexOf(id) + 1, total: TOTAL });
  const done = id === "CTX" ? TOTAL : ITEM_IDS.indexOf(id);
  const section = sectionOf[id === "CTX" ? "CTX1" : id] || "";
  return `<div class="progress">
    <div class="progress-meta"><p class="eyebrow" id="progress-label">${esc(label)}</p><span class="section">${esc(section)}</span></div>
    <div class="bar" role="progressbar" aria-labelledby="progress-label" aria-valuemin="0" aria-valuemax="${TOTAL}" aria-valuenow="${done}" aria-valuetext="${done} of ${TOTAL} answered"><span style="width:${(done / TOTAL) * 100}%"></span></div>
  </div>`;
}

function navHtml(isLast) {
  const Q = COPY.quiz;
  return `<div class="nav">
    <button type="button" class="btn btn-quiet" id="back">${esc(Q.back)}</button>
    <button type="submit" class="btn" id="next">${esc(isLast ? Q.finish : Q.next)} ${arrow}</button>
    <span class="hint small" id="hint" role="status"></span>
  </div>`;
}

function wireNav(form, id, onDone) {
  const next = document.getElementById("next"), hint = document.getElementById("hint");
  const sync = () => next.setAttribute("aria-disabled", isAnswered(id === "CTX" ? "CTX1" : id, state.answers) ? "false" : "true");
  sync();
  form.addEventListener("change", () => { sync(); if (next.getAttribute("aria-disabled") === "false") hint.textContent = ""; });
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!isAnswered(id === "CTX" ? "CTX1" : id, state.answers)) {
      hint.textContent = byId[id] && byId[id].type === "energy-grid" ? COPY.quiz.requiredGrid : COPY.quiz.required;
      return;
    }
    onDone();
  });
  document.getElementById("back").addEventListener("click", () => {
    if (state.step === 0) renderWelcome(true); else goStep(state.step - 1);
  });
}

function renderQuestion(id) {
  const q = byId[id], a = state.answers;
  let body;
  if (q.type === "energy-grid") {
    const cur = a[id] || {};
    body = `<div class="grid">${q.rows.map((row, r) => `
      <fieldset>
        <legend>${esc(row)}</legend>
        <div class="scale" style="--cols:${q.choices.length}">${q.choices.map((c, n) => optionHtml(`${id}-r${r}`, c, n, cur[row])).join("")}</div>
      </fieldset>`).join("")}</div>`;
  } else {
    body = `<div class="${layoutFor(q)}" style="--cols:${q.choices.length}">${q.choices.map((c, n) => optionHtml(id, c, n, a[id])).join("")}</div>`;
  }

  show(`
    <form class="screen" id="q-form" novalidate>
      ${progressHtml(id)}
      <fieldset${q.type === "energy-grid" ? ' role="group"' : ""}>
        <legend tabindex="-1" id="q-legend"><span class="q-prompt">${esc(q.text)}</span></legend>
        ${body}
      </fieldset>
      ${navHtml(false)}
    </form>`, "#q-legend");

  const form = document.getElementById("q-form");
  form.addEventListener("change", e => {
    const t = e.target;
    if (t.type !== "radio") return;
    if (q.type === "energy-grid") {
      const r = Number(t.name.split("-r")[1]);
      state.answers[id] = Object.assign({}, state.answers[id], { [q.rows[r]]: t.value });
    } else {
      state.answers[id] = t.value;
      if (id === "Q5" && t.value === Q5_ZERO) delete state.answers.Q6;
    }
    save();
  }, true);
  wireNav(form, id, () => goStep(state.step + 1));
}

/* ---------- Context (CTX1 required, CTX2 optional) ---------- */
function renderContext() {
  const c1 = byId.CTX1, c2 = byId.CTX2, a = state.answers;
  show(`
    <form class="screen" id="q-form" novalidate>
      ${progressHtml("CTX")}
      <fieldset>
        <legend tabindex="-1" id="q-legend"><span class="q-prompt">${esc(c1.text)}</span></legend>
        <div class="list">${c1.choices.map((c, n) => optionHtml("CTX1", c, n, a.CTX1)).join("")}</div>
      </fieldset>
      <div class="note-field">
        <label for="ctx2">${esc(c2.text)}</label>
        <textarea id="ctx2" name="CTX2" maxlength="1000" rows="4">${esc(a.CTX2 || "")}</textarea>
        <span class="small muted">This stays on your device and appears only in your own reflection.</span>
      </div>
      ${navHtml(true)}
    </form>`, "#q-legend");

  const form = document.getElementById("q-form");
  form.addEventListener("change", e => {
    if (e.target.name === "CTX1") { state.answers.CTX1 = e.target.value; save(); }
  }, true);
  document.getElementById("ctx2").addEventListener("input", e => {
    const v = e.target.value;
    if (v.trim()) state.answers.CTX2 = v; else delete state.answers.CTX2;
    save();
  });
  wireNav(form, "CTX", () => renderResults());
}

/* ---------- Results ---------- */
function seaHtml() {
  const wave = (period, amp, base) => {
    let d = `M0 ${base}`;
    for (let x = 0; x <= 2400; x += 20) d += ` L${x} ${(base + Math.sin((x / period) * Math.PI * 2) * amp).toFixed(1)}`;
    return d;
  };
  return `<svg class="w1" viewBox="0 0 2400 120" preserveAspectRatio="none"><path d="${wave(800, 10, 50)} L2400 120 L0 120 Z" fill="var(--wave-mid)" opacity="0.45"/></svg>` +
    `<svg class="w3" viewBox="0 0 2400 120" preserveAspectRatio="none"><path d="${wave(1200, 9, 72)}" fill="none" stroke="var(--gold)" stroke-width="1.2" vector-effect="non-scaling-stroke"/></svg>` +
    `<svg class="w2" viewBox="0 0 2400 120" preserveAspectRatio="none"><path d="${wave(600, 7, 88)} L2400 120 L0 120 Z" fill="var(--ground)"/></svg>`;
}

function obsHtml(o) {
  return `<div class="obs">${o.title ? `<h3>${esc(o.title)}</h3>` : ""}<p>${esc(o.body)}</p></div>`;
}

// Response summary: approved short labels + exact answers. Full question stems are never shown here.
function summaryHtml(a) {
  const groups = [];
  ITEM_IDS.forEach(id => {
    const g = LABELS[id].group;
    let grp = groups.find(x => x.name === g);
    if (!grp) groups.push(grp = { name: g, ids: [] });
    grp.ids.push(id);
  });
  const answerHtml = id => {
    const q = byId[id];
    if (q.type === "energy-grid") {
      return `<span class="ans sub">${q.rows.map(r => `<span>${esc(r)}: <b class="ans">${esc(a[id][r])}</b></span>`).join("")}</span>`;
    }
    if (id === "Q6" && skipQ6(a)) return `<span class="ans muted">${esc(COPY.skippedQ6)}</span>`;
    return `<span class="ans">${esc(displayChoice(a[id]))}</span>`;
  };
  const R = COPY.results;
  return groups.map(g => `
    <h3>${esc(g.name)}</h3>
    <ol>${g.ids.map(id => `<li class="item"><span class="label"><span class="qid">${esc(id)}</span>${esc(LABELS[id].label)}</span>${answerHtml(id)}</li>`).join("")}</ol>`).join("") + `
    <h3>${esc(R.contextHeading)}</h3>
    <ul>
      <li class="item"><span class="label">${esc(byId.CTX1.text)}</span><span class="ans">${esc(a.CTX1)}</span></li>
      ${a.CTX2 ? `<li class="item"><span class="label">${esc(R.contextExplanationLabel)}</span><span class="free">${esc(a.CTX2)}</span></li>` : ""}
    </ul>`;
}

// Shape of a record for any FUTURE approved collection. Not sent anywhere now.
function buildRecord(a, result) {
  return {
    instrument: QN.version, rules: RULES.version, completedAt: new Date().toISOString(),
    answers: JSON.parse(JSON.stringify(a)), contentIds: result.dev.selectedIds
  };
}

function renderResults() {
  const miss = firstMissing(state.answers);
  if (miss) { goStep(steps().indexOf(miss)); return; }
  state.screen = "results";
  save();
  const a = state.answers, R = COPY.results, C = COPY.closing;
  const result = RULES.evaluate(a);

  if (COLLECTION.enabled && typeof COLLECTION.submit === "function") {
    try { COLLECTION.submit(buildRecord(a, result)); } catch (e) { /* never block results */ }
  }

  const closing = C.enabled ? `
    <section class="connect" aria-labelledby="connect-title">
      <img src="assets/kimberly-sterling.jpg" alt="${esc(C.photoAlt)}" width="640" height="800">
      <div class="connect-body">
        <h2 id="connect-title">${esc(C.headline)}</h2>
        <p>${esc(C.copy)}</p>
        <a class="btn" href="${esc(C.url)}" target="_blank" rel="noopener">${esc(C.button)} ${arrow}</a>
        <p class="print-only small">${esc(C.url)}</p>
      </div>
    </section>` : "";

  show(`
    <article class="screen" aria-labelledby="results-title">
      <header class="complete">
        <span class="mark"><img src="assets/sm-monogram.png" alt=""></span>
        <h1 id="results-title" tabindex="-1">${esc(R.pageTitle)}</h1>
        <div class="flourish" aria-hidden="true"><span></span></div>
        <p>${esc(R.intro)}</p>
        <p class="print-only small">${esc(QN.instrument_name)}</p>
        <div class="sea" aria-hidden="true">${seaHtml()}</div>
      </header>

      ${result.contextNote ? `<p class="context-note">${esc(result.contextNote)}</p>` : ""}

      <section class="block" aria-labelledby="sup-title">
        <h2 id="sup-title">${esc(R.supportsHeading)}</h2>
        <div class="pair">${result.supports.map(obsHtml).join("")}</div>
      </section>

      <section class="block" aria-labelledby="pat-title">
        <h2 id="pat-title">${esc(R.patternsHeading)}</h2>
        <div class="pair">${result.patterns.map(obsHtml).join("")}</div>
      </section>

      <section class="explore" aria-labelledby="pr-title">
        <h2 id="pr-title">${esc(R.promptsHeading)}</h2>
        <ul class="prompts">${result.prompts.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
      </section>

      <div class="actions">
        <button type="button" class="btn" id="print">${esc(R.print)}</button>
      </div>
      <p class="small muted no-print">${esc(R.printNote)}</p>

      <section class="block summary" aria-labelledby="sum-title">
        <h2 id="sum-title">${esc(R.summaryHeading)}</h2>
        ${summaryHtml(a)}
      </section>

      ${closing}

      <div class="no-print">${privacyHtml()}</div>
      <div class="actions">
        <button type="button" class="btn" id="print2">${esc(R.print)}</button>
        <button type="button" class="btn btn-quiet" id="clear">${esc(R.clear)}</button>
      </div>
    </article>`, "#results-title");

  document.title = R.pageTitle + " | Sterling Momentum";
  const doPrint = () => window.print();
  document.getElementById("print").addEventListener("click", doPrint);
  document.getElementById("print2").addEventListener("click", doPrint);
  // Two-step clear built into the page (no browser dialog).
  const clearBtn = document.getElementById("clear");
  clearBtn.addEventListener("click", () => {
    if (clearBtn.dataset.armed !== "1") {
      clearBtn.dataset.armed = "1";
      clearBtn.textContent = "Yes, clear my answers";
      const cancel = document.createElement("button");
      cancel.type = "button"; cancel.className = "btn btn-quiet"; cancel.textContent = "Keep my answers";
      const note = document.createElement("p");
      note.className = "small muted"; note.setAttribute("role", "status"); note.textContent = R.clearConfirm;
      clearBtn.after(cancel); clearBtn.parentNode.after(note);
      cancel.addEventListener("click", () => { clearBtn.dataset.armed = ""; clearBtn.textContent = R.clear; cancel.remove(); note.remove(); clearBtn.focus(); });
      cancel.focus();
      return;
    }
    clearSaved(); state = fresh(); save();
    document.title = "Leading Well Capacity Inventory Short Form | Sterling Momentum";
    renderWelcome(true);
  });
}

/* ---------- Error / recovery state ---------- */
function renderError(err) {
  const E = COPY.error;
  if (window.console) console.error(err && err.message ? err.message : err); // message only, never answers
  stage.innerHTML = `
    <section class="screen" role="alert" aria-labelledby="err-title">
      <h1 class="display" id="err-title" tabindex="-1">${esc(E.heading)}</h1>
      <p class="prose">${esc(E.body)}</p>
      <div class="actions">
        <button type="button" class="btn" id="err-reload">${esc(E.reload)}</button>
        <button type="button" class="btn btn-quiet" id="err-restart">${esc(E.restart)}</button>
      </div>
    </section>`;
  document.getElementById("err-reload").addEventListener("click", () => location.reload());
  document.getElementById("err-restart").addEventListener("click", () => { clearSaved(); state = fresh(); renderWelcome(true); });
  document.getElementById("err-title").focus();
}

/* ---------- Shore ---------- */
function drawShore() {
  const wave = (period, amp, base) => {
    let d = `M0 ${base}`;
    for (let x = 0; x <= 2400; x += 20) d += ` L${x} ${(base + Math.sin((x / period) * Math.PI * 2) * amp).toFixed(1)}`;
    return d;
  };
  const layer = (cls, period, amp, base, fill) =>
    `<svg class="${cls}" viewBox="0 0 2400 120" preserveAspectRatio="none"><path d="${wave(period, amp, base)} L2400 120 L0 120 Z" fill="${fill}"/></svg>`;
  document.getElementById("shore").innerHTML =
    layer("w1", 800, 9, 34, "var(--wave-back)") +
    layer("w2", 600, 7, 58, "var(--wave-mid)") +
    `<svg class="w3" viewBox="0 0 2400 120" preserveAspectRatio="none"><path d="${wave(1200, 10, 76)}" fill="none" stroke="var(--gold)" stroke-width="1.2" vector-effect="non-scaling-stroke"/></svg>` +
    layer("w3", 1200, 8, 86, "var(--wave-front)");
}

/* ---------- Start ---------- */
function start() {
  drawShore();
  if (!QN || !LABELS || !COPY || !RULES) throw new Error("A content or rules file did not load.");
  const saved = load();
  if (saved) state = Object.assign(fresh(), saved);
  if (state.screen === "results") renderResults();
  else if (state.screen === "question" || state.screen === "context") goStep(state.step);
  else renderWelcome(false);
}

// Any unexpected error shows a recovery screen instead of a blank page.
window.addEventListener("error", e => renderError(e.error || e.message));
try { start(); } catch (e) { renderError(e); }

// Exposed for test.html only (same answers in, same content out). Holds no data.
window.LWCI_APP = { steps: () => steps(), firstMissing, isAnswered, storageKey: STORAGE_KEY };
})();

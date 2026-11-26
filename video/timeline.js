/* SyloCare for Business explainer — timeline. Every value is a pure function of t.
 * Times are absolute seconds on the video timeline (see video.md §5). */
(function () {
  // ---- helpers ------------------------------------------------------------------------
  const cache = new Map();
  const $ = (name) => {
    if (!cache.has(name)) {
      const n = document.querySelector(`[data-el="${name}"]`);
      if (!n) console.error('missing data-el: ' + name);
      cache.set(name, n);
    }
    return cache.get(name);
  };
  const E = () => window.VX.ease.bezier(0.2, 0, 0, 1);
  let ease = null;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const prog = (t, t0, dur) => clamp(dur <= 0 ? (t >= t0 ? 1 : 0) : (t - t0) / dur);

  // motion vocabulary (video.md §4)
  const TEXT_DUR = 0.40, TEXT_Y = 24;
  const CARD_DUR = 0.50, CARD_SCALE = 0.96;
  const BAR_DUR = 0.80;
  const LINE_DUR = 0.625;
  const SWAP_DUR = 0.20, SWAP_Y = 16;

  /** text enter: opacity 0→1 + y 24→0 */
  function textIn(t, name, t0, base = '') {
    const n = $(name); const e = ease(prog(t, t0, TEXT_DUR));
    n.style.opacity = e; n.style.transform = `${base} translateY(${(TEXT_Y * (1 - e)).toFixed(2)}px)`;
  }
  /** card enter: opacity 0→1 + scale 0.96→1 */
  function cardIn(t, name, t0, base = '') {
    const n = $(name); const e = ease(prog(t, t0, CARD_DUR));
    n.style.opacity = e; n.style.transform = `${base} scale(${(CARD_SCALE + (1 - CARD_SCALE) * e).toFixed(4)})`;
  }
  /** hard state switch at t0 */
  const on = (t, name, t0, cls = 'on') => $(name).classList.toggle(cls, t >= t0);
  /** bar fill 0→pct% */
  function barGrow(t, name, t0, pct) { $(name).style.width = (pct * window.VX.ease.out(prog(t, t0, BAR_DUR))).toFixed(2) + '%'; }
  /** integer count-up */
  const count = (t, name, t0, dur, from, to) => { $(name).textContent = String(Math.round(from + (to - from) * prog(t, t0, dur))); };
  const show = (name, v) => { $(name).style.visibility = v ? 'visible' : 'hidden'; };

  /** currency swap: sequence of [time, code]; returns {cur, prev, p} at t */
  function currencyAt(t, seq) {
    let cur = seq[0][1], prev = null, p = 1;
    for (let i = 1; i < seq.length; i++) if (t >= seq[i][0]) { prev = seq[i - 1][1]; cur = seq[i][1]; p = prog(t, seq[i][0], SWAP_DUR); }
    return { cur, prev, p };
  }
  function applyCurrency(beat, st) {
    for (const node of document.querySelectorAll(`[data-beat="${beat}"] [data-cur]`)) {
      const c = node.dataset.cur; let o = 0, y = 0;
      if (c === st.cur) { o = st.p; y = SWAP_Y * (1 - st.p); }
      else if (c === st.prev) { o = 1 - st.p; y = -SWAP_Y * st.p; }
      node.style.opacity = o; node.style.transform = `translateY(${y.toFixed(2)}px)`;
    }
  }
  /** position of an element's centre in stage pixels (layout only, unaffected by player scaling) */
  function centreInStage(n) {
    let x = 0, y = 0, e = n;
    while (e && e.id !== 'stage') { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x: x + n.offsetWidth / 2, y: y + n.offsetHeight / 2 };
  }

  // ---- beat timings (video.md §5) -------------------------------------------------------
  const T = {
    // cold-open
    CO_L1: 0.30, CO_L2: 1.25, CO_LAGOS: 2.50, CO_ACCRA: 3.125, CO_NAIROBI: 3.75, CO_CLOSE: 4.375, CO_DOT_DUR: 0.30,
    // the-turn
    TURN_PLUS: 7.50, TURN_PLUS_DUR: 0.50, TURN_WM: 7.70, TURN_H: 7.90, TURN_SUB: 8.00,
    // markets
    MK_PILL: 12.60, MK_H: 12.80, MK_CARDS: [13.125, 13.4375, 13.75], MK_STAT: 14.375,
    // dashboard shell
    SHELL_IN: 17.50, SHELL_OUT: 37.50,
    // add-team
    AT_CAP: 17.60, AT_CARD: 17.80, AT_ROWS: [18.4375, 18.75, 19.0625, 19.375],
    // pick-plans
    PP_CAP: 22.60, PP_CARD: 22.80, PP_NOTICE: 23.125, PP_PLAN: 23.4375, PP_PTR_FROM: 24.375, PP_CLICK: 25.00, PP_SAVED: 25.10,
    // enrol-invoice
    EI_CAP: 27.60, EI_CARD: 27.80, EI_ROWS: [28.4375, 28.75], EI_TICKS: [29.0625, 29.375], EI_TOTAL: 29.6875,
    // currency
    CU_CAP: 32.60, CU_NOTE: 33.75, CU_SEQ: [[32.50, 'GBP'], [33.125, 'USD'], [34.375, 'AED'], [35.625, 'GBP']],
    // usage
    US_CAP: 37.60, US_CARD: 37.80, US_BARS: [38.4375, 38.5875], US_FOOT: 39.0625,
    // payoff
    PO_IN: 42.50, PO_H: 42.70, PO_GREEN: 43.125, PO_BODY: 43.75, PO_CARD: 43.75, PO_TABS: [44.375, 45.00, 45.625],
    PO_BARS: [45.625, 45.775, 45.925], PO_FOOT: 46.25,
    // cta
    CTA_NAME: 50.30, CTA_TAG: 50.9375, CTA_BTN: 51.875, CTA_URL: 52.50,
  };

  window.VIDEO = {
    duration: 57.50,
    fps: 30,
    width: 1920,
    height: 1080,
    music: { src: 'assets/music/sylocare-explainer.m4a', bpm: 96, offset: 0, trimStart: 0.28, fadeOut: 1.5 },
    beats: [
      { id: 'cold-open', start: 0.00, end: 7.50 },
      { id: 'the-turn', start: 7.50, end: 12.50 },
      { id: 'markets', start: 12.50, end: 17.50 },
      { id: 'add-team', start: 17.50, end: 22.50 },
      { id: 'pick-plans', start: 22.50, end: 27.50 },
      { id: 'enrol-invoice', start: 27.50, end: 32.50 },
      { id: 'currency', start: 32.50, end: 37.50 },
      { id: 'usage', start: 37.50, end: 42.50 },
      { id: 'payoff', start: 42.50, end: 50.00 },
      { id: 'cta', start: 50.00, end: 57.50 },
    ],

    update(t) {
      ease = ease || E();

      // ---- cold-open ----
      textIn(t, 'cold-open.line1', T.CO_L1);
      textIn(t, 'cold-open.line2', T.CO_L2);
      const cities = [['lagos', T.CO_LAGOS], ['accra', T.CO_ACCRA], ['nairobi', T.CO_NAIROBI]];
      for (const [c, t0] of cities) {
        const d = $(`cold-open.dot-${c}`); const e = ease(prog(t, t0, T.CO_DOT_DUR));
        d.style.opacity = e > 0 ? 1 : 0; d.style.transform = `scale(${e.toFixed(4)})`;
        textIn(t, `cold-open.${c}`, t0);
      }
      $('cold-open.line-a').style.transform = `scaleX(${prog(t, T.CO_LAGOS, LINE_DUR).toFixed(4)})`;
      $('cold-open.line-b').style.transform = `scaleX(${prog(t, T.CO_ACCRA, LINE_DUR).toFixed(4)})`;
      textIn(t, 'cold-open.close', T.CO_CLOSE);

      // ---- the-turn (signature: the plus grows, becomes the logo) ----
      const pe = ease(prog(t, T.TURN_PLUS, T.TURN_PLUS_DUR));
      $('the-turn.plus').style.transform = `scale(${pe.toFixed(4)})`;
      textIn(t, 'the-turn.wordmark', T.TURN_WM);
      textIn(t, 'the-turn.headline', T.TURN_H);
      textIn(t, 'the-turn.sub', T.TURN_SUB);

      // ---- markets ----
      textIn(t, 'markets.pill', T.MK_PILL);
      textIn(t, 'markets.headline', T.MK_H);
      ['ng', 'gh', 'ke'].forEach((c, i) => cardIn(t, `markets.card-${c}`, T.MK_CARDS[i]));
      textIn(t, 'markets.stat', T.MK_STAT);

      // ---- global dashboard shell (add-team → currency) ----
      const shellOn = t >= T.SHELL_IN && t < T.SHELL_OUT;
      show('global.sidebar', shellOn); show('global.user', shellOn);
      cardIn(t, 'global.sidebar', T.SHELL_IN);
      textIn(t, 'global.user', T.SHELL_IN);
      const nav = t < 22.50 ? 'employees' : t < 27.50 ? 'plans' : 'enrollment';
      for (const k of ['overview', 'employees', 'plans', 'enrollment', 'utilisation']) $(`global.nav-${k}`).classList.toggle('on', k === nav);

      // ---- add-team ----
      textIn(t, 'add-team.cap-num', T.AT_CAP); textIn(t, 'add-team.cap', T.AT_CAP);
      cardIn(t, 'add-team.card', T.AT_CARD);
      T.AT_ROWS.forEach((t0, i) => textIn(t, `add-team.row${i + 1}`, t0));
      count(t, 'add-team.count-ng', T.AT_ROWS[0], T.AT_ROWS[3] - T.AT_ROWS[0], 13, 17);

      // ---- pick-plans ----
      textIn(t, 'pick-plans.cap-num', T.PP_CAP); textIn(t, 'pick-plans.cap', T.PP_CAP);
      cardIn(t, 'pick-plans.card', T.PP_CARD);
      textIn(t, 'pick-plans.notice', T.PP_NOTICE);
      cardIn(t, 'pick-plans.plan', T.PP_PLAN);
      // pointer travels (1900,1100) → Save button centre, clicks on the beat
      const target = centreInStage($('pick-plans.save-btn'));
      const mp = ease(prog(t, T.PP_PTR_FROM, T.PP_CLICK - T.PP_PTR_FROM));
      const px = 1900 + (target.x - 1900) * mp, py = 1100 + (target.y - 1100) * mp;
      const cp = t - T.PP_CLICK;
      const sc = cp < 0 ? 1 : cp < 0.10 ? 1 - 0.12 * (cp / 0.10) : cp < 0.20 ? 0.88 + 0.12 * ((cp - 0.10) / 0.10) : 1;
      const ptr = $('pick-plans.pointer');
      ptr.style.opacity = t >= T.PP_PTR_FROM ? 1 : 0;
      ptr.style.transform = `translate(${(px - 4).toFixed(1)}px, ${(py - 4).toFixed(1)}px) scale(${sc.toFixed(4)})`;
      const saved = t >= T.PP_SAVED;
      $('pick-plans.save-label').style.opacity = saved ? 0 : 1;
      $('pick-plans.saved-label').style.opacity = saved ? 1 : 0;
      $('pick-plans.saved').textContent = saved ? 'My Saved Plans (1)' : 'My Saved Plans (0)';
      $('pick-plans.saved').classList.toggle('on', saved);

      // ---- enrol-invoice ----
      textIn(t, 'enrol-invoice.cap-num', T.EI_CAP); textIn(t, 'enrol-invoice.cap', T.EI_CAP);
      cardIn(t, 'enrol-invoice.card', T.EI_CARD);
      T.EI_ROWS.forEach((t0, i) => textIn(t, `enrol-invoice.row${i + 1}`, t0));
      T.EI_TICKS.forEach((t0, i) => on(t, `enrol-invoice.box${i + 1}`, t0));
      textIn(t, 'enrol-invoice.foot', T.EI_TOTAL);
      applyCurrency('enrol-invoice', { cur: 'GBP', prev: null, p: 1 });

      // ---- currency (card continues from enrol-invoice: no re-entry, boxes ticked) ----
      textIn(t, 'currency.cap-num', T.CU_CAP); textIn(t, 'currency.cap', T.CU_CAP);
      on(t, 'currency.box1', 0); on(t, 'currency.box2', 0);
      applyCurrency('currency', currencyAt(t, T.CU_SEQ));
      textIn(t, 'currency.note', T.CU_NOTE);

      // ---- usage ----
      textIn(t, 'usage.cap', T.US_CAP);
      cardIn(t, 'usage.card', T.US_CARD);
      barGrow(t, 'usage.out-bar', T.US_BARS[0], 62);
      barGrow(t, 'usage.den-bar', T.US_BARS[1], 24);
      $('usage.out-pct').textContent = Math.round(62 * window.VX.ease.out(prog(t, T.US_BARS[0], BAR_DUR))) + '%';
      $('usage.den-pct').textContent = Math.round(24 * window.VX.ease.out(prog(t, T.US_BARS[1], BAR_DUR))) + '%';
      textIn(t, 'usage.foot', T.US_FOOT);

      // ---- payoff (frame A) ----
      textIn(t, 'payoff.wordmark', T.PO_IN);
      $('payoff.plus').style.opacity = t >= T.PO_IN ? 1 : 0;
      textIn(t, 'payoff.pill', T.PO_IN);
      textIn(t, 'payoff.headline', T.PO_H);
      // inline clause: opacity only, so the headline keeps wrapping like frame A
      $('payoff.headline-green').style.opacity = ease(prog(t, T.PO_GREEN, TEXT_DUR));
      textIn(t, 'payoff.body', T.PO_BODY);
      cardIn(t, 'payoff.card', T.PO_CARD);
      const tab = t >= T.PO_TABS[2] ? 3 : t >= T.PO_TABS[1] ? 2 : 1;
      for (const k of [1, 2, 3]) $(`payoff.tab${k}`).classList.toggle('on', k === tab);
      [82, 41, 27].forEach((pct, i) => barGrow(t, `payoff.r${i + 1}-bar`, T.PO_BARS[i], pct));
      textIn(t, 'payoff.foot', T.PO_FOOT);

      // ---- cta ----
      textIn(t, 'cta.name', T.CTA_NAME);
      textIn(t, 'cta.tagline', T.CTA_TAG);
      cardIn(t, 'cta.button', T.CTA_BTN);
      textIn(t, 'cta.url', T.CTA_URL);
    },
  };
})();

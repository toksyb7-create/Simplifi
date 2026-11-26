/* video runtime — copied verbatim into video/runtime.js by the video-build skill.
 * Do not edit per video. All per-video logic lives in video/timeline.js.
 *
 * timeline.js must define, before this file runs:
 *   window.VIDEO = {
 *     duration, fps, width, height,
 *     music: { src, bpm, offset, trimStart, fadeOut },   // music may be null
 *     beats: [{ id, start, end }, ...],                    // tile 0..duration
 *     update(t, beat, local) { ... }                       // pure function of t
 *   }
 *
 * Exposes window.__video:
 *   duration, fps, beats, ready (Promise), time,
 *   seek(t)  — render the exact frame at t (deterministic, no side effects on audio)
 *   play(), pause(), toggle(), setTime(t) — player controls (audio follows)
 */
(function () {
  const V = window.VIDEO;
  if (!V) throw new Error('timeline.js must define window.VIDEO before runtime.js');

  const params = new URLSearchParams(location.search);
  const bare = params.has('render') || params.has('embed');
  if (bare) document.documentElement.classList.add('bare');
  if (params.has('render')) document.documentElement.classList.add('render');

  const stage = document.getElementById('stage');
  stage.style.width = V.width + 'px';
  stage.style.height = V.height + 'px';

  // ---- helpers available to timeline.js -------------------------------------------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = {
    linear: (x) => x,
    out: (x) => 1 - Math.pow(1 - x, 3),
    in: (x) => x * x * x,
    inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    bezier(p1x, p1y, p2x, p2y) {
      return (x) => {
        let lo = 0, hi = 1, u = x;
        for (let i = 0; i < 24; i++) {
          u = (lo + hi) / 2;
          const bx = 3 * p1x * u * (1 - u) ** 2 + 3 * p2x * u * u * (1 - u) + u ** 3;
          if (bx < x) lo = u; else hi = u;
        }
        return 3 * p1y * u * (1 - u) ** 2 + 3 * p2y * u * u * (1 - u) + u ** 3;
      };
    },
  };
  /** value of a tween at time t: starts at t0, lasts dur seconds */
  const tween = (t, t0, dur, from, to, fn = ease.out) =>
    from + (to - from) * fn(clamp(dur <= 0 ? 1 : (t - t0) / dur));
  /** time of musical beat n (0-based) on the grid */
  const grid = (n) => (V.music ? V.music.offset + (n * 60) / V.music.bpm : n);
  window.VX = { clamp, ease, tween, grid };

  // ---- frame rendering ----------------------------------------------------------
  const beatEls = new Map();
  for (const b of V.beats) {
    const el = stage.querySelector(`[data-beat="${b.id}"]`);
    if (!el) console.error(`beat "${b.id}" has no [data-beat] element`);
    beatEls.set(b.id, el);
  }
  let current = 0;
  function seek(t) {
    t = clamp(t, 0, V.duration - 1e-6);
    current = t;
    let active = null;
    for (const b of V.beats) {
      const on = t >= b.start && t < b.end;
      const el = beatEls.get(b.id);
      if (el) el.style.visibility = on ? 'visible' : 'hidden';
      if (on) active = b;
    }
    stage.dataset.activeBeat = active ? active.id : '';
    V.update(t, active, active ? t - active.start : 0);
    ui.sync(t, active);
    return t;
  }

  // ---- audio --------------------------------------------------------------------
  // audioState: 'none' (no music) | 'ready' | 'playing' | 'blocked' (browser refused play) | 'error' (file failed)
  let audio = null, audioState = 'none';
  if (V.music && V.music.src) {
    audio = new Audio(V.music.src);
    audio.preload = 'auto';
    audioState = 'ready';
    audio.addEventListener('error', () => { audioState = 'error'; console.error('music failed to load: ' + V.music.src); ui.state(); });
  }
  const trim = (V.music && V.music.trimStart) || 0;
  const fadeOut = (V.music && V.music.fadeOut) || 0;

  // ---- clock --------------------------------------------------------------------
  let playing = false, wallStart = 0, tStart = 0, raf = 0;
  function now() {
    if (!playing) return current;
    if (audio && !audio.paused) return audio.currentTime - trim;
    return tStart + (performance.now() - wallStart) / 1000;
  }
  function loop() {
    const t = now();
    if (t >= V.duration) { pause(); setTime(V.duration - 1 / V.fps); return; }
    if (audio && fadeOut) audio.volume = clamp((V.duration - t) / fadeOut);
    seek(t);
    raf = requestAnimationFrame(loop);
  }
  function play() {
    if (playing) return;
    if (current >= V.duration - 1 / V.fps) current = 0;
    playing = true; tStart = current; wallStart = performance.now();
    if (audio && audioState !== 'error') {
      audio.currentTime = current + trim; audio.volume = 1;
      audio.play().then(() => { audioState = 'playing'; ui.state(); })
        .catch((e) => { audioState = 'blocked'; console.warn('music blocked: ' + e.message); ui.state(); });
    }
    raf = requestAnimationFrame(loop);
    ui.state();
  }
  function pause() {
    if (!playing) return;
    current = now(); playing = false;
    cancelAnimationFrame(raf);
    if (audio) { audio.pause(); if (audioState === 'playing') audioState = 'ready'; }
    ui.state();
  }
  function setTime(t) {
    const was = playing; if (was) pause();
    seek(t);
    if (audio) audio.currentTime = current + trim;
    if (was) play();
  }

  // ---- player UI (hidden with ?render or ?embed) ----------------------------------
  const ui = (() => {
    const c = document.getElementById('controls');
    if (!c || bare) return { sync() {}, state() {} };
    c.innerHTML = `
      <button id="pp" aria-label="Play">▶</button>
      <div id="track"><input id="scrub" type="range" min="0" max="${V.duration}" step="${1 / V.fps}" value="0"><div id="marks"></div></div>
      <span id="tc">0:00.00</span><span id="bn"></span><span id="au"></span>`;
    const pp = c.querySelector('#pp'), scrub = c.querySelector('#scrub');
    const tc = c.querySelector('#tc'), bn = c.querySelector('#bn'), marks = c.querySelector('#marks'), au = c.querySelector('#au');
    for (const b of V.beats) {
      const m = document.createElement('i');
      m.style.left = (b.start / V.duration) * 100 + '%';
      m.title = `${b.id} @ ${b.start.toFixed(2)}s`;
      marks.appendChild(m);
    }
    pp.onclick = () => (playing ? pause() : play());
    scrub.oninput = () => setTime(+scrub.value);
    addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'text') return;
      if (e.code === 'Space') { e.preventDefault(); playing ? pause() : play(); }
      if (e.code === 'ArrowRight') setTime(current + (e.shiftKey ? 1 : 1 / V.fps));
      if (e.code === 'ArrowLeft') setTime(current - (e.shiftKey ? 1 : 1 / V.fps));
    });
    const fmt = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(2).padStart(5, '0')}`;
    return {
      sync(t, b) { scrub.value = t; tc.textContent = fmt(t); bn.textContent = b ? b.id : ''; },
      state() {
        pp.textContent = playing ? '❚❚' : '▶'; pp.setAttribute('aria-label', playing ? 'Pause' : 'Play');
        au.textContent = { none: 'no music', blocked: 'music blocked — press ▶ again', error: 'music file failed to load' }[audioState] || '';
        au.style.color = audioState === 'blocked' || audioState === 'error' ? '#f85149' : '#888';
      },
    };
  })();

  // ---- fit stage to window ----------------------------------------------------------
  function fit() {
    if (params.has('render')) { stage.style.transform = 'none'; return; }
    const ctrl = bare ? 0 : 56;
    const s = Math.min(innerWidth / V.width, (innerHeight - ctrl) / V.height);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
    document.documentElement.style.setProperty('--stage-scale', s);
  }
  addEventListener('resize', fit);
  fit();

  // ---- ready: fonts + images decoded, first frame drawn --------------------------
  const ready = (async () => {
    await document.fonts.ready;
    await Promise.all([...stage.querySelectorAll('img')].map((i) => i.decode().catch(() => {})));
    seek(+(params.get('t') || 0));
  })();

  window.__video = {
    get duration() { return V.duration; }, get fps() { return V.fps; }, get beats() { return V.beats; },
    get time() { return current; }, get playing() { return playing; }, get hasAudio() { return !!audio; },
    get audio() { return audio ? { state: audioState, currentTime: audio.currentTime - trim, paused: audio.paused } : { state: 'none' }; },
    ready, seek, play, pause, setTime, toggle: () => (playing ? pause() : play()),
  };
})();

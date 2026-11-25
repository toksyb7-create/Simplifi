#!/usr/bin/env node
// Measure the built video instead of looking at it. No screenshots.
//
//   node .claude/skills/video-build/scripts/measure.mjs [dir=video] [--at 1.5,3,7.25] [--el beat.name] [--quiet]
//
// Default: checks structure, assets, fonts, audio, determinism, and samples every
// beat at start+0.05, middle and end-0.05, plus a 10 fps sweep for reading time.
// --at: only sample these times (fast re-check after a fix). --el: only report these elements.
// Writes the full report to <dir>/.measure.json; prints problems. Exit code 1 if any errors.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './serve.mjs';

// Resolve Playwright from the project (cwd) first, then from wherever node can find it.
function loadPlaywright() {
  for (const base of [path.join(process.cwd(), 'noop.js'), import.meta.url]) {
    try { return createRequire(base)('playwright'); } catch {}
  }
  console.error('Playwright not found. Install it in the project: npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}
const { chromium } = loadPlaywright();

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : null; };
const flag = (k) => { const i = args.indexOf(k); if (i >= 0) { args.splice(i, 1); return true; } return false; };
const at = opt('--at'), only = opt('--el'), quiet = flag('--quiet');
const dir = args[0] || 'video';
if (!fs.existsSync(path.join(dir, 'index.html'))) { console.error(`no ${dir}/index.html`); process.exit(2); }

const { port, close } = await serve(dir, 0);
const browser = await chromium.launch();
const problems = []; // {level:'error'|'warn', where, msg}
const P = (level, where, msg) => problems.push({ level, where, msg });

try {
  const page = await browser.newPage();
  const failed = [];
  page.on('console', (m) => { if (m.type() === 'error') P('error', 'console', m.text()); });
  page.on('pageerror', (e) => P('error', 'page', e.message));
  page.on('requestfailed', (r) => failed.push(r.url()));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });

  // size the viewport to the stage so render-mode coordinates are 1:1
  await page.goto(`http://127.0.0.1:${port}/?render=1`);
  const size = await page.evaluate(() => ({ w: window.VIDEO?.width, h: window.VIDEO?.height }));
  if (!size.w) throw new Error('window.VIDEO missing or has no width — timeline.js did not load');
  await page.setViewportSize({ width: size.w, height: size.h });
  await page.waitForFunction(() => window.__video).catch(() => {});
  await page.evaluate(() => window.__video.ready);
  for (const f of failed) P('error', 'asset', `failed request: ${f.replace(`http://127.0.0.1:${port}`, '')}`);

  // ---- structure -------------------------------------------------------------
  const info = await page.evaluate(() => {
    const V = window.VIDEO;
    const css = getComputedStyle(document.documentElement);
    return {
      duration: V.duration, fps: V.fps, width: V.width, height: V.height, music: V.music,
      beats: V.beats.map((b) => ({ ...b, el: !!document.querySelector(`[data-beat="${b.id}"]`) })),
      domBeats: [...document.querySelectorAll('[data-beat]')].map((e) => e.dataset.beat),
      safe: parseFloat(css.getPropertyValue('--safe')) || 0,
      elCount: document.querySelectorAll('[data-el]').length,
    };
  });
  let cursor = 0;
  for (const b of info.beats) {
    if (!b.el) P('error', b.id, 'beat has no [data-beat] element');
    if (Math.abs(b.start - cursor) > 1e-3) P('error', b.id, `gap/overlap: starts at ${b.start}, previous ended at ${cursor}`);
    if (b.end <= b.start) P('error', b.id, `end ${b.end} <= start ${b.start}`);
    cursor = b.end;
  }
  if (Math.abs(cursor - info.duration) > 1e-3) P('error', 'timeline', `beats end at ${cursor}, duration is ${info.duration}`);
  for (const id of info.domBeats) if (!info.beats.find((b) => b.id === id)) P('warn', id, 'DOM beat not in VIDEO.beats');
  if (!info.elCount) P('warn', 'dom', 'no [data-el] elements — nothing can be measured');

  // ---- fonts --------------------------------------------------------------------
  const fonts = await page.evaluate(() => {
    const loaded = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/["']/g, ''));
    const used = new Set();
    for (const e of document.querySelectorAll('#stage [data-el]')) used.add(getComputedStyle(e).fontFamily.split(',')[0].trim().replace(/["']/g, ''));
    return { loaded: [...new Set(loaded)], used: [...used] };
  });
  const generic = ['serif', 'sans-serif', 'monospace', 'system-ui', 'cursive', 'fantasy'];
  for (const f of fonts.used) if (!generic.includes(f) && !fonts.loaded.includes(f)) P('error', 'fonts', `"${f}" is used but not loaded (falls back to a system font)`);

  // ---- audio --------------------------------------------------------------------
  let audioDur = null;
  if (info.music?.src) {
    audioDur = await page.evaluate((src) => new Promise((res) => {
      const a = new Audio(src); a.preload = 'metadata';
      a.onloadedmetadata = () => res(a.duration); a.onerror = () => res(-1); setTimeout(() => res(-2), 8000);
    }), info.music.src);
    if (audioDur < 0) P('error', 'music', `cannot load ${info.music.src}`);
    else if (audioDur + 0.01 < (info.music.trimStart || 0) + info.duration) P('error', 'music', `track is ${audioDur.toFixed(2)}s; needs ${((info.music.trimStart || 0) + info.duration).toFixed(2)}s (trimStart + duration)`);
    if (info.music.bpm) {
      const spb = 60 / info.music.bpm;
      for (const b of info.beats.slice(1)) {
        const n = (b.start - info.music.offset) / spb;
        if (Math.abs(n - Math.round(n)) * spb > 0.04) P('warn', b.id, `start ${b.start}s is off the beat grid by ${((n - Math.round(n)) * spb).toFixed(3)}s`);
      }
    }
  } else P('warn', 'music', 'no music in VIDEO.music');

  // ---- per-frame measurement ------------------------------------------------------
  const measureAt = (t, onlyEls) => page.evaluate(({ t, onlyEls, safe }) => {
    window.__video.seek(t);
    const stage = document.getElementById('stage').getBoundingClientRect();
    const W = stage.width, H = stage.height;
    const visible = (e) => {
      for (let n = e; n && n.id !== 'stage'; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.01) return false;
      }
      return true;
    };
    const opacity = (e) => { let o = 1; for (let n = e; n && n.id !== 'stage'; n = n.parentElement) o *= +getComputedStyle(n).opacity; return o; };
    const bgOf = (e) => {
      for (let n = e; n; n = n.parentElement) {
        const c = getComputedStyle(n).backgroundColor;
        const m = c.match(/[\d.]+/g); if (m && (m[3] === undefined || +m[3] > 0.5)) return m.slice(0, 3).map(Number);
      }
      return [0, 0, 0];
    };
    const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    let els = [...document.querySelectorAll('#stage [data-el]')].filter(visible);
    if (onlyEls) els = els.filter((e) => onlyEls.includes(e.dataset.el));
    const out = els.map((e) => {
      const r = e.getBoundingClientRect(), s = getComputedStyle(e);
      const box = { x: +(r.left - stage.left).toFixed(1), y: +(r.top - stage.top).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
      const hasText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const fg = (s.color.match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number);
      const L1 = lum(fg), L2 = lum(bgOf(e));
      return {
        el: e.dataset.el, box, opacity: +opacity(e).toFixed(3),
        text: hasText ? e.textContent.trim().replace(/\s+/g, ' ').slice(0, 120) : null,
        fontSize: parseFloat(s.fontSize), fontFamily: s.fontFamily.split(',')[0].replace(/["']/g, ''),
        color: s.color,
        contrast: hasText ? +((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2) : null,
        overflowX: e.scrollWidth > e.clientWidth + 1 && s.overflowX !== 'visible' ? e.scrollWidth - e.clientWidth : (hasText && e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0 ? e.scrollWidth - e.clientWidth : 0),
        overflowY: hasText && e.clientHeight > 0 && e.scrollHeight > e.clientHeight + 1 ? e.scrollHeight - e.clientHeight : 0,
        outside: r.left < stage.left - 0.5 || r.top < stage.top - 0.5 || r.right > stage.right + 0.5 || r.bottom > stage.bottom + 0.5,
        outsideSafe: safe > 0 && hasText && (box.x < safe || box.y < safe || box.x + box.w > W - safe || box.y + box.h > H - safe),
        allowOverlap: e.hasAttribute('data-allow-overlap'), decorative: e.hasAttribute('data-decorative'),
        node: e,
      };
    });
    const overlaps = [];
    for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) {
      const a = out[i], b = out[j];
      if (a.allowOverlap || b.allowOverlap || a.decorative || b.decorative) continue;
      if (a.node.contains(b.node) || b.node.contains(a.node)) continue;
      const ix = Math.max(0, Math.min(a.box.x + a.box.w, b.box.x + b.box.w) - Math.max(a.box.x, b.box.x));
      const iy = Math.max(0, Math.min(a.box.y + a.box.h, b.box.y + b.box.h) - Math.max(a.box.y, b.box.y));
      const area = ix * iy, small = Math.min(a.box.w * a.box.h, b.box.w * b.box.h) || 1;
      if (area / small > 0.02) overlaps.push({ a: a.el, b: b.el, pct: +((100 * area) / small).toFixed(1) });
    }
    out.forEach((o) => delete o.node);
    return { t, beat: document.getElementById('stage').dataset.activeBeat, els: out, overlaps };
  }, { t, onlyEls, safe: info.safe });

  const onlyEls = only ? only.split(',') : null;
  const times = at ? at.split(',').map(Number)
    : info.beats.flatMap((b) => [b.start + 0.05, (b.start + b.end) / 2, b.end - 0.05]).filter((t) => t >= 0 && t < info.duration);
  const samples = [];
  for (const t of times) {
    const s = await measureAt(+t.toFixed(3), onlyEls);
    samples.push(s);
    const where = (e) => `${e.el} @ ${s.t.toFixed(2)}s`;
    for (const e of s.els) {
      if (e.outside && !e.decorative) P('error', where(e), `outside the stage ${JSON.stringify(e.box)}`);
      if (e.outsideSafe) P('warn', where(e), `text outside safe area (${info.safe}px) ${JSON.stringify(e.box)}`);
      if (e.overflowX) P('error', where(e), `text overflows its box horizontally by ${e.overflowX}px`);
      if (e.overflowY) P('error', where(e), `text overflows its box vertically by ${e.overflowY}px`);
      if (e.text && e.fontSize < info.height * 0.022) P('warn', where(e), `font-size ${e.fontSize}px is small for a ${info.height}px stage`);
      if (e.text && e.contrast && e.contrast < 4.5 && e.opacity > 0.9) P('warn', where(e), `contrast ${e.contrast}:1 against its background`);
    }
    for (const o of s.overlaps) P('error', `${o.a} × ${o.b} @ ${s.t.toFixed(2)}s`, `overlap ${o.pct}% of the smaller box (add data-allow-overlap if intended)`);
  }

  // ---- determinism: same t after a different seek history → same layout --------------
  if (!at) {
    const probe = info.beats.map((b) => +((b.start + b.end) / 2).toFixed(3));
    for (const t of probe.slice(0, 6)) {
      const a = await measureAt(t, onlyEls);
      await measureAt(info.duration - 0.05, null);
      await measureAt(0, null);
      const b = await measureAt(t, onlyEls);
      const sig = (s) => JSON.stringify(s.els.map((e) => [e.el, e.box, e.opacity]));
      if (sig(a) !== sig(b)) P('error', `t=${t}`, 'frame differs depending on seek history — something depends on real time or previous state');
    }
  }

  // ---- reading time sweep (10 fps) ---------------------------------------------------
  if (!at) {
    const shown = new Map(); // el -> {seconds, words}
    for (let t = 0; t < info.duration; t += 0.1) {
      const vis = await page.evaluate((t) => {
        window.__video.seek(t);
        const res = [];
        for (const e of document.querySelectorAll('#stage [data-el]')) {
          let o = 1, ok = true;
          for (let n = e; n && n.id !== 'stage'; n = n.parentElement) { const s = getComputedStyle(n); if (s.visibility === 'hidden' || s.display === 'none') ok = false; o *= +s.opacity; }
          const own = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').trim();
          if (ok && o > 0.5 && own) res.push([e.dataset.el, own.split(/\s+/).length]);
        }
        return res;
      }, +t.toFixed(3));
      for (const [el, words] of vis) { const s = shown.get(el) || { seconds: 0, words }; s.seconds += 0.1; shown.set(el, s); }
    }
    for (const [el, s] of shown) {
      const need = s.words * 0.3 + 1;
      if (s.seconds + 0.05 < need) P('warn', el, `on screen ${s.seconds.toFixed(1)}s, reading time for ${s.words} words is ${need.toFixed(1)}s`);
    }
  }

  const report = { measuredAt: new Date().toISOString(), info: { ...info, audioDuration: audioDur }, fonts, problems, samples };
  fs.writeFileSync(path.join(dir, '.measure.json'), JSON.stringify(report, null, 2));

  const errors = problems.filter((p) => p.level === 'error'), warns = problems.filter((p) => p.level === 'warn');
  console.log(`measured ${samples.length} frames, ${info.beats.length} beats, ${info.duration}s @ ${info.fps}fps → ${errors.length} errors, ${warns.length} warnings`);
  for (const p of [...errors, ...warns]) console.log(`${p.level === 'error' ? 'ERROR' : 'warn '}  ${p.where}: ${p.msg}`);
  if (!quiet && at) for (const s of samples) console.log(JSON.stringify({ t: s.t, beat: s.beat, els: s.els.map(({ el, box, opacity, fontSize, text }) => ({ el, box, opacity, fontSize, text })) }));
  console.log(`full report: ${path.join(dir, '.measure.json')}`);
  process.exitCode = errors.length ? 1 : 0;
} finally {
  await browser.close();
  close();
}

#!/usr/bin/env node
// Save a SMALL crop of one moment — only when a measurement can't answer the question.
//
//   node .claude/skills/video-review/scripts/crop.mjs <t> (--el <beat.name> | --box x,y,w,h) [--pad 24] [--max 480] [dir=video]
//
// Crops to the element's box (plus padding) or an explicit stage-pixel box, then
// scales down so the longest side is ≤ --max px (default 480, hard cap 640).
// Never captures the full frame. Prints the output path.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { serve } from '../../video-build/scripts/serve.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const el = opt('--el'), boxArg = opt('--box'), pad = +opt('--pad', 24);
const max = Math.min(640, +opt('--max', 480));
const t = +args[0], dir = args[1] || 'video';
if (Number.isNaN(t) || (!el && !boxArg)) { console.error('usage: crop.mjs <t> (--el beat.name | --box x,y,w,h) [--pad 24] [--max 480] [dir]'); process.exit(2); }

const req = (() => { for (const b of [path.join(process.cwd(), 'noop.js'), import.meta.url]) { try { return createRequire(b)('playwright'); } catch {} } console.error('Playwright not found (npm i -D playwright)'); process.exit(2); })();
const { port, close } = await serve(dir, 0);
const browser = await req.chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/?render=1`);
  const { w, h } = await page.evaluate(() => ({ w: window.VIDEO.width, h: window.VIDEO.height }));
  await page.setViewportSize({ width: w, height: h });
  await page.evaluate(() => window.__video.ready);
  const box = await page.evaluate(({ t, el }) => {
    window.__video.seek(t);
    if (!el) return null;
    const e = document.querySelector(`[data-el="${el}"]`); if (!e) return { missing: true };
    const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height };
  }, { t, el });
  if (box && box.missing) throw new Error(`no element data-el="${el}"`);
  let [x, y, bw, bh] = box ? [box.x, box.y, box.w, box.h] : boxArg.split(',').map(Number);
  x = Math.max(0, x - pad); y = Math.max(0, y - pad);
  bw = Math.min(w - x, bw + 2 * pad); bh = Math.min(h - y, bh + 2 * pad);
  if (bw * bh > 0.5 * w * h) console.error('warning: crop covers more than half the frame — narrow it if you can');
  const scale = Math.min(1, max / Math.max(bw, bh));
  const outDir = path.join(dir, 'review', 'crops'); fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${(el || 'box').replace(/[^\w.-]/g, '_')}@${t.toFixed(2)}.png`);
  await page.setViewportSize({ width: w, height: h });
  const buf = await page.screenshot({ clip: { x, y, width: bw, height: bh }, scale: 'css' });
  if (scale < 1) {
    // downscale in the page so no extra dependency is needed
    const small = await page.evaluate(async ({ b64, scale }) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); return c.toDataURL('image/png').split(',')[1];
    }, { b64: buf.toString('base64'), scale });
    fs.writeFileSync(out, Buffer.from(small, 'base64'));
  } else fs.writeFileSync(out, buf);
  console.log(out);
} finally { await browser.close(); close(); }

#!/usr/bin/env node
// Render the approved video to MP4. Run ONLY after the user has said "approved".
//
//   node .claude/skills/video-review/scripts/render.mjs [dir=video] [--out video/out/<name>.mp4] [--crf 18]
//
// Seeks every frame with __video.seek(i / fps) in ?render=1 mode, captures the stage,
// pipes frames to ffmpeg (H.264, yuv420p), then muxes the brief's music with trimStart
// and fadeOut applied. Requires ffmpeg on PATH and Playwright in the project.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { serve } from '../../video-build/scripts/serve.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const crf = opt('--crf', '18');
let out = opt('--out');
const dir = args[0] || 'video';

const req = (() => { for (const b of [path.join(process.cwd(), 'noop.js'), import.meta.url]) { try { return createRequire(b)('playwright'); } catch {} } console.error('Playwright not found (npm i -D playwright)'); process.exit(2); })();
const run = (cmd, a) => new Promise((res, rej) => { const p = spawn(cmd, a, { stdio: ['ignore', 'inherit', 'inherit'] }); p.on('error', rej); p.on('close', (c) => (c ? rej(new Error(`${cmd} exited ${c}`)) : res())); });

const approved = path.join(dir, 'review', 'approved.json');
if (!fs.existsSync(approved)) console.error(`note: ${approved} not found — make sure the user said "approved" in chat before rendering.`);

const { port, close } = await serve(dir, 0);
const browser = await req.chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/?render=1`);
  const V = await page.evaluate(() => ({ w: VIDEO.width, h: VIDEO.height, fps: VIDEO.fps, duration: VIDEO.duration, music: VIDEO.music, title: document.title }));
  await page.setViewportSize({ width: V.w, height: V.h });
  await page.evaluate(() => window.__video.ready);
  out = out || path.join(dir, 'out', `${(V.title || 'video').toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') || 'video'}.mp4`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const silent = out.replace(/\.mp4$/, '.noaudio.mp4');
  const frames = Math.round(V.duration * V.fps);
  const stage = await page.$('#stage');

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(V.fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', crf, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => { ff.on('error', rej); ff.on('close', (c) => (c ? rej(new Error('ffmpeg exited ' + c)) : res())); });
  const started = Date.now();
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.__video.seek(t), i / V.fps);
    const png = await stage.screenshot({ type: 'png' });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % V.fps === 0) process.stderr.write(`\rframe ${i}/${frames}  ${((Date.now() - started) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await done;
  process.stderr.write(`\rframe ${frames}/${frames}  done\n`);

  if (V.music && V.music.src) {
    const src = path.join(dir, V.music.src);
    const fadeOut = V.music.fadeOut || 0, trim = V.music.trimStart || 0;
    const af = fadeOut ? ['-af', `afade=t=out:st=${(V.duration - fadeOut).toFixed(3)}:d=${fadeOut}`] : [];
    await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-ss', String(trim), '-t', String(V.duration), '-i', src,
      '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', ...af, '-shortest', out]);
    fs.unlinkSync(silent);
  } else fs.renameSync(silent, out);
  console.log(out);
} finally { await browser.close(); close(); }

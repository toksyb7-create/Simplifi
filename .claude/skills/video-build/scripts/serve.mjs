#!/usr/bin/env node
// Tiny static server for the video folder, plus the review endpoints.
//
//   node .claude/skills/video-build/scripts/serve.mjs [dir=video] [--port 4321]
//
//   GET  /...            static files from <dir>
//   GET  /__notes        current <dir>/review/notes.json (or {"notes":[]})
//   POST /__notes        body {notes:[...]} → writes <dir>/review/notes.json (round += 1)
//   POST /__approve      writes <dir>/review/approved.json {approvedAt, round}
//
// Also importable: `import { serve } from './serve.mjs'` → { port, close }.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.ogg': 'audio/ogg', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf',
};

export function serve(dir = 'video', port = 0) {
  const root = path.resolve(dir);
  const reviewDir = path.join(root, 'review');
  const notesFile = path.join(reviewDir, 'notes.json');
  const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const send = (code, body, type = 'application/json') => { res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' }); res.end(body); };

    if (url.pathname === '/__notes' && req.method === 'GET') return send(200, JSON.stringify(readJSON(notesFile, { round: 0, notes: [] })));
    if ((url.pathname === '/__notes' || url.pathname === '/__approve') && req.method === 'POST') {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        fs.mkdirSync(reviewDir, { recursive: true });
        const prev = readJSON(notesFile, { round: 0, notes: [] });
        if (url.pathname === '/__approve') {
          fs.writeFileSync(path.join(reviewDir, 'approved.json'), JSON.stringify({ approvedAt: new Date().toISOString(), round: prev.round }, null, 2));
          return send(200, '{"ok":true}');
        }
        let data; try { data = JSON.parse(body); } catch { return send(400, '{"error":"bad json"}'); }
        const out = { round: prev.round + 1, submittedAt: new Date().toISOString(), notes: data.notes || [] };
        fs.rmSync(path.join(reviewDir, 'approved.json'), { force: true }); // new notes cancel an earlier approval
        fs.writeFileSync(notesFile, JSON.stringify(out, null, 2));
        // archive every round so nothing is lost
        fs.writeFileSync(path.join(reviewDir, `notes.round-${out.round}.json`), JSON.stringify(out, null, 2));
        send(200, JSON.stringify({ ok: true, round: out.round }));
      });
      return;
    }

    let p = decodeURIComponent(url.pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(root, p);
    if (!file.startsWith(root)) return send(403, 'forbidden', 'text/plain');
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) return send(404, 'not found: ' + p, 'text/plain');
      const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
      // Range support so <audio> can seek
      const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
      if (range) {
        const start = range[1] ? +range[1] : 0, end = range[2] ? +range[2] : st.size - 1;
        res.writeHead(206, { 'content-type': type, 'content-range': `bytes ${start}-${end}/${st.size}`, 'accept-ranges': 'bytes', 'content-length': end - start + 1 });
        return fs.createReadStream(file, { start, end }).pipe(res);
      }
      res.writeHead(200, { 'content-type': type, 'content-length': st.size, 'accept-ranges': 'bytes', 'cache-control': 'no-store' });
      fs.createReadStream(file).pipe(res);
    });
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve({ port: server.address().port, close: () => server.close() })));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const pi = args.indexOf('--port');
  const port = pi >= 0 ? +args.splice(pi, 2)[1] : 4321;
  const dir = args[0] || 'video';
  const { port: p } = await serve(dir, port);
  console.log(`serving ${path.resolve(dir)}`);
  console.log(`  player: http://localhost:${p}/`);
  if (fs.existsSync(path.join(dir, 'review', 'index.html'))) console.log(`  review: http://localhost:${p}/review/`);
}

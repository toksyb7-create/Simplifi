---
name: video-build
description: Build the video described in video.md (or VIDEO.md) as a browser page the user can play and scrub, with the music from the brief, but do not render an mp4. Checks its own work by measuring the page (element boxes, overflow, overlap, fonts, audio length, beat grid, reading time, determinism), never by taking screenshots. Use when the user says "build the video", "build from the brief", "make the video from video.md", or after video-brief has produced an approved brief.
---

# video-build

Turn `video.md` into `video/index.html`: a page that plays the video in sync
with its music and can be scrubbed frame by frame. **No render** — rendering
happens only in `video-review` after the user approves.

**No screenshots.** You verify your work by measuring the DOM with
`scripts/measure.mjs`. Don't call a screenshot tool, don't open the page to
"take a look", don't publish it as an artifact to see it. If a measurement
can't answer a question, write a better measurement (a `page.evaluate` that
returns numbers), not a picture.

## Inputs

1. `video.md` at the project root (accept `VIDEO.md`; if both exist, ask which).
   If neither exists, stop and suggest the `video-brief` skill.
2. Read `.claude/skills/slop-video-patterns/SKILL.md`. Where the brief is
   silent, don't fill the gap with anything on that list.
3. If the brief names a style frame (`video-brief/frames/<x>.html`), read its
   source: its palette, type and layout values are the source of truth where
   the brief is ambiguous.

## Stop conditions (ask before building)

- **Music missing.** The brief's track file doesn't exist at the path given.
  Ask the user for the file (or a path to it). Don't substitute, generate or
  download a different track, and don't build silently without it. If the
  brief says "no music", set `music: null`.
- **Font missing** and not obtainable (not on Google Fonts, not in the repo):
  ask, or propose the closest available family.
- A beat references an asset the user was to supply and it isn't there.

Everything else — gaps in motion detail, exact positions — you decide, within
the brief's tokens and the slop list.

## Output layout (fixed — video-review and video-fixer depend on it)

```
video/
  index.html      # from assets/index.template.html: stage, beats, controls
  runtime.js      # copied verbatim from assets/runtime.js — never edited
  timeline.js     # window.VIDEO = { duration, fps, width, height, music, beats, update(t) }
  tokens.css      # :root custom properties copied from the brief's palette + type tables
  styles.css      # per-beat layout, using only tokens
  assets/
    music/<track>   fonts/<files>   img/<files>
```

## Build steps

1. **Scaffold.** Create `video/`. Copy `assets/runtime.js` →
   `video/runtime.js` unchanged. Copy `assets/index.template.html` →
   `video/index.html`, set `__TITLE__`, and replace `__BEATS__` with one
   `<section data-beat="<id>">` per beat, in brief order.
2. **Assets.** Put the music in `video/assets/music/`, fonts in
   `video/assets/fonts/` with `@font-face` rules at the top of `tokens.css`
   (`font-display: block`). Fonts from Google Fonts: download the woff2 files
   locally — the page must work offline.
3. **Tokens.** `tokens.css` holds every palette and type value from the brief
   as custom properties with the brief's exact names, plus `--safe: <px>`.
   `styles.css` and `timeline.js` reference tokens, never raw hex or px font
   sizes. This is what lets `video-fixer` change a colour in one place.
4. **Timeline.** In `timeline.js` define `window.VIDEO`:
   - `duration`, `fps`, `width`, `height` from the brief.
   - `music: { src: 'assets/music/<file>', bpm, offset, trimStart, fadeOut }`
     from the brief's Music section.
   - `beats: [{ id, start, end }]` copied **exactly** from the shot list.
   - `update(t, beat, local)` sets every animated property as a **pure
     function of `t`**, using the helpers on `window.VX`:
     `tween(t, t0, dur, from, to, ease)`, `ease.out/in/inOut/linear/bezier()`,
     `grid(n)` (time of musical beat n), `clamp`.
   - Put each beat's animation in its own clearly labelled block, and name
     timing constants (`const TITLE_IN = 0.4`), so small timing edits are a
     one-value change.
5. **Markup.** Every element that matters gets `data-el="<beat-id>.<name>"`
   (e.g. `hero.title`, `hero.cta`). Copy text **verbatim** from the brief.
   Mark intentional overlaps with `data-allow-overlap` and pure decoration
   (backgrounds, grain, shapes) with `data-decorative`.

### Determinism rules

The same `t` must always produce the same frame — the review viewer, the
measurements and the final render all call `__video.seek(t)` in arbitrary
order.

- No CSS `transition`/`animation`, `setTimeout`, `setInterval`,
  `Date.now()`, `Math.random()` (use a seeded PRNG keyed on `t` if needed).
- `update()` sets *every* property it ever animates on every call (no "only
  when entering the beat" logic).
- Video/GIF elements inside the stage are driven by setting `currentTime`
  from `t`.

## Verify by measurement

Run from the project root (Playwright must be installed in the project —
`npm i -D playwright && npx playwright install chromium` — if it isn't):

```bash
node .claude/skills/video-build/scripts/measure.mjs video
```

It loads the page with `?render=1`, waits for fonts and images, and reports:

- beats tile 0 → `duration`; every beat has a DOM section; beat starts sit on
  the music grid
- failed asset requests, console errors, fonts used but not loaded
- music loads and is long enough for `trimStart + duration`
- per sample (each beat at start, middle, end) for every visible `data-el`:
  box in stage pixels, outside the stage, outside the safe area, text
  overflow, overlap with other elements, font size too small, contrast
- determinism: the same `t` after a different seek history gives the same
  boxes and opacities
- reading time: every text element is on screen at least
  0.3 s/word + 1 s

Fix every **ERROR**. Fix **warn**ings unless the brief explicitly wants the
behaviour (then say so in your summary). Re-check fixes quickly with
`--at <t1,t2>` and optionally `--el <beat.name,…>`, which also prints the
measured boxes as JSON. Write ad-hoc `page.evaluate` checks for anything
brief-specific (e.g. "logo is centred": compare its box centre to 960×540).

Then check against the brief yourself: every beat's copy present verbatim,
every token used, timings match the shot list, music cues land where the
brief says. Measurement proves it's not broken; the brief comparison proves
it's the right video.

## Hand off

Start the server and give the user the link:

```bash
node .claude/skills/video-build/scripts/serve.mjs video --port 4321
```

(Run it in the background.) The player at `http://localhost:4321/` has
play/pause (Space), a scrub bar with beat markers, frame step (←/→, Shift for
1 s), and `?t=12.5` to open at a time.

Tell the user in a few lines: the URL, duration and beat count, the last
measure result (0 errors, N warnings and why they're acceptable), and any
choices you made that the brief didn't specify. Next step: `video-review`.
Don't render.

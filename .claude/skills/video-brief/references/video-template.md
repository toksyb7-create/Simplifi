# video.md template

This is the contract between `video-brief`, `video-build`, `video-review` and
the `video-fixer` agent. Keep every heading. Replace everything in `<…>`.
Field names in **bold code** (`id`, `start`, `end`, `duration`, token names)
are read by the other skills — don't rename them.

````markdown
# <Video title>

> One-line logline: <what happens and why the viewer cares>

Status: draft | approved for build
Brief depth: detailed | general direction | your call
Style frame: video-brief/frames/<chosen>.html | none (look fully specified below)

## 1. Overview
- Purpose: <launch / explainer / …>
- Audience: <who>
- Key message (the one thing they remember): <sentence>
- Call to action: <exact text>
- Platform: <YouTube / Reels / …>
- Stage: <1920×1080> (aspect <16:9>)
- `fps`: <30>
- `duration`: <30.00> s

## 2. Story
<3–6 sentences: the situation, the turn, the payoff. Concrete, no adjectives doing the work.>

## 3. Music & sound
- Track: `video/assets/music/<file>.mp3` — <title / artist / licence or "generated"> — **blocking if missing**
- `bpm`: <120>
- `offset`: <0.00> s (time of first downbeat)
- Bar length: <2.00> s (4 beats)
- Track trim: start at <0.00> s in the file, fade out <1.0> s at the end
- Key cues: <t = 8.00 drop; t = 24.00 resolves>
- SFX: <none | list with time and file>
- Voiceover: <none | script file + timing>

## 4. Visual system
### Palette (copied verbatim into `video/tokens.css`)
| token | hex | use |
|---|---|---|
| `--bg` | <#…> | background |
| `--ink` | <#…> | primary text |
| `--muted` | <#…> | secondary text |
| `--accent` | <#…> | the one thing that matters on screen |
| <add only what's needed> | | |

### Type
- Family: <name> (files: `video/assets/fonts/<…>`), weights <400, 600>
- Second family (optional): <…>
- Scale at stage size (px): `--fs-display` <120>, `--fs-h1` <80>, `--fs-h2` <56>, `--fs-body` <36>, `--fs-caption` <28>
- Line-height: <1.05 display / 1.3 body>; tracking <-0.02em display>
- Safe area: <96> px each side

### Motion vocabulary
- Default ease: <cubic-bezier(0.2, 0, 0, 1)>
- Enter: <e.g. opacity 0→1 + y 24→0 px over 0.40 s>
- Exit: <hard cut on the beat line | 0.25 s fade>
- Signature transition (max one): <…>
- Hold rule: every line holds ≥ its reading time (0.3 s/word + 1 s)

## 5. Shot list
Beats tile 0 → `duration` with no gaps. Times in seconds.

### `<beat-id>` · `start` <0.00> → `end` <4.00> · bars <1–2>
- On screen: <exactly what is visible, where (left third / centered / full-bleed), at what size>
- Copy: "<verbatim text>" (token: `--fs-h1`, colour `--ink`) | no text
- Motion: <element: property from→to, start offset, duration, ease>
- Music cue: <lands on downbeat of bar 1>
- Assets: <files used>

### `<beat-id>` · `start` <4.00> → `end` <…>
…

## 6. Assets
| path | what | source | blocking |
|---|---|---|---|
| `video/assets/music/<file>.mp3` | music | user / to find | yes |
| `video/assets/fonts/<…>.woff2` | font | Google Fonts / user | yes |
| `video/assets/img/<…>` | <…> | user / generated in code | <yes/no> |

## 7. Build notes
- Stack: plain HTML/CSS/JS, single page `video/index.html`, deterministic `seek(t)` (default — change only with a reason)
- Anything the builder must know: <e.g. "UI in beat 3 is rebuilt in HTML, not a screenshot">
- Render target (used only after approval): MP4 H.264, <1920×1080>, `fps` above, AAC audio

## 8. Assumptions
Decisions made without the user's explicit input (veto any of them):
- <…>

## 9. Slop check
Walked slop-video-patterns sections 1–7.
- Tempting: <pattern> → instead: <…>
Deliberate exceptions: none | <pattern> — <story reason>

## 10. Don'ts
- <user's hard no's>
````

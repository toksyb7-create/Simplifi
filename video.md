# SyloCare for Business — explainer

> One-line logline: A company run from London, New York, Toronto or Dubai covers its team in Lagos, Accra and Nairobi from one dashboard: add people, pick plans, enrol in batches, pay one invoice in its own currency.

Status: approved for build (direction A; content and music from the user's reference video)
Brief depth: your call
Style frame: video-brief/frames/frame-a.html (light middle section; bookends follow §4 "Deep" surfaces)
Reference: user's earlier cut "SyloCare_Business_Explainer.mp4" (58.5 s): the source of the opening copy, step names, demo data, end-card line and music. This brief keeps its story and rebuilds the screen captures as large, readable UI.

## 1. Overview
- Purpose: product explainer for SyloCare for Business (employer health cover in Nigeria, Ghana and Kenya)
- Audience: founders, HR and ops leads at companies headquartered abroad (UK, US, Canada, UAE), including EORs, with employees in Nigeria, Ghana or Kenya
- Key message (the one thing they remember): You can set up real HMO health cover for your whole African team yourself, from one dashboard, paid in the currency your books already use.
- Call to action: "Get Started" button + "sylocare.com/corporate"
- Platform: website explainer, LinkedIn, YouTube (landscape)
- Stage: 1920×1080 (aspect 16:9)
- `fps`: 30
- `duration`: 57.50 s

## 2. Story
From London, New York, Toronto or Dubai, your team works across Lagos, Accra and Nairobi, and their health cover should keep up. SyloCare for Business is a real system built around how a distributed team actually runs, on regulated HMO networks in all three countries. Amara, HR at Meridian EOR Group in London, adds her employees with their departments, browses plans that fit a team of her size, batches the enrolments into one combined invoice and pays it in pounds, though dollars or dirhams would do too. Afterwards she sees usage by category, never anyone's private records. The video ends on SyloCare's promise ("set it up yourself, today") and the end card: cover for your whole team, minus the operational headache.

## 3. Music & sound
- Track: `video/assets/music/sylocare-explainer.m4a` — the music bed from the user's reference video (AAC, 58.50 s, extracted without re-encoding) — present, not blocking
- `bpm`: 96 (measured: 96.00)
- `offset`: 0.00 s — the file's first beat is at 0.28 s, removed by `trimStart`
- `trimStart`: 0.28 s, so every beat line is `n × 0.625 s` on the video timeline
- Bar length: 2.50 s (4 beats). The downbeat could not be measured reliably; beat starts are all on bar lines of a 2.5 s grid from 0.00, so each also sits on a beat line whatever the true downbeat.
- Fade out: 1.5 s at the end (`fadeOut` 1.5); the track's own tail fades from about 56 s
- Key cues: none to hit beyond the grid; the track is a steady groove at an even level (about −20 dB RMS) throughout.
- SFX: none
- Voiceover: none; on-screen text carries the story

## 4. Visual system
### Palette (copied verbatim into `video/tokens.css`)
| token | hex | use |
|---|---|---|
| `--bg` | #F5F7F5 | light stage background (beats `the-turn` → `payoff`) |
| `--surface` | #FFFFFF | UI cards |
| `--ink` | #0F1A13 | primary text on light |
| `--muted` | #5E6A62 | secondary text, labels |
| `--line` | #E3E8E4 | card borders, chip borders |
| `--track` | #EEF1EE | progress-bar tracks, inactive tab background |
| `--accent` | #22DD1A | SyloCare green: fills, buttons, bars, logo plus, green text **on dark** |
| `--accent-text` | #119A0C | green **text** on light backgrounds |
| `--accent-tint` | #E8FBE6 | selected chip / pill background on light |
| `--deep` | #0A3A26 | dark stage background (`cold-open`, `cta`) and dashboard sidebar |
| `--deep-2` | #0E4A31 | raised surfaces and lines on `--deep` |
| `--on-deep` | #F2F7F3 | text on `--deep` |
| `--on-deep-muted` | #A9C2B3 | secondary text on `--deep` |

Dark beats are flat `--deep`. No gradients or vignettes (the reference's radial glow is dropped).

### Type
- Family: Plus Jakarta Sans (files: `video/assets/fonts/PlusJakartaSans-{Regular,Medium,SemiBold,Bold,ExtraBold}.woff2`, Google Fonts, OFL), weights 400, 500, 600, 700, 800
- Second family: none
- Scale at stage size (px): `--fs-display` 112, `--fs-h1` 80, `--fs-h2` 52, `--fs-body` 34, `--fs-ui` 30, `--fs-caption` 24
- Line-height: 1.02 display / 1.04 h1 / 1.15 h2 / 1.35 body; tracking −0.035em display and h1, −0.02em h2, 0 elsewhere
- Weights: display/h1 800, h2 700, UI labels 500, emphasis 600–700, captions 500–600
- Safe area: `--safe` 96 px each side
- Green words in headlines are a plain `<em>` with `font-style: normal`, colour `--accent-text` on light and `--accent` on dark

### Shapes & UI kit (rebuild in HTML; no screenshots in the video)
- Cards: `--surface`, radius 32 px, shadow `0 2px 0 rgba(15,26,19,.04), 0 30px 60px -30px rgba(15,26,19,.25)`, padding 40–44 px
- Pills/chips: radius 999 px, 2 px border `--line`, `--fs-caption` 600; selected = border `--accent`, text `--accent-text`, background `--accent-tint`
- Buttons: `--accent` fill, `--ink` text, 600 weight, radius 999 px, 72 px tall, 0 40 px padding
- Progress bars: 16 px tall, radius 99 px, track `--track`, fill `--accent`
- Step caption (all four steps use it): top-left at (96, 96), `--fs-h2` 700 `--ink`; the step number sits in a 56 px `--accent` circle with `--ink` 700 numeral, 20 px left of the text. This replaces the reference's floating dark pills.
- Logo: green "+" (two rounded bars 14×40 px, radius 5, `--accent`) + "SyloCare" 700 34 px + "BUSINESS" 12 px, tracking 0.3em, below it. Light: wordmark `--ink`, BUSINESS `--accent-text`. Dark: wordmark `--on-deep`, BUSINESS `--accent`. Exact build in `frame-a.html`. Replace with the official SVG if supplied.
- Dashboard shell (beats `add-team` → `currency`): left sidebar 360 px wide, `--deep`, radius 32 px, with the logo (dark variant) at top and menu items "Overview", "Employees", "Plan Catalog", "Enrollment", "Utilisation" (`--fs-ui` 500 `--on-deep`; the current item is an `--accent` pill with `--ink` text). Top-right of the content area: avatar circle 56 px `--accent` with "AO" (700 `--ink`), then "Amara Okafor" (`--fs-ui` 700) over "HR · Meridian EOR Group · London" (`--fs-caption` `--muted`). The shell spans x 96→1824, y 200→984.
- Pointer: black arrow cursor, 44 px tall, 2 px white outline, inline SVG; click = scale 1→0.88→1 over 0.20 s

### Motion vocabulary
- Default ease: `cubic-bezier(0.2, 0, 0, 1)` (`VX.ease.bezier(0.2, 0, 0, 1)`)
- Text enter: opacity 0→1 + y 24→0 px over 0.40 s
- Card enter: opacity 0→1 + scale 0.96→1 over 0.50 s, transform-origin centre
- List rows: text enter, staggered 0.3125 s (half a beat)
- Bars: width 0→target over 0.80 s ease-out, staggered 0.15 s
- Line draw: `scaleX` 0→1 from the left over 0.625 s, linear
- Number swaps (currency): old value opacity 1→0 + y 0→−16 px over 0.20 s, new value opacity 0→1 + y 16→0 px over 0.20 s, starting together
- Exits: hard cut on the beat line, unless the beat says otherwise
- Signature transition (only one): at `the-turn` (t = 7.50) the green "+" grows from stage centre, scale 0→1 over 0.50 s, and becomes the logo
- Within the dashboard beats (`add-team` → `currency`) the shell (sidebar + user block) stays put across cuts; only the content area cuts and the sidebar's current item changes. Build the shell as a `global.shell` element visible from 17.50 to 37.50.
- Hold rule: every line holds ≥ its reading time (0.3 s/word + 1 s)
- No idle floating, no particles, no camera pans across screenshots

## 5. Shot list
Beats tile 0 → `duration` with no gaps. Times in seconds; all starts are on 2.5 s bar lines.

### `cold-open` · `start` 0.00 → `end` 7.50 · bars 1–3
- On screen: flat `--deep`. Centred column: line 1 at y = 200, line 2 under it (+56 px). At y = 470, a horizontal timeline: three 24 px `--accent` dots at x = 640, 960, 1280 joined by a 4 px `--accent` line. Under each dot (+40 px) the city in `--fs-h2` 700 `--on-deep` and the country code under it in `--fs-caption` `--on-deep-muted`. At y = 760 the closing line.
- Copy: "From London, New York, Toronto or Dubai," (`--fs-h2` 700, `--accent`) · "your team works across" (`--fs-h2` 500, `--on-deep`) · "Lagos" / "NG", "Accra" / "GH", "Nairobi" / "KE" · "Their health cover should keep up." (`--fs-h1` 800, `--accent`)
- Motion: line 1 text enter at 0.30. Line 2 text enter at 1.25. Lagos dot (scale 0→1, 0.30 s) + label text enter at 2.50. Line draws Lagos→Accra 2.50→3.125, Accra appears at 3.125, line Accra→Nairobi 3.125→3.75, Nairobi appears at 3.75. Closing line text enter at 4.375.
- Music cue: city reveals on beats 0, 1 and 2 of bar 2.
- Assets: none

### `the-turn` · `start` 7.50 → `end` 12.50 · bars 4–5
- On screen: hard cut to `--bg`. The "+" grows at stage centre (signature transition), then the logo assembles centred at 1.6× (plus 64 px). Below it, centred: headline, then sub (max width 1200).
- Copy: "Meet SyloCare for Business." (`--fs-h1`, `--ink`; "SyloCare for Business" as `<em>`, `--accent-text`) · "A real system built around how a distributed team actually runs." (`--fs-body`, `--muted`)
- Motion: "+" scale 0→1 at 7.50 over 0.50 s. Wordmark text enter at 7.70. Headline text enter at 7.90. Sub text enter at 8.00.
- Music cue: transition on the 7.50 bar line.
- Assets: logo (CSS)

### `markets` · `start` 12.50 → `end` 17.50 · bars 6–7
- On screen: `--bg`. Pill "WHERE YOU CAN HIRE" at (96, 160). Headline below it, left-aligned, max width 1100. Right half: three market cards (each 300×300, `--surface`, radius 32) in a row ending at x = 1824, y = 340: a 48×32 flag SVG (radius 4), country name `--fs-ui` 600, currency line `--fs-caption` `--muted`. Below the row, aligned to its left edge: the "3 countries covered today" stat — "3" at 120 px 800 `--ink`, with "countries covered today" in `--fs-caption` `--muted` to its right.
- Copy: pill "WHERE YOU CAN HIRE" · "Regulated HMO networks in Nigeria, Ghana and Kenya." (`--fs-h1`) · cards "Nigeria" / "NGN · ₦", "Ghana" / "GHS · ₵", "Kenya" / "KES · KSh" · "3" + "countries covered today"
- Motion: pill + headline text enter at 12.60 and 12.80. Cards card-enter at 13.125, 13.4375, 13.75. Stat text enter at 14.375.
- Music cue: cards land on half-beats.
- Assets: flag SVGs (generated in code)

### `add-team` · `start` 17.50 → `end` 22.50 · bars 8–9
- On screen: step caption 1. Dashboard shell (sidebar current item "Employees"). Content area: white card titled "Employees", with market chips "Nigeria 17 employees" (selected) and "Ghana 6 employees" at the top right of the card, then a 4-row list. Each row: name (`--fs-ui` 600) · department (`--muted`) · city (`--muted`), and a tier chip right-aligned (`--accent-tint` / `--accent-text`).
- Copy: "Add your employees, with their departments." (step caption, number 1) · rows: "Ada Obi · Engineering · Lagos — Premium", "Kwame M. · Operations · Accra — Standard", "Chidinma E. · Finance · Lagos — Standard", "Tunde A. · Sales · Abuja — Premium"
- Motion: caption text enter at 17.60. Shell card-enter at 17.50 (first appearance only). Content card enter at 17.80. Rows enter at 18.4375, 18.75, 19.0625, 19.375. The "17" in the Nigeria chip counts 13→17 (integers) from 18.4375 to 19.375.
- Music cue: rows on half-beats.
- Assets: none

### `pick-plans` · `start` 22.50 → `end` 27.50 · bars 10–11
- On screen: step caption 2. Shell (current item "Plan Catalog"). Content: "Plan Catalog" card. Top row: chips "Nigeria 17 employees" (selected), "Ghana 6 employees", "Kenya"; at right, "Show prices in" label + a "USD" select box, and a "My Saved Plans (0)" pill. A green-left-bordered notice: "3 of 3 HMOs are open to your team of 17 in Nigeria" (`--fs-ui` 700) over "AXA Mansard · Leadway Health · Bastion Health" (`--fs-caption` `--muted`). Below, one plan card at 1.25× UI scale: "SME Cobalt (15–22, Starter)", "Underwritten by AXA Mansard", chip "COVERS UP TO 2 PEOPLE", "Age: 18 – 65 years" (`--accent-text`), "15–22 employees" (`--muted`), price "$62.60" (52 px 800 `--accent-text`) + " / Yearly" (`--muted`), full-width button "Save to my list". The pointer enters from bottom-right.
- Copy: "Browse plans for your team size." (step caption, number 2) · UI text as listed
- Motion: caption text enter at 22.60. Content card enter at 22.80. Notice text enter at 23.125. Plan card enter at 23.4375. Pointer moves (1900, 1100) → button centre 24.375→25.00. Click at 25.00. At 25.10 the button label becomes "Saved" with a check, and "My Saved Plans (0)" → "(1)" with the selected chip style.
- Music cue: click on the 25.00 beat.
- Assets: none

### `enrol-invoice` · `start` 27.50 → `end` 32.50 · bars 12–13
- On screen: step caption 3. Shell (current item "Enrollment"). Content: "Combined invoice" card. Sub: "One invoice for everything you owe across your batches." At top right, "Invoice in" + a select showing "GBP". Two batch rows with a checked checkbox (`--accent` fill, `--ink` tick): "Lagos engineering" / "AXA MANSARD · NG · 16 employees" / "£961.82", and "Abuja sales" / "LEADWAY HEALTH LIMITED · NG · 1 employee · instalment 1 of 2" / "£51.44". Divider, then "2 of 2 batches selected" (`--muted`) left and "Total due: £1,013.26" (`--fs-h2` 800) right. Buttons "Download invoice" (outline) and "Email invoice" (`--accent`).
- Copy: "Batch, enrol, one combined invoice." (step caption, number 3) · UI text as listed
- Motion: caption text enter at 27.60. Card enter at 27.80. Row 1 enters at 28.4375 and row 2 at 28.75; checkboxes tick at 29.0625 and 29.375 (fill appears, hard switch). Total text enter at 29.6875.
- Music cue: ticks on half-beats.
- Assets: none

### `currency` · `start` 32.50 → `end` 37.50 · bars 14–15
- On screen: step caption 4. Same Combined invoice card and layout as `enrol-invoice` (it continues; no card re-entry). The "Invoice in" select cycles currencies and every amount swaps with it. To the left of the card nothing new; under the card, the line below.
- Copy: "Pay in USD, GBP, AED and more." (step caption, number 4) · amounts per currency, verbatim:
  - USD: "$1,282.43" · "$68.58" · "Total due: $1,351.01"
  - GBP: "£961.82" · "£51.44" · "Total due: £1,013.26"
  - AED: "AED 4,709.72" · "AED 251.87" · "Total due: AED 4,961.59"
  - "No forced conversion into naira, cedis, or shillings." (`--fs-body`, `--muted`, under the card, left-aligned with it)
- Motion: caption text enter at 32.60. The select and all amounts number-swap GBP → USD at 33.125, USD → AED at 34.375, AED → GBP at 35.625 (ends on GBP, matching the London persona). Bottom line text enter at 33.75.
- Music cue: swaps on beats.
- Assets: none

### `usage` · `start` 37.50 → `end` 42.50 · bars 16–17
- On screen: hard cut out of the dashboard shell to `--bg`. Caption top-left (no number). Centre: white card 1100 px wide titled "Utilisation", with two rows: "Outpatient" 62% and "Dental" 24% (label left, percent right, bar beneath). Card footer: lock icon (inline SVG, 24 px, `--muted`) + "Needs 5+ employees to show a category". Right side of the stage stays empty.
- Copy: "Usage reports that keep records private." (`--fs-h2` 700) · UI text as listed (`--fs-ui`; footer `--fs-caption` `--muted`)
- Motion: caption text enter at 37.60. Card enter at 37.80. Bars grow at 38.4375 and 38.5875; percentages count 0→62 and 0→24 with the fill. Footer text enter at 39.0625.
- Music cue: bars start on the half-beat.
- Assets: none

### `payoff` · `start` 42.50 → `end` 50.00 · bars 18–20 — **matches frame-a.html exactly**
- On screen: logo top-left (96, 80). Copy column at x = 96, y = 250, width 930: pill "SYLOCARE FOR BUSINESS", headline, body. Card at x = 1120, y = 250, width 704 (border-box): tabs "1 · Sign up" / "2 · Assign plans" / "3 · Track usage"; rows "Outpatient $296.83", "Dental $106.63", "Optical $69.52" with bars at 82%, 41% and 27%; footer "Checked 42 of 45 employees just now".
- Copy: pill "SYLOCARE FOR BUSINESS" · headline "Give your team real health cover — " + `<em>`"set it up yourself, today."`</em>` (`--fs-display`, green part `--accent-text`) · body "Nigeria, Ghana and Kenya. Paid in the currency your business already uses." (`--fs-body`, `--muted`)
- Motion: logo + pill text enter at 42.50. Headline text enter at 42.70; the green clause enters separately at 43.125. Body text enter at 43.75. Card enter at 43.75. The selected tab steps 1→2→3 at 44.375, 45.00 and 45.625 (hard switches). Bars grow at 45.625, 45.775 and 45.925. Footer text enter at 46.25.
- Music cue: on the grid.
- Assets: none

### `cta` · `start` 50.00 → `end` 57.50 · bars 21–23
- On screen: hard cut to flat `--deep`. Centred column: logo "+" (64 px, `--accent`), "SyloCare for Business" (`--fs-h1` 800 `--on-deep`), tagline (`--fs-body` `--on-deep-muted`, two lines, max width 900), "Get Started" button (1.3×), URL under the button (`--fs-body` 600 `--on-deep`).
- Copy: "SyloCare for Business" · "Cover for your whole team, minus the operational headache." · button "Get Started" · "sylocare.com/corporate"
- Motion: "+" visible at the cut. Name text enter at 50.30. Tagline text enter at 50.9375. Button card-enter at 51.875. URL text enter at 52.50. Hold to the end. The music fades over the last 1.5 s; picture holds, no fade to black.
- Music cue: end of bar 23.
- Assets: logo (CSS)

## 6. Assets
| path | what | source | blocking |
|---|---|---|---|
| `video/assets/music/sylocare-explainer.m4a` | music bed, 96 BPM, 58.50 s | user's reference video (extracted) | no — present |
| `video/assets/fonts/PlusJakartaSans-*.woff2` (400, 500, 600, 700, 800) | font | Google Fonts (OFL), download locally | yes |
| `video/assets/img/sylocare-business-logo.svg` | official logo | user, optional | no — CSS logo per §4 is the fallback |
| flags NG / GH / KE, lock icon, checkbox tick, pointer | icons | generated in code as inline SVG | no |

## 7. Build notes
- Stack: plain HTML/CSS/JS, single page `video/index.html`, deterministic `seek(t)` (default)
- `VIDEO.music = { src: 'assets/music/sylocare-explainer.m4a', bpm: 96, offset: 0, trimStart: 0.28, fadeOut: 1.5 }`
- All UI is rebuilt in HTML/CSS from §4–5 and `video-brief/frames/frame-a.html`. Don't embed screenshots or pan across them, as the reference did.
- `global.shell` (dashboard sidebar + user block) is one element shown from 17.50 to 37.50 so it stays put across the four dashboard beats; the sidebar's current item is set from `t`.
- Count-ups and currency swaps use integer/fixed strings per frame from `tween()`; currency strings are the verbatim values in §5, never computed conversions.
- Render target (used only after approval): MP4 H.264, 1920×1080, 30 fps, AAC audio

## 8. Assumptions
Decisions made without the user's explicit input (veto any of them):
- The reference video is the content source: its opening lines, step names, persona (Amara Okafor, HR · Meridian EOR Group · London), batch names and every price and total come from it verbatim.
- What changes from the reference: UI is rebuilt large instead of panned screen captures; numbered dark pills become step captions in the top-left; no radial gradients; one signature transition; length 57.5 s (vs 58.5 s) so it ends on a bar line.
- Music is the reference's own track, reused as-is. This assumes you have the right to it, since it came from your video.
- Direction A (brand light) for the middle, with flat dark-green bookends taken from the reference — the look you approved plus the reference's opening and closing.
- Kenya is live (confirmed by the user). The reference's "Kenya · Coming soon" catalog chip is out of date; the video shows Kenya as a normal market.
- The four employee rows (Ada Obi, Kwame M. from SyloCare's site; Chidinma E. and Tunde A. added) are sample data.
- Font is Plus Jakarta Sans, judged from the site and the reference; swap if SyloCare uses a different face.
- Green text on light uses the darker `--accent-text` for readability; on dark, and in fills, the bright brand green is used.
- HMO partner logos are not shown; partner names appear only as UI text.
- The step formerly called "pay" is split into `enrol-invoice` and `currency` (matching the reference's two captions), and the problem beat from the first draft is dropped: the reference's opening already states the need.

## 9. Slop check
Walked slop-video-patterns sections 1–7.
- Tempting: the reference's radial green glow → instead: flat `--deep`.
- Tempting: panning across small screen captures (reference) → instead: UI rebuilt at readable size, cropped to the part that matters.
- Tempting: "Introducing" / "Seamless" copy → instead: SyloCare's own concrete lines.
- Tempting: invented stats → instead: only figures from SyloCare's site and the reference.
- Tempting: identical fade-up on every element → instead: hard cuts, beat-synced reveals, state switches (ticks, tabs, currency swaps), one signature transition.
- Tempting: feature list → instead: one continuous task by one persona through four steps of the same flow.
- Tempting: glassmorphism / floating devices / particles → instead: solid cards, no devices, no particles.
- Tempting: emoji flags → instead: drawn flag SVGs.
- Tempting: whoosh SFX → instead: none.
Deliberate exceptions: none

## 10. Don'ts
- No real customer or account data. Use the persona and figures above only (not the live dashboard account in the user's screenshots).
- No HMO logos unless the user supplies licensed files.
- No claims beyond what SyloCare's site states.
- No screenshots or screen recordings of the product in the video.

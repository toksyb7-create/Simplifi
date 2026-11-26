# SyloCare for Business — explainer

> One-line logline: An HR lead covers a team spread across Lagos, Accra and Nairobi in four steps from one dashboard, paying in the currency their books already use.

Status: draft — approved direction, pending the user's reference video
Brief depth: your call
Style frame: video-brief/frames/frame-a.html

## 1. Overview
- Purpose: product explainer for SyloCare for Business (corporate health cover)
- Audience: founders, HR and ops leads at companies (often distributed or EOR-run) with employees in Nigeria, Ghana or Kenya
- Key message (the one thing they remember): You can set up real HMO health cover for your whole African team yourself, in one place, paid in your own currency.
- Call to action: "Get Started" button + "sylocare.com/corporate"
- Platform: website hero/explainer, YouTube, LinkedIn (landscape)
- Stage: 1920×1080 (aspect 16:9)
- `fps`: 30
- `duration`: 47.50 s

## 2. Story
Meridian EOR Group's team works from Lagos, Accra and Nairobi. Covering them used to mean three HMOs, three currencies and a spreadsheet. With SyloCare for Business it is one login: the HR lead adds the team with their departments, saves a real HMO plan from the catalog, pays the invoice in AED, and then sees usage by category, never anyone's private records. The video ends on SyloCare's own promise: give your team real health cover and set it up yourself, today.

## 3. Music & sound
- Track: `video/assets/music/sylocare-explainer.mp3` — to be supplied: warm, light afro-house / afrobeats-influenced instrumental, no vocals, shakers + soft log drum + muted keys, optimistic but unhurried, ≥ 48 s with a resolved ending on bar 19 — royalty-free licence — **blocking if missing**
- `bpm`: 96
- `offset`: 0.00 s (time of first downbeat)
- Bar length: 2.50 s (4 beats of 0.625 s)
- Track trim: start at 0.00 s in the file (adjust `trimStart` so the file's first downbeat lands at 0.00), fade out 1.5 s at the end
- Key cues: t = 0.00 sparse intro (shaker only); t = 10.00 full groove enters (the turn); t = 35.00 lift into the payoff (drop or added layer); t = 47.50 final resolved hit
- SFX: none
- Voiceover: none. On-screen text carries the story; no captions needed.

## 4. Visual system
### Palette (copied verbatim into `video/tokens.css`)
| token | hex | use |
|---|---|---|
| `--bg` | #F5F7F5 | stage background (off-white, as on sylocare.com/corporate) |
| `--surface` | #FFFFFF | UI cards |
| `--ink` | #0F1A13 | primary text |
| `--muted` | #5E6A62 | secondary text, labels |
| `--line` | #E3E8E4 | card borders, bar tracks use #EEF1EE via `--track` |
| `--track` | #EEF1EE | progress-bar tracks, inactive tab background |
| `--accent` | #22DD1A | SyloCare green: fills, buttons, bars, logo plus |
| `--accent-text` | #119A0C | green **text** on light backgrounds (readable version of the accent) |
| `--accent-tint` | #E8FBE6 | selected chip / pill background |
| `--deep` | #0A3A26 | dashboard sidebar green (beat `add-team` sidebar only) |
| `--on-deep` | #F2F7F3 | text on `--deep` |

### Type
- Family: Plus Jakarta Sans (files: `video/assets/fonts/PlusJakartaSans-{Regular,Medium,SemiBold,Bold,ExtraBold}.woff2`, Google Fonts, OFL), weights 400, 500, 600, 700, 800
- Second family: none
- Scale at stage size (px): `--fs-display` 112, `--fs-h1` 80, `--fs-h2` 52, `--fs-body` 34, `--fs-ui` 30, `--fs-caption` 24
- Line-height: 1.02 display / 1.04 h1 / 1.35 body; tracking −0.035em display and h1, −0.02em h2, 0 elsewhere
- Weights: display/h1 800, h2 700, UI labels 500, emphasis 600–700, captions 500–600
- Safe area: `--safe` 96 px each side
- Green words in headlines use `--accent-text`, set as a plain `<em>` with `font-style: normal`

### Shapes & UI kit (rebuild in HTML; no screenshots)
- Cards: `--surface`, radius 32 px, shadow `0 2px 0 rgba(15,26,19,.04), 0 30px 60px -30px rgba(15,26,19,.25)`, padding 40–44 px
- Pills/chips: radius 999 px, 2 px border `--line`, selected = border `--accent`, text `--accent-text`, background `--accent-tint`
- Buttons: `--accent` fill, `--ink` text, 600 weight, radius 999 px, 72 px tall
- Progress bars: 16 px tall, radius 99 px, track `--track`, fill `--accent`
- Logo: green "+" (two rounded bars 14×40 px, radius 5, `--accent`) + "SyloCare" 700 34 px `--ink` + "BUSINESS" 12 px, tracking 0.3em, `--accent-text` underneath (exact build in `frame-a.html`). Replace with the official SVG if supplied.
- Pointer: a plain black macOS-style arrow cursor, 44 px tall, white 2 px outline, built as inline SVG; click = scale 1→0.88→1 over 0.20 s

### Motion vocabulary
- Default ease: `cubic-bezier(0.2, 0, 0, 1)` (VX.ease.bezier(0.2, 0, 0, 1))
- Text enter: opacity 0→1 + y 24→0 px over 0.40 s
- Card enter: opacity 0→1 + scale 0.96→1 over 0.50 s, transform-origin centre
- List rows: same as text enter, staggered 0.625 s (one musical beat)
- Bars: width 0→target over 0.80 s ease-out, staggered 0.15 s
- Exit: hard cut on the beat line (no exit animation) unless the beat says otherwise
- Signature transition (only one): at the turn (t = 10.00) the green "+" grows from the centre of the stage, scale 0→1 over 0.50 s, and becomes the logo
- Hold rule: every line holds ≥ its reading time (0.3 s/word + 1 s)
- No idle floating, no particles, no camera drift

## 5. Shot list
Beats tile 0 → `duration` with no gaps. Times in seconds. Sample company: **Meridian EOR Group** (from SyloCare's own marketing page).

### `cold-open` · `start` 0.00 → `end` 5.00 · bars 1–2
- On screen: `--bg` stage. Left-aligned at x = 96, vertically centred: the line below at `--fs-h1`. Under it (y + 56 px), three city labels in a row, `--fs-h2` 700, `--muted`, 64 px gap: "Lagos" "Accra" "Nairobi", each with its flag (🇳🇬 🇬🇭 🇰🇪 drawn as simple flag SVGs, 48×32, radius 4) to its left.
- Copy: "Your team works from Lagos, Accra and Nairobi." (`--fs-h1`, `--ink`, max width 1500)
- Motion: headline text enter at 0.40. City labels enter at 1.875, 2.50, 3.125 (beats 4, 5, 6) with text enter.
- Music cue: shaker intro; city labels land on beats 4–6.
- Assets: inline SVG flags (generated in code)

### `the-problem` · `start` 5.00 → `end` 10.00 · bars 3–4
- On screen: line left at x = 96, top third. Below, three small grey "fragments" side by side across the lower half, each a card at 0.9 opacity: (1) a spreadsheet card with 4 rows of grey cell blocks and header "cover-tracker-final-v3.xlsx", (2) a PDF card "Broker quote — Ghana.pdf", (3) a chip row "NGN ₦ · GHS ₵ · KES KSh". All in `--muted` / `--line`; no green anywhere in this beat.
- Copy: "Covering them meant three HMOs, three currencies and a spreadsheet." (`--fs-h1`, `--ink`, max width 1500) · fragment labels as above (`--fs-caption`, `--muted`)
- Motion: headline text enter at 5.10. Fragments card-enter at 6.25, 6.875, 7.50 (beats). At 9.375 all three fragments shift y 0→8 px and opacity 0.9→0.5 over 0.40 s (they go quiet before the turn).
- Music cue: still sparse; fragments on beats.
- Assets: none

### `the-turn` · `start` 10.00 → `end` 15.00 · bars 5–6
- On screen: hard cut to empty `--bg`. The logo "+" grows at stage centre (signature transition), then the full logo assembles centred at 1.6× size (plus 64 px). Below the logo, centred: headline, then sub.
- Copy: "Now it's one login." (`--fs-h1`, `--ink`) · "Every market, every plan, from a single dashboard." (`--fs-body`, `--muted`)
- Motion: "+" scale 0→1 at 10.00 over 0.50 s. Wordmark ("SyloCare" + "BUSINESS") text enter at 10.30. Headline text enter at 10.625. Sub text enter at 11.25.
- Music cue: full groove enters on the downbeat at 10.00.
- Assets: logo (CSS)

### `add-team` · `start` 15.00 → `end` 20.00 · bars 7–8
- On screen: caption top-left at (96, 96). A dashboard crop fills x 96→1824, y 220→984: left a 360 px `--deep` sidebar with the logo (on-deep colours) and menu items "Overview", "Employees" (selected: `--accent` pill, `--ink` text), "Plan Catalog", "Enrollment", "Utilisation"; right a white card titled "Employees" with the counter "17 employees · 5 departments" and four rows: "Ada Obi · Engineering — Premium", "Kwame M. · Operations — Standard", "Wanjiru K. · Finance — Standard", "Tunde A. · Sales — Premium". Tiers are `--accent-tint` chips with `--accent-text` text, right-aligned.
- Copy: "1 · Add your team, with their departments." (`--fs-h2`, `--ink`; "1 ·" in `--accent-text`) · UI text as listed (`--fs-ui` names, departments `--muted`)
- Motion: caption text enter at 15.10. Dashboard card enter at 15.30. Rows enter on half-beats at 15.9375, 16.25, 16.5625, 16.875. Counter number counts 13→17 (integer steps) between 15.9375 and 16.875, in sync with the rows.
- Music cue: rows land on the half-beats of bar 7.
- Assets: none

### `pick-plans` · `start` 20.00 → `end` 25.00 · bars 9–10
- On screen: caption top-left. Main area: a white "Plan Catalog" card. Top row: market chips "Nigeria" (selected), "Ghana", "Kenya"; right side a "My Saved Plans (0)" pill. Below, one plan card at 1.3× UI scale centred in the area: "SME Cobalt (15–22, Starter)", "Underwritten by AXA Mansard", chip "COVERS UP TO 2 PEOPLE", "Age: 18 – 65 years" (`--accent-text`), price "₦86,885.70 / Yearly" (price 700 in `--accent-text`), full-width button "Save to my list". Pointer enters from bottom-right.
- Copy: "2 · Pick real HMO plans in Nigeria, Ghana or Kenya." (`--fs-h2`) · UI text as listed
- Motion: caption text enter at 20.10. Catalog card enter at 20.30. Plan card enter at 20.90. Pointer moves from (1900, 1100) to the button centre 21.60→22.50 (ease default). Click at 22.50 (scale pulse). At 22.60 the button label switches to "Saved" with a check (fill stays `--accent`), and "My Saved Plans (0)" → "(1)" with the selected chip style.
- Music cue: click on the downbeat of bar 10 (22.50).
- Assets: none

### `pay` · `start` 25.00 → `end` 30.00 · bars 11–12
- On screen: caption top-left. Centre-right: the invoice card from the site, scaled to 760 px wide: "Invoice · Meridian EOR Group" (`--muted`), "AED 10,430" (h2 size 84 px, 800), "October invoice · paid in AED" (`--muted`). Under the amount, currency chips "USD", "GBP", "AED". Left of the card, in `--fs-body` `--muted`, the line from the site: "No forced conversion into naira, cedis, or shillings."
- Copy: "3 · Pay in the currency your books already use." (`--fs-h2`) · "No forced conversion into naira, cedis, or shillings." (`--fs-body`, `--muted`, max width 760)
- Motion: caption text enter at 25.10. Card enter at 25.30. Side line text enter at 25.625. Chip selection steps USD (25.625) → GBP (26.25) → AED (26.875), each a hard switch of the selected style. Amount "AED 10,430" and the "paid in AED" line text-enter at 27.20.
- Music cue: chip switches on beats.
- Assets: none

### `usage` · `start` 30.00 → `end` 35.00 · bars 13–14
- On screen: caption top-left. Centre: white card 1100 px wide titled "Utilisation" with two rows: "Outpatient" 62% and "Dental" 24% (label left, percent right, bar beneath). Footer line in the card: lock icon (inline SVG, 24 px, `--muted`) + "Needs 5+ employees to show a category". Right of the card at x ≥ 1360 nothing else — leave air.
- Copy: "4 · See usage by category — never anyone's private records." (`--fs-h2`) · UI text as listed (`--fs-ui`; footer `--fs-caption` `--muted`)
- Motion: caption text enter at 30.10. Card enter at 30.30. Bars grow at 31.25 and 31.40 (0.80 s each); percent numbers count 0→62 and 0→24 alongside the bar fill. Footer text enter at 31.80.
- Music cue: bars start on the downbeat of bar 13 + 1 beat.
- Assets: none

### `payoff` · `start` 35.00 → `end` 42.50 · bars 15–17 — **matches frame-a.html exactly**
- On screen: logo top-left (96, 80). Copy column x = 96, y = 250, width 930: pill "SYLOCARE FOR BUSINESS", headline, body. Card x = 1120, y = 250, width 704: tabs "1 · Sign up" / "2 · Assign plans" / "3 · Track usage" (third selected); rows "Outpatient ₦412,000", "Dental ₦148,000", "Optical ₦96,500" with bars at 82%, 41%, 27%; footer "Checked 42 of 45 employees just now".
- Copy: pill "SYLOCARE FOR BUSINESS" · headline "Give your team real health cover — " + `<em>`"set it up yourself, today."`</em>` (`--fs-display`, green part `--accent-text`) · body "Nigeria, Ghana and Kenya. Paid in the currency your business already uses." (`--fs-body`, `--muted`)
- Motion: logo + pill text enter at 35.00. Headline text enter at 35.20; the green clause enters separately at 35.625. Body text enter at 36.25. Card enter at 36.25. Tabs: selected tab steps 1→2→3 at 36.875, 37.50, 38.125 (hard switches). Bars grow at 38.125, 38.275, 38.425. Footer text enter at 39.00.
- Music cue: lift/drop at 35.00 lands with the headline.
- Assets: none

### `cta` · `start` 42.50 → `end` 47.50 · bars 18–19
- On screen: hard cut to `--bg`. Centred: logo at 1.6×, below it the "Get Started" button (scaled 1.3×), below that the URL. Nothing else.
- Copy: button "Get Started" · "sylocare.com/corporate" (`--fs-body`, `--muted`, 500)
- Motion: logo visible at cut (no animation). Button card-enter at 43.125. URL text enter at 43.75. Hold to the end; no exit.
- Music cue: final resolved hit at 47.50 (end of bar 19).
- Assets: logo (CSS)

## 6. Assets
| path | what | source | blocking |
|---|---|---|---|
| `video/assets/music/sylocare-explainer.mp3` | music, 96 BPM, ≥ 48 s, see §3 | user to supply (royalty-free) | yes |
| `video/assets/fonts/PlusJakartaSans-*.woff2` (400, 500, 600, 700, 800) | font | Google Fonts (OFL), download locally | yes |
| `video/assets/img/sylocare-business-logo.svg` | official logo | user, optional | no — CSS logo per §4 is the fallback |
| flags NG / GH / KE, lock icon, pointer | icons | generated in code as inline SVG | no |

## 7. Build notes
- Stack: plain HTML/CSS/JS, single page `video/index.html`, deterministic `seek(t)` (default)
- All UI is rebuilt in HTML/CSS from the specs above and `video-brief/frames/frame-a.html`; no screenshots of the real product in the video.
- Sample data only: company "Meridian EOR Group" and employee names as listed. Do not use any real customer names or the account shown in the user's dashboard screenshots.
- Number count-ups (employees, percentages) use integer values per frame from `tween()` and `Math.round`.
- Render target (used only after approval): MP4 H.264, 1920×1080, 30 fps, AAC audio

## 8. Assumptions
Decisions made without the user's explicit input (veto any of them):
- Length 47.5 s (19 bars at 96 BPM), 16:9, for the website and LinkedIn/YouTube.
- No voiceover; on-screen text only.
- Look: direction A (brand light) — approved by the user.
- Font is Plus Jakarta Sans, judged from the site's headlines; swap if SyloCare uses a different face.
- Green text uses a darker `--accent-text` (#119A0C) instead of the site's bright green so it stays readable; fills and bars keep the bright green.
- Story follows the product's own "four steps" (add employees → save a plan → enrol/pay → track usage), with enrolment and payment merged into one beat.
- Sample company "Meridian EOR Group", plan "SME Cobalt (15–22, Starter) — AXA Mansard — ₦86,885.70/yr" and figures (AED 10,430; Outpatient 62%, Dental 24%; ₦412,000 / ₦148,000 / ₦96,500; 42 of 45) are taken from SyloCare's own marketing page and catalog screenshots.
- HMO partner logos are not shown (no licensed files); the partner name appears only as UI text ("Underwritten by AXA Mansard").
- The user's reference video has not been received yet; this brief will be revised when it arrives.

## 9. Slop check
Walked slop-video-patterns sections 1–7.
- Tempting: green→teal gradient background → instead: flat `--bg` off-white, green only on fills and one headline clause.
- Tempting: glassmorphism cards → instead: solid white cards with one shadow spec.
- Tempting: "Introducing SyloCare for Business" / "Seamless health cover" → instead: SyloCare's own concrete lines ("Give your team real health cover — set it up yourself, today.").
- Tempting: "10x faster setup" stat → instead: no invented stats; only numbers from SyloCare's own UI.
- Tempting: floating 3D laptop mockup → instead: UI rebuilt flat at readable size, cropped to what matters.
- Tempting: everything fading up on the same stagger → instead: hard cuts between beats, beat-synced reveals, chip/tab switches as hard state changes, one signature transition (the "+").
- Tempting: feature list beat after beat → instead: one continuous task by one company (Meridian), four steps of the same flow.
- Tempting: logo + URL ending with nothing else → instead: payoff beat carries the promise with live product UI; CTA beat is short and holds.
- Tempting: emoji flags and ✨ → instead: simple drawn flag SVGs, no sparkle icons.
- Tempting: whoosh SFX → instead: no SFX.
Deliberate exceptions: none

## 10. Don'ts
- No real customer or account data (no names from the user's live dashboard).
- No HMO logos unless the user supplies licensed files.
- No claims beyond what SyloCare's site states (3 markets today; more "on the way" is not promised in the video).

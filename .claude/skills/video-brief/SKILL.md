---
name: video-brief
description: Interview the user at the depth they choose (detailed, general direction, or "your call"), then write video.md, a complete, build-ready direction file for a code-rendered video. It covers story, a timed shot list, exact copy, palette, type, motion, sound, assets and build notes, all checked against the banned slop patterns, plus 2–3 style frames for approval when the look isn't already pinned down. Use when someone wants to plan, brief, scope or art-direct a video (launch film, product ad, explainer, motion graphics, social clip) before it's built, says "video brief", "write a video.md", "plan the video", "direction for the video", or asks to start a new video and no video.md exists yet.
---

# video-brief

Your job ends with one file: **`video.md`** at the project root. It must be
complete enough that a fresh session with no memory of this conversation can
run the `video-build` skill and build exactly this video without asking a single
question. You do not build the video here.

Files this skill uses:

- `references/video-template.md` — the exact structure of `video.md`. Follow it
  section by section; don't drop sections.
- `references/questions.md` — the question bank for each depth mode.
- `../slop-video-patterns/SKILL.md` — the banned list. **Read it before you
  write a single line of the brief.**

## Step 0 — Check what exists

- If `video.md` (or `VIDEO.md`) already exists, read it and ask with
  `AskUserQuestion` whether to revise it or start a new one (move the old one
  to `video.<date>.md`). Never overwrite silently.
- Look for brand material in the repo (logo files, `brand/`, a design-tokens
  file, a README describing the product). Anything you find answers questions
  so you don't have to ask them.
- Note what the user already said in their request — topic, length, platform,
  audience. Don't re-ask anything already answered.

## Step 1 — Ask how deep to go

Your first question is always a single `AskUserQuestion` call with exactly
these three options (header: `Brief depth`):

1. **Detailed** — "I'll ask about style, guidelines, brand identity, colours,
   type, music and everything else needed to lock the look. Most questions, most
   control."
2. **General direction** — "You give the overall style and anything specific
   you're expecting; I fill in the rest and show you what I guessed."
3. **Your call** — "Tell me what the video is about; I decide everything else."

## Step 2 — Interview at that depth

`AskUserQuestion` takes 1–4 questions per call, 2–4 options each, and the user
can always type "Other". Group related questions into rounds; never fire one
question at a time when four fit. Put your recommended option first, labelled
"(Recommended)". Use the `preview` field to show palette swatches as hex lists,
type pairings, or a 3-line shot sketch when it helps them choose.

### Detailed
Run every round in `references/questions.md` → *Detailed* (typically 4–6
rounds). Cover: purpose and audience, platform/aspect ratio/length, story and
key message, brand identity (name, logo, existing guidelines), colours, type,
visual style and references, motion feel, music and SFX, voiceover/captions,
assets they'll supply, the call to action, and hard don'ts. Skip any question
the repo or their request already answered. Finish with: "Anything else I
should know before I write it?"

### General direction
One or two rounds from *General direction*: overall style/mood, platform and
length, and "anything particular you're expecting?" (must-have shots, lines,
brand rules). Then **you** decide the rest. Every decision you made for them is
listed in the brief under *Assumptions* so they can veto it.

### Your call
Ask only what the video is about if they haven't said (one question, free text
via "Other" is fine), plus length/platform only if it truly can't be inferred.
Decide everything else yourself. List decisions under *Assumptions*.

In all modes: if the user gives a music track, use it. If they don't, you
choose one — either a file they already have in the repo, or describe the track
precisely (genre, BPM, mood, length) and mark it under *Assets needed* as
**blocking**. Never invent a file path that doesn't exist.

## Step 3 — Slop pass (before writing)

Read `.claude/skills/slop-video-patterns/SKILL.md` in full. For your planned
palette, type, copy, motion, layout, sound and structure, walk each section and
replace anything that matches with the specific alternative. Keep a short
record — it goes into the brief's *Slop check* section.

## Step 4 — Style frames (only when the look isn't pinned down)

Skip this step if the user supplied a complete brand system (palette + type +
references) or chose **Detailed** and approved every visual choice explicitly.
Otherwise:

- Make **2–3 style frames**: each a single, still, 1920×1080 (or the chosen
  aspect) HTML file in `video-brief/frames/frame-a.html`, `frame-b.html`, …
  Each shows the *same* key moment (usually the hero/payoff beat) in a
  different direction — palette, type, composition. Real copy, no lorem ipsum,
  slop-checked.
- Show them: publish each as an Artifact if that tool is available, otherwise
  give the user the file paths to open. Label each with a one-line description
  ("A — warm paper, serif headline, product UI full-bleed").
- Ask with `AskUserQuestion` which direction to take (options A/B/C, plus
  "mix" via Other). Fold their choice and any tweaks into the brief.
- The chosen frame stays in the repo and is referenced in the brief as the
  visual source of truth.

## Step 5 — Write video.md

Fill `references/video-template.md` completely. Rules:

- **Timed shot list.** Every beat has `id` (kebab-case), `start` and `end` in
  seconds (two decimals), what's on screen, exact copy, motion, and the music
  cue it lands on. Beats tile the timeline with no gaps or overlaps;
  `end` of the last beat = `duration`.
- **Music grid.** Track file, BPM, offset of the first downbeat in seconds, and
  which beat starts on which bar. Beat boundaries should land on bar or beat
  lines (`offset + n × 60/BPM`) unless there's a reason.
- **Exact copy.** Every word that appears on screen, verbatim, with its hold
  time ≥ reading time (≈ 0.3 s/word + 1 s).
- **Tokens.** Palette as named hex tokens; type as family, weights, and a size
  scale in px at the stage size. The build will copy these into
  `video/tokens.css` verbatim.
- **Numbers, not adjectives.** "Fade 0.4 s ease-out from 0 to 1, y 24→0 px",
  not "smooth fade in".
- **Assets.** Every file the build needs, with path, source (user / generated /
  to be found), and whether it's blocking.
- **Assumptions.** Everything you decided that the user didn't (general and
  "your call" modes especially).
- **Slop check.** The record from step 3.

## Step 6 — Hand off

Validate before you finish: beats tile `0 → duration`, every beat has copy or is
marked "no text", every token referenced in beats is defined, every asset in
beats is in the asset list. Then tell the user, in 3–5 lines: where the file
is, length and beat count, the chosen direction, anything blocking (usually the
music file), and that the next step is `video-build`.

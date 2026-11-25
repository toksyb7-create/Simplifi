---
name: video-review
description: Review loop for a video built by video-build. Opens a browser viewer where the user scrubs the video, leaves comments pinned to exact timestamps (and optionally to an element), and approves when nothing needs changing. Takes all notes of a round at once, sends the small value edits to the video-fixer agent in one go, handles the larger changes itself, re-measures, and repeats. If it must look at something, it takes only a small crop. Renders the mp4 only when the user says "approved". Use when the user says "review the video", "let me give notes", "open the viewer", "I have feedback on the video", or after video-build finishes.
---

# video-review

A round-based loop: **user leaves notes → you apply them all → user checks →
repeat until "approved" → render.**

Run this skill in the main conversation (not as a subagent): it delegates to
the `video-fixer` agent, which only works from the main thread.

## Rules

- **Batch.** Never act on notes one at a time. Wait until the user has sent
  the whole round, then process the round together.
- **Small fixes go to `video-fixer`, in one call.** All of a round's small
  notes go in a single Agent call. Don't make those edits yourself and don't
  split them across several calls.
- **Measure, don't look.** Verify with
  `.claude/skills/video-build/scripts/measure.mjs`. If a note truly can't be
  checked with numbers ("does the gradient band?"), take **one small crop**
  with `scripts/crop.mjs` — max 480 px, cropped to the element. Never a full
  frame, never a screenshot of the viewer.
- **No render before approval.** `scripts/render.mjs` runs only after the user
  says "approved" (in chat, or via the viewer's Approve button followed by a
  chat message). "Looks good" about one beat is not approval of the video.

## Step 1 — Open the viewer

1. Check `video/index.html` exists (otherwise suggest `video-build`). Read
   `video.md` (or `VIDEO.md`) so you know the intent behind each beat.
2. Copy `assets/review.html` → `video/review/index.html`.
3. Start the server in the background if it isn't already running:
   `node .claude/skills/video-build/scripts/serve.mjs video --port 4321`
4. Give the user `http://localhost:4321/review/` and how to use it, in 3 lines:
   - scrub or play, pause where something should change, type the note, Enter
     (optionally **Pick element** first, then click the thing in the video)
   - add as many notes as you like, then **Send all notes to Claude**, then
     tell me "done"
   - when nothing needs changing, press **Approve** and tell me "approved"

Then wait.

## Step 2 — Read the round

When the user says the notes are sent, read `video/review/notes.json`
(`{ round, notes: [{ id, t, tc, beat, el, text }] }`). Notes can also arrive
typed in chat ("at 0:12 the title is cut off") — treat those the same way,
assigning `t` and `beat` from what they say.

For each note, resolve what it's about: the beat from `t`, the element from
`el` — or, if `el` is null, run
`measure.mjs video --at <t>` and match the note's words to the measured
elements' text and positions.

## Step 3 — Triage

Sort every note into exactly one bucket:

**Small → video-fixer.** A literal value edit:
- text (copy, typos, labels)
- sizes (font size, width/height, scale, padding/margin, stroke)
- colours (hex, opacity, a token)
- timings *inside* a beat (durations, delays, holds, easing)

**Larger → you.** Anything else, for example:
- moving a beat's `start`/`end` or changing `duration`, since that moves
  the music grid
- adding, removing or reordering elements, beats or animations
- layout or composition changes, new assets, a different transition
- vague direction ("feels slow", "more energy"); turn it into a concrete
  change consistent with the brief before doing it
- anything the measurement shows is broken (overflow, overlap) where the fix
  isn't a single value

**Question → ask.** If a note conflicts with the brief or with another note,
or you can't tell what it means, collect it. Ask all such questions together in
one `AskUserQuestion` call, before you start editing.

## Step 4 — Apply

1. **Fixer first, one call.** Send every small note to the `video-fixer`
   agent in a single Agent call (`subagent_type: video-fixer`). For each note
   give: number, `tc`, `beat`, `el`, the user's words verbatim, and the
   file/line or token you identified, if known. Ask for its standard report.
2. **Then your changes.** Make the larger changes yourself, following the
   video-build rules (tokens only, everything a pure function of `t`,
   `data-el` on new elements, `runtime.js` untouched). Re-read
   `.claude/skills/slop-video-patterns/SKILL.md` before any change that adds
   or restyles something. If you move beat boundaries, keep them on the music
   grid and update the shot list in `video.md` so brief and build stay in sync.
3. **Pick up the leftovers.** Anything the fixer returned as NOT DONE or
   NEEDS A DECISION becomes yours: do it, or ask.

## Step 5 — Verify

Run `node .claude/skills/video-build/scripts/measure.mjs video`, a full run
and not only `--at`, since a change in one beat can break another. Zero errors.
Then confirm each note individually with numbers: e.g. the new text is present
at `t`, the font size reads the new px value, the element's opacity is above 0.5
for the new hold time, the overlap is gone. Use `--at <t> --el <name>` for
these. Crop only if a note is about something measurement genuinely can't see.

## Step 6 — Report and loop

Write `video/review/changes.json`. The viewer shows it as "Changed in round N"
with jump links:

```json
{ "round": 2, "changes": [ { "t": 4.2, "summary": "hero.title: \"Ship faster\" → \"Ship it faster\"" } ] }
```

Then tell the user, in chat:

- **Changed:** one line per note, saying what changed (merged from the fixer's
  report and your own work).
- **Not changed:** anything you didn't do, and why.
- **Measure:** 0 errors, N warnings.
- "Refresh the viewer to check. Leave more notes, or Approve and say
  'approved' to render."

Go back to Step 2 for the next round.

## Step 7 — Render (only on "approved")

When the user says "approved" (or presses Approve and tells you):

1. Run `measure.mjs video` one last time. It must have zero errors; if it
   doesn't, say so and fix before rendering.
2. `node .claude/skills/video-review/scripts/render.mjs video`. It seeks every
   frame, encodes H.264 at the brief's size and fps, and muxes the music with
   the brief's trim and fade. Output: `video/out/<title>.mp4`.
3. Check the file with
   `ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,duration -of compact <file>`
   and compare the video stream's size, fps and duration (±1 frame), and the
   audio stream's presence, against the brief.
4. Give the user the path and those numbers. Stop the review server.

---
name: slop-video-patterns
description: The banned list for code-rendered videos — visual, motion, copy, sound and structure patterns that make a video look generic, templated or AI-made. Read it before writing a video brief, before building a video, and when reviewing one. Use when someone says "slop check", "does this look generic", "banned patterns", or when the video-brief, video-build or video-review skills reach their slop step.
---

# Banned slop patterns for video

A pattern on this list is banned by default. It may appear only when `video.md`
names it under **Deliberate exceptions** with a one-line reason tied to the
story ("the gradient is the client's actual brand gradient"). "It looks nice"
is not a reason.

How to use this file:

- **Writing a brief:** walk every section below and make sure no beat, colour,
  line of copy or sound cue in the brief falls into one. Record the check in the
  brief's *Slop check* section (which patterns were tempting and what you did
  instead).
- **Building:** if the brief is silent on something, don't fill the gap with a
  pattern from this list.
- **Reviewing:** treat any hit as a fix, even if the user didn't flag it — but
  tell them, don't silently redesign.

Each entry says what to do instead. Prefer the specific over the generic: the
real product, the real number, the real interface, the real sentence.

## 1. Colour and light

| Banned | Do instead |
|---|---|
| Purple→blue / pink→orange "AI gradient" backgrounds | A palette from the brand or the subject matter; flat fields with one accent |
| Neon glow / outer-glow on text and icons | Contrast from value and size, not bloom |
| Glassmorphism cards (frosted blur panels) everywhere | Solid surfaces with a clear elevation system, used sparingly |
| Aurora / mesh-gradient blobs drifting behind content | A background that carries meaning (texture of the product, a real photo, plain colour) |
| Lens flares, light leaks, god rays as decoration | Light only when the scene has a light source |
| Every element a different saturated colour | 1 base, 1 ink, 1–2 accents; accents mean something |
| Pure #000 background with pure #FFF text at full size | Slightly lifted darks / off-white, tuned for the medium |

## 2. Type and copy

| Banned | Do instead |
|---|---|
| "Introducing…", "Meet…", "The future of…", "Reimagined", "Unleash", "Elevate", "Supercharge", "Seamless", "Game-changer", "Next-level" | Say the concrete thing the product does, in the viewer's words |
| Three-word stacked taglines ("Fast. Simple. Powerful.") | One sentence with a verb and a specific claim |
| Word-by-word typewriter reveal on every line | Reveal style chosen per line; most lines just appear and hold |
| Kinetic type that spins, bounces or scales each letter | Motion on the block, letters stay still |
| Text on screen for less time than it takes to read (≈ 0.3 s per word + 1 s) | Hold every line at least its reading time |
| Gradient-filled headline text | Solid ink colour |
| More than two typefaces; default Inter-for-everything without a reason | One family (two max) chosen for the tone; set sizes on a scale |
| Emoji as icons; ✨ sparkle icon for "AI" | Real icons from one set, or none |
| Fake stats ("10x faster", "99.9%") not given by the user | Real numbers, or no number |
| Lorem ipsum, "John Doe", "Acme" placeholder data in UI shots | Plausible, specific sample content that fits the story |

## 3. Motion

| Banned | Do instead |
|---|---|
| Everything fades up 20px with the same ease and the same delay stagger | Motion vocabulary chosen per beat: cut, push, mask, scale-from-source |
| Floating/bobbing idle animation on cards and devices | Things hold still when they aren't the point |
| Continuous slow zoom ("Ken Burns") on every shot | Camera moves only with a motivation |
| Particles, confetti, sparkles, orbiting dots | One purposeful accent at the payoff, if any |
| 3D-tilting devices spinning in space | Straight-on product UI at a readable size |
| Bouncy overshoot springs on everything | Overshoot only on the one element that should feel playful |
| Transitions longer than ~0.6 s between beats; whooshy whip-pans on each cut | Hard cuts on the beat; one signature transition max |
| Animation that doesn't land on the music grid | Key moments on downbeats, listed in the brief |
| A "glitch" effect to signal tech | Show the tech |

## 4. Layout and composition

| Banned | Do instead |
|---|---|
| Centered headline + subhead + button, beat after beat | Vary composition per beat; use the full 16:9 (or chosen ratio) |
| Bento grid of identical rounded cards | Hierarchy: one hero, supporting items smaller |
| Floating device mockup on a gradient with nothing else | Device in context or full-bleed UI with a pointer doing a real task |
| Fake browser/app chrome with traffic lights on everything | Chrome only when the context of "this is an app" matters |
| Elements crammed to the edges; no safe area | Title-safe margins (≥ 5% each side) |
| Tiny UI screenshots the viewer can't read | Crop to the part that matters and scale it up |

## 5. Sound

| Banned | Do instead |
|---|---|
| Generic "inspiring corporate" ukulele/piano + claps | A track whose tempo and mood match the brief, named with a BPM |
| A whoosh SFX on every transition | SFX only where an on-screen action makes a sound |
| Music that ends abruptly or loops visibly | Video length set to the track's phrase; end on a resolved bar |
| Riser → drop with nothing visual on the drop | The hero moment sits on the drop |

## 6. Structure and story

| Banned | Do instead |
|---|---|
| Problem → "But what if…" → product → logo outro, with no specific moment | One concrete situation the viewer recognises, then the turn |
| Feature list read out as beats (feature, feature, feature, feature) | One to three features, each shown doing something |
| Ending on a logo + URL with nothing else | End on the payoff image; logo holds over it |
| Every beat the same length | Rhythm: short beats into a held payoff |
| A call to action that isn't something the viewer can do | One action, specific ("Run `npx create-x`", "Join the waitlist at …") |

## 7. Build tells (for code-rendered video)

| Banned | Do instead |
|---|---|
| Default system font fallback because the font never loaded | Font files in `video/assets/`, load awaited before frame 0 |
| Layout that shifts between frames | All positions computed from time `t`; nothing depends on real elapsed time |
| CSS transitions / `setTimeout` driving animation | Every value derived in `seek(t)` |
| Text overflowing its box, overlapping another element, or clipped by the stage | Measured and fixed before handoff |

## Slop check template (paste into video.md)

```markdown
## Slop check
Walked slop-video-patterns sections 1–7.
- Tempting: <pattern> → instead: <what the brief does>
- Tempting: <pattern> → instead: <…>
Deliberate exceptions: none | <pattern> — <story reason>
```

# Pause walkthrough

An automated, interactive walkthrough of the Pause prototype for presentations. It drives the **real** prototype (not screenshots). It shows **Purpose Sessions** and **Reward the Exit**, plus an optional **Personalised Learning** chapter, and explains each step next to the phone.

## Open it

- From the prototype's landing page: **▶ Watch Walkthrough** (or **Try Pause** for the normal prototype).
- Directly: `walkthrough.html` (for example `https://natashaa27.github.io/sdt-doomscrolling/walkthrough.html` once deployed).
- It also works when opened straight from disk (double-click `walkthrough.html`).

Useful URL options:

| URL | Opens |
|---|---|
| `walkthrough.html` | Title card with a Start button |
| `walkthrough.html?autoplay` | Starts playing Chapters 1 and 2 at once |
| `walkthrough.html?chapter=learn` | The optional learning chapter (paused) |
| `walkthrough.html?step=extra2` | Jumps to a step (use its `id` or number, e.g. `step=7`), paused |
| `walkthrough.html?speed=1.5` | Starts at 1.5× |
| `walkthrough.html?video` | Recording mode: title card, auto play, summary, no buttons |

## Controls

| Control | Keyboard |
|---|---|
| Play / Pause | Space or K |
| Previous / Next step | ← / → |
| Restart | R |
| Jump to chapter | 1, 2, 3, or the chapter menu |
| Jump to any step | Click a numbered step in the progress bar |
| Speed 1× / 1.5× | Buttons at the bottom right |
| Collapse the overview | O, or the « button |
| Exit to the prototype | Esc, or Exit |

**Pausing and jumping:**
- **Pause** freezes both the script and the phone: the countdown, Reels and grayscale all stop.
- **Jumping** to a step (Previous, Next, the step numbers or the chapter menu) stops automatic playback. The chosen step still sets itself up and plays its own demonstration, then waits. Press **Play** to continue to the following steps.

On screens narrower than 900 px, the explanation moves into a bottom sheet (tap its heading to shrink it), the overview is hidden, and the connecting line is replaced by the numbered bubble alone.

## How it works

- `walkthrough.html` shows the prototype in an iframe: `index.html?demo`.
- In `?demo` mode the prototype:
  - uses **in-memory storage**, so it never reads or changes the visitor's saved preferences
  - accepts commands from the walkthrough through `postMessage`
- Without `?demo`, the prototype behaves exactly as before.
- The walkthrough presses the prototype's real buttons (`click`) and moves the highlight. It can also start from a known state (`set`), for example the second checkpoint, so jumping to grayscale or protected mode needs no replay.
- The prototype reports the highlighted element's position every frame. The page redraws the highlight, numbered bubble and connecting line from it, so they follow scrolling, re-rendering and window resizing.
- The grayscale indicator beside the phone reads the prototype's own grayscale value.
- Repetitive scrolling is sped up by running the prototype's Reel timer faster. The Reels, counter and grayscale sequence are unchanged: 35→65% for the first extension, 70→100% for the second.

Files:

| File | Purpose |
|---|---|
| `walkthrough.html` | Page layout (overview, phone, explanation, controls) |
| `walkthrough/steps.js` | **All step text and scripts. Edit this to change the walkthrough.** |
| `walkthrough/walkthrough.js` | Playback engine, highlight and connector overlay, controls |
| `walkthrough/walkthrough.css` | Styles (same cream, sage and dark-green palette as the prototype) |
| `walkthrough/record.js` | Records the videos and writes subtitles and narration |
| `walkthrough/video/` | Generated MP4s, SRT subtitles and narration scripts |

## Updating the walkthrough

Each step in `steps.js` has:
- the panel text: `phone`, `user`, `why` and `systems`
- a systems-thinking `label`
- `say`: one or two sentences used for subtitles and narration
- an optional `note`
- two functions:
  - `prepare(d)`: sets up the phone when someone jumps to the step
  - `run(d)`: the scripted demonstration

Inside `run`:

```js
await d.hl('#feed-count', 'Reel counter and time'); // move the numbered highlight (one at a time)
await d.click('[data-action="continue"]');           // press a real button in the prototype
await d.rate(1.6);                                     // Reel playback speed (1 = normal, 7 s per Reel)
await d.until(q => q.screen === 'checkpoint');         // wait for a prototype state
await d.wait(3000);                                    // hold so the explanation can be read (scaled by 1× / 1.5×)
```

Highlight targets are CSS selectors inside the prototype. `{sel, closest}` highlights a parent, for example the whole commitment card. `{union:[...]}` draws one box around several elements.

The systems loops in the overview (`LOOPS` in `steps.js`) are a general reinforcing and balancing structure. Adjust their wording to match your own causal loop diagram.

If you change a prototype screen, re-run the checks below and re-record.

## Recording the videos

Requirements:
- Node 18+
- Playwright with Chromium
- FFmpeg with libx264

```bash
# once, if needed
npm install playwright && npx playwright install chromium
# FFmpeg: install from your package manager, or: pip install imageio-ffmpeg and point FFMPEG at its binary

node walkthrough/record.js                  # → walkthrough/video/pause-walkthrough.mp4 (+ .srt, -narration.md)
node walkthrough/record.js --chapter learn  # → walkthrough/video/pause-personalised-learning.mp4 (+ .srt, -narration.md)
# FFMPEG=/path/to/ffmpeg node walkthrough/record.js   if ffmpeg is not on PATH
```

The script:
- serves the repository locally
- opens `walkthrough.html?video` in headless Chromium at 1920×1080
- captures each rendered frame through the DevTools screencast
- encodes a 30 fps H.264 MP4
- times the subtitles and narration from the walkthrough's own step events

Re-record after any change to the text or timing so the subtitles stay in sync.

Current outputs:

| File | Length |
|---|---|
| `video/pause-walkthrough.mp4` | 2:32. Title, Chapters 1–2, summary |
| `video/pause-personalised-learning.mp4` | 0:49. Title, optional chapter, summary |
| `video/*.srt` | Subtitles matching each video |
| `video/*-narration.md` | Optional narration script with timestamps. No synthetic voice is included. |

## Honesty notes shown in the walkthrough

- The Instagram screens are simulated. Real Instagram restrictions would need a compatible browser or browser extension.
- Learning cards are curated demo content, not live AI. Instagram-derived interests are simulated; there is no Instagram connection and no password is ever requested.
- The walkthrough explains what each intervention is *intended* to do. Their effects have not yet been evaluated.

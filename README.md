# Pause – doomscrolling prototype

A clickable, mobile-sized prototype for a design-thinking project on doomscrolling.
Pause adds a small layer before and after a scrolling session so starting is a
conscious choice and stopping feels good. It never blocks the user.

## Run it

Open `index.html` in any modern browser. No build step, backend or login.
The phone (390 × 844) sits on the left and the facilitator panel on the right.
The phone scales down to fit smaller laptop screens.

## Flow

1. **Purpose prompt**: shown before the app opens. One tap for a purpose, one for
   "Open my app". Optional time cue (5 / 10 / 15 min, default No timer).
2. **Conscious Continue checkpoint**: only when a cue was set, shown when it runs
   out. End / Continue for 5 minutes / Change my purpose. Never auto-closes.
3. **Exit feedback**: a voluntary close within the cue (or untimed) shows
   "You chose to stop". Reward B adds weekly reclaimed minutes and a goal ring.
   Interruptions show a neutral "Session ended" screen.
4. **Optional reflection**: two questions, save or skip.

## Facilitator panel

- Prompt variant A (full list) / B (short list), reward variant A / B
- Time speed 1× / 10× / 60×
- Simulate notification, simulate interruption (call or class), new participant
- Live session log, **Export CSV** (download) and **Copy CSV** (clipboard fallback)

Data stays in memory for the tab. Export before closing; the page warns on close.

## Log columns

One row per session:
`participant_id, session_id, app, trigger, prompt_variant, purpose, time_cue_chosen,
time_to_choose_purpose_ms, start_time, checkpoint_count, checkpoint_choices,
final_boundary, end_time, end_type, within_boundary, reward_variant_shown,
well_spent, how_it_ended`, plus two helper columns, `time_speed` and `sim_duration_s`.

Notes:
- Times use the simulated clock: `end_time = start_time + simulated duration`.
- The clock runs only while the feed is visible. It pauses on the checkpoint and
  purpose screens.
- `purpose` lists every purpose in order when the user changed it (`A break > Something specific`).
- `final_boundary` is in cumulative minutes of in-app time (10 then +5 → `15`), or
  `none` when untimed. `within_boundary` is blank for untimed sessions.
- Tapping "Not now" on the prompt logs a session with purpose `(not opened)`.
- "New participant" during an open session logs it with `end_type = unknown`.
- The session in progress is left out of the CSV export.
- Feed content is placeholder-only and never logged.

# Pause – doomscrolling prototype

A clickable, mobile-sized prototype for a design-thinking project on doomscrolling.
Pause adds a small layer before and after a scrolling session so starting is a
conscious choice and stopping feels good. It never blocks the user.

- `index.html`: **Pause v3** (current version, served on GitHub Pages)
- `pause-v2.html`: **Pause v2**, the previous version, kept for comparison

## Run it

Open `index.html` in a browser, or use the Pages site:
https://natashaa27.github.io/sdt-doomscrolling/

For a participant's own phone:
https://natashaa27.github.io/sdt-doomscrolling/?participant=1&speed=10&reward=A

URL options: `participant=1`, `speed=1|10|60`, `reward=A|B`, `breath=on`, `pid=P07`.
Tap the phone's clock five times within three seconds to show or hide the test console.

The log is kept in the tab's session storage: it survives a reload but is cleared when
the tab closes. Export it after each participant.

## What changed from v2

- Purpose and time on one sheet; tapping a time opens the app (two taps).
- "I don't need [app] right now" lets people back out; logged as `declined`, no reward.
- Optional 3-second breath before the prompt (off by default).
- Full-screen checkpoint whose question depends on the purpose and alternates
  between two wordings ("Feeling rested?" / "Still on your break?").
- Live pill at the top shows purpose and time.
- Reward B: a plant that grows a leaf per chosen stop and flowers at a weekly goal the
  participant sets. It never shrinks.
- Close the app with the home bar at the bottom of the phone.
- Console: dismissal watch (purpose picks under 1 s, same purpose repeated), running
  totals, auto-save, CSV export/copy.

## Benchmarks shown in the console

- one sec: participants closed the target app again in 36% of opening attempts
  ([Grüning et al., PNAS 2023](https://www.pnas.org/doi/10.1073/pnas.2213114120)).
- Wellspent: RCT of full-screen quit/continue reminders
  ([JMIR mHealth 2026](https://mhealth.jmir.org/2026/1/e56824)). The share of reminders
  followed by a stop has not been checked yet, so no figure is shown.

---

# Pause v2 (previous version, `pause-v2.html`)

## Participant mode (real phone)

Add `?participant=1` to the URL to hide the facilitator panel and show the phone
view full-screen, e.g.

    pause-v2.html?participant=1&speed=10&reward=A

| Parameter | Values | Default |
|---|---|---|
| `participant` | `1` hides the panel | off |
| `speed` | `1`, `10`, `60` | `1` |
| `reward` | `A`, `B` | `A` |
| `prompt` | `A`, `B` (optional) | `A` |
| `id` | participant ID (optional) | `P01` |

The log is still kept in memory. To reach it on the phone, tap the clock on the home
screen five times within three seconds; the panel opens with Export / Copy CSV and a
"Back to phone view" button.

## Flow

1. **Purpose prompt**: shown before the app opens. One tap for a purpose, one for
   "Open my app". Optional time cue (5 / 10 / 15 min, default No timer) on the same screen.
2. **Feed**: endless; it loops a set of invented sample posts. Clips shows them as video cards.
3. **Conscious Continue checkpoint**: only when a cue was set, shown when it runs
   out. "You planned 10 minutes to take a break." End / Continue for 5 minutes /
   Change my purpose. Never auto-closes.
4. **Exit feedback**: a voluntary close within the cue (or untimed) shows
   "You chose to stop." Timed sessions that ended within the cue also get
   "You stopped when you planned to." Reward B adds "Stops you chose this week: X of
   [goal]" with a ring that fills once. The participant picks the goal (5/10/15/20)
   the first time they see it. Every voluntary stop that reaches this screen counts,
   timed or untimed, in both variants. Interruptions show a neutral "Session ended" screen.
5. **Optional reflection**: "Did this session feel worthwhile?" and "Did you feel in
   control?" (Yes / Partly / No each), then Save or Skip.

## Facilitator panel

- Prompt variant A (full list) / B (short list), reward variant A / B
- Time speed 1× / 10× / 60×
- Simulate notification, simulate interruption (call or class), new participant
- "Chosen stops at week start" seeds the weekly count for variant B
- Live session log, **Export CSV** (download) and **Copy CSV** (clipboard fallback)

Data stays in memory for the tab. Export before closing; the page warns on close.

## Log columns

One row per session:
`participant_id, session_id, session_number, app, trigger, prompt_variant, purpose,
time_cue_chosen, purpose_decision_ms, start_time, checkpoint_count, checkpoint_choice,
checkpoint_choices, checkpoint_decision_ms, final_boundary, end_time, end_type,
within_boundary, reward_variant_shown, reflection_skipped, worthwhile, felt_in_control,
time_speed, sim_duration_s`

Notes:
- `purpose_decision_ms` and `checkpoint_decision_ms` are real milliseconds from the
  screen appearing to the tap. Time speed and clock pausing do not affect them.
  When a session has more than one prompt or checkpoint, values are joined with `|`
  in order (the first `purpose_decision_ms` value is the entry prompt).
- `checkpoint_choice` is the last checkpoint choice; `checkpoint_choices` lists all of them.
- `reflection_skipped` is `yes` (tapped Skip), `no` (saved), or blank (reflection not opened).
- Session times use the simulated clock: `end_time = start_time + simulated duration`.
  That clock runs only while the feed is visible.
- `purpose` lists every purpose in order when the user changed it (`A break > Something specific`).
- `final_boundary` is in cumulative minutes of in-app time (10 then +5 → `15`), or
  `none` when untimed. `within_boundary` is blank for untimed sessions.
- Tapping "Not now" on the prompt logs a session with purpose `(not opened)`.
- "New participant" during an open session logs it with `end_type = unknown`.
- The session in progress is left out of the CSV export.
- Feed content is never logged.

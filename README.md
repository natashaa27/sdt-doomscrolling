# Pause – doomscrolling prototype

A clickable, mobile-sized prototype for a design-thinking project on doomscrolling.
Pause adds a small layer before and after a scrolling session so starting is a
conscious choice and stopping feels good. It never blocks the user.

The two interventions under test:

1. **Purpose Sessions with Conscious Continue**: pick a purpose and a time before the
   app opens; at the time you chose, a purpose-specific checkpoint offers End /
   Continue for 5 minutes / Change my purpose.
2. **Reward the Exit**: stopping by choice shows "You chose to stop." Variant A is the
   message only; variant B adds a plant that grows a leaf for each stop you chose.

Files:

- `index.html`: **Pause v3** (current version, served on GitHub Pages)
- `pause-v2.html`: **Pause v2**, the previous version, kept for comparison

## Run it

Open `index.html` in a browser, or use the Pages site:
https://natashaa27.github.io/sdt-doomscrolling/

For a participant's own phone (real time, reward A):
https://natashaa27.github.io/sdt-doomscrolling/?participant=1&speed=1&reward=A

| Parameter | Values | Default |
|---|---|---|
| `participant` | `1` hides the test console | off |
| `speed` | `1`, `10`, `60` | `1` |
| `reward` | `A`, `B` | `A` |
| `pause` | `off` for the baseline condition | `on` |
| `goal` | `5`, `10`, `15` (optional weekly goal) | none |
| `breath` | `on` for the 3-second breath | off |
| `pid` | participant ID | `P01` |

Tap the phone's clock five times within three seconds to show or hide the console.

The log is kept in the tab's session storage: it survives a reload but is cleared when
the tab closes. Export it after each participant.

## Running a test round

1. **Before testing:** tell the participant that their reflection answers are saved in
   the researcher's session log, and who will see it. Set the weekly goal with them
   only if they want one. Keep "Example stops at week start" at 0.
2. **Conditions:** run some tasks with the Pause layer off (baseline) and some with it
   on, and switch reward A/B halfway through the Pause tasks. Reverse the order for
   every second participant.
3. **Speed:** use 1× with participants. 10× and 60× are for walkthroughs; durations
   logged at those speeds are simulated and are left out of the real-time averages.
4. **Debrief (outside the app):** "What made you stop or continue?" and "Did the plant
   feel encouraging, pressuring, or irrelevant?" Record both in the console's Debrief
   section, then export the session log and the debrief CSV.

## What the console shows

- **Purpose-response patterns:** time to pick a purpose, with quick picks (under 1 s)
  and repeated purposes marked. These can reflect familiarity or a consistent reason,
  so use them as prompts for a follow-up question, not as proof of automatic dismissal.
- **Totals:** sessions by condition, how often people chose not to open, stops within
  1 minute of a checkpoint (app time), chosen stops, average session length for
  1× sessions only (Pause vs baseline), and reflection counts.

## Log columns

Session log (one row per session): `participant_id, session_number, session_id,
condition, app, trigger, breath_pause, purpose, purpose_history, purpose_decision_ms,
prompt_total_ms, time_cue_min, start_time, checkpoint_count, checkpoint_titles,
checkpoint_choices, checkpoint_decision_ms, stop_within_1min_of_checkpoint_app_time,
original_boundary_min, final_boundary_min, time_speed, duration_app_s, end_time,
end_type, interruption, within_boundary, reward_variant, chosen_stops_after,
example_stops_at_start, weekly_goal, reflection, worthwhile, in_control`

- Decision times (`*_ms`) are real milliseconds.
- `duration_app_s`, clock times and `stop_within_1min_of_checkpoint_app_time` use app
  time: it runs at `time_speed` and pauses on Pause screens. At 1× it equals real time.
- `end_type` is `voluntary`, `declined` (chose not to open), `interrupted` or `unknown`.
  Declined and baseline sessions earn no reward and don't count as chosen stops.

Debrief CSV (one row per participant): `participant_id, saved_at,
what_made_you_stop_or_continue, plant_feeling, notes`

## Research notes

Background evidence for the design, not targets for this test. Both studies ran for
weeks with real use, so their numbers are not directly comparable with a short,
simulated session.

- **one sec** (Grüning et al., [PNAS 2023](https://www.pnas.org/doi/10.1073/pnas.2213114120)):
  six-week field study with 280 participants. A brief pause before a chosen app opened;
  on average, participants closed the app again in 36% of opening attempts.
- **Wellspent** ([JMIR mHealth 2026](https://mhealth.jmir.org/2026/1/e56824)):
  three-week RCT with 70 iPhone users. Full-screen quit/continue reminders after a
  self-set time limit. The share of reminders followed by a stop has not been checked.

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

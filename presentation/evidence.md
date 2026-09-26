# Pause: presentation evidence pack

**Status:** the prototype is ready for the pilot, but no participant has tested it yet.
Everything under "Participant evidence" and "Changes after testing" is empty until the
pilot runs. **Reduced doomscrolling is an expected outcome to investigate, not a
result.** Fill those sections only from `pilot-notes.md` and the exported CSVs.

The two prototypes:

1. **Purpose Sessions with Conscious Continue**: "What brings you here?" with three
   purposes and an optional "Remind me after 10 minutes" setting, then "Open Loop".
   At the reminder: "You came here for a break. It's been 10 minutes." with "Finish
   for now" and "5 more minutes", and "Change my purpose" as a smaller link.
2. **Reward the Exit**: a chosen stop returns to the home screen and briefly shows
   "You chose when to stop." with no tap needed. Variant A is the message only.
   Variant B adds a plant that grows a leaf for each chosen stop.

---

## 1. Screenshots

All in `presentation/screenshots/`, captured from the current prototype at phone size
(390 × 844, 2× resolution). The feed content is invented sample content.

| File | Shows | Prototype |
|---|---|---|
| `01-home.png` | Simulated home screen; Loop is the only app that opens | Context |
| `02-purpose-first-use-intro.png` | First use: one-line explanation of Pause, then "What brings you here?" | 1 |
| `03-purpose-break-reminder-on.png` | Purpose chosen, reminder switched on, one "Open Loop" button | 1 |
| `04-feed-first-use-finish-label.png` | Feed with the purpose pill; home bar labelled "Finish session" on first use | 1 |
| `05-reminder-break.png` | Reminder: "You came here for a break. It's been 10 minutes." | 1 |
| `06-change-purpose.png` | Change my purpose, with the elapsed session time kept | 1 |
| `07-home-ack-A-planned.png` | Reward A on the home screen: "You chose when to stop." | 2 |
| `08-purpose-later-use.png` | Purpose screen after the first use, without the explanation | 1 |
| `09-feed-loop-scrolled.png` | Loop feed further down, with the purpose pill still visible | 1 |
| `10-declined-toast.png` | "I don't need Loop right now" returns home with a short message | 1 |
| `11-home-ack-B-plant-first-stop.png` | Reward B after the first chosen stop | 2 |
| `12-home-ack-B-plant-4-stops.png` | Reward B after four chosen stops | 2 |
| `13-home-ack-B-goal-reached.png` | Reward B with an optional goal of 5 reached | 2 |
| `14-reflection-optional-in-app.png` | In-app reflection, off by default for the pilot | 2 |
| `15-baseline-feed-no-pause.png` | Baseline condition: same feed, no Pause layer | Comparison |
| `16-facilitator-console.png` | Test console used to run sessions (not shown to participants) | Method |

To refresh them after a design change, see "Updating the screenshots" at the end.

---

## 2. Method (what to say about how it was tested)

- **Participants:** _n = ___ (fill in)._ Recruitment: _fill in_.
- **Design:** within-participant. Each participant uses baseline (Pause off) and Pause.
  Within Pause, they see reward A (message) and reward B (plant). Order is
  counterbalanced across participants (see the table in `README.md`).
- **Tasks:** the same task wording and the same app in both conditions, for example
  "Open Loop to take a break."
- **Speed:** real time (1×).
- **Measures:**
  - after each condition, asked verbally outside the app (in-app reflection is off): "Did this session feel worthwhile?" and
    "Did you feel in control?" (Yes / Partly / No)
  - session log: purpose, time chosen, checkpoint choices, how the session ended,
    session length
  - debrief: what confused them, what made them stop or continue, whether the plant
    felt encouraging, pressuring or irrelevant
- **Consent:** participants were told their answers go into the researcher's log.
- **Limits to state on the slide:** small sample, a simulated feed, short sessions in a
  lab setting, and no real notifications or social pressure. Results show usability
  and perceived effects, not long-term behaviour change.

---

## 3. Participant evidence

_Empty until the pilot. Quote participants' words directly; don't paraphrase them
into stronger claims._

### What confused people

| Finding | Participants | Quote |
|---|---|---|
| | | |

### What made people stop or continue

| Finding | Participants | Quote |
|---|---|---|
| | | |

### Did the plant help or create pressure?

| Response | Count | Quote |
|---|---|---|
| Encouraging | | |
| Pressuring | | |
| Irrelevant | | |
| Didn't see it | | |

### Worthwhile and in control, baseline vs Pause

Counts from the debrief CSV (`baseline_*` and `pause_*` columns).

| Question | Condition | Yes | Partly | No |
|---|---|---|---|---|
| Worthwhile? | Baseline | | | |
| Worthwhile? | Pause | | | |
| In control? | Baseline | | | |
| In control? | Pause | | | |

### From the session log

| Measure | Pause | Baseline |
|---|---|---|
| Sessions | | |
| Chose not to open | | n/a |
| Checkpoint choices (end / continue / change) | | n/a |
| Stopped within 1 minute of a checkpoint | | n/a |
| Average session length (1× only) | | |

With a small sample, report counts and quotes rather than percentages or claims of
significance.

---

## 4. Changes made so far

### Before the pilot (from design reviews)

These changes came from reviewing the prototype against the brief, not from
participants.

| Version | Change | Reason |
|---|---|---|
| v1 → v2 | Replaced grey placeholder cards with readable sample posts | The feed has to feel like real scrolling to test stopping |
| v1 → v2 | Checkpoint subtitle names the plan: "You planned 10 minutes to…" | Ties the reminder to the user's own intention |
| v2 → v3 | Purpose and time on one sheet; tapping a time opens the app | Keeps the entry to two taps |
| v2 → v3 | Added "I don't need [app] right now" | Lets people back out before opening, with no reward attached |
| v2 → v3 | Checkpoint question depends on the purpose ("Feeling rested?") | Connects the reminder to why the app was opened |
| v3 → v4 | Weekly goal made optional and moved out of the exit screen | Someone leaving should reach "Back to my day" with no extra decisions; a stop target can reward extra open-close cycles |
| v3 → v4 | Example stops default to 0 and are labelled when used | Pre-filled progress would mislead participants |
| v3 → v4 | Reflection footer: "Your responses are included in the researcher's session log." | The old "stays private" wording was inaccurate |
| v3 → v4 | Declining returns straight home | Removed an extra tap after the user had already decided |
| v3 → v4 | Added a baseline condition with Pause off | Needed to see what the intervention adds |
| v4 | Same worthwhile / in-control questions after both conditions; counterbalanced order | Makes baseline and Pause comparable |
| v4 → v5 | Five purposes cut to three; the time is an optional "Remind me after…" setting; one explicit "Open Loop" button | One question and one obvious action per screen; choosing a time no longer opens the app by surprise |
| v4 → v5 | Reminder names the purpose and time ("You came here for a break. It's been 10 minutes."); two main options, with "Change my purpose" as a link | Makes the main decision easy to scan and ties it to the user's own choice |
| v4 → v5 | Finishing returns home with a brief "You chose when to stop." (and the plant in B); no tap needed | The acknowledgement shouldn't cost another decision |
| v4 → v5 | In-app reflection off by default; asked after the task instead | Keeps the exit short and measures both conditions the same way |
| v4 → v5 | Pause explained once on first use; home bar labelled "Finish session" in each condition's first session | A simulated phone's tappable bar isn't obviously an exit |
| v5 | Reminder switched on by default (10 minutes); participants can switch it off | So every participant reaches the reminder screen; a default is a nudge, so it stays the same for everyone |
| v5 | One app (Loop) instead of three; Clips and Feed removed | One complete journey (open Loop → choose purpose → scroll → check-in → stop → plant) shows both prototypes without extra choices |
| v6 | Remaining non-working app icons removed from the home screen | Loop is the only thing to tap |
| v6 | Reminder shown as 5 / 10 / 15 / Off with a line saying what will happen | The chosen setting is always visible, including Off |
| v6 | "Finish session" label shown whenever the feed is open (highlighted on first use) | The exit stays easy to find while scrolling |
| v6 | Leaving the page ends the session without a reward; each finish counted once | Only deliberate stops grow the plant |
| v6 | Participant view is the default, with the plant reward on; console behind `?facilitator=1` | The plain link is the classroom demonstration |
| v6 | Log records `run_mode` (`real_time` or `accelerated_demo`) | Keeps demo sessions out of duration comparisons |

### After the pilot

_Empty until the pilot. Each change should point to a finding in section 3._

| Finding (section 3) | Change | Participants |
|---|---|---|
| | | |

---

## 5. Expected effects on the causal loop diagram

These are **hypotheses** for the pilot to check, not results. Rename the variables to
match the ones in your CLD.

### The loop Pause targets

**R1, habitual scrolling (reinforcing):** habitual, unplanned opening → longer
unplanned scrolling → lower mood or guilt afterwards → stronger urge for quick
distraction → more habitual opening.

### What each intervention adds

| Loop | Mechanism | Expected effect | Evidence to check |
|---|---|---|---|
| **B1, conscious start (balancing)** | Purpose prompt at opening → opening becomes a conscious choice → some opens are declined or given a time | Weakens the link from habit to unplanned scrolling | Declined sessions; time chosen; debrief "what made you stop or continue" |
| **B2, conscious continue (balancing)** | Planned time reached → purpose-specific checkpoint → reconsider → end, continue deliberately, or change purpose | Scrolling past the plan becomes a choice rather than drift | Checkpoint choices; stops within 1 minute of a checkpoint; "in control?" Pause vs baseline |
| **R2, rewarded exit (reinforcing, desired)** | Chosen stop → calm acknowledgement (and plant in B) → stopping feels good → sense of control → more chosen stops | Builds a positive loop around stopping instead of guilt | "worthwhile?" and "in control?" after Pause; plant debrief answers |

### Possible side effects to watch

| Risk | How it could show up | Evidence to check |
|---|---|---|
| **Prompt fatigue** weakens B1 over time | Purpose picked very quickly, the same purpose every time | Purpose-response patterns in the console; ask about it in the debrief |
| **Stop-counting backfires**: a goal rewards opening and closing more often | More, shorter sessions with reward B, or the plant feels pressuring | Session count with A vs B; plant debrief answers |
| **Guilt returns** if the checkpoint feels like a judgement | Participants describe it as nagging or judging | Debrief quotes |

### Time delays

B1 and B2 act within a session. R2 is expected to build over days or weeks, so a
short lab pilot can only show whether the reward feels encouraging, not whether it
changes habits.

---

## 6. Implementation plan

| Phase | What | Output | Decides |
|---|---|---|---|
| **1. Pilot (now)** | 4–6 participants, counterbalanced, 1×, with debrief | `pilot-notes.md`, both CSVs, quotes | What confuses people; whether the plant helps or pressures |
| **2. Iterate** | Change only what the pilot supports; re-test with 3–4 new participants | Revised prototype, "Changes after testing" table | Whether the fixes worked |
| **3. Real-device prototype** | Trigger Pause when a chosen app opens. On iOS: a Shortcuts "App is opened" automation (the approach one sec uses), or the Screen Time API (FamilyControls, ManagedSettings, DeviceActivity). On Android: UsageStatsManager, or an AccessibilityService that detects the launch and shows an overlay | Installable prototype | Whether the flow works outside the lab |
| **4. Field study** | 1 baseline week, then 1–2 weeks with Pause, on participants' own phones | Opens and session length from the OS, plus a short daily "worthwhile / in control" check | Whether unplanned scrolling actually goes down |

**Other scrolling formats:** the pilot uses one image feed (Loop). Short-video and text
feeds, where the reminder and exit may behave differently, are a later step once the
single-app journey works.

**Principles that stay fixed:** no blocking or hard limits, continuing is never
penalised, no shaming language, data stays with the participant unless they consent
to share it.

**Measures of success for phase 4:** fewer unplanned opens, a higher share of
sessions ended by choice, and higher "in control" ratings, with no rise in total
opens. The last one guards against the stop-counting side effect.

---

## Updating the screenshots

The screenshots were captured with a Playwright script in participant view
(the default participant view) at 390 × 844. To refresh them, open the Pages link on a phone or in
the browser's device mode at the same size, and use the same URL options (`reward=B`,
`goal=5`, `pause=off`) for the reward and baseline screens.

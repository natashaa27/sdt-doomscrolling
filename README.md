# Pause — two extra portions, then protected mode

Double-click `index.html` to use this **offline demo** (keep the `photos/` folder next to it). There are no trackers or network dependencies.

## Exact experience

1. The demo opens on a phone home screen. Tap the **Instagram** app. Pause steps in first with a five-second timer. Instagram is a simulation; the demo does not connect to your account.
2. Complete the five-second pause and choose the three commitments (why you're here, your finish line, and what you might do afterwards). After the pause there are three options: **Continue to Instagram**, **Learn something instead**, or **Leave for now**. **Progressive grayscale is checked by default**. It remains off visually during the initial portion.
3. Scroll to the initial finish line (for quick tests, select **5 Reels**) using swipe up, mouse wheel or Next. Select **+3 more Reels** at the checkpoint. The next Reel is a new one, grayscale begins **immediately at 35%** and fades steadily to **65%** across these three Reels.
4. At the second checkpoint, select the **second and final +3 Reels**. Grayscale begins at **70%** and fades steadily to **100%** across these three Reels.
5. At the third checkpoint **there is no more +3 button**. The Reels section is disabled and only **regular feed and DMs** remain accessible; the protected view excludes in-feed Reels as well. You can browse sample posts, enter a sample chat, and send a **local-only demo message**.
6. Go home and reopen Instagram: protected mode remains active in this browser tab. **Reset demo for another test** restores the Reels flow. Reloading within the same tab preserves the protected flag using sessionStorage.

**Important limitation:** A standalone HTML page cannot disable the Reels section in real Instagram, especially the native mobile app. This is a functional interaction prototype of the desired experience within a simulated view. An actual Instagram-web implementation would need a browser extension or controlled browser with site-specific DOM hiding, navigation restrictions, and maintenance as Instagram changes its interface. Instagram's own app cannot be modified by this HTML prototype.

## Validation checklist

- Default grayscale toggle starts on, but first five Reels remain in colour.
- First +3 begins at 35% grayscale and fades gradually to 65% (it also deepens while each Reel plays).
- Second +3 begins at 70% grayscale and reaches 100%.
- Each extra portion shows three new Reels; the counter reads Extra 1 / 3, 2 / 3, 3 / 3.
- Only **two** extra portions are possible, and the third checkpoint has no Continue option.
- After two extra portions, the Instagram mock Reels tab is disabled; regular posts and DMs remain accessible.
- No plants, points, streaks, or automatic phone locks.

## Making consumption visible

The counter under the progress bar always shows Reels and time together, for example "17 Reels · 1:52 / 2:00". The checkpoint repeats it ("So far: 17 Reels in 2:00") and the exit screen shows Reels watched and time in feed.

## Personalised micro-learning

**My Interests (optional).** The first time, the home screen offers a short, skippable setup in three steps: interests (plus what you watch a lot of on Instagram, chosen by you), places you've been and places you're planning to visit, and work or study plus subjects to explore. Every step can be skipped, it isn't shown again, and everything can be edited or deleted later from the **Pause** app on the home screen.

**Learn something instead.** After the five-second pause, this shows **one** card picked from your profile: planned trips first, then subjects to explore, work or study, interests, Instagram interests, and places visited. Each card has:
- a heading saying why it was picked ("Because you're planning to visit Rome")
- a photo where a relevant one exists (sky, parrots, lighthouse); otherwise a colour band
- a 60–100-word explanation (about 30–60 seconds)
- a one-question quiz or one extra fact
- a source link (Wikipedia, NASA, WHO, Britannica, Investopedia)
- feedback: Interesting / Not for me / Already knew this (cards marked "Not for me" or "Already knew this" are skipped next time)
- a Done button. There is no next card, autoplay, streak or quota.

If you skip setup, you get a general card about variable rewards and an invitation to personalise.

**Learning from the demo feed.** You can save Reels and posts in the simulated Instagram. When you've saved two posts on the same topic (for example, architecture), Pause asks on the home screen and in My Interests whether to add it. Nothing is added without your confirmation.

**Reward the Exit.** When you stop, Pause offers **one** optional idea based on why you opened Instagram, what you planned to do afterwards, your profile and how much time you have (2, 10 or 30 minutes). Examples: read five pages of the book you're reading, learn one phrase for a city you're visiting (Japanese, Italian, French, Catalan, Turkish), stretch or take a short walk, message a friend, a two-minute puzzle, or one learning card. "Another idea" shows a different one, and "I'm done for now" is always there.

## What is real and what is simulated

| Part | Status |
|---|---|
| Five-second pause, commitments, purpose reminder, Reel counter, finish line, grayscale extensions, protected mode | Fully working in the simulation |
| My Interests setup, editing and deleting | Fully working; stored only in this browser (localStorage) |
| Card selection, quiz, feedback, source links | Fully working; 27 hand-written, fact-checked cards |
| Exit ideas and travel phrases | Fully working; chosen from a fixed list |
| Saving posts and interest suggestions | Working inside the demo feed only |
| Instagram feed, Reels, messages | Simulated. No connection to Instagram |
| Importing Instagram interests | **Not implemented.** The code has a placeholder (`INTEREST_SOURCES.instagramImport`) for a future, consent-based import such as uploading your own Instagram data export. Pause never asks for Instagram passwords, calls Instagram APIs or reads likes, saved posts or private activity. |
| Current professional news | Not included. Cards cover stable topics, not live news. |

## What the screens look like

- **Reels:** full-screen photos with the Reels layout: title, like / comment / share on the right, account name with Follow, caption and audio line. Your commitment progress sits at the top with a **Finish** button.
- **Instagram home (after the two extra portions):** Instagram-style header, stories row, photo posts with like / comment / share / save, captions and comment counts, and a bottom tab bar where Reels is crossed out and disabled.
- **Messages:** conversation list and a chat screen with blue sent bubbles. Messages stay on the device.

## Photos

The feed photos in `photos/` come from the **Kodak Lossless True Color Image Suite**, released by the Eastman Kodak Company for unrestricted use. Account names, captions and counts are invented.

## Hosting

Live at https://natashaa27.github.io/sdt-doomscrolling/ (GitHub Pages, `main` branch).

The earlier **Pause** prototype is kept on the
[`pause-prototype`](https://github.com/natashaa27/sdt-doomscrolling/tree/pause-prototype) branch.

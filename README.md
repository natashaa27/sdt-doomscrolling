# Pause — two extra portions, then protected mode

Double-click `index.html` to use this **offline demo** (keep the `photos/` folder next to it). There are no trackers or network dependencies.

## Exact experience

1. The demo opens on a phone home screen. Tap the **Instagram** app. Pause steps in first with a five-second timer. Instagram is a simulation; the demo does not connect to your account.
2. Complete the five-second pause and choose the three commitments (why, finish line, after). **Progressive grayscale is checked by default**. It remains off visually during the initial portion.
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

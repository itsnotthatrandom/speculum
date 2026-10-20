# Speculum

A small Chrome extension that mirrors your outgoing webcam video in Google Meet and Slack huddles, so other participants see a horizontally flipped image. It needs no virtual camera driver, OBS, or CamGraph: the flip happens inside the browser.

## How it works

Speculum wraps `navigator.mediaDevices.getUserMedia` on `meet.google.com` and `app.slack.com`. When the call page asks for the camera, the extension routes the video track through `MediaStreamTrackProcessor` and `MediaStreamTrackGenerator`, flips each frame on an `OffscreenCanvas`, and hands the page the flipped track instead of the original. When mirroring is off, frames pass through unchanged.

Slack opens huddles in a separate `about:blank` popup window. Speculum covers this two ways: the content scripts use `match_origin_as_fallback` so Chrome injects them into `about:blank` windows and frames opened by Slack, and `mirror.js` also hooks `window.open` on the Slack page to patch the popup's `getUserMedia` the moment it is created. A guard ensures each window is patched only once.

## Requirements

- A Chromium-based browser (Chrome, Edge, Arc, Brave, and so on). It does not work in Safari or Firefox, because they lack `MediaStreamTrackProcessor` and `MediaStreamTrackGenerator`.
- Google Meet or Slack running in the browser. Slack huddles must be joined from the web app at `app.slack.com`; the Slack desktop app is not affected. Other desktop apps such as Zoom or FaceTime are not affected either.

## Install

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this folder.
4. Pin Speculum from the puzzle-piece menu so its icon stays visible.
5. Reload any open Meet or Slack tab.

## Usage

Click the Speculum toolbar icon to turn mirroring on or off. The badge shows the current state:

- **ON** (green): other participants see a mirrored image.
- **OFF** (grey): your video is sent unchanged.

The change applies immediately, even mid-call. The setting is saved and persists across browser restarts. Mirroring is on by default.

## Notes

- Meet mirrors your self-view locally (most call apps, Slack likely included, do the same). With Speculum on, the two flips cancel out there, so your own preview looks un-mirrored while everyone else sees the mirrored feed.
- Mirrored video makes any text behind you, or held up to the camera, read backwards for other participants.
- To use Speculum on other sites, add their URLs to both `matches` entries in `manifest.json`, then reload the extension.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension manifest (Manifest V3). |
| `mirror.js` | Runs in the page; wraps `getUserMedia` and flips frames. |
| `bridge.js` | Relays the saved toggle state from extension storage into the page. |
| `background.js` | Handles toolbar clicks, saves the toggle, and updates the badge. |

## Updating

After editing any file, click the reload icon on the Speculum card in `chrome://extensions`, then reload the Meet or Slack tab.

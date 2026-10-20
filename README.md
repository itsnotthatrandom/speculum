# Speculum

A small Chrome extension that mirrors your outgoing webcam video on any website (Google Meet, Slack huddles, and others), so other participants see a horizontally flipped image. It needs no virtual camera driver, OBS, or CamGraph: the flip happens inside the browser.

## How it works

Speculum wraps `navigator.mediaDevices.getUserMedia` on every page, in every frame and popup. When a page asks for the camera, the extension routes the video track through `MediaStreamTrackProcessor` and `MediaStreamTrackGenerator`, flips each frame on an `OffscreenCanvas`, and hands the page the flipped track instead of the original. When mirroring is off, frames pass through unchanged.

Some apps, such as Slack huddles, run the call in a separate `about:blank` popup window. Speculum covers this two ways: the content scripts use `match_origin_as_fallback` so Chrome injects them into `about:blank` windows and frames, and `mirror.js` also hooks `window.open` to patch the popup's `getUserMedia` the moment it is created. A guard ensures each window is patched only once.

## Requirements

- A Chromium-based browser (Chrome, Edge, Arc, Brave, and so on). It does not work in Safari or Firefox, because they lack `MediaStreamTrackProcessor` and `MediaStreamTrackGenerator`.
- The call must run in the browser. Desktop apps (the Slack desktop app, Zoom, FaceTime, and so on) are not affected.

## Install

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this folder.
4. Pin Speculum from the puzzle-piece menu so its icon stays visible.
5. Reload any tab where you will use the camera.

## Usage

Click the Speculum toolbar icon to turn mirroring on or off. The badge shows the current state:

- **ON** (green): other participants see a mirrored image.
- **OFF** (grey): your video is sent unchanged.

The change applies immediately, even mid-call. The setting is saved and persists across browser restarts. Mirroring is on by default.

## Notes

- Meet mirrors your self-view locally (most call apps, Slack likely included, do the same). With Speculum on, the two flips cancel out there, so your own preview looks un-mirrored while everyone else sees the mirrored feed.
- Mirrored video makes any text behind you, or held up to the camera, read backwards for other participants.
- Speculum applies to every site that uses your camera, not only call apps. Turn it off with the toolbar icon when you need an unflipped image, for example to scan a QR code or a document.
- Because it runs on all sites, Chrome shows the "Read and change all your data on all websites" permission warning. Speculum only touches the camera stream; it reads no page content and sends nothing anywhere.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension manifest (Manifest V3). |
| `mirror.js` | Runs in the page; wraps `getUserMedia` and flips frames. |
| `bridge.js` | Relays the saved toggle state from extension storage into the page. |
| `background.js` | Handles toolbar clicks, saves the toggle, and updates the badge. |

## Updating

After editing any file, click the reload icon on the Speculum card in `chrome://extensions`, then reload the tab you are testing in.

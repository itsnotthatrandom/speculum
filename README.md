# Speculum

A small Chrome extension that mirrors your outgoing webcam video in Google Meet, so other participants see a horizontally flipped image. It needs no virtual camera driver, OBS, or CamGraph: the flip happens inside the browser.

## How it works

Speculum wraps `navigator.mediaDevices.getUserMedia` on `meet.google.com`. When Meet asks for the camera, the extension routes the video track through `MediaStreamTrackProcessor` and `MediaStreamTrackGenerator`, flips each frame on an `OffscreenCanvas`, and hands Meet the flipped track instead of the original. When mirroring is off, frames pass through unchanged.

## Requirements

- A Chromium-based browser (Chrome, Edge, Arc, Brave, and so on). It does not work in Safari or Firefox, because they lack `MediaStreamTrackProcessor` and `MediaStreamTrackGenerator`.
- Google Meet in the browser. Desktop apps such as Zoom or FaceTime are not affected.

## Install

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this folder.
4. Pin Speculum from the puzzle-piece menu so its icon stays visible.
5. Reload any open Meet tab.

## Usage

Click the Speculum toolbar icon to turn mirroring on or off. The badge shows the current state:

- **ON** (green): other participants see a mirrored image.
- **OFF** (grey): your video is sent unchanged.

The change applies immediately, even mid-call. The setting is saved and persists across browser restarts. Mirroring is on by default.

## Notes

- Meet already mirrors your self-view locally. With Speculum on, the two flips cancel out, so your own preview looks un-mirrored while everyone else sees the mirrored feed.
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

After editing any file, click the reload icon on the Speculum card in `chrome://extensions`, then reload the Meet tab.

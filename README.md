# THE LAST BIRTHDAY · 1983

**The party ended ten years ago. The door is still open.**

October 14, 1983. June Mercer returns to Candlewick’s Celebration Palace before its demolition destroys the original records of the 1973 fire. Her brother Robin died there at seven. The owner concealed the cause. The abandoned rabbit mascot is still inside—and completely mute.

## PLAY RIGHT AWAY

Open **PLAY_OFFLINE.html** in a current browser. It contains the game code and every image. No server, installation, internet connection, or account is needed. Audio starts after a button press. Browser permissions and capabilities can affect optional device speech and fullscreen.

The normal **index.html** edition is designed for web hosting. For local development, serve the folder over HTTP, for example with `python3 -m http.server 8000`, then open `http://localhost:8000`. Opening its ES modules directly with a file URL can be blocked by browsers; use the standalone edition for direct opening.

## PUT IT ON GITHUB PAGES

1. Create a repository such as `the-last-birthday` and upload the **contents** of this folder. `index.html`, `styles.css`, `js/`, and `assets/` must be at the repository root. Include `.nojekyll`.
2. Open the repository’s **Settings → Pages**.
3. Under **Build and deployment → Source**, select **Deploy from a branch**.
4. Select **main** and **/(root)**, then save. Use the published URL shown by GitHub when deployment completes.

All game URLs are relative, so both a project URL and a custom domain work. The game has no build dependencies or remote fonts. Repository visibility and Pages availability depend on the GitHub plan.

Official setup reference: [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## THE EXPERIENCE

- 76 story nodes, 137 authored choices, 9 original environments, 7 developed characters, and 8 distinct endings.
- Cinematic first-person **2.5D** presentation: original rendered scene plates with camera parallax, rain, mist, flashlight aiming, dust, a foreground torch hand, and animated character encounters.
- The live exterior is shared by the main menu and the opening gameplay. Its entrance marker begins the story; the same forecourt then becomes explorable.
- In-world object markers and caption-based choices. Movement follows chosen routes through the palace.
- Two clue-based puzzles: the owner’s safe and the emergency relay. Both offer readable hints and an on-screen keypad.
- Evidence inspection, inventory, field notes, a floor plan, action-based battery use, trust decisions, and noise affecting encounter time.
- Autosave after every choice, three manual slots, save export/import, and persistent ending discoveries.
- Locally synthesized ambience and effects: rain, motor drone, spatial knocks, telephone, shutter, electrical relay, music-box intervals, and scare impacts.
- Optional **device-generated adult voices** for scripted lines. These are browser speech synthesis, not recorded actors. Text captions always appear.
- Responsive portrait and landscape layouts, keyboard shortcuts, touch controls, large text, reduced motion, adjustable brightness, gentler scares, and unlimited decision time.

The supplied images were used only to understand the requested design. None is packaged or displayed in the game. All game raster assets were newly generated for this project.

## CONTROLS

| Input | Action |
| --- | --- |
| Mouse movement / touch drag | Aim the light and shift the camera |
| Click / tap | Inspect an object or choose an action |
| 1–7 | Choose the corresponding story option |
| E | Use the hovered object |
| Enter | Continue when one option is available; otherwise activate the focused button |
| F | Toggle flashlight |
| J / M | Evidence journal / palace map |
| Escape | Pause or close a panel |
| Puzzle digits / Backspace / Enter | Enter, erase, and try a combination |

Reading does not drain the battery. A hidden browser tab or opened panel pauses an encounter. Unlimited decision time preserves every outcome.

## FILES

`js/story.js` owns the entire story graph and lore. `js/engine.js` is the pure state reducer. `js/app.js` connects the controls, journal, puzzles, and saves. `js/scene.js` renders the animated scenes. `js/audio.js` generates audio and optional device speech. `js/storage.js` validates and persists browser data. `styles.css` owns the responsive UI.

The `docs/` folder contains the lore, exact playable voice script, scare/audio design, asset briefs, spoiler walkthroughs, and test report. The `tests/` folder contains the reproducible verification harness.

## REPRODUCE THE CHECKS

Use Node.js 24 or newer. No npm install is required.

```sh
node tests/bundle.mjs
npm test
```

The tests verify every story link and choice transition, play all eight endings through both the reducer and application handlers, exercise puzzles and save validation, and check the standalone build. The DOM/audio harness does not perform real browser rendering. Live browser visual and audible QA was unavailable in the creation environment; the included test report records that limit.

Browser data is specific to the browser and origin. Export a save before moving between the hosted and standalone editions. If persistent browser storage is blocked, the current session still plays and save export remains available.

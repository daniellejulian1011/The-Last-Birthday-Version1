# RELEASE VERIFICATION · 1.0.0

Date: October 10, 2026. Runtime: Node.js 24.19.0. All required automated checks completed successfully.

| Story graph | CSS source | Outcome routes | Controls and state | Standalone build |
| --- | --- | --- | --- | --- |
| 76 reachable nodes; 137 linked choices; all targets, imports, items, evidence, and assets present | Balanced lexical structure; 1,021 declarations in 322 rule blocks checked | All eight endings reached through actual reducers and application button/keypad handlers | Journal, document inspection, map, saves, settings, flashlight, timer assistance, pause, hidden-tab behavior, and timeout checked | Inlined script boots and starts a new game with embedded images and no module or stylesheet requests |

## OTHER CHECKS

- Every one of the 137 declared choice transitions was exercised with a state meeting its rule. Invalid choices and locked routes were rejected.
- Incorrect puzzle attempts preserve the current room. Both correct combinations unlock their intended route. Attempt counts, one-time battery pickup, resource limits, and corrupted-save rejection were checked.
- The scene renderer’s drawing calls were exercised at 1366×768, 412×915, and 915×412. Every sound cue was invoked through a mocked Web Audio graph.
- The optional speech path was exercised with an adult line; the explicit Mr. Morrow speaker guard rejected mascot dialogue.
- All ten supplied reference images were compared by SHA-256 against the packaged asset set. None appears in the game assets.
- The normal web edition uses relative paths. The standalone edition embeds every raster image, the favicon, stylesheet, story data, and game code.

## VERIFICATION LIMIT

The application tests use a deterministic DOM, canvas-call, timer, and audio harness. They do not render pixels in a browser or evaluate an audible mix. Real browser visual QA, live audio listening, mobile-device execution, fullscreen permission behavior, and device-specific speech quality were unavailable in the creation environment. GitHub deployment has not been performed because no target repository was supplied.

For release on a chosen repository, follow README.md and perform one browser playthrough there. The independent offline edition is available immediately for that review.

## REPRODUCE

```sh
node tests/bundle.mjs
npm test
```

These checks require no installation of npm packages. Run them with Node.js 24 or newer.

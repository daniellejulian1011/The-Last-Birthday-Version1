# SCENE, SCARE, AND AUDIO DIRECTION

## VISUAL LANGUAGE

The reference composition informs a full-screen first-person scene, a small upper-left objective, understated tools at the upper right, a lower-left timestamp, and a flashlight battery at the lower right. Caption choices remain anchored near the bottom. Original art supplies photographic material detail; the canvas adds motion and interaction.

The exterior is shared between title and gameplay. Rain, low mist, neon reflections, and pointer parallax keep it alive. The entrance marker begins a new game. June then explores that same forecourt and passes through the front door into the foyer.

Portrait phones show the landscape artwork above the caption area and extend the atmosphere beneath it. Object markers use the same projection as the scene plate, so their location follows the image at each viewport size.

## ENCOUNTER CUES

| Trigger | Visual cue | Audio cue | Choice consequence |
| --- | --- | --- | --- |
| Strike the front glass | Morrow appears in the reflection | Short glass impact and descending tone | Noise rises; investigation continues |
| Examine the dining curtain | A distant figure fills the empty space | Low motor-like swell | Optional first sighting |
| Search the arcade aisle | Morrow emerges by a cabinet | Spatial scrape, restrained low sting | Hide/freeze earns an evasion route; running costs battery and raises noise |
| Take the prize-room fuse | A glove meets the wired glass | Heavy thud | Hide, switch off the light, or shove through |
| Pry the spare-fuse drawer | A hand unfolds under the workbench | Low impact | A noisier alternative to the arcade route |
| Photograph the stage | The figure moves between exposures | Shutter, then low swell | Back away, run, or turn into a close reveal |
| Help Ellis at the exit | Morrow lowers beneath the pipe | Footfall and scrape | Escape together, send the records, or burn the curtain |
| Cross the final door | A glove catches the bag strap | Close thud | Cut, evade, drop the bag, or pull against the grip |
| Drain / alcove | Morrow closes the limited escape space | Spatial weight cue | Evidence salvage, return to Ellis, or capture |
| Capture ending | The face advances toward the camera | One impact and descending motor tone | Ending is recorded once |

Scares are authored story events rather than random interruptions. A return visit does not replay a pickup’s scare. Motion moves the character toward the camera with a single continuous reveal. No repeated strobe sequence is implemented.

## SOUND SYSTEM

All non-speech sounds are generated with the Web Audio API. A low 46/69/92 Hz motor bed and filtered noise establish rain and damp-room ambience. Stereo panning places occasional knocks away from the center. Damaged music-box intervals are instrumental tones, never children’s voices or Mr. Morrow’s singing.

UI actions receive quiet clicks. Photography gets a shutter impulse. The telephone uses a restrained two-tone ring. The relay adds a rising motor cue. Encounters layer a low descending pitch with a short filtered impact. Sound pauses or mutes when requested; audio begins only following a user gesture.

The optional speech setting sends exact adult script lines to browser speech synthesis. Available voices vary by device. The game selects an English voice when present and always keeps written captions. The speaker filter prevents Mr. Morrow from entering the speech system. Edwin and Ruth’s historical recordings are explicitly dated 1973 in both the caption and journal.

## ACCESSIBILITY

Unlimited decision time disables automatic encounter choices. A modal panel or hidden tab pauses a timed encounter. Noise can shorten the normal decision period, with a minimum of seven seconds, but time assistance keeps all outcomes available.

Reduced motion removes camera sway and rapid approach movement. Gentler scares remove the animated character reveals and soften their impacts. Brightness and text-size settings improve visibility. Every scene interaction also exists as a caption choice, so object markers are optional.

The audio graph, scene renderer calls, and timer behavior were exercised in deterministic harness tests. Audible mix quality, real GPU/canvas output, and device speech require a browser playtest.

// Every interaction belongs to this graph. Rendering never grants evidence or bypasses a lock.
export const SCENES = {
  exterior: { title: "Candlewick’s forecourt", image: 'assets/exterior.webp', focus: [.70,.60], rain: true, light: '#d58b42' },
  foyer: { title: 'Reception foyer', image: 'assets/foyer.webp', focus: [.43,.58], light: '#c28a50' },
  dining: { title: 'Birthday auditorium', image: 'assets/dining.webp', focus: [.54,.64], light: '#e1a254' },
  arcade: { title: 'The midnight arcade', image: 'assets/arcade.webp', focus: [.70,.55], light: '#b374df' },
  office: { title: 'Edwin Candlewick’s office', image: 'assets/office.webp', focus: [.63,.65], light: '#dba864' },
  maintenance: { title: 'Maintenance workshop', image: 'assets/maintenance.webp', focus: [.59,.43], light: '#88b8c2' },
  archive: { title: 'Records archive', image: 'assets/archive.webp', focus: [.58,.52], light: '#d19c62' },
  tunnel: { title: 'The service passage', image: 'assets/tunnel.webp', focus: [.52,.55], light: '#b35340' },
  stage: { title: 'The last birthday stage', image: 'assets/stage.webp', focus: [.52,.56], light: '#d9ae72' }
};

export const ITEMS = {
  torch: ['Flashlight', 'A scratched metal torch. Batteries drain with actions, never while reading.'],
  camera: ['35 mm camera', 'Photographs preserve evidence without moving it.'],
  radio: ['Two-way radio', 'Ellis is on channel three.'],
  token: ['Rabbit arcade token', 'One tarnished token for the prize-room latch.'],
  fuse: ['Ceramic fuse', 'The stage and emergency-exit relay need a new fuse.'],
  key: ['Brass archive key', 'Found in Edwin’s private wall safe.'],
  cutters: ['Bolt cutters', 'Heavy enough to open a lock. Heavy enough to be heard.'],
  ribbon: ['Robin’s blue ribbon', 'The ribbon June tied on her brother’s birthday jacket.'],
  film: ['Exposed film', 'A physical record of what the palace was hiding.'],
  ledger: ['Original ledger', 'The fire-exit order bears Edwin’s signature.'],
  tape: ['Ruth’s sworn cassette', 'A dated employee statement recorded in November 1973.']
};

export const EVIDENCE = {
  invitation: { title: 'The demolition notice', date: '11 OCT 1983', body: 'CANDLEWICK PROPERTY HOLDINGS. Clearance begins at 06:00 on October 15. All remaining records are to be destroyed on site. Someone tucked a copy into June Mercer’s letterbox. It is a notice, not a message from Robin.', source: 'FORECOURT / LETTERBOX', weight: 'MOTIVE' },
  seating: { title: 'Birthday seating plan', date: '27 OCT 1973', body: 'Party Seven: Robin Mercer, age 7. Adult supervisor: June Mercer, age 14. The original plan places the children beside the eastern fire exit. The amended incident list leaves that entire table blank.', source: 'BIRTHDAY AUDITORIUM', weight: 'IDENTIFICATION' },
  receipt: { title: 'The last open day', date: '27 OCT 1973', body: 'Office receipt 2710. Edwin writes: “Safe code changed to the closing date. Day first. No spaces.” The palace closed permanently after the fire that night. The numbers are 2–7–1–0.', source: 'RECEPTION REGISTER', weight: 'SAFE CLUE' },
  directive: { title: 'The chained-exit directive', date: '26 OCT 1973', body: '“Keep the east exit chained during parties. Loss prevention takes priority. Remove the chain when inspectors arrive.” Signed: E. Candlewick. A maintenance note underneath warns that the stage lighting circuit is overheating. Both warnings were ignored.', source: 'OWNER’S SAFE', weight: 'PRIMARY PROOF' },
  recording: { title: 'Edwin’s office tape', date: '27 OCT 1973 · 17:42', body: 'Edwin’s recorded dictation orders staff to keep the birthday performance running despite a hot lighting cable. After the fire, he orders a revised guest list and calls it an electrical accident. This is an adult owner’s business dictation, recorded in 1973.', source: 'OFFICE CASSETTE', weight: 'PRIMARY PROOF' },
  coroner: { title: 'Robin Mercer’s death certificate', date: '30 OCT 1973', body: 'Robin Mercer, 7. Died in the October 27 fire. Positively identified by family and dental records. June has known he died for ten years. The certificate was omitted from the venue’s insurance submission; it does not suggest that he survived.', source: 'RECORDS ARCHIVE', weight: 'CONFIRMED LOSS' },
  testimony: { title: 'Ruth Hale’s sworn statement', date: '04 NOV 1973', body: 'Ruth, the party hostess, describes smoke coming from the stage’s overloaded light bar. She tried the east door and found the chain. She states that Edwin took the guest register before emergency crews arrived. Her statement was suppressed. Ruth appears only in this dated archive and in June’s memories.', source: 'ARCHIVE CASSETTE', weight: 'PRIMARY PROOF' },
  relay: { title: 'Emergency-relay diagram', date: 'MAINTENANCE / 1972', body: 'Restoration sequence: 3 = EAST EXIT. 1 = HOUSE LIGHTS. 2 = STAGE. Apply in that order: 312. Bringing up the stage first can move the damaged machinery before the escape path is lit.', source: 'WORKSHOP / BRASS TAG', weight: 'RELAY CLUE' },
  photo: { title: 'The impossible photograph', date: '14 OCT 1983 · TONIGHT', body: 'A frame of the main stage shows Mr. Morrow standing on the pedestal. The next frame, taken seconds later, shows an empty pedestal and a wet footprint facing the camera. There is no working drive assembly connecting him to the stage.', source: 'JUNE’S CAMERA', weight: 'TONIGHT' },
  list: { title: 'The unamended guest register', date: '27 OCT 1973', body: 'Seven fatal casualties; three other children were never reconciled against the venue’s attendance records. Robin is among the positively identified dead. Edwin’s insurance copy deletes Party Seven. The discrepancy concealed families from the investigation; it does not undo Robin’s death.', source: 'ARCHIVE / BOTTOM DRAWER', weight: 'PRIMARY PROOF' }
};

export const ENDINGS = {
  daylight: { number:'01', title: 'DAYLIGHT', type: 'THE COMPLETE RECORD', color:'#d9c28a', text: 'You leave the palace with Ellis, the original ledger, and Ruth’s testimony. Nora makes copies before sunrise. The fire-exit order and the unamended guest register reopen the case. Robin remains a child who died in 1973. At last, his name is where it should have been. In the last photograph, the stage is empty.' },
  witness: { number:'02', title: 'THE WITNESS', type: 'YOU GOT OUT', color:'#b2c6c2', text: 'You reach the road with enough to contradict the official account. Nora publishes what she can prove. Some records are still behind the walls. You survive, but you never learn whether the scrape beneath the floor was a machine winding down—or something following the car.' },
  stay: { number:'03', title: 'SOMEONE MUST STAY', type: 'THE RECORD SURVIVES', color:'#c3afb8', text: 'Ellis takes the records through the lit exit while you hold the service door. You hear the car start. Mr. Morrow stops on the other side of the glass. There is no song, no whisper, no final sentence. Only the weight of the handle moving in your hands. The papers reach Nora. You do not.' },
  silence: { number:'04', title: 'BOUGHT SILENCE', type: 'EDWIN’S LAST CUSTOMER', color:'#b59867', text: 'The envelope is heavier than it looks. You surrender the negatives and ledger. Edwin’s car leaves before the demolition crew arrives. Years later, an unfamiliar brass token appears in your coat pocket. You cannot remember ever accepting it.' },
  ashes: { number:'05', title: 'ASHES AGAIN', type: 'A SECOND FIRE', color:'#c17b50', text: 'You open the escape route, then feed the old curtains into the maintenance flame. The palace burns a second time. You make the road. Most of the proof does not. Robin’s story survives only in your account. When the roof falls, the rabbit sign keeps smiling.' },
  guest: { number:'06', title: 'THE LAST GUEST', type: 'THE PARTY KEPT YOU', color:'#b64a43', text: 'Your flashlight rolls across the floor. Its beam rests on an empty chair and a paper hat printed with a faded rabbit. Something pulls the chair out. Nothing in the building speaks. Outside, the demolition notice flutters against the locked doors.' },
  walk: { number:'07', title: 'THE ROAD HOME', type: 'YOU CHOSE TO LEAVE', color:'#a4b8bc', text: 'You turn the car around. There are no penalties for refusing an invitation to a ruin. At dawn, the wrecking crew reduces the palace to dust. The investigation stays closed. That night, you put Robin’s photograph back on the mantel and leave the hallway light on.' },
  floor: { number:'08', title: 'UNDER THE FLOOR', type: 'FOUND TOO LATE', color:'#9995ad', text: 'You push the records through the drain grate before the service door folds inward. The demolition crew finds them in the morning. Your photograph leads investigators to the chained exit. It is finally opened. Your camera is still warm when they reach it.' }
};

export const CHARACTERS = [
  {name:'JUNE MERCER',role:'YOU · 24 · 1983',text:'A freelance photographer returning to the place where her seven-year-old brother died. Practical, observant, angry at a story that was made smaller than it was. In 1973, she was fourteen.',voice:'Low, restrained, American. Grief is carried in pauses.'},
  {name:'MR. MORROW',role:'THE MASCOT · MUTE IN 1983',text:'Once a cheerful ivory-and-pink birthday rabbit with a performer’s voice and prerecorded greetings. Now a soot-stained shell with hollow eyes, torn ears, and an exposed armature. He communicates only through movement, stillness, and violence.',voice:'NO dialogue, whispers, mimicry, or speech in 1983.'},
  {name:'EDWIN CANDLEWICK',role:'FOUNDER · 61 · 1983',text:'An immaculate businessman who treated the guest register as an expense sheet. His signature survives on the chained-exit order. Tonight he is a voice on an office telephone and a car waiting outside.',voice:'Controlled, older American male; the calm is the threat.'},
  {name:'ELLIS WARD',role:'COUNTY ELECTRICIAN · 29',text:'A nineteen-year-old apprentice in 1973. He reported the hot stage cable; management ignored him. He meets June outside with a radio and tries to restore the emergency exit. Trust him—or leave him holding the door.',voice:'Plainspoken, low American male; practical under stress.'},
  {name:'NORA BELL',role:'LOCAL REPORTER · 32',text:'Waiting beyond the property with a running car and a duplicate-file envelope. She needs documents, not a ghost story. She is June’s route to a public record.',voice:'Clear adult American female; steady, direct.'},
  {name:'RUTH HALE',role:'PARTY HOSTESS · 1973 ARCHIVE',text:'The hostess who tried to open the chained exit. Her November 1973 testimony is stored in a forgotten drawer. She never physically appears in the 1983 storyline.',voice:'Only a clearly dated 1973 adult archival statement.'},
  {name:'ROBIN MERCER',role:'JUNE’S BROTHER · 7 IN 1973',text:'He died in the October 27, 1973 fire. Seen only in historical material and June’s memories; never alive or playable in 1983. His blue ribbon is a tangible reminder of a birthday that should have ended with a ride home.',voice:'No present-day voice or imitation.'}
];

export const NODES = {};
const c = (id, label, to, effects={}, requires=null, point=null) => ({id,label,to,effects,requires,point});
const move = {minutes:3,battery:-2};
const back = (id,to='foyer_hub') => c('back','RETURN TO THE '+id,to,{minutes:1,battery:-1});
const n = (id,scene,title,text,choices=[],extra={}) => {
  NODES[id] = {id,scene,title,text,choices,chapter:1,speaker:'JUNE MERCER',objective:'Find a way inside Candlewick’s.',...extra};
};
const indoors = {chapter:2,objective:'Find the fire records. Restore the emergency exit.'};
const finale = {chapter:3,objective:'Get the original records out before the door closes.'};

n('arrival','exterior','THE NOTICE','October 14, 1983. Ten years since the fire. Thirteen days until Robin’s birthday. Someone left a demolition notice in my letterbox. By morning, everything left inside will be gone.',[
 c('begin','STEP OUT OF THE CAR','forecourt',{items:['torch','camera','radio'],evidence:['invitation'],minutes:1},null,[.66,.73]),
 c('leave','DRIVE HOME','end_walk')
],{voice:'Ten years. And they still want to erase it.'});
n('forecourt','exterior','CANDLEWICK’S CELEBRATION PALACE','The neon is lit. The power company disconnected this address in 1973. Across the wet forecourt, a paper birthday hat catches against the door.',[
 c('door','TRY THE FRONT DOORS','frontdoor',move,null,[.71,.68]),
 c('radio','CALL ELLIS ON THE RADIO','radio_intro',{minutes:1},null,[.34,.78]),
 c('notice','READ THE POSTED NOTICE','notice',{minutes:1},null,[.54,.61]),
 c('leave','GO BACK TO THE CAR','leave_check',{},null,[.18,.78])
],{voice:'The sign has power. It shouldn’t.'});
n('notice','exterior','CLEARANCE AT SIX','CLEARANCE BEGINS 06:00. NO PERSONAL EFFECTS WILL BE RETAINED. Beneath the notice: a cracked brass plaque commemorating the palace’s opening in 1958.',[back('FORECOURT','forecourt')]);
n('radio_intro','exterior','CHANNEL THREE','“June. I’m by the service gate. I can give the exit relay power, but I need the old switch order. Stay off the stage until you find it.”',[
 c('trust','TELL HIM YOU WANT HIS HELP','forecourt',{trust:1,flags:{contact:true}}),
 c('cold','TELL HIM TO KEEP THE CAR READY','forecourt',{flags:{contact:true}})
],{speaker:'ELLIS WARD · RADIO',voice:'June. Stay off the stage until you find the switch order.'});
n('frontdoor','exterior','THE LATCH','The front door opens before I touch the handle. Beyond the glass, the ticket booth is exactly where I remember it. The smell is wet plaster, old sugar, and something electrical.',[
 c('enter','PUSH THE DOOR OPEN','foyer_intro',{...move,nerve:7},null,[.71,.68]),
 c('back','STEP BACK','forecourt')
]);
n('leave_check','exterior','ONE MORE CHANCE','The car is still here. The road is empty. I can leave the palace to the people who buried the truth, or I can go inside with my own name on the guest list.',[
 c('leave','LEAVE CANDLEWICK’S','end_walk'),c('stay','GO BACK TO THE DOOR','forecourt')
]);
n('foyer_intro','foyer','ADMIT ONE','The door closes softly behind me. On the reception clock, both hands are stopped at 6:17. A trail of wet mascot footprints leads toward the birthday hall. They begin in the middle of the floor.',[
 c('quiet','KEEP QUIET AND LOOK AROUND','foyer_hub',{nerve:4}),
 c('call','CALL OUT FOR THE CARETAKER','foyer_hub',{noise:15,nerve:8})
],{...indoors,voice:'No caretaker. Just me.',enter:{flags:{inside:true}}});
n('foyer_hub','foyer','THE RECEPTION FOYER','A guest register lies open on the counter. Through the left arch: the birthday tables. To the right: the arcade. A brass sign points to the office and workshop.',[
 c('register','EXAMINE THE GUEST REGISTER','register',{minutes:2},null,[.30,.65]),
 c('dining','ENTER THE BIRTHDAY HALL','dining_intro',move,null,[.57,.47]),
 c('arcade','ENTER THE ARCADE','arcade_intro',move,null,[.81,.51]),
 c('office','FIND EDWIN’S OFFICE','office_intro',move,null,[.65,.39]),
 c('workshop','ENTER THE WORKSHOP','workshop_intro',move,null,[.18,.49]),
 c('stage','GO TO THE MAIN STAGE','stage_intro',move,{flags:['power']},[.50,.34]),
 c('exit','TRY THE FRONT DOOR','sealed',{},null,[.47,.78])
],indoors);
n('register','foyer','DAY FIRST','The last page is dated October 27, 1973. Receipt 2710 is clipped over the attendance column. A note reads: SAFE CODE CHANGED TO CLOSING DATE. DAY FIRST. The children’s names have been cut out with a razor.',[back('FOYER')],{...indoors,enter:{evidence:['receipt']}});
n('sealed','foyer','SOMETHING ON THE OTHER SIDE','The door handle moves. The door does not. Through the rain-streaked glass, the forecourt lamps go out one at a time. My radio clicks twice.',[
 c('return','FIND ANOTHER WAY OUT','foyer_hub'),
 c('break','STRIKE THE GLASS WITH THE TORCH','glass_hit',{noise:18,nerve:6})
],indoors);
n('glass_hit','foyer','THE WRONG REFLECTION','The glass does not break. In the reflection, a tall rabbit shape stands behind my shoulder. I turn. The room is empty.',[back('FOYER')],{...indoors,scare:'glass'});

n('dining_intro','dining','PARTY SEVEN','A cake has collapsed into its own stand. The candles are warm. They are not lit. There has been no party here for ten years. My table is still set for two.',[c('look','SEARCH THE TABLES','dining_hub')],{...indoors,voice:'Robin’s table. They left it here.'});
n('dining_hub','dining','THE EMPTY CHAIR','The birthday table is arranged beneath the fire-exit sign. A small blue ribbon hangs from the chair nearest the wall. Across the room, the stage curtain moves against the draught.',[
 c('plan','PHOTOGRAPH THE SEATING PLAN','seating',{minutes:2,battery:-3},null,[.36,.66]),
 c('ribbon','TAKE THE BLUE RIBBON','ribbon',{minutes:1,nerve:4},null,[.59,.70]),
 c('memory','REMEMBER THE LAST BIRTHDAY','memory',{minutes:1},null,[.53,.53]),
 c('curtain','LOOK BEHIND THE CURTAIN','dining_curtain',{minutes:2,nerve:8},null,[.78,.37]),
 back('FOYER')
],indoors);
n('seating','dining','A NAME REMOVED','The seating plan says ROBIN MERCER — 7. JUNE MERCER — 14. The insurance copy beside it shows a blank table. I photograph both. The shutter seems louder than a gun in this room.',[back('TABLE','dining_hub')],{...indoors,enter:{evidence:['seating'],items:['film']}});
n('ribbon','dining','THE KNOT','I recognize the knot because I tied it. Robin wore this ribbon on his jacket. I do not need a ghost to tell me what happened to him. I need someone to answer for the chain on that door.',[back('TABLE','dining_hub')],{...indoors,enter:{items:['ribbon'],nerve:3},voice:'I know what happened to you. I need them to say it.'});
n('memory','dining','OCTOBER 27, 1973','I am fourteen again. Ruth is counting the plates. Robin is seven, trying to straighten his party hat in a spoon. The stage light gives a dry little pop. Ruth reaches for the east door. Her hand comes back holding a chain.',[c('return','RETURN TO TONIGHT','dining_hub')],{...indoors,speaker:'JUNE · A 1973 MEMORY',voice:'It started above the stage. Not in the kitchen.'});
n('dining_curtain','dining','A SPACE THE SIZE OF A MAN','Behind the curtain is a dusty outline on the floor. A mascot stood here recently. On the wall, a hook still holds the old drive cable. Its end has been cut.',[back('TABLE','dining_hub')],{...indoors,scare:'sighting'});

n('arcade_intro','arcade','NO HIGH SCORES','The arcade cabinets are dead. One purple tube above the prize counter glows without a ballast. At the back, something heavy has scuffed a path through the dust.',[c('search','SEARCH THE ARCADE','arcade_hub')],indoors);
n('arcade_hub','arcade','ONE TOKEN, ONE PRIZE','The prize-room door has a coin-operated latch. A cabinet marked BUNNY’S LAST BOW has an open return slot. The broken camera flash throws my reflection into every black screen.',[
 c('slot','CHECK THE COIN RETURN','token',{minutes:1},null,[.29,.60]),
 c('prize','OPEN THE PRIZE ROOM','prize',{minutes:2,removeItems:['token']},{items:['token']},[.72,.55]),
 c('look','LOOK DOWN THE DARK AISLE','arcade_look',{minutes:1,nerve:6},null,[.52,.45]),
 back('FOYER')
],indoors);
n('token','arcade','THE RABBIT TOKEN','A brass token falls into my palm. The rabbit engraved on it has a smile worn almost flat. In the reflection above the slot, an ear unfolds behind the counter.',[back('ARCADE','arcade_hub')],{...indoors,enter:{items:['token']}});
n('arcade_look','arcade','HOLD STILL','At the end of the aisle, Mr. Morrow leans out from behind a cabinet. Hollow eyes. Split cloth. A bent ear dragging down his shoulder. His head turns toward the tiny click of my torch.',[
 c('hide','DUCK BEHIND THE CABINET','arcade_safe',{nerve:-4,battery:-2}),
 c('still','LOWER THE LIGHT AND FREEZE','arcade_safe',{nerve:5}),
 c('run','RUN THROUGH THE AISLE','arcade_run',{noise:20,nerve:16})
],{...indoors,scare:'sighting',timed:12,timeout:'run',threat:true});
n('prize','arcade','THE ONLY USEFUL PRIZE','The coin latch opens. Behind the dusty plush prizes is a ceramic fuse in a service envelope. I pick it up. The arcade door closes. A heavy glove presses flat against the wired glass.',[
 c('hide','CRAWL UNDER THE PRIZE COUNTER','arcade_safe',{nerve:7}),
 c('freeze','TURN OFF THE FLASHLIGHT','arcade_safe',{battery:-1,nerve:11}),
 c('charge','SHOVE THE DOOR OPEN','arcade_run',{noise:20,nerve:18})
],{...indoors,enter:{items:['fuse']},scare:'hand',timed:12,timeout:'charge',threat:true});
n('arcade_safe','arcade','THE WEIGHT PASSES','I count the scrape of each foot until it stops. Mr. Morrow waits on the other side of the cabinet. He does not breathe. Eventually the floor takes his weight somewhere else.',[c('leave','SLIP BACK TO THE FOYER','foyer_hub',move)],{...indoors,enter:{flags:{evaded:true}}});
n('arcade_run','arcade','TOO LOUD','A cabinet falls behind me. The glove catches my sleeve and tears it away. I wrench free into the foyer. The radio is still intact. The torch is dimmer.',[c('escape','KEEP MOVING','foyer_hub',{battery:-12})],{...indoors,scare:'rush'});

n('office_intro','office','THE OWNER’S OFFICE','Edwin’s portrait faces the desk. A cassette is already in the recorder. Beside it, a typed guest list has been carefully corrected in red. The telephone has no dial tone.',[c('search','SEARCH THE DESK','office_hub')],indoors);
n('office_hub','office','A VERY CAREFUL MAN','The safe is inset into the wall. Four number wheels. On the desk: the recorder, an old envelope, and a photograph of the palace before the fire.',[
 c('tape','PLAY EDWIN’S DATED TAPE','edwin_tape',{minutes:2},null,[.65,.66]),
 c('safe','OPEN THE WALL SAFE','office_safe',{minutes:1},null,[.82,.33]),
 c('photo','EXAMINE THE 1973 PHOTOGRAPH','old_photo',{minutes:1},null,[.34,.55]),
 c('phone','PICK UP THE TELEPHONE','edwin_phone',{minutes:2},null,[.43,.71]),
 back('FOYER')
],indoors);
n('edwin_tape','office','1973 · OWNER’S DICTATION','“Keep the birthday show running. If the cable is hot, turn the house lights down. We cannot refund an entire afternoon.” The tape jumps. “Use the amended list for the insurer. No one needs the original.”',[
 c('take','KEEP THE CASSETTE AS PROOF','office_hub',{evidence:['recording'],flags:{heardEdwin:true}})
],{...indoors,speaker:'EDWIN · RECORDED 27 OCT 1973',voice:'Use the amended list for the insurer. No one needs the original.'});
n('office_safe','office','DAY FIRST. NO SPACES.','Four brass wheels. The receipt in the reception register says the combination is the closing date, day first. The fire was October 27. A safe is a remarkably patient thing.',[
 c('hint','READ THE RECEPTION RECEIPT','safe_hint'),back('DESK','office_hub')
],{...indoors,puzzle:{code:'2710',label:'WALL SAFE',length:4,to:'safe_open',effects:{flags:{safeOpen:true}}}});
n('safe_hint','office','THE CLOSING DATE','The last open day was 27 October. Day first: 27, then 10. Four digits. 2710.',[back('SAFE','office_safe')],indoors);
n('safe_open','office','LOSS PREVENTION','Inside: a brass key and the original ledger. Edwin ordered the east exit chained to stop children leaving without paying. The following page warns him about the overheating stage cable. Both carry his initials.',[
 c('keep','TAKE THE KEY AND ORIGINAL LEDGER','phone_ring',{items:['key','ledger'],evidence:['directive'],minutes:2})
],indoors);
n('phone_ring','office','THE TELEPHONE RINGS','The dead telephone rings once. Then twice. I can leave it. But someone knows exactly where I am.',[
 c('answer','ANSWER THE PHONE','edwin_phone'),c('ignore','LEAVE THE ROOM','foyer_hub',move)
],{...indoors,sfx:'phone'});
n('edwin_phone','office','A VOICE THAT HAS NOT CHANGED','“Miss Mercer. You have mistaken private property for an invitation. Bring what you have to the stage. We can settle this without another unfortunate incident.”',[
 c('refuse','TELL HIM THE RECORDS ARE LEAVING','phone_refuse',{trust:1,flags:{defiedEdwin:true}}),
 c('offer','ASK WHAT HE IS OFFERING','phone_offer',{flags:{bribe:true}}),
 c('hangup','HANG UP WITHOUT A WORD','foyer_hub')
],{...indoors,speaker:'EDWIN CANDLEWICK · TELEPHONE · 1983',voice:'Miss Mercer. Bring what you have to the stage. We can settle this.'});
n('phone_refuse','office','NOT AN ACCIDENT','“You keep saying accident,” I tell him. “An accident doesn’t sign a ledger.” The line goes quiet. On the other side of the office door, a heel drags once across the carpet.',[back('FOYER')],{...indoors,voice:'An accident doesn’t sign a ledger.'});
n('phone_offer','office','THE ENVELOPE','“Enough to leave this town. Enough to stop living in that afternoon.” His voice stays level. “You do not need to come to the stage empty-handed.”',[
 c('later','END THE CALL. DECIDE LATER.','foyer_hub')
],{...indoors,speaker:'EDWIN CANDLEWICK · TELEPHONE',voice:'Enough to stop living in that afternoon.'});
n('old_photo','office','BEFORE THE FIRE','Mr. Morrow in 1973: clean pink cloth, white gloves, a friendly painted face. He could speak then, through a performer and cheerful prerecorded greetings. In tonight’s photographs, that face is empty. It will never say a word.',[back('DESK','office_hub')],indoors);

n('workshop_intro','maintenance','THE HOT CABLE','The workshop smells of wet copper. A relay panel stands behind the workbench. On the bench: spare batteries, bolt cutters, and a fuse drawer.',[c('search','EXAMINE THE WORKSHOP','workshop_hub')],indoors);
n('workshop_hub','maintenance','EXIT. HOUSE. STAGE.','A brass relay tag hangs from the fuse panel. The archive door has a heavy padlock. Through the wall, something brushes along the lowest pipe.',[
 c('tag','READ THE RELAY TAG','relay_tag',{minutes:1},null,[.59,.42]),
 c('spare','PRY OPEN THE SPARE-FUSE DRAWER','spare_fuse',{minutes:2,noise:12},null,[.74,.67]),
 c('battery','REPLACE THE TORCH BATTERIES','batteries',{minutes:1}, {notFlags:['charged']},[.77,.72]),
 c('cutters','TAKE THE BOLT CUTTERS','cutters',{minutes:1},null,[.40,.63]),
 c('power','INSTALL THE FUSE AND SET THE RELAY','relay_puzzle',{minutes:2}, {items:['fuse']},[.59,.37]),
 c('archive','OPEN THE ARCHIVE DOOR','archive_door',{minutes:1},null,[.19,.42]),
 back('FOYER')
],indoors);
n('relay_tag','maintenance','THE RESTORATION ORDER','3: EAST EXIT. 1: HOUSE LIGHTS. 2: STAGE. Emergency restoration sequence: 3–1–2. Someone underlined EXIT three times. I copy the order before the damp tag breaks off.',[back('WORKSHOP','workshop_hub')],{...indoors,enter:{evidence:['relay']}});
n('spare_fuse','maintenance','THE DRAWER GIVES','The drawer opens with a shriek. A ceramic fuse rolls out. Beneath the workbench, a broad glove slowly uncurls from the shadows. I keep my hand away from the edge.',[back('WORKSHOP','workshop_hub')],{...indoors,enter:{items:['fuse'],nerve:7},scare:'hand'});
n('batteries','maintenance','A SMALL KINDNESS','The new batteries are still in their paper sleeve. The torch steadies. For a moment, the room looks like somewhere people worked. The moment passes.',[back('WORKSHOP','workshop_hub')],{...indoors,enter:{battery:100,flags:{charged:true}}});
n('cutters','maintenance','HEAVY STEEL','I slide the cutters through my bag strap. They can break the archive lock. They can also ring like a dinner bell if I drop them.',[back('WORKSHOP','workshop_hub')],{...indoors,enter:{items:['cutters']}});
n('relay_puzzle','maintenance','THE EMERGENCY RELAY','The new fuse seats with a soft click. Three relays wait for their order. The brass tag says to light the east exit before the house, and the house before the stage.',[
 c('hint','READ THE SWITCH ORDER','relay_hint'),back('WORKSHOP','workshop_hub')
],{...indoors,puzzle:{code:'312',label:'RELAY SEQUENCE',length:3,to:'power_on',effects:{flags:{power:true,exitLit:true},minutes:3}}});
n('relay_hint','maintenance','THREE. ONE. TWO.','EXIT = 3. HOUSE = 1. STAGE = 2. The restoration order is 312. It powers the escape path first.',[back('RELAYS','relay_puzzle')],indoors);
n('power_on','maintenance','THE BUILDING WAKES','The east-exit lamp glows. House lights follow. Finally, the stage relay engages. Somewhere beyond the wall, a very large thing takes one step. Ellis answers the radio immediately.',[
 c('ellis','ASK ELLIS TO MEET YOU AT THE EXIT','ellis_promise',{trust:1,flags:{exitMeeting:true}}),
 c('alone','TELL HIM YOU WILL FIND YOUR OWN WAY','workshop_hub',{trust:-1})
],{...indoors,sfx:'power',voice:'The exit first. At least this time.'});
n('ellis_promise','maintenance','NO MORE WARNINGS LEFT UNHEARD','“I should have pulled that cable myself in ’73. I won’t stay outside this time. Get the originals. I’ll be at the east passage.”',[
 c('return','CONTINUE SEARCHING','workshop_hub')
],{...indoors,speaker:'ELLIS WARD · RADIO',voice:'Get the originals. I’ll be at the east passage.'});
n('archive_door','maintenance','THE PADLOCK','A newer padlock on a very old door. Edwin kept these records after telling everyone they had burned.',[
 c('key','USE THE BRASS ARCHIVE KEY','archive_intro',{minutes:1},{items:['key']},[.24,.48]),
 c('cut','CUT THE LOCK','archive_intro',{minutes:2,noise:18},{items:['cutters']},[.24,.48]),
 back('WORKSHOP','workshop_hub')
],indoors);

n('archive_intro','archive','WHAT DID NOT BURN','The records are stacked behind a false wall. Not lost. Not destroyed. Hidden. A blue folder is labelled MERCER, R. Under it lies a handwritten statement from Ruth Hale.',[c('open','OPEN THE FILES','archive_hub')],indoors);
n('archive_hub','archive','THE ORIGINAL RECORD','An insurer’s list sits beside the original guest register. A small cassette marked NOVEMBER 4, 1973 is sealed in a statement envelope. Robin’s certificate is in the blue file.',[
 c('certificate','READ ROBIN’S CERTIFICATE','certificate',{minutes:2},null,[.59,.58]),
 c('statement','PLAY RUTH’S SWORN STATEMENT','ruth_statement',{minutes:3},null,[.72,.65]),
 c('register','TAKE THE ORIGINAL GUEST REGISTER','original_register',{minutes:2},null,[.42,.69]),
 c('passage','FOLLOW THE SERVICE PASSAGE','tunnel_intro',move,{flags:['power']},[.54,.38]),
 back('WORKSHOP','workshop_hub')
],indoors);
n('certificate','archive','ROBIN MERCER, SEVEN','The certificate confirms the death I have lived with for ten years. October 27, 1973. Positive identification. On the insurance copy, his name is missing. I am not here to find Robin alive. I am here because someone removed him twice.',[
 c('copy','PHOTOGRAPH THE CERTIFICATE','archive_hub',{evidence:['coroner'],items:['film'],battery:-2})
],{...indoors,voice:'You don’t get to remove his name twice.'});
n('ruth_statement','archive','NOVEMBER 4, 1973 · SWORN STATEMENT','“The light bar was smoking. I went to the east exit. It was chained. Edwin took the register before the fire crew came. I saw him. Please write down that I saw him.” The adult hostess’s old recording ends with the click of a stop button.',[
 c('keep','KEEP RUTH’S ORIGINAL TAPE','archive_hub',{evidence:['testimony'],items:['tape']})
],{...indoors,speaker:'RUTH HALE · RECORDED 4 NOV 1973',voice:'It was chained. Edwin took the register. Please write down that I saw him.'});
n('original_register','archive','PARTY SEVEN EXISTS','Seven confirmed deaths. Three other children whose departures were never checked against the register. Robin is listed among the dead, not the missing. The company’s copy deletes the whole table. This is the page that the investigation never saw.',[
 c('keep','PHOTOGRAPH AND KEEP THE ORIGINAL PAGE','archive_hub',{evidence:['list'],items:['film'],battery:-2})
],indoors);

n('stage_intro','stage','AN EMPTY PEDESTAL','The stage lights are on. The old performance cable hangs severed from the rail. Mr. Morrow should be on the pedestal. He is not. An envelope waits among the empty gift boxes.',[
 c('photo','PHOTOGRAPH THE STAGE','stage_photo',{minutes:2,battery:-3},null,[.51,.51]),
 c('envelope','EXAMINE EDWIN’S ENVELOPE','bribe_stage',{minutes:1},null,[.68,.70]),
 c('passage','TAKE THE EAST SERVICE PASSAGE','tunnel_intro',move,null,[.84,.60]),
 c('search','RETURN TO SEARCH THE FOYER','foyer_hub',move)
],{...indoors,objective:'Photograph the stage, then find the east passage.'});
n('stage_photo','stage','THE SECOND EXPOSURE','The first frame: Mr. Morrow on the pedestal. I lower the camera. Nothing is there. The second exposure catches a wet footprint facing me from the front of the stage. Behind my chair, fabric slowly tears.',[
 c('quiet','LOWER THE CAMERA. BACK AWAY.','stage_escape',{nerve:5}),
 c('run','RUN FOR THE SERVICE DOOR','stage_escape',{noise:15,nerve:12}),
 c('turn','TURN AROUND','stage_turn',{nerve:15})
],{...indoors,enter:{evidence:['photo'],items:['film']},scare:'sighting',timed:12,timeout:'turn',threat:true});
n('stage_turn','stage','TOO CLOSE','His hollow face fills the light. I fall backwards over the chair. A glove closes where my throat was. I kick through the rotten seat and crawl toward the passage.',[c('crawl','CRAWL INTO THE SERVICE PASSAGE','tunnel_intro',{battery:-12,nerve:10})],{...indoors,scare:'rush'});
n('stage_escape','stage','KEEP THE EXIT IN SIGHT','A hand grips the edge of the stage. I do not stop to see the rest of him stand. The exit light is the only steady thing in the room.',[
 c('passage','REACH THE EAST PASSAGE','tunnel_intro',move),
 c('search','RETREAT TO THE FOYER','foyer_hub',{minutes:3,nerve:5})
],indoors);
n('bribe_stage','stage','A PRICE FOR THE RECORD','Inside the envelope: cash, a release form, and a note. “Return all originals. The front door will be opened.” The release calls Robin’s death an unforeseeable incident.',[
 c('accept','ACCEPT THE MONEY AND SURRENDER THE PROOF','end_silence',{removeEvidence:['directive','recording','testimony','list'],removeItems:['ledger','film','tape']},{any:[{items:['ledger']},{items:['film']},{items:['tape']}]}),
 c('refuse','LEAVE THE ENVELOPE UNTOUCHED','stage_intro',{flags:{refusedBribe:true}})
],{...indoors,voice:'He put a price on a seven-year-old.'});

n('tunnel_intro','tunnel','THE EAST PASSAGE','The lit passage runs beneath the stage. Ellis is at the far door, pressing a bar against the collapsing frame. The chain on the original exit has rusted into its bracket. Behind me, the stage stairs creak once.',[
 c('meet','GO TO ELLIS','ellis_door',move),
 c('chain','EXAMINE THE OLD CHAIN','chain',{minutes:2}),
 c('return','RETURN TO THE ARCHIVE','archive_hub',{minutes:3,battery:-2},{any:[{items:['key']},{items:['cutters']} ]})
],{...finale,voice:'The exit. The same door.'});
n('chain','tunnel','THE OLD ORDER','The chain is still here. A warning plaque says REMOVE DURING OCCUPANCY. Someone painted over the final word. I photograph it before the exit lamp dims.',[
 c('return','GO TO ELLIS','ellis_door',{minutes:1})
],{...finale,enter:{evidence:['directive'],items:['film']}});
n('ellis_door','tunnel','HOLD THE FRAME','“The bar’s slipping. Help me lift it, then we both go. If you take the drain, it goes under the foundations. It doesn’t reach the road.” Something heavy starts down the stairs behind us.',[
 c('help','HELP ELLIS LIFT THE DOOR','help_ellis',{trust:1,nerve:8}),
 c('drain','TAKE THE DRAIN ALONE','drain',{trust:-2,nerve:15}),
 c('hide','HIDE IN THE MAINTENANCE ALCOVE','alcove',{nerve:12})
],{...finale,speaker:'ELLIS WARD',voice:'Help me lift it, then we both go. The drain doesn’t reach the road.',timed:15,timeout:'hide',threat:true});
n('help_ellis','tunnel','TWO HANDS ON THE BAR','The door lifts. Ellis catches it with his shoulder. At the far end of the passage, Mr. Morrow lowers his head beneath the pipe. He has found the room with no other exit.',[
 c('escape','TAKE ELLIS AND THE ORIGINALS OUT','final_crossing',{flags:{savedEllis:true}}),
 c('send','GIVE ELLIS THE RECORDS. HOLD THE DOOR.','sacrifice',{flags:{sentRecords:true}},{evidenceCount:3,any:[{items:['ledger']},{items:['tape']}]}),
 c('burn','SET THE STAGE CURTAINS ALIGHT','fire_plan',{flags:{savedEllis:true}})
],{...finale,scare:'sighting'});
n('final_crossing','tunnel','DO NOT LOOK BACK','Ellis has the gate. I have the bag. Mr. Morrow’s glove catches the strap as I cross the threshold. There is time for one decision.',[
 c('cut','CUT THE STRAP. KEEP THE RECORDS.','road',{nerve:6}, {items:['cutters']}),
 c('slip','SLIP OUT OF THE STRAP WITH THE BAG','road',{nerve:12}, {flags:['evaded']}),
 c('drop','DROP THE BAG AND RUN','road_lost',{removeItems:['film','ledger','tape'],removeEvidence:['directive','recording','testimony','list','photo']}),
 c('pull','PULL AGAINST HIS HAND','final_pull',{noise:20,nerve:16})
],{...finale,scare:'hand',timed:15,timeout:'pull',threat:true});
n('final_pull','tunnel','THE GRIP','The bag holds. The rotten door frame does not. Ellis reaches for me, but the gap disappears between his hand and mine.',[
 c('last','MAKE ONE LAST ATTEMPT','end_guest')
],{...finale,scare:'rush'});
n('road','exterior','THE RUNNING CAR','Nora opens the passenger door. Ellis gets into the back. I place the originals on her lap before I sit down. She asks one question: “Can you prove the chain was an order?”',[
 c('complete','GIVE HER THE COMPLETE RECORD','end_daylight',{}, {evidence:['directive','testimony','list','coroner'],items:['ledger','tape'],flags:['savedEllis'],trust:1}),
 c('testify','HAND OVER WHAT YOU FOUND','end_witness')
],{...finale,speaker:'NORA BELL',voice:'Can you prove the chain was an order?',objective:'Put the proof in someone else’s hands.'});
n('road_lost','exterior','EMPTY HANDS','Nora pulls me into the car. My bag is somewhere inside the palace. I can describe the ledger. I can describe the chain. She writes every word down. We leave before I can go back.',[
 c('leave','LEAVE WITH NORA AND ELLIS','end_witness')
],finale);
n('sacrifice','tunnel','SOMEONE MUST HOLD IT','I give Ellis every record in my bag. I put both hands against the bar. He wants to stay. I tell him to make one warning count this time.',[
 c('send','SEND HIM TO NORA','end_stay')
],{...finale,voice:'Make this warning count.'});
n('fire_plan','tunnel','ANOTHER WAY TO LOSE THE RECORD','There is lamp fuel in the maintenance alcove and a dead curtain above the pipe. I can destroy the place. I can also destroy the only records the families have left.',[
 c('burn','LIGHT THE CURTAIN AND RUN','end_ashes',{removeEvidence:['directive','testimony','list','recording']}),
 c('return','KEEP THE RECORDS. TAKE THE DOOR.','final_crossing')
],finale);
n('drain','tunnel','THE DRAIN','The grate gives beneath me. Black water reaches my waist. Ellis was right: the channel ends under the foundations. Above me, the grate is pushed closed by a dirty ivory glove.',[
 c('records','PUSH THE EVIDENCE UP THROUGH THE GRATE','end_floor',{}, {evidenceCount:3}),
 c('climb','CLIMB TOWARD THE HAND','end_guest'),
 c('wait','WAIT IN THE DARK','end_guest')
],{...finale,scare:'hand'});
n('alcove','tunnel','THE ALCOVE','I fit behind the hot-water tank. Mr. Morrow stops outside. The edge of his ear lowers into the gap. The space was built for a pipe, not a person.',[
 c('dash','DASH FOR ELLIS WHILE THE DOOR IS OPEN','help_ellis',{nerve:15}),
 c('still','STAY ABSOLUTELY STILL','end_guest')
],{...finale,scare:'sighting',timed:10,timeout:'still',threat:true});

for (const [id,ending,scene] of [
 ['end_daylight','daylight','exterior'],['end_witness','witness','exterior'],
 ['end_stay','stay','tunnel'],['end_silence','silence','stage'],
 ['end_ashes','ashes','exterior'],['end_guest','guest','stage'],
 ['end_walk','walk','exterior'],['end_floor','floor','tunnel']
]) n(id,scene,ENDINGS[ending].title,ENDINGS[ending].text,[],{chapter:4,speaker:'THE LAST BIRTHDAY',ending,objective:'The story has ended.',scare:ending==='guest'?'rush':null});

export const CHAPTERS = ['THE INVITATION','WHAT DID NOT BURN','THE EAST EXIT','THE LAST BIRTHDAY'];
export const MAP = [
 ['exterior','FORECOURT',0,1],['foyer','FOYER',1,1],['dining','BIRTHDAY HALL',2,0],
 ['arcade','ARCADE',2,2],['office','OFFICE',3,0],['maintenance','WORKSHOP',3,2],
 ['archive','ARCHIVE',4,2],['stage','MAIN STAGE',4,0],['tunnel','EAST PASSAGE',5,1]
];

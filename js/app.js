import { NODES, SCENES, ITEMS, EVIDENCE, ENDINGS, CHARACTERS, CHAPTERS, MAP } from './story.js';
import { startGame, choose, solvePuzzle, permitted, clock, validateState } from './engine.js';
import { SceneDirector } from './scene.js';
import { AudioDirector } from './audio.js';
import { settings, storeSettings, save, load, clearSlot, getEndings, unlockEnding, clearProgress } from './storage.js';

const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state=null,playing=false,prefs=settings(),modalView=null,modalOrigin=null,puzzleValue='',busy=false;
let encounter=null,encounterInterval=null,toastTimer=null,announcementTimer=null,transitionToken=0;
let currentScene='exterior',hoverChoice=null,lastScene='exterior';
const audio=new AudioDirector();
const scene=new SceneDirector($('world'),message=>showToast(message));

function configure(){
  scene.configure(prefs);audio.configure(prefs);
  if(!prefs.scares)scene.clearScare();
  $('grain').hidden=!prefs.grain;
  document.documentElement.classList.toggle('reduced-motion',prefs.reducedMotion);
  document.documentElement.classList.toggle('large-text',prefs.largeText);
  if(playing)renderHotspots();
  updateSoundButton();
}
function updateSoundButton(){ $('sound-toggle').textContent=audio.enabled&&prefs.sound?'SOUND ON · CLICK TO MUTE':'ENABLE SOUND'; }
function showToast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3200);}
function refreshContinue(){const autosave=load('auto');$('continue-game').disabled=!autosave;}
function showTitle(){
  clearEncounter();playing=false;busy=false;transitionToken++;audio.cancelVoice();scene.clearScare();
  if(state)save('auto',state);
  closeModal();scene.pause(false);audio.pause(false);
  $('title-screen').hidden=false;$('play-screen').hidden=true;$('ending-screen').hidden=true;$('world-actions').replaceChildren();
  $('transition').classList.remove('fade');scene.setScene('exterior');audio.setScene('exterior');lastScene='exterior';refreshContinue();
}
async function beginNew(){
  if(busy)return;
  busy=true;
  await audio.start();updateSoundButton();
  busy=false;
  closeModal();const result=startGame();state=null;playing=true;
  $('title-screen').hidden=true;$('ending-screen').hidden=true;$('play-screen').hidden=false;
  applyResult(result);showToast('MOVE TO LOOK. CLICK A CHOICE OR A MARKED OBJECT. YOUR STORY AUTOSAVES.');
}
async function resumeFrom(slot){
  const stored=load(slot);if(!stored){showToast('This slot is empty or cannot be read.');return;}
  await audio.start();closeModal();state=stored.state;playing=!state.ending;
  $('title-screen').hidden=true;$('ending-screen').hidden=true;$('play-screen').hidden=!!state.ending;
  if(state.ending)renderEnding();else renderNode({state,node:NODES[state.node],first:false,event:null});
  save('auto',state);updateSoundButton();
}
function applyResult(result){
  const previous=state;state=result.state;save('auto',state);
  const collected=state.evidence.filter(id=>!previous?.evidence.includes(id));
  if(collected.length&&state.node!=='arrival')showToast('EVIDENCE ADDED · '+collected.map(id=>EVIDENCE[id].title.toUpperCase()).join(' / '));
  if(state.ending){renderEnding();return;}
  renderNode(result);
}
function lockedReason(rule){
  if(rule?.items){const item=rule.items.find(id=>!state.items.includes(id));if(item)return 'NEED '+(ITEMS[item]?.[0]||item).toUpperCase();}
  if(rule?.notFlags?.some(id=>state.flags[id]))return 'ALREADY USED';
  if(rule?.flags?.includes('power')&&!state.flags.power)return 'RESTORE POWER';
  if(rule?.trust!=null&&state.trust<rule.trust)return 'ELLIS’S TRUST';
  if(rule?.evidenceCount!=null&&state.evidence.length<rule.evidenceCount)return 'NEED '+rule.evidenceCount+' RECORDS';
  return 'MORE PROOF NEEDED';
}
function renderNode(result){
  const node=result.node;clearEncounter();scene.clearScare();
  const sceneChanged=lastScene!==node.scene;currentScene=node.scene;lastScene=node.scene;
  if(sceneChanged){
    $('transition').classList.add('fade');const serial=++transitionToken;
    setTimeout(()=>{if(serial!==transitionToken)return;scene.setScene(node.scene,state,node);renderHotspots();$('transition').classList.remove('fade');},prefs.reducedMotion?0:200);
    announce(SCENES[node.scene].title);audio.cue('door');
  }else{scene.update(state,node);scene.setScene(node.scene,state,node);}
  audio.setScene(node.scene,state.nerve);
  $('chapter-label').textContent=String(node.chapter).padStart(2,'0')+' / '+CHAPTERS[node.chapter-1];
  $('objective').textContent=node.objective;$('speaker').textContent=node.speaker;$('node-title').textContent=node.title;
  $('story-text').textContent=node.text;$('location-name').textContent=SCENES[node.scene].title.toUpperCase();$('clock').textContent=clock(state);
  $('evidence-count').textContent=String(state.evidence.length);updateBattery();
  const choices=$('choices');choices.replaceChildren();
  node.choices.forEach((choice,i)=>{
    const button=document.createElement('button');button.className='choice';button.dataset.choice=choice.id;
    button.disabled=!permitted(state,choice.requires);
    const number=document.createElement('span');number.className='choice-number';number.textContent=String(i+1);button.append(number);
    const label=document.createElement('span');label.textContent=choice.label;button.append(label);
    if(button.disabled){const reason=document.createElement('span');reason.className='choice-lock';reason.textContent=lockedReason(choice.requires);button.append(reason);button.title=reason.textContent;}
    button.addEventListener('click',()=>act(choice.id));choices.append(button);
  });
  renderHotspots();puzzleValue='';renderPuzzle();
  if(result.event&&result.event!=='error'){scene.scare(result.event);audio.cue(result.event);}
  if(node.sfx)audio.cue(node.sfx);
  if(node.voice)audio.voice(node.voice,node.speaker);else audio.cancelVoice();
  if(node.timed)startEncounter(node);
}
function act(id){
  if(!playing||busy||modalView)return;
  try{
    const choice=NODES[state.node].choices.find(c=>c.id===id);if(!choice||!permitted(state,choice.requires))return;
    audio.cue(/PHOTOGRAPH/.test(choice.label)?'camera':'click');applyResult(choose(state,id));
  }catch{showToast('That choice is unavailable.');}
}
function updateBattery(){
  $('battery-label').textContent=state.battery+'%';$('battery-fill').style.width=state.battery+'%';
  $('flashlight-button').classList.toggle('off',!state.flashlight||state.battery===0);
  $('flashlight-button').setAttribute('aria-pressed',String(state.flashlight));
}
function toggleTorch(){
  if(!playing||modalView)return;state={...state,flashlight:!state.flashlight};updateBattery();scene.update(state,NODES[state.node]);save('auto',state);audio.cue('click');
  if(state.flashlight&&state.battery===0)showToast('THE BATTERIES ARE EMPTY. THE WORKSHOP HAS ONE SPARE SET.');
}
function renderHotspots(){
  const layer=$('world-actions');layer.replaceChildren();hoverChoice=null;$('interaction-hint').hidden=true;
  const entrance=scene.project([.69,.65]);$('enter-door').style.left=entrance.x+'px';$('enter-door').style.top=entrance.y+'px';
  if(!playing||!state||!prefs.hotspots||modalView)return;
  for(const choice of NODES[state.node].choices){
    if(!choice.point)continue;
    const point=scene.project(choice.point),button=document.createElement('button');button.className='hotspot';
    button.style.left=point.x+'px';button.style.top=point.y+'px';button.dataset.choice=choice.id;button.setAttribute('aria-label',choice.label);
    button.disabled=!permitted(state,choice.requires);button.classList.toggle('locked',button.disabled);
    const dot=document.createElement('span');dot.className='dot';const label=document.createElement('span');label.className='label';label.textContent='[E] '+choice.label;button.append(dot,label);
    button.addEventListener('click',()=>act(choice.id));button.addEventListener('pointerenter',()=>hoverChoice=choice.id);button.addEventListener('pointerleave',()=>hoverChoice=null);layer.append(button);
  }
}
function announce(label){clearTimeout(announcementTimer);$('scene-announcement').textContent=label;$('scene-announcement').classList.add('visible');announcementTimer=setTimeout(()=>$('scene-announcement').classList.remove('visible'),1900);}
function startEncounter(node){
  const duration=Math.max(7,node.timed-Math.floor(state.noise/25));
  encounter={node:state.node,remaining:duration*1000,last:performance.now(),length:duration*1000};$('danger').hidden=false;
  encounterInterval=setInterval(()=>{
    if(!encounter||!playing||state.node!==encounter.node){clearEncounter();return;}
    const now=performance.now(),delta=now-encounter.last;encounter.last=now;
    if(!modalView&&!document.hidden&&!prefs.timerAssist&&!busy)encounter.remaining-=delta;
    $('danger-fill').style.width=(prefs.timerAssist?100:Math.max(0,encounter.remaining/encounter.length*100))+'%';
    $('danger').querySelector('span').textContent=prefs.timerAssist?'HE IS CLOSE · TIME ASSIST ON':'HE IS CLOSE · '+Math.max(0,Math.ceil(encounter.remaining/1000))+'s';
    if(encounter.remaining<=0&&!modalView){const fallback=NODES[state.node].timeout;clearEncounter();act(fallback);}
  },100);
}
function clearEncounter(){clearInterval(encounterInterval);encounterInterval=null;encounter=null;$('danger').hidden=true;}
function renderPuzzle(){
  const panel=$('puzzle-panel'),puzzle=NODES[state.node]?.puzzle;panel.hidden=!puzzle;panel.replaceChildren();if(!puzzle)return;
  const label=document.createElement('p');label.className='puzzle-label';label.textContent=puzzle.label;panel.append(label);
  const digits=document.createElement('div');digits.className='puzzle-digits';digits.id='puzzle-digits';digits.setAttribute('aria-label','Entered combination');digits.textContent=puzzleValue.padEnd(puzzle.length,'_');panel.append(digits);
  const keypad=document.createElement('div');keypad.className='keypad';
  for(const key of ['1','2','3','4','5','6','7','8','9','⌫','0','↵']){
    const button=document.createElement('button');button.textContent=key;button.setAttribute('aria-label',key==='⌫'?'Delete last digit':key==='↵'?'Try combination':'Digit '+key);button.addEventListener('click',()=>puzzleKey(key));keypad.append(button);
  }panel.append(keypad);
  const status=document.createElement('p');status.id='puzzle-status';status.className='puzzle-status';status.textContent='ENTER '+puzzle.length+' DIGITS · ↵ TO TRY';panel.append(status);
}
function puzzleKey(key){
  if(!playing||modalView||busy)return;const puzzle=NODES[state.node]?.puzzle;if(!puzzle)return;
  if(key==='⌫'){puzzleValue=puzzleValue.slice(0,-1);}
  else if(key==='↵'){
    if(puzzleValue.length!==puzzle.length){$('puzzle-status').textContent='ENTER ALL '+puzzle.length+' DIGITS FIRST';return;}
    const result=solvePuzzle(state,puzzleValue);
    if(result.solved){audio.cue('unlock');applyResult(result);return;}
    state=result.state;save('auto',state);audio.cue('error');puzzleValue='';$('puzzle-status').textContent='NO MOVEMENT. TRY THE CLUE IN YOUR JOURNAL.';
  }else if(/^\d$/.test(key)&&puzzleValue.length<puzzle.length)puzzleValue+=key;
  $('puzzle-digits').textContent=puzzleValue.padEnd(puzzle.length,'_');audio.cue('click');
}
function renderEnding(){
  clearEncounter();playing=false;transitionToken++;$('transition').classList.remove('fade');$('play-screen').hidden=true;$('title-screen').hidden=true;$('ending-screen').hidden=false;$('world-actions').replaceChildren();
  scene.clearScare();scene.setScene(NODES[state.node].scene,state,NODES[state.node]);audio.cancelVoice();audio.setScene(NODES[state.node].scene,state.nerve);
  if(state.ending==='guest'){
    scene.scare('rush');audio.cue('rush');
    if(prefs.scares){const serial=transitionToken;$('ending-screen').hidden=true;setTimeout(()=>{if(serial===transitionToken&&state?.ending==='guest')$('ending-screen').hidden=false;},1600);}
  }else audio.cue('ending');
  const seen=unlockEnding(state.ending),ending=ENDINGS[state.ending];save('auto',state);
  $('ending-screen').innerHTML=`<article class="ending-card"><p class="ending-number">ENDING ${esc(ending.number)} / 08</p><h2 style="color:${ending.color}">${esc(ending.title)}</h2><p class="ending-type">${esc(ending.type)}</p><p class="ending-story">${esc(ending.text)}</p><div class="ending-stats"><span>${state.evidence.length} / ${Object.keys(EVIDENCE).length} RECORDS</span><span>${seen.length} / 8 ENDINGS FOUND</span><span>${esc(clock(state))}</span></div><div class="ending-buttons"><button class="solid-button" data-end="new">BEGIN ANOTHER NIGHT</button><button class="outline-button" data-end="endings">VIEW ENDINGS</button><button class="outline-button" data-end="menu">MAIN MENU</button></div><p class="small-note">DIFFERENT DECISIONS LEAVE DIFFERENT THINGS BEHIND.</p></article>`;
  $('ending-screen').querySelectorAll('[data-end]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.end==='new')beginNew();else if(button.dataset.end==='endings')openModal('endings');else showTitle();}));
}
function openModal(view,extra=null){
  modalOrigin=document.activeElement;modalView=view;audio.pause(true);scene.pause(true);audio.cancelVoice();$('modal-backdrop').hidden=false;
  renderModal(view,extra);renderHotspots();$('modal-close').focus();
}
function closeModal(){
  if(!modalView)return;modalView=null;$('modal-backdrop').hidden=true;audio.pause(false);scene.pause(false);renderHotspots();
  if(modalOrigin?.isConnected)modalOrigin.focus();modalOrigin=null;
}
function modalHeader(title,kicker){$('modal-title').textContent=title;$('modal-kicker').textContent=kicker;}
function renderModal(view,extra=null){
  const body=$('modal-body');body.replaceChildren();
  if(view==='settings'){renderSettings();return;}
  if(view==='journal'){renderJournal(extra||'evidence');return;}
  if(view==='document'){renderDocument(extra);return;}
  if(view==='saves'){renderSaves();return;}
  if(view==='map'){renderMap();return;}
  if(view==='endings'){renderEndings();return;}
  if(view==='case'){renderCase();return;}
  if(view==='reset'){
    modalHeader('Clear this game’s progress?','LOCAL SAVE DATA');
    body.innerHTML='<p class="modal-intro">This removes the autosave, all three manual slots, and discovered endings for The Last Birthday on this browser. Your settings remain.</p><div class="modal-actions"><button class="outline-button" data-action="settings">KEEP MY PROGRESS</button><button class="solid-button danger-button" data-action="reset-confirm">CLEAR GAME PROGRESS</button></div>';return;
  }
  modalHeader('Pause','THE LAST BIRTHDAY · 1983');
  body.innerHTML='<p class="modal-intro">The story and encounter timer are paused.</p><div class="pause-menu"><button data-action="resume">RESUME THE NIGHT</button><button data-action="saves">SAVE / LOAD</button><button data-action="settings">SETTINGS</button><button data-action="journal">EVIDENCE JOURNAL</button><button data-action="fullscreen">TOGGLE FULLSCREEN</button><button data-action="controls">CONTROLS & ACCESSIBILITY</button><button data-action="menu">RETURN TO MAIN MENU</button></div>';
  if(view==='controls'){
    modalHeader('Controls','MOUSE · KEYBOARD · TOUCH');
    body.innerHTML='<dl class="control-table"><dt>MOUSE / TOUCH</dt><dd>Move or drag to aim the light. Click or tap an object or a story choice.</dd><dt>1–7</dt><dd>Choose the corresponding story option.</dd><dt>E / ENTER</dt><dd>Use the pointed-at object. With a single choice, continue.</dd><dt>F</dt><dd>Toggle the flashlight.</dd><dt>J / M</dt><dd>Open the evidence journal / floor plan.</dd><dt>ESC</dt><dd>Pause or close a panel.</dd><dt>PUZZLES</dt><dd>Type digits, Backspace to delete, Enter to try. Touch users have the on-screen keypad.</dd></dl><p class="modal-intro">Reading, opened panels, and a hidden browser tab do not drain the flashlight. Encounters pause inside every panel. Settings include unlimited decision time, reduced motion, large text, and quieter scare reveals.</p><div class="modal-actions"><button class="outline-button" data-action="resume">RETURN TO GAME</button><button class="outline-button" data-action="settings">OPEN SETTINGS</button></div>';
  }
}
function renderSettings(){
  modalHeader('Settings','MAKE THE NIGHT YOURS');
  const toggles=[['sound','Sound','Rain, machinery, spatial knocks, and encounter cues.'],['voices','Optional device voices','Speaks the scripted adult voice lines when your browser supports speech synthesis. Captions always remain visible.'],['scares','Intense scare reveals','Disable for gentler character reveals and quieter impact sounds.'],['timerAssist','Unlimited decision time','Keeps every encounter choice available until you decide.'],['reducedMotion','Reduced motion','Removes camera sway and rapid character movement.'],['largeText','Larger story text','Raises caption size on desktop and mobile.'],['hotspots','Object markers','Show clickable objects in the scene. Story choices always remain available.'],['grain','Film texture','Subtle static film grain over the scene.']];
  $('modal-body').innerHTML=`<p class="modal-intro">Nothing here changes which endings you can reach.</p>${toggles.map(([id,title,note])=>`<div class="setting"><label for="setting-${id}">${title}<small>${note}</small></label><input id="setting-${id}" type="checkbox" data-setting="${id}" ${prefs[id]?'checked':''} ${id==='voices'&&!window.speechSynthesis?'disabled':''}></div>`).join('')}<div class="setting"><label for="setting-volume">Volume<small>Audio starts only after a button press.</small></label><div class="range-control"><input id="setting-volume" data-setting="volume" type="range" min="0" max="100" value="${prefs.volume}"><output id="out-volume">${prefs.volume}%</output></div></div><div class="setting"><label for="setting-brightness">Scene brightness<small>Increase to make objects easier to see.</small></label><div class="range-control"><input id="setting-brightness" data-setting="brightness" type="range" min="65" max="130" value="${prefs.brightness}"><output id="out-brightness">${prefs.brightness}%</output></div></div><div class="modal-actions"><button class="outline-button" data-action="controls">CONTROLS</button><button class="outline-button danger-button" data-action="reset">CLEAR GAME PROGRESS</button></div>`;
  $('modal-body').querySelectorAll('[data-setting]').forEach(input=>input.addEventListener('input',async()=>{
    const id=input.dataset.setting;prefs={...prefs,[id]:input.type==='checkbox'?input.checked:Number(input.value)};storeSettings(prefs);configure();
    const out=$('out-'+id);if(out)out.textContent=prefs[id]+'%';
    if(id==='sound'&&prefs.sound)await audio.start();
  }));
}
function renderJournal(tab){
  modalHeader('June’s field journal',`${state?.evidence.length||0} / ${Object.keys(EVIDENCE).length} RECORDS FOUND`);
  const tabs=`<nav class="panel-tabs"><button data-action="journal" data-tab="evidence" class="${tab==='evidence'?'selected':''}">EVIDENCE</button><button data-action="journal" data-tab="inventory" class="${tab==='inventory'?'selected':''}">INVENTORY</button><button data-action="journal" data-tab="history" class="${tab==='history'?'selected':''}">NOTES</button></nav>`;
  let content='';
  if(tab==='inventory')content=`<div class="inventory-list">${(state?.items||[]).map(id=>`<article class="inventory-card"><strong>${esc(ITEMS[id]?.[0]||id)}</strong><p>${esc(ITEMS[id]?.[1]||'')}</p></article>`).join('')}</div>`;
  else if(tab==='history')content=(state?.history||[]).slice().reverse().slice(0,25).map(h=>`<div class="history-line"><span>${esc(clock({minutes:h.minute}))}</span><strong>${esc(NODES[h.node].title)}</strong></div>`).join('');
  else content=`<p class="modal-intro">Original documents carry more weight than a memory. Open a record to read it.</p><div class="evidence-grid">${(state?.evidence||[]).map(id=>{const record=EVIDENCE[id];return `<button class="evidence-card" data-action="document" data-record="${id}"><small>${esc(record.weight)}</small><strong>${esc(record.title)}</strong><span>${esc(record.date)}</span></button>`;}).join('')}</div>`;
  $('modal-body').innerHTML=tabs+(content||'<p class="empty">The journal is still empty.</p>');
}
function renderDocument(id){
  const record=EVIDENCE[id];if(!record||!state?.evidence.includes(id)){renderJournal('evidence');return;}
  modalHeader('Evidence inspection','ORIGINAL RECORD · '+record.weight);
  $('modal-body').innerHTML=`<article class="document"><span class="eyebrow">${esc(record.date)}</span><h3>${esc(record.title)}</h3><p>${esc(record.body)}</p><div class="document-source">RECOVERED FROM: ${esc(record.source)}</div></article><button class="outline-button" data-action="journal">BACK TO THE JOURNAL</button>`;audio.cue('page');
}
function renderSaves(){
  modalHeader('Save / load','THREE MANUAL SLOTS + AUTOSAVE');
  const rows=['auto','1','2','3'].map(slot=>{
    const stored=load(slot),heading=slot==='auto'?'AUTOSAVE':'SLOT '+slot;
    return `<div class="save-row"><div><strong>${heading}</strong><small>${stored?esc(NODES[stored.state.node].title)+' · '+esc(clock(stored.state))+'<br>'+stored.state.evidence.length+' RECORDS':'EMPTY SLOT'}</small></div><div class="save-controls">${slot!=='auto'?`<button data-action="save-slot" data-slot="${slot}" ${!state?'disabled':''}>SAVE</button>`:''}<button data-action="load-slot" data-slot="${slot}" ${!stored?'disabled':''}>LOAD</button>${slot!=='auto'?`<button data-action="clear-slot" data-slot="${slot}" ${!stored?'disabled':''}>×</button>`:''}</div></div>`;
  }).join('');
  $('modal-body').innerHTML=`<p class="modal-intro">The game saves after every choice. Manual slots let you return to an earlier decision. Each browser keeps its own progress.</p>${rows}<div class="modal-actions"><button class="outline-button" data-action="export-save" ${!state?'disabled':''}>EXPORT CURRENT SAVE</button><button class="outline-button" data-action="import-save">IMPORT SAVE</button><input id="save-import" type="file" accept="application/json,.json" hidden></div><p class="small-note">The downloadable offline edition can import a save exported from the website.</p>`;
  $('save-import').addEventListener('change',async event=>{
    const file=event.target.files?.[0];if(!file)return;if(file.size>1000000){showToast('That file is too large to be a game save.');return;}
    try{const raw=JSON.parse(await file.text()),valid=validateState(raw.state||raw);if(!valid)throw new Error('invalid');save('auto',valid);await resumeFrom('auto');showToast('SAVE IMPORTED.');}catch{showToast('That file is not a compatible Last Birthday save.');}
  });
}
function renderMap(){
  const visited=new Set((state?.visited||[]).map(id=>NODES[id].scene));
  modalHeader('Palace floor plan','A MEMORY OF THE BUILDING');
  $('modal-body').innerHTML=`<p class="modal-intro">The foyer links the birthday hall, arcade, office, and workshop. The workshop opens into the archive; the restored stage and archive both reach the east passage.</p><div class="map-grid">${MAP.map(([id,label])=>`<div class="map-room ${id===NODES[state?.node]?.scene?'current':''} ${visited.has(id)?'':'unknown'}"><strong>${esc(label)}</strong><small>${id===NODES[state?.node]?.scene?'YOU ARE HERE':visited.has(id)?'VISITED':'UNEXPLORED'}</small></div>`).join('')}</div><p class="small-note">Use the scene’s choices to move. Locked routes need a key, a tool, or restored power.</p>`;
}
function renderEndings(){
  const seen=getEndings();modalHeader('The things you left behind',`${seen.length} / 8 ENDINGS DISCOVERED`);
  $('modal-body').innerHTML=`<p class="modal-intro">Each ending follows your decisions. Unfound endings stay hidden.</p><div class="ending-list">${Object.entries(ENDINGS).map(([id,end])=>`<article class="ending-item ${seen.includes(id)?'':'locked'}"><small>ENDING ${end.number}</small><h3>${seen.includes(id)?esc(end.title):'UNDISCOVERED'}</h3><p>${seen.includes(id)?esc(end.type):'A different decision waits inside.'}</p></article>`).join('')}</div><p class="small-note">Completing the record requires original documents, an open escape route, and someone you help get out.</p>`;
}
function renderCase(){
  modalHeader('The Candlewick case','THE STORY · THE PEOPLE · THE GAME');
  $('modal-body').innerHTML=`<p class="modal-intro">October 14, 1983. Photographer June Mercer returns to Candlewick’s Celebration Palace before demolition destroys the remaining records of the 1973 fire. Her brother Robin died there at seven. The question is who concealed the cause—and what is still walking inside.</p><p class="small-note">A first-person visual novel with original environment art, animated 2.5D scenes, object interactions, procedural sound, device-voice support, and eight endings. Move through selectable routes and object hotspots. All supplied reference images are excluded from this game.</p>${CHARACTERS.map(p=>`<article class="character"><h3>${esc(p.name)}</h3><small>${esc(p.role)}</small><p>${esc(p.text)}</p></article>`).join('')}<article class="character"><h3>PRODUCTION NOTES</h3><p>Created for Danielle. Original environment and character assets generated for this project. All game systems run locally in the browser. Optional voices use the device’s speech engine; they are not actor recordings. Mr. Morrow has no spoken lines in 1983.</p></article><div class="modal-actions"><button class="outline-button" data-action="controls">HOW TO PLAY</button></div>`;
}

$('modal-body').addEventListener('click',async event=>{
  const button=event.target.closest('button[data-action]');if(!button||button.disabled)return;
  const action=button.dataset.action;audio.cue('click');
  if(action==='resume'){closeModal();return;}
  if(action==='menu'){showTitle();return;}
  if(action==='document'){modalView='document';renderDocument(button.dataset.record);return;}
  if(action==='journal'){modalView='journal';renderJournal(button.dataset.tab||'evidence');return;}
  if(action==='save-slot'){if(!state)return;const durable=save(button.dataset.slot,state);renderSaves();showToast(durable?'SLOT SAVED.':'SLOT SAVED FOR THIS SESSION. EXPORT A BACKUP TO KEEP IT.');return;}
  if(action==='load-slot'){await resumeFrom(button.dataset.slot);return;}
  if(action==='clear-slot'){clearSlot(button.dataset.slot);renderSaves();return;}
  if(action==='export-save'){
    if(!state)return;const blob=new Blob([JSON.stringify({game:'THE LAST BIRTHDAY',state},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='LAST_BIRTHDAY_SAVE.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return;
  }
  if(action==='import-save'){$('save-import').click();return;}
  if(action==='fullscreen'){
    try{if(document.fullscreenElement)await document.exitFullscreen();else await $('game').requestFullscreen();}catch{showToast('Fullscreen is unavailable here.');}return;
  }
  if(action==='reset-confirm'){clearProgress();state=null;showTitle();showToast('GAME PROGRESS CLEARED.');return;}
  modalView=action;renderModal(action);
});
$('modal-close').addEventListener('click',closeModal);
$('modal-backdrop').addEventListener('click',event=>{if(event.target===$('modal-backdrop'))closeModal();});
$('new-game').addEventListener('click',beginNew);$('enter-door').addEventListener('click',beginNew);
$('continue-game').addEventListener('click',()=>resumeFrom('auto'));
$('title-settings').addEventListener('click',()=>openModal('settings'));$('title-endings').addEventListener('click',()=>openModal('endings'));$('title-credits').addEventListener('click',()=>openModal('case'));
$('sound-toggle').addEventListener('click',async()=>{if(!audio.enabled){prefs.sound=true;await audio.start();}else prefs.sound=!prefs.sound;storeSettings(prefs);configure();});
$('journal-button').addEventListener('click',()=>openModal('journal'));$('map-button').addEventListener('click',()=>openModal('map'));$('save-button').addEventListener('click',()=>openModal('saves'));$('pause-button').addEventListener('click',()=>openModal('pause'));$('flashlight-button').addEventListener('click',toggleTorch);
$('hide-dialogue').addEventListener('click',()=>{const collapsed=$('narrative').classList.toggle('collapsed');$('hide-dialogue').textContent=collapsed?'+':'−';$('hide-dialogue').setAttribute('aria-label',collapsed?'Expand story text':'Collapse story text');});
$('game').addEventListener('pointermove',event=>{if(modalView)return;scene.point(event.clientX/window.innerWidth,event.clientY/window.innerHeight);});
window.addEventListener('resize',()=>{renderHotspots();});
document.addEventListener('visibilitychange',()=>{audio.pause(document.hidden||!!modalView);scene.pause(document.hidden||!!modalView);if(encounter)encounter.last=performance.now();});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();if(modalView)closeModal();else if(playing)openModal('pause');return;}
  if(modalView){
    if(event.key==='Tab'){
      const focusable=[...$('modal').querySelectorAll('button:not([disabled]), input:not([disabled]):not([hidden])')];
      if(focusable.length){const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
    }return;
  }
  if(!playing||event.repeat||/INPUT|TEXTAREA/.test(event.target.tagName))return;
  const key=event.key.toLowerCase();
  if(key==='enter'&&event.target.tagName==='BUTTON')return;
  if(key==='j'){openModal('journal');return;}if(key==='m'){openModal('map');return;}if(key==='f'){toggleTorch();return;}
  if(NODES[state.node].puzzle){if(/^\d$/.test(key)||key==='enter'||key==='backspace'){event.preventDefault();puzzleKey(key==='enter'?'↵':key==='backspace'?'⌫':key);}return;}
  if(/^[1-7]$/.test(key)){event.preventDefault();const choice=NODES[state.node].choices[Number(key)-1];if(choice)act(choice.id);return;}
  if(key==='e'||key==='enter'){
    const choices=NODES[state.node].choices.filter(c=>permitted(state,c.requires));if(hoverChoice){event.preventDefault();act(hoverChoice);}else if(choices.length===1){event.preventDefault();act(choices[0].id);}
  }
});

configure();refreshContinue();
// Preload all original scene plates, independently of story navigation.
Promise.allSettled(Object.values(SCENES).map(s=>scene.load(s.image))).then(()=>renderHotspots());

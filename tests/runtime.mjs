import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { combinedSource } from './bundle.mjs';
import { environment } from './dom.mjs';
import { ROUTES, ENTRY } from './routes.mjs';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const env=environment(html),ctx=vm.createContext(env.globals);
vm.runInContext(combinedSource()+`\nglobalThis.runtime={beginNew,act,showTitle,openModal,closeModal,puzzleKey,resumeFrom,renderHotspots,audio,scene,get state(){return state;},get prefs(){return prefs;},get modal(){return modalView;},get encounter(){return encounter;}};`,ctx);
const runtime=ctx.runtime,$=id=>env.document.getElementById(id),settle=()=>new Promise(resolve=>setImmediate(resolve));
await settle();assert.equal($('continue-game').disabled,true);
for(const [ending,steps]of Object.entries(ROUTES)){
 runtime.showTitle();await $('enter-door').click();await settle();assert.equal(runtime.state.node,'arrival');
 for(const action of steps){
  if(action.startsWith('=')){for(const digit of action.slice(1))runtime.puzzleKey(digit);runtime.puzzleKey('↵');}
  else{const button=$('choices').querySelector(`button[data-choice="${action}"]`);assert.ok(button,`${runtime.state.node} -> ${action}: missing UI button`);assert.equal(button.disabled,false,`${runtime.state.node} -> ${action}: UI unexpectedly locked`);await button.click();}
  env.advance(250);await settle();
 }
 assert.equal(runtime.state.ending,ending);env.advance(1800);assert.equal($('ending-screen').hidden,false);
}
console.log('PASS: all 8 endings completed through actual application choice/keypad handlers.');

runtime.showTitle();await $('new-game').click();for(const action of ENTRY){runtime.act(action);}await settle();
await $('journal-button').click();assert.equal(runtime.modal,'journal');assert.ok($('modal-body').querySelector('[data-record="invitation"]'));
await $('modal-body').querySelector('[data-record="invitation"]').click();assert.equal(runtime.modal,'document');assert.match($('modal-body').textContent,/clearance/i);
await $('modal-close').click();assert.equal(runtime.modal,null);
await $('map-button').click();assert.equal($('modal-body').querySelectorAll('.map-room').length,9);await $('modal-close').click();
await $('save-button').click();await $('modal-body').querySelector('[data-action="save-slot"][data-slot="1"]').click();runtime.closeModal();
const savedNode=runtime.state.node;runtime.act('register');assert.notEqual(runtime.state.node,savedNode);await runtime.resumeFrom('1');assert.equal(runtime.state.node,savedNode);
await $('pause-button').click();await $('modal-body').querySelector('[data-action="settings"]').click();
const assist=$('setting-timerAssist');assist.checked=true;await assist.dispatch('input');assert.equal(runtime.prefs.timerAssist,true);await $('modal-close').click();
const lit=runtime.state.flashlight;await $('flashlight-button').click();assert.equal(runtime.state.flashlight,!lit);
await $('hide-dialogue').click();assert.equal($('narrative').classList.contains('collapsed'),true);await $('hide-dialogue').click();
runtime.act('arcade');runtime.act('search');runtime.act('look');assert.equal(runtime.state.node,'arcade_look');env.advance(20000);assert.equal(runtime.state.node,'arcade_look','Time assist must prevent timeout.');
runtime.openModal('settings');const off=$('setting-timerAssist');off.checked=false;await off.dispatch('input');runtime.closeModal();
runtime.openModal('journal');const remaining=runtime.encounter.remaining;env.advance(20000);assert.equal(runtime.encounter.remaining,remaining,'Opened panels must pause encounter.');runtime.closeModal();
env.document.hidden=true;await env.document.dispatch('visibilitychange');env.advance(20000);assert.equal(runtime.encounter.remaining,remaining,'Hidden browser tabs must pause encounter.');env.document.hidden=false;await env.document.dispatch('visibilitychange');
env.advance(13000);assert.equal(runtime.state.node,'arcade_run','Timeout must select the declared fallback exactly once.');
console.log('PASS: journal inspection, map, save/load, settings, flashlight, collapse, time assist, pause, hidden-tab handling, and timeout.');

for(const [w,h]of [[1366,768],[412,915],[915,412]]){
 env.window.innerWidth=w;env.window.innerHeight=h;env.window.dispatch('resize');
 for(const id of ['exterior','foyer','arcade','office','stage']){
  await runtime.scene.setScene(id,runtime.state,{scene:id});
  runtime.scene.point(.2,.7);runtime.scene.draw(env.now+100);env.advance(35);
  for(const kind of ['sighting','hand','glass','rush']){runtime.scene.scare(kind);runtime.scene.draw(env.now+100);env.advance(35);}
  const point=runtime.scene.project([.5,.5]);assert.ok(point.x>=0&&point.x<=w&&point.y>=0&&point.y<=h);
 }
}
for(const cue of ['click','page','door','camera','error','unlock','phone','power','sighting','hand','glass','rush','ending'])runtime.audio.cue(cue);
const spoken=[];env.window.speechSynthesis={cancel(){},getVoices:()=>[{name:'David',lang:'en-US'},{name:'Samantha',lang:'en-US'}],speak:u=>spoken.push(u)};ctx.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
runtime.audio.configure({...runtime.prefs,voices:true,sound:true});runtime.audio.voice('This must never be spoken.','MR. MORROW');assert.equal(spoken.length,0);runtime.audio.voice('The exit first.','JUNE MERCER');assert.equal(spoken.length,1);
console.log('PASS: renderer calls at desktop, portrait, and landscape sizes; all sound cues; mute-mascot speech guard.');
assert.ok(env.calls.includes('drawImage'));assert.ok(env.calls.includes('createRadialGradient')===false); // Gradients are separately stubbed.
const offline=fs.readFileSync(new URL('../PLAY_OFFLINE.html',import.meta.url),'utf8');assert.ok(!offline.includes('src="./js/app.js"'));assert.ok(!offline.includes('href="./styles.css"'));assert.ok(offline.includes('window.GAME_ASSETS='));
const source=offline.match(/<script>([\s\S]*)<\/script>/)[1];const independent=environment(html),offlineCtx=vm.createContext(independent.globals);vm.runInContext(source,offlineCtx);await settle();await independent.document.getElementById('new-game').click();await settle();assert.ok(independent.document.getElementById('story-text').textContent.includes('October 14'));
console.log('PASS: standalone offline HTML boot and new-game initialization without imports or asset requests.');

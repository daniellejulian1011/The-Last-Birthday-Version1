import assert from 'node:assert/strict';
import { NODES, EVIDENCE, ITEMS } from '../js/story.js';
import { startGame, enterNode, choose, solvePuzzle, validateState, permitted, clock } from '../js/engine.js';
import { ROUTES, ENTRY } from './routes.mjs';

function play(steps){let s=startGame().state;for(const action of steps){try{s=(action.startsWith('=')?solvePuzzle(s,action.slice(1)):choose(s,action)).state;}catch(e){throw new Error(`At ${s.node}, action ${action}: ${e.message}`);}}return s;}
for(const [ending,route]of Object.entries(ROUTES)){const s=play(route);assert.equal(s.ending,ending);assert.ok(validateState(s));console.log(`PASS: ${ending} ending (${route.length} actual interactions).`);}
const base=play(ENTRY);assert.throws(()=>choose(base,'stage'),/locked/);assert.throws(()=>choose(base,'invented'),/Invalid/);
let safe=play([...ENTRY,'office','search','safe']);const wrong=solvePuzzle(safe,'0000');assert.equal(wrong.solved,false);assert.equal(wrong.state.node,'office_safe');assert.equal(wrong.state.puzzleAttempts.office_safe,1);assert.equal(wrong.state.flags.safeOpen,undefined);assert.equal(safe.puzzleAttempts.office_safe,undefined);
const correct=solvePuzzle(wrong.state,'2 7 1 0');assert.equal(correct.solved,true);assert.equal(correct.state.node,'safe_open');assert.equal(correct.state.puzzleAttempts.office_safe,2);
let charged=play([...ENTRY,'workshop','search','battery','back']);assert.equal(charged.battery,99);assert.throws(()=>choose(charged,'battery'),/locked/);
const repeat=enterNode(charged,'batteries');assert.equal(repeat.state.battery,99,'One-time battery pickup must not regenerate.');
assert.ok(permitted(base,{any:[{items:['torch']},{items:['key']}]}));assert.ok(!permitted(base,{any:[{items:['key']},{flags:['power']}]}));
assert.equal(clock({minutes:0}),'08:12 PM');assert.equal(clock({minutes:48}),'09:00 PM');
assert.equal(validateState(null),null);assert.equal(validateState({...base,version:99}),null);assert.equal(validateState({...base,node:'missing'}),null);assert.equal(validateState({...base,battery:NaN}),null);assert.equal(validateState({...base,evidence:['unknown']}),null);assert.equal(validateState({...base,items:['unknown']}),null);
const checked=validateState({...base,battery:10000,noise:-50,trust:100,flags:{good:true,bad:'true'}});assert.equal(checked.battery,100);assert.equal(checked.noise,0);assert.equal(checked.trust,5);assert.equal(checked.flags.bad,undefined);
assert.throws(()=>choose(play(ROUTES.walk),'leave'),/Invalid|ended/);

// Exercise every declared edge using a state satisfying its rule; this catches malformed effects.
const flags=new Set();
function findFlags(rule){for(const k of ['flags','notFlags'])for(const id of rule?.[k]||[])flags.add(id);for(const r of rule?.any||[])findFlags(r);}
for(const node of Object.values(NODES)){for(const id of Object.keys(node.enter?.flags||{}))flags.add(id);for(const c of node.choices){findFlags(c.requires);for(const id of Object.keys(c.effects?.flags||{}))flags.add(id);}}
let edges=0;
for(const [id,node]of Object.entries(NODES))for(const c of node.choices){const s={...startGame().state,node:id,flags:Object.fromEntries([...flags].map(id=>[id,true])),items:Object.keys(ITEMS),evidence:Object.keys(EVIDENCE),trust:5,visited:[]};for(const f of c.requires?.notFlags||[])s.flags[f]=false;assert.ok(permitted(s,c.requires));const result=choose(s,c.id);assert.ok(validateState(result.state),`${id}.${c.id}`);assert.equal(result.state.node,c.to);edges++;}
console.log(`PASS: all ${edges} choice transitions, puzzle attempts, one-time effects, resource bounds, and corrupted-save rejection.`);

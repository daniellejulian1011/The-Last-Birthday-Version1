import { validateState } from './engine.js';
const PREFIX='lastBirthday.1983.v1.';
const memory=new Map();
export const DEFAULT_SETTINGS={sound:true,volume:45,voices:false,brightness:100,grain:true,hotspots:true,scares:true,timerAssist:false,reducedMotion:false,largeText:false};
function read(key){try{const raw=localStorage.getItem(PREFIX+key);return raw?JSON.parse(raw):memory.get(key)||null;}catch{return memory.get(key)||null;}}
function write(key,value){memory.set(key,value);try{localStorage.setItem(PREFIX+key,JSON.stringify(value));return true;}catch{return false;}}
export function settings(){const raw=read('settings')||{},s={...DEFAULT_SETTINGS};for(const k of Object.keys(s)){if(typeof raw[k]===typeof s[k])s[k]=raw[k];}s.volume=Math.max(0,Math.min(100,Number.isFinite(s.volume)?s.volume:45));s.brightness=Math.max(65,Math.min(130,Number.isFinite(s.brightness)?s.brightness:100));return s;}
export function storeSettings(s){return write('settings',s);}
export function save(slot,state){return write('save.'+slot,{state,savedAt:new Date().toISOString()});}
export function load(slot){const raw=read('save.'+slot);if(!raw)return null;const state=validateState(raw.state);return state?{state,savedAt:raw.savedAt||''}:null;}
export function clearSlot(slot){memory.delete('save.'+slot);try{localStorage.removeItem(PREFIX+'save.'+slot);}catch{}}
export function getEndings(){const raw=read('endings');return Array.isArray(raw)?raw.filter(x=>typeof x==='string'):[];}
export function unlockEnding(id){const endings=getEndings();if(!endings.includes(id))endings.push(id);write('endings',endings);return endings;}
export function clearProgress(){for(const key of ['save.auto','save.1','save.2','save.3','endings']){memory.delete(key);try{localStorage.removeItem(PREFIX+key);}catch{}}}

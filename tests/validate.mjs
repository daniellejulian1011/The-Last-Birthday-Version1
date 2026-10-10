import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { NODES, SCENES, ENDINGS, EVIDENCE, ITEMS } from '../js/story.js';
const root=path.resolve(import.meta.dirname,'..');
const seen=new Set(),queue=['arrival'];let choiceCount=0;
while(queue.length){const id=queue.shift();if(seen.has(id))continue;seen.add(id);const node=NODES[id];assert.ok(node,`Missing ${id}`);for(const c of node.choices)queue.push(c.to);if(node.puzzle)queue.push(node.puzzle.to);}
assert.equal(seen.size,Object.keys(NODES).length,'Every story node must be reachable in the graph.');
const known=new Set(Object.keys(NODES));
function checkEffect(effect,context){
  for(const id of effect?.items||[])assert.ok(ITEMS[id],`${context}: item ${id}`);
  for(const id of effect?.evidence||[])assert.ok(EVIDENCE[id],`${context}: evidence ${id}`);
  for(const id of effect?.removeItems||[])assert.ok(ITEMS[id]);
  for(const id of effect?.removeEvidence||[])assert.ok(EVIDENCE[id]);
  for(const key of ['minutes','battery','nerve','noise','trust'])if(effect?.[key]!=null)assert.ok(Number.isFinite(effect[key]));
}
for(const [id,node]of Object.entries(NODES)){
  assert.equal(id,node.id);assert.ok(SCENES[node.scene],`${id}: unknown scene`);assert.ok(node.text&&node.title&&node.objective);
  assert.ok(node.chapter>=1&&node.chapter<=4);assert.equal(new Set(node.choices.map(c=>c.id)).size,node.choices.length,`${id}: duplicate choice id`);
  checkEffect(node.enter,id);
  for(const c of node.choices){choiceCount++;assert.ok(known.has(c.to),`${id}: missing target ${c.to}`);assert.ok(c.label);checkEffect(c.effects,id);if(c.point)assert.ok(c.point.length===2&&c.point.every(v=>v>=0&&v<=1));}
  if(node.timed){assert.ok(node.choices.some(c=>c.id===node.timeout));assert.ok(node.timed>=7);}
  if(node.puzzle){assert.match(node.puzzle.code,/^\d+$/);assert.equal(node.puzzle.code.length,node.puzzle.length);assert.ok(known.has(node.puzzle.to));}
  if(node.ending)assert.ok(ENDINGS[node.ending]);
  assert.ok(!(/MORROW/.test(node.speaker)&&node.voice),`${id}: the mute mascot must never have a voiced line`);
}
assert.equal(Object.keys(ENDINGS).length,8);assert.equal(Object.values(NODES).filter(n=>n.ending).length,8);
for(const scene of Object.values(SCENES))assert.ok(fs.existsSync(path.join(root,scene.image)),`Missing ${scene.image}`);
for(const name of ['morrow.webp','hand.webp','favicon.svg'])assert.ok(fs.existsSync(path.join(root,'assets',name)));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'Duplicate HTML id');
for(const src of [...html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)].map(m=>m[1]))assert.ok(fs.existsSync(path.join(root,src)),`Missing HTML asset ${src}`);
for(const file of fs.readdirSync(path.join(root,'js'))){const code=fs.readFileSync(path.join(root,'js',file),'utf8');for(const m of code.matchAll(/from ['"]([^'"]+)['"]/g))assert.ok(fs.existsSync(path.resolve(root,'js',m[1])));assert.ok(!/https?:\/\//.test(code),'Runtime must not depend on external services.');}
const forbidden=fs.readdirSync(path.join(root,'assets')).filter(n=>/1000050/.test(n));assert.deepEqual(forbidden,[]);
console.log(`PASS: ${known.size} reachable nodes, ${choiceCount} linked choices, 8 endings, all game assets and imports.`);

import assert from 'node:assert/strict';
import fs from 'node:fs';
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
// A lexical/declaration check. Actual CSS interpretation remains a browser QA task.
let quote=null,escape=false,depth=0,paren=0,clean='';
for(let i=0;i<css.length;i++){
 const char=css[i];
 if(quote){if(escape){escape=false;}else if(char==='\\'){escape=true;}else if(char===quote){quote=null;}clean+=' ';continue;}
 if(char==='"'||char==="'"){quote=char;clean+=' ';continue;}
 if(char==='/'&&css[i+1]==='*'){const end=css.indexOf('*/',i+2);assert.ok(end>=0);i=end+1;continue;}
 if(char==='{')depth++;if(char==='}')depth--;assert.ok(depth>=0,'Unmatched CSS closing brace');
 if(char==='(')paren++;if(char===')')paren--;assert.ok(paren>=0,'Unmatched CSS closing parenthesis');
 clean+=char;
}
assert.equal(depth,0);assert.equal(paren,0);assert.equal(quote,null);
let blocks=0,declarations=0;
for(const match of clean.matchAll(/\{([^{}]*)\}/g)){
 blocks++;const content=match[1];let start=0,nesting=0;
 for(let i=0;i<=content.length;i++){
  if(content[i]==='(')nesting++;if(content[i]===')')nesting--;
  if((content[i]===';'&&nesting===0)||i===content.length){const declaration=content.slice(start,i).trim();start=i+1;if(!declaration)continue;assert.match(declaration,/^(?:--[\w-]+|-?[a-zA-Z][\w-]*)\s*:/,`Malformed declaration: ${declaration}`);declarations++;}
 }
}
assert.ok(blocks>100&&declarations>400);assert.ok(css.includes('[hidden]'));assert.ok(css.includes('orientation:portrait')&&css.includes('orientation:landscape'));
console.log(`PASS: CSS lexical structure and ${declarations} declarations in ${blocks} rule blocks, including responsive rules.`);

// A deterministic DOM/audio harness, not a substitute for real browser visual QA.
const decode=s=>s.replace(/&(?:amp|lt|gt|quot|#39);/g,x=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[x]));
export class TestElement {
  constructor(tag,doc){this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.children=[];this.parentNode=null;this.attrs={};this.dataset=new Proxy({}, {set:(obj,key,value)=>{obj[key]=String(value);this.attrs['data-'+String(key).replace(/[A-Z]/g,c=>'-'+c.toLowerCase())]=String(value);return true;}});this.style={};this.listeners={};this.hidden=false;this.disabled=false;this.checked=false;this.value='';this._text='';this.className='';this.id='';}
  get classList(){const e=this;return{contains:v=>e.className.split(/\s+/).includes(v),add(...vs){e.className=[...new Set([...e.className.split(/\s+/).filter(Boolean),...vs])].join(' ');},remove(...vs){e.className=e.className.split(/\s+/).filter(v=>!vs.includes(v)).join(' ');},toggle(v,force){const yes=force==null?!this.contains(v):force;if(yes)this.add(v);else this.remove(v);return yes;}};}
  set textContent(v){this._text=String(v);this.replaceChildren();}
  get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
  set innerHTML(v){this._text='';this.replaceChildren();parse(String(v),this,this.ownerDocument);}
  get innerHTML(){return this.textContent;}
  get isConnected(){let p=this;while(p){if(p===this.ownerDocument.root)return true;p=p.parentNode;}return false;}
  setAttribute(k,v){this.attrs[k]=String(v);if(k==='id')this.id=String(v);if(k==='class')this.className=String(v);if(k==='type')this.type=String(v);if(k==='value')this.value=String(v);if(['hidden','disabled','checked'].includes(k))this[k]=true;if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,x)=>x.toUpperCase())]=String(v);}
  getAttribute(k){return this.attrs[k]??null;}
  append(...elements){for(let e of elements){if(typeof e==='string'){const text=new TestElement('#text',this.ownerDocument);text._text=e;e=text;}if(e.parentNode)e.remove();e.parentNode=this;this.children.push(e);}}
  replaceChildren(...elements){for(const c of this.children)c.parentNode=null;this.children=[];this.append(...elements);}
  remove(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(c=>c!==this);this.parentNode=null;}}
  matches(selector){
    const exclusions=[...selector.matchAll(/:not\(([^)]+)\)/g)].map(m=>m[1]);selector=selector.replace(/:not\([^)]+\)/g,'').trim();
    if(exclusions.some(x=>this.matches(x)))return false;
    const tag=selector.match(/^[\w-]+/);if(tag&&this.tagName!==tag[0].toUpperCase())return false;
    const id=selector.match(/#([\w-]+)/);if(id&&this.id!==id[1])return false;
    for(const m of selector.matchAll(/\.([\w-]+)/g))if(!this.classList.contains(m[1]))return false;
    for(const m of selector.matchAll(/\[([\w-]+)(?:=["']?([^\]"']+)["']?)?\]/g)){
      const [_,attr,value]=m;let actual=attr==='disabled'?this.disabled?true:null:attr==='hidden'?this.hidden?true:null:attr==='id'?this.id:this.attrs[attr];
      if(actual==null||actual===false)return false;if(value!=null&&String(actual)!==value)return false;
    }return true;
  }
  closest(selector){let e=this;while(e){if(e.matches(selector))return e;e=e.parentNode;}return null;}
  querySelectorAll(selector){const selectors=selector.split(',').map(x=>x.trim());const out=[];const scan=e=>{for(const child of e.children){if(selectors.some(s=>child.matches(s)))out.push(child);scan(child);}};scan(this);return out;}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  addEventListener(type,handler){(this.listeners[type]||=[]).push(handler);}
  async dispatch(type,init={}){
    const event={type,target:this,defaultPrevented:false,repeat:false,preventDefault(){this.defaultPrevented=true;},...init};
    let e=this;const pending=[];while(e){for(const handler of e.listeners[type]||[])pending.push(handler(event));e=e.parentNode;}await Promise.all(pending);return event;
  }
  async click(){if(this.disabled)return;this.focus();return this.dispatch('click');}
  focus(){this.ownerDocument.activeElement=this;}
  getContext(){return this.ownerDocument.context2d;}
  async requestFullscreen(){this.ownerDocument.fullscreenElement=this;}
}
function parse(html,parent,doc){
  const stack=[parent],voids=new Set(['AREA','BASE','BR','COL','EMBED','HR','IMG','INPUT','LINK','META','PARAM','SOURCE','TRACK','WBR']);
  for(const token of html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g)||[]){
    if(/^<!/.test(token))continue;
    if(/^<\//.test(token)){const tag=token.slice(2,-1).trim().toUpperCase();while(stack.length>1){const e=stack.pop();if(e.tagName===tag)break;}continue;}
    if(token[0]==='<'){
      const m=token.match(/^<([\w-]+)/);if(!m)continue;const el=doc.createElement(m[1]);
      for(const a of token.slice(m[0].length,-1).matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))el.setAttribute(a[1],decode(a[2]??a[3]??a[4]??''));
      stack.at(-1).append(el);if(!voids.has(el.tagName)&&!token.endsWith('/>'))stack.push(el);
    }else{const el=doc.createElement('#text');el._text=decode(token);stack.at(-1).append(el);}
  }
}
export function environment(html){
  let now=0,id=0;const timers=new Map(),frames=new Map(),memory=new Map(),calls=[];
  const document={hidden:false,fullscreenElement:null,activeElement:null,listeners:{},createElement(tag){return new TestElement(tag,this);},getElementById(id){return this.root.querySelectorAll('[id]').find(e=>e.id===id)||null;},addEventListener(type,fn){(this.listeners[type]||=[]).push(fn);},async dispatch(type,event={}){event={target:this.body,preventDefault(){},...event};for(const fn of this.listeners[type]||[])await fn(event);},async exitFullscreen(){this.fullscreenElement=null;}};
  document.root=new TestElement('document',document);parse(html,document.root,document);document.body=document.root.querySelector('body');document.documentElement=document.root.querySelector('html');document.activeElement=document.body;
  const methods=['setTransform','clearRect','fillRect','beginPath','moveTo','lineTo','stroke','arc','fill','save','restore','translate','rotate','drawImage'];
  const context2d={globalAlpha:1,globalCompositeOperation:'source-over',createLinearGradient(){return{addColorStop(){}};},createRadialGradient(){return{addColorStop(){}};}};
  for(const method of methods)context2d[method]=(...args)=>{for(const a of args)if(typeof a==='number'&&!Number.isFinite(a))throw new Error(`Canvas ${method}: nonfinite argument`);calls.push(method);};document.context2d=context2d;
  const param=()=>({value:0,setValueAtTime(v){if(!Number.isFinite(v))throw new Error('Invalid audio value');this.value=v;},linearRampToValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){if(v<=0)throw new Error('Invalid exponential ramp');this.value=v;},setTargetAtTime(v){this.value=v;}});
  class TestAudioContext{
    constructor(){this.sampleRate=8000;this.destination={};this.state='running';}
    get currentTime(){return now/1000;}
    node(){return{connect(){},disconnect(){},start(){},stop(){},gain:param(),frequency:param(),pan:param()};}
    createGain(){return this.node();}createOscillator(){return this.node();}createBiquadFilter(){return this.node();}createStereoPanner(){return this.node();}createBufferSource(){return this.node();}
    createBuffer(channels,length,rate){if(!Number.isInteger(length)||length<=0)throw new Error('Invalid audio buffer');const data=new Float32Array(length);return{getChannelData:()=>data};}
    async resume(){this.state='running';}async close(){this.state='closed';}
  }
  const window={innerWidth:1366,innerHeight:768,devicePixelRatio:1,listeners:{},AudioContext:TestAudioContext,addEventListener(type,fn){(this.listeners[type]||=[]).push(fn);},dispatch(type,event={}){for(const fn of this.listeners[type]||[])fn(event);}};
  class TestImage{constructor(){this.width=1672;this.height=941;}set src(value){this._src=value;if(/morrow/.test(value)){this.width=1024;this.height=1536;}if(/hand/.test(value)){this.width=1536;this.height=1024;}queueMicrotask(()=>this.onload?.());}get src(){return this._src;}}
  const addTimer=(fn,ms,interval)=>{const key=++id;timers.set(key,{fn,due:now+ms,ms,interval});return key;};
  const globals={window,document,Image:TestImage,console,Math,Date,JSON,Set,Map,Array,Object,String,Number,Boolean,RegExp,Promise,Float32Array,Blob,URL,performance:{now:()=>now},localStorage:{getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,value),removeItem:key=>memory.delete(key)},setTimeout:(fn,ms=0)=>addTimer(fn,ms,false),clearTimeout:key=>timers.delete(key),setInterval:(fn,ms)=>addTimer(fn,ms,true),clearInterval:key=>timers.delete(key),requestAnimationFrame:fn=>{const key=++id;frames.set(key,fn);return key;},cancelAnimationFrame:key=>frames.delete(key)};
  function advance(ms){const end=now+ms;let operations=0;while(true){const next=[...timers].filter(([,t])=>t.due<=end).sort((a,b)=>a[1].due-b[1].due)[0];if(!next)break;const [key,t]=next;now=t.due;if(t.interval)t.due+=t.ms;else timers.delete(key);t.fn();if(++operations>10000)throw new Error('Timer loop');}now=end;}
  return{globals,document,window,advance,memory,calls,get now(){return now;}};
}

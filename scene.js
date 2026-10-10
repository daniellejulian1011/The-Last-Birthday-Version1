import { SCENES } from './story.js';

export class SceneDirector {
  constructor(canvas, onError=()=>{}) {
    this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.images=new Map();
    this.id='exterior'; this.playing=false; this.state=null; this.node=null;
    this.settings={brightness:100,reducedMotion:false,scares:true}; this.pointer={x:.65,y:.5};
    this.look={x:.5,y:.5}; this.event=null; this.frame=0; this.lastTime=0; this.pausedAt=null;
    this.pausedTotal=0; this.onError=onError; this.failed=false; this.loadSerial=0;
    this.rain=Array.from({length:90},()=>({x:Math.random(),y:Math.random(),v:.4+Math.random(),length:5+Math.random()*14}));
    this.dust=Array.from({length:28},()=>({x:Math.random(),y:Math.random(),phase:Math.random()*6.28,r:.5+Math.random()*1.2}));
    this.resize();
    window.addEventListener('resize',()=>this.resize());
    this.load('assets/morrow.webp').then(im=>this.morrow=im).catch(()=>{});
    this.load('assets/hand.webp').then(im=>this.hand=im).catch(()=>{});
    this.setScene('exterior');
    if(this.ctx) this.frame=requestAnimationFrame(t=>this.draw(t));
    else this.onError('The scene renderer is unavailable. The story controls still work.');
  }
  load(src) {
    const resolved=window.GAME_ASSETS?.[src] || src;
    if(this.images.has(src))return this.images.get(src);
    const promise=new Promise((resolve,reject)=>{
      const im=new Image(); im.onload=()=>resolve(im); im.onerror=()=>reject(new Error(src)); im.src=resolved;
    });
    this.images.set(src,promise); return promise;
  }
  async setScene(id,state=null,node=null) {
    this.id=id; this.state=state; this.node=node; this.playing=!!state && !state.ending;
    const serial=++this.loadSerial;
    try { const image=await this.load(SCENES[id].image); if(serial===this.loadSerial)this.background=image; }
    catch { if(serial===this.loadSerial){this.background=null;this.onError('This scene’s art could not load. You can continue using the story choices.');} }
  }
  update(state,node) { this.state=state;this.node=node;this.playing=!!state&&!state.ending; }
  configure(settings) { this.settings=settings; }
  point(x,y) { this.pointer={x:Math.max(0,Math.min(1,x)),y:Math.max(0,Math.min(1,y))}; }
  pause(paused) {
    if(paused && this.pausedAt===null)this.pausedAt=performance.now();
    if(!paused && this.pausedAt!==null){this.pausedTotal+=performance.now()-this.pausedAt;this.pausedAt=null;}
  }
  scare(kind) {
    if(!this.settings.scares)return;
    this.event={kind,start:this.timeNow(),duration:kind==='rush'?2.8:4.5};
  }
  clearScare(){this.event=null;}
  timeNow(){return ((this.pausedAt===null?performance.now():this.pausedAt)-this.pausedTotal)/1000;}
  resize(){
    this.w=window.innerWidth;this.h=window.innerHeight;
    const dpr=Math.min(window.devicePixelRatio||1,1.65,2200/this.w);
    this.canvas.width=Math.round(this.w*dpr);this.canvas.height=Math.round(this.h*dpr);this.dpr=dpr;
  }
  project(point){
    const im=this.background,ratio=im?im.width/im.height:16/9;
    // Portrait maintains the gameplay objects inside the camera rather than cropping them away.
    if(this.w/this.h<.9) {
      const dw=this.w*1.03,dh=dw/ratio;
      return{x:(this.w-dw)/2+point[0]*dw,y:this.h*.10+point[1]*dh};
    }
    const scale=Math.max(this.w/(im?.width||1600),this.h/(im?.height||900))*1.035;
    const dw=(im?.width||1600)*scale,dh=dw/ratio;
    return{x:(this.w-dw)/2+point[0]*dw,y:(this.h-dh)/2+point[1]*dh};
  }
  draw(ts){
    this.frame=requestAnimationFrame(t=>this.draw(t));
    if(ts-this.lastTime<32)return;
    const dt=Math.min(.05,(ts-this.lastTime)/1000||.033);this.lastTime=ts;
    const c=this.ctx,w=this.w,h=this.h,t=this.timeNow();if(!c)return;
    c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,w,h);c.fillStyle='#101719';c.fillRect(0,0,w,h);
    const reduced=this.settings.reducedMotion;
    this.look.x+=(this.pointer.x-this.look.x)*.055;this.look.y+=(this.pointer.y-this.look.y)*.055;
    const driftX=reduced?0:(this.look.x-.5)*15;
    const driftY=reduced?0:(this.look.y-.5)*10+Math.sin(t*.6)*1.5;
    const im=this.background;
    if(im){
      if(w/h<.9){
        // Extend atmosphere beneath the uncropped landscape scene on phone screens.
        const cover=Math.max(w/im.width,h/im.height)*1.08;
        c.globalAlpha=.32;c.drawImage(im,(w-im.width*cover)/2,(h-im.height*cover)/2,im.width*cover,im.height*cover);c.globalAlpha=1;
        const dw=w*1.03,dh=dw*im.height/im.width;
        const y=h*.10;
        c.drawImage(im,(w-dw)/2+driftX*.4,y+driftY*.4,dw,dh);
        const g=c.createLinearGradient(0,y+dh*.60,0,y+dh+100);g.addColorStop(0,'#09101500');g.addColorStop(1,'#091015');c.fillStyle=g;c.fillRect(0,y+dh*.6,w,h);
      }else{
        const s=Math.max(w/im.width,h/im.height)*1.035;
        c.drawImage(im,(w-im.width*s)/2+driftX,(h-im.height*s)/2+driftY,im.width*s,im.height*s);
      }
    }
    // Restrained ambient motion: airborne dust, volumetric mist, rain, reflected light.
    if(SCENES[this.id].rain){
      c.strokeStyle='#abb9c32e';c.lineWidth=.8;c.beginPath();
      for(const p of this.rain){if(!reduced)p.y=(p.y+dt*p.v*.37)%1.15;
        const x=p.x*w,y=(p.y-.15)*h;c.moveTo(x,y);c.lineTo(x-3,y+p.length);
      }c.stroke();
      for(let j=0;j<3;j++){
        const cx=(.2+j*.31)*w+(reduced?0:Math.sin(t*.11+j)*70),cy=h*(.77+j*.06);
        const g=c.createRadialGradient(cx,cy,0,cx,cy,w*.4);g.addColorStop(0,'#b0c6d70b');g.addColorStop(1,'#b0c6d700');c.fillStyle=g;c.fillRect(0,h*.55,w,h*.45);
      }
      const p=this.project([.73,.84]);c.globalCompositeOperation='screen';c.fillStyle=`rgba(166,62,31,${.025+Math.sin(t*.35)*.008})`;c.fillRect(p.x-w*.15,p.y,w*.3,h*.08);c.globalCompositeOperation='source-over';
    } else {
      for(const p of this.dust){const x=p.x*w+(reduced?0:Math.sin(t*.12+p.phase)*20),y=p.y*h+(reduced?0:Math.sin(t*.17+p.phase)*14);c.fillStyle='#e5d6b232';c.beginPath();c.arc(x,y,p.r,0,Math.PI*2);c.fill();}
    }
    if(this.playing){
      const lit=this.state.flashlight&&this.state.battery>0;
      const cx=this.look.x*w,cy=Math.min(h*.63,Math.max(h*.20,this.look.y*h));
      const g=c.createRadialGradient(cx,cy,w*.045,cx,cy,Math.max(w,h)*.68);
      g.addColorStop(0,lit?'rgba(0,0,0,0)':'rgba(0,0,0,.28)');g.addColorStop(.38,lit?'rgba(0,0,0,.05)':'rgba(0,0,0,.43)');g.addColorStop(1,lit?'rgba(0,0,0,.47)':'rgba(0,0,0,.66)');
      c.fillStyle=g;c.fillRect(0,0,w,h);
      if(lit){const glow=c.createRadialGradient(cx,cy,0,cx,cy,w*.17);glow.addColorStop(0,'rgba(236,211,165,.065)');glow.addColorStop(1,'rgba(236,211,165,0)');c.fillStyle=glow;c.fillRect(0,0,w,h);}
      if(this.hand && w/h>.9 && lit){
        const dw=Math.min(w*.25,360),dh=dw*this.hand.height/this.hand.width;
        c.globalAlpha=.89;c.drawImage(this.hand,-dw*.10+driftX*.25,h-dh*.80+(reduced?0:Math.sin(t*.7)*2),dw,dh);c.globalAlpha=1;
      }
    }
    if(this.event&&this.morrow){
      const age=t-this.event.start,ev=this.event,progress=age/ev.duration;
      if(progress>=1){this.event=null;}
      else{
        const alpha=Math.min(1,age*3,(ev.duration-age)*2.4);
        c.save();c.globalAlpha=alpha;
        if(ev.kind==='rush'){
          const k=reduced?1.1:.7+Math.min(1,age/1.2)*2.6;
          // The face advances into the camera; there is no strobing or repeated flashing.
          const dh=h*k,dw=dh*this.morrow.width/this.morrow.height;
          c.translate(w*.52+(reduced?0:Math.sin(age*17)*3),(h-dh*.57)*.58);
          c.rotate(reduced?-.035:Math.sin(age*6)*.022);c.drawImage(this.morrow,-dw*.5,0,dw,dh);
        }else{
          const dh=h*(ev.kind==='hand'?.68:.76),dw=dh*this.morrow.width/this.morrow.height;
          const pp=this.project(ev.kind==='glass'?[.72,.50]:[.67,.55]);
          c.globalAlpha=alpha*.88;c.drawImage(this.morrow,pp.x-dw*.5,pp.y-dh*.52,dw,dh);
        }
        c.restore();
      }
    }
    if(this.state?.ending==='ashes'){
      const g=c.createLinearGradient(0,h,0,0);g.addColorStop(0,'#b954275f');g.addColorStop(1,'#b9542700');c.fillStyle=g;c.fillRect(0,0,w,h);
    }
    const dark=Math.max(0,Math.min(.35,(100-this.settings.brightness)/100));if(dark){c.fillStyle=`rgba(0,0,0,${dark})`;c.fillRect(0,0,w,h);}
    if(this.settings.brightness>100){c.fillStyle=`rgba(227,213,180,${(this.settings.brightness-100)/200})`;c.fillRect(0,0,w,h);}
  }
  dispose(){cancelAnimationFrame(this.frame);}
}

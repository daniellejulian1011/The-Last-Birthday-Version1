export class AudioDirector {
  constructor(){this.ctx=null;this.master=null;this.bed=null;this.nodes=[];this.settings={sound:true,volume:45,voices:false,scares:true};this.scene='exterior';this.paused=false;this.enabled=false;this.nextAmbient=0;this.ambientTimer=null;}
  async start(){
    if(this.ctx){try{await this.ctx.resume();this.enabled=true;}catch{}return;}
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
    try{
      this.ctx=new AC();this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);this.applyVolume();
      this.bed=this.ctx.createGain();this.bed.gain.value=.045;this.bed.connect(this.master);
      // Low motor drone and filtered rain are generated locally. No streaming audio dependencies.
      for(const freq of [46,69,92.1]){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.value=freq;g.gain.value=freq===46?.24:.10;o.connect(g);g.connect(this.bed);o.start();this.nodes.push(o);}
      const b=this.ctx.createBuffer(1,this.ctx.sampleRate*3,this.ctx.sampleRate),d=b.getChannelData(0);let last=0;
      for(let i=0;i<d.length;i++){last=(last+.02*(Math.random()*2-1))/1.02;d[i]=last*3.5;}
      const source=this.ctx.createBufferSource();source.buffer=b;source.loop=true;
      this.rainFilter=this.ctx.createBiquadFilter();this.rainFilter.type='lowpass';this.rainFilter.frequency.value=1100;
      this.rainGain=this.ctx.createGain();this.rainGain.gain.value=.24;source.connect(this.rainFilter);this.rainFilter.connect(this.rainGain);this.rainGain.connect(this.bed);source.start();this.nodes.push(source);
      await this.ctx.resume();this.enabled=true;
      this.ambientTimer=setInterval(()=>this.ambient(),900);
    }catch{this.ctx=null;this.enabled=false;}
  }
  configure(s){this.settings=s;this.applyVolume();if(!s.voices||!s.sound)this.cancelVoice();}
  applyVolume(){if(this.master)this.master.gain.setTargetAtTime(this.settings.sound&&!this.paused?this.settings.volume/100:0,this.ctx.currentTime,.1);}
  pause(p){this.paused=p;this.applyVolume();if(p)this.cancelVoice();}
  setScene(id,nerve=0){this.scene=id;this.nerve=nerve;if(this.rainGain){this.rainGain.gain.setTargetAtTime(id==='exterior'?.24:.055,this.ctx.currentTime,.9);this.rainFilter.frequency.setTargetAtTime(id==='exterior'?1100:330,this.ctx.currentTime,1);} }
  tone(freq,duration=.2,volume=.1,type='sine',endFreq=null,pan=0){
    if(!this.ctx||!this.settings.sound||this.paused)return;
    const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);
    if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(1,endFreq),t+duration);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
    o.connect(g);if(this.ctx.createStereoPanner){const p=this.ctx.createStereoPanner();p.pan.value=pan;g.connect(p);p.connect(this.master);}else g.connect(this.master);
    o.onended=()=>{o.disconnect();g.disconnect();};o.start(t);o.stop(t+duration+.02);
  }
  noise(duration=.2,volume=.15,frequency=800,pan=0){
    if(!this.ctx||!this.settings.sound||this.paused)return;
    const t=this.ctx.currentTime,b=this.ctx.createBuffer(1,Math.max(1,Math.floor(this.ctx.sampleRate*duration)),this.ctx.sampleRate),d=b.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);
    const src=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();src.buffer=b;f.type='lowpass';f.frequency.value=frequency;g.gain.value=volume;src.connect(f);f.connect(g);
    if(this.ctx.createStereoPanner){const p=this.ctx.createStereoPanner();p.pan.value=pan;g.connect(p);p.connect(this.master);}else g.connect(this.master);
    src.onended=()=>{src.disconnect();f.disconnect();g.disconnect();};src.start(t);
  }
  cue(kind){
    const reduced=!this.settings.scares;
    switch(kind){
      case 'click':this.tone(700,.05,.025,'sine',300);break;
      case 'page':this.noise(.15,.035,1800);break;
      case 'door':this.noise(.5,.09,400);this.tone(85,.5,.05,'triangle',45);break;
      case 'camera':this.noise(.07,.10,2400);break;
      case 'error':this.tone(145,.19,.07,'triangle',105);break;
      case 'unlock':this.tone(580,.08,.04);setTimeout(()=>this.tone(820,.14,.025),80);break;
      case 'phone':this.tone(440,.8,.07,'sine');this.tone(480,.8,.05);break;
      case 'power':this.tone(70,1,.10,'triangle',90);this.noise(.25,.07,600);break;
      case 'sighting':this.tone(53,2,reduced?.04:.16,'sine',37,.45);this.noise(1.7,reduced?.025:.07,550,-.6);break;
      case 'hand':this.noise(.5,reduced?.03:.16,480,.7);this.tone(38,1.4,reduced?.025:.12,'triangle');break;
      case 'glass':this.noise(.25,reduced?.035:.16,2500);this.tone(140,1.4,.08,'sine',45);break;
      case 'rush':this.noise(.6,reduced?.04:.29,1300);this.tone(57,1.5,reduced?.05:.19,'sawtooth',28);break;
      case 'ending':this.tone(220,4,.035);this.tone(261.63,4,.023);break;
    }
  }
  ambient(){
    if(!this.enabled||this.paused||!this.settings.sound)return;
    if(this.scene!=='exterior'&&this.nerve>35){this.tone(43,.12,.017,'sine');setTimeout(()=>this.tone(37,.14,.011,'sine'),180);}
    if(Math.random()>.14)return;
    if(this.scene==='exterior'){this.noise(2,.025,180);return;}
    const pan=Math.random()*1.6-.8;
    this.tone(90+Math.random()*100,.15,.02,'triangle',null,pan);
    if(['arcade','stage'].includes(this.scene)&&Math.random()>.6){
      // A damaged mechanical music-box interval, never a voice or mascot song.
      this.tone(523.25,.9,.012,'sine',null,pan);setTimeout(()=>this.tone(622.25,.6,.008,'sine',null,pan),500);
    }
  }
  voice(text,speaker){
    this.cancelVoice();
    if(!text||!this.settings.voices||!this.settings.sound||this.paused||!window.speechSynthesis||typeof SpeechSynthesisUtterance==='undefined')return;
    // The mute mascot is never sent to speech synthesis, including accidental future content edits.
    if(/MORROW/.test(speaker))return;
    const u=new SpeechSynthesisUtterance(text),voices=window.speechSynthesis.getVoices();
    const english=voices.filter(v=>/^en[-_]/i.test(v.lang));const male=/EDWIN|ELLIS/.test(speaker);
    const preferred=english.find(v=>male?/david|mark|daniel|james|guy/i.test(v.name):/samantha|zira|jenny|susan|aria|victoria/i.test(v.name));
    if(preferred)u.voice=preferred;else if(english.length)u.voice=english[male?0:Math.min(1,english.length-1)];
    u.lang='en-US';u.rate=/EDWIN/.test(speaker)?.83:/ELLIS/.test(speaker)?.94:.9;u.pitch=male?.82:1;u.volume=this.settings.volume/100;
    window.speechSynthesis.speak(u);
  }
  cancelVoice(){if(window.speechSynthesis)window.speechSynthesis.cancel();}
  dispose(){clearInterval(this.ambientTimer);this.cancelVoice();if(this.ctx)this.ctx.close().catch(()=>{});}
}

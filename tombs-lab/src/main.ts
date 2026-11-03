import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {buildLab,buildIslandScaleReferences,createCharacterMounts,LabState,TownScaleController,CinematicDirector,
  nearestUse,useObject,moveWithWalls,roomAt,anchor,planSvg} from './tombs';
import './styles.css';

const holder=document.getElementById('app');if(!holder)throw new Error('Missing #app');
holder.innerHTML=`<div class="view" id="view"></div><div class="ui">
<div class="top"><div class="brand"><b>TOMBS</b><span>LABORATORY · DRAFT C</span></div>
<div class="hud"><span id="location">ISLAND · NORMAL</span><span id="scale">TOWN SCALE 1:1</span><span id="fps">FPS …</span></div></div>
<div class="left"><div class="eyebrow">TOMBS LABORATORY · 2110</div><h1 id="title">THE ALARM</h1>
<div id="caption">Standalone procedural facility · Chapter 1 environment</div><div id="objective">Select TOUR or EXPLORE to begin.</div>
<div class="mini" id="mini"></div></div>
<div class="bottom"><div class="btns"><button data-act="tour">🎬 CINEMATIC TOUR</button><button data-act="explore">🚶 EXPLORE</button><button data-act="top">🗺 TOP VIEW</button><button data-act="plan">📐 PLAN</button><button data-act="roof">ROOF: OFF</button></div>
<div class="btns"><button data-act="activate" class="primary">⚡ ACTIVATE ARRAY</button><button data-act="restore">↩ NORMAL SIZE</button><button data-act="interact">E · INTERACT</button><button data-act="save">SAVE</button><button data-act="load">LOAD</button></div><div class="hint">WASD / arrows move · drag to look · E interact · mobile: joystick to move, swipe view to turn · 1:180 scales the town and people only</div></div>
<div class="joy" id="joy" aria-label="Move"><div class="knob" id="knob"></div></div>
<div class="effects" id="effects"></div><div class="plan" id="plan" hidden><button class="close" data-act="plan">✕ CLOSE PLAN</button><div class="sheet" id="plansheet"></div></div><div class="toast" id="toast"></div></div>`;
const element=document.getElementById('view')!;
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
element.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x101d2d);scene.fog=new THREE.Fog(0x101d2d,30,150);
const sunlight=new THREE.DirectionalLight(0xc3e3ff,2);sunlight.position.set(-18,32,24);scene.add(sunlight);
const island=new THREE.Group();island.name='ISLAND:unchanged-scale';scene.add(island);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(400,400),new THREE.MeshStandardMaterial({color:0x1f433e,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.26;island.add(ground);
const outside=buildIslandScaleReferences();outside.visible=false;island.add(outside);
const controller=new TownScaleController(island,1);
controller.setWorldAnchor(0,0,0);
const labState=new LabState();const building=buildLab(labState);controller.townRoot.add(building.group);
const characters=createCharacterMounts();controller.townRoot.add(characters.group);
// Camera belongs inside townRoot: it scales with Jack, Sarah and the lab, while exterior bugs stay in island.
const camera=new THREE.PerspectiveCamera(68,innerWidth/innerHeight,.025,1500);controller.townRoot.add(camera);
camera.position.set(-13.1,1.65,-9.9);aimLocal(-13.0,1.1,-12.4);
const orbit=new OrbitControls(camera,renderer.domElement);orbit.enabled=false;orbit.enableDamping=true;orbit.minDistance=.8;orbit.maxDistance=95;
let view:'tour'|'explore'|'top'='explore';let roof=false;let yaw=0,pitch=0;
const held=new Set<string>();const joy={x:0,y:0};let drag=false,px=0,py=0;let toastTimeout=0;
const $=(id:string)=>document.getElementById(id)!;
function setCaption(v:string):void{$('caption').textContent=v}
function notify(msg:string):void{$('toast').textContent=msg;$('toast').classList.add('show');toastTimeout=2.7}
function captureExploreAngles():void{const target=new THREE.Vector3();camera.getWorldDirection(target);yaw=Math.atan2(target.x,-target.z);pitch=Math.asin(THREE.MathUtils.clamp(target.y,-1,1))}
function aimLocal(x:number,y:number,z:number):void{controller.townRoot.updateWorldMatrix(true,false);camera.lookAt(controller.townRoot.localToWorld(new THREE.Vector3(x,y,z)))}
function applyViewAngles():void{const dx=Math.sin(yaw)*Math.cos(pitch),dy=Math.sin(pitch),dz=-Math.cos(yaw)*Math.cos(pitch);aimLocal(camera.position.x+dx,camera.position.y+dy,camera.position.z+dz)}
function setView(next:typeof view):void{
 director.stop();view=next;orbit.enabled=next==='top';building.setLabels(next==='top');
 if(next==='top'){building.setRoof(false);roof=false;camera.position.set(0,52,22);orbit.target.set(0,0,0);orbit.update();aimLocal(0,0,0);setCaption('Authoritative metric blockout: orbit, zoom and inspect the U-shaped loop.');}
 else if(next==='explore'){camera.position.set(-13.1,1.65,-9.9);aimLocal(-13.0,1.1,-12.4);captureExploreAngles();setCaption('Playable room exploration · Stable interactive object IDs');}
}
const director=new CinematicDirector(camera,controller,labState,{
 onCaption:setCaption,onEffects:s=>{$('effects').style.opacity=String(s)},onComplete:event=>{if(event==='intro'){view='explore';captureExploreAngles();notify('Explore as Jack · Use E near doors, monitors or intercom.')}else{view='explore';captureExploreAngles();outside.visible=true;notify('1:180 · town and humans shrunk, insects and island unchanged.')}}
});
function useNearest():void{const nearby=nearestUse(camera.position.x,camera.position.z);if(!nearby){notify('Nothing to interact with nearby.');return}
 const result=useObject(labState,nearby.id);notify(result);$('objective').textContent=result;
}
function activate():void{orbit.enabled=false;view='tour';director.triggerActivation();notify('Array activating · watch the town scale change.');}
function restore():void{controller.restore(2.5);outside.visible=false;labState.setMode('night');notify('Restoring 1:1 human and building scale.');}
for(const b of Array.from(document.querySelectorAll<HTMLButtonElement>('button[data-act]'))){b.addEventListener('click',()=>{
 switch(b.dataset.act){
 case 'tour':orbit.enabled=false;view='tour';outside.visible=false;director.startIntro();notify('Cinematic opening · ending in Jack’s laboratory');break;
 case 'explore':setView('explore');break;
 case 'top':setView('top');break;
 case 'plan':{const el=$('plan');if(el.hidden){$('plansheet').innerHTML=planSvg();el.hidden=false}else el.hidden=true;break}
 case 'roof':roof=!roof;building.setRoof(roof);b.textContent=`ROOF: ${roof?'ON':'OFF'}`;break;
 case 'activate':activate();break;case 'restore':restore();break;case 'interact':useNearest();break;
 case 'save':{const save={schema:1,state:labState.snapshot(),townScale:controller.relativeScale,pose:[camera.position.x,camera.position.y,camera.position.z,yaw,pitch]};localStorage.setItem('tombs-draft-c-preview',JSON.stringify(save));notify('Standalone preview state saved locally.');break}
 case 'load':{const raw=localStorage.getItem('tombs-draft-c-preview');if(!raw){notify('No saved preview.');break}try{const s=JSON.parse(raw);director.stop();labState.restore(s.state);controller.setScale(s.townScale);outside.visible=s.townScale<.5;const v=s.pose;camera.position.set(v[0],v[1],v[2]);yaw=v[3];pitch=v[4];applyViewAngles();view='explore';orbit.enabled=false;notify('Standalone preview state loaded.')}catch{notify('Incompatible save.')}break}
 }
 })}
window.addEventListener('keydown',e=>{if(e.repeat)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();held.add(e.key.toLowerCase());if(e.key.toLowerCase()==='e')useNearest();if(e.key==='1')setView('explore');if(e.key==='2')setView('top');if(e.key==='3')activate()});
window.addEventListener('keyup',e=>held.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>{held.clear();releaseJoy()});
renderer.domElement.addEventListener('pointerdown',e=>{if(view!=='explore')return;drag=true;px=e.clientX;py=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointerup',()=>{drag=false});
renderer.domElement.addEventListener('pointermove',e=>{if(view!=='explore'||!drag)return;const dx=e.clientX-px,dy=e.clientY-py;px=e.clientX;py=e.clientY;
 yaw+=dx*.004;pitch=THREE.MathUtils.clamp(pitch-dy*.004,-1.35,1.35);applyViewAngles()});
// The on-screen joystick, bottom left (Joshua, 2026-11-03: "a real joystick on the left side").
// Analog: how far the knob is pushed is how fast you walk, in whatever direction it points.
const joyEl=$('joy'),knob=$('knob');let joyId:number|null=null;
function joyAt(e:PointerEvent):void{
 const r=joyEl.getBoundingClientRect(),R=r.width/2;
 let dx=(e.clientX-(r.left+R))/R,dy=(e.clientY-(r.top+R))/R;const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}
 joy.x=dx;joy.y=dy;knob.style.transform=`translate(${dx*R*.62}px,${dy*R*.62}px)`;
}
function releaseJoy():void{joyId=null;joy.x=0;joy.y=0;knob.style.transform='';joyEl.classList.remove('active')}
joyEl.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();joyId=e.pointerId;joyEl.setPointerCapture(e.pointerId);joyEl.classList.add('active');joyAt(e)});
joyEl.addEventListener('pointermove',e=>{if(e.pointerId===joyId)joyAt(e)});
for(const event of ['pointerup','pointercancel','lostpointercapture'])joyEl.addEventListener(event,e=>{if((e as PointerEvent).pointerId===joyId)releaseJoy()});
function movement(dt:number):void{
 if(view!=='explore'||director.isPlaying||orbit.enabled)return;
 const dead=Math.hypot(joy.x,joy.y)<.12; // a small dead zone, so a resting thumb does not drift
 const forward=(held.has('w')||held.has('arrowup')?1:0)-(held.has('s')||held.has('arrowdown')?1:0)+(dead?0:-joy.y);
 const side=(held.has('d')||held.has('arrowright')?1:0)-(held.has('a')||held.has('arrowleft')?1:0)+(dead?0:joy.x);
 const len=Math.hypot(forward,side);if(len<.01)return;
 const speed=(held.has('shift')?3.5:2.2)*Math.min(dt,.05)*Math.min(1,len)/len;
 const dx=(Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed;
 const dz=(-Math.cos(yaw)*forward+Math.sin(yaw)*side)*speed;
 const [x,z]=moveWithWalls(camera.position.x,camera.position.z,dx,dz,.24,id=>labState.isOpen(id));
 camera.position.set(x,1.65,z);
}
function refreshHud(fps:number):void{
 const n=controller.relativeScale;
 $('scale').textContent=n>0.999?'TOWN SCALE 1:1':`TOWN SCALE 1:${(1/n).toFixed(n<.01?0:1)}`;
 $('location').textContent=`${roomAt(camera.position.x,camera.position.z).toUpperCase()} · ${labState.mode.toUpperCase()}`;
 $('fps').textContent=`FPS ${fps.toFixed(0)}`;
 const nearest=nearestUse(camera.position.x,camera.position.z);
 $('mini').textContent=nearest&&view==='explore'?`E · ${nearest.label} (${nearest.distance.toFixed(1)}m)`:`8 ROOMS · 10 DOORS · U-LOOP · 5 ARRAY RINGS`;
 if(controller.phase==='small')outside.visible=true;
 if(controller.phase==='normal')outside.visible=false;
}
function resize():void{const width=innerWidth,height=innerHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}
window.addEventListener('resize',resize);
let last=performance.now(),fpsSmooth=60,hudTime=0;
function frame(now:number):void{
 const dt=Math.min(.065,(now-last)/1000);last=now;controller.update(dt);director.update(dt);movement(dt);building.update(dt,labState);
 if(view==='top')orbit.update();
 fpsSmooth=fpsSmooth*.93+(dt>0?1/dt:60)*.07;hudTime+=dt;if(hudTime>.25){hudTime=0;refreshHud(fpsSmooth)}
 if(toastTimeout>0){toastTimeout-=dt;if(toastTimeout<=0)$('toast').classList.remove('show')}
 renderer.render(scene,camera);requestAnimationFrame(frame);
}
const spawn=anchor('jackSpawn');camera.position.set(...spawn.xyz);camera.position.y=1.65;aimLocal(-13.0,1.1,-12.4);captureExploreAngles();
notify('TOMBS Draft C standalone · all geometry is procedural.');requestAnimationFrame(frame);

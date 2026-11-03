import * as THREE from 'three';
import {LabState} from './state';
import {TownScaleController} from './scale';

interface Key { readonly at:number; readonly position:readonly[number,number,number]; readonly look:readonly[number,number,number]; readonly caption:string }
const KEYS:readonly Key[]=[
 {at:0,position:[0,19,46],look:[0,1,0],caption:'THE ATLANTIC · MARCH 5, 2110'},
 {at:3.8,position:[-15,12,31],look:[0,3,4],caption:'THE RESEARCH SETTLEMENT'},
 {at:7.7,position:[0,5.1,19],look:[0,2.5,8],caption:'TOMBS ARRAY RESEARCH LABORATORY'},
 {at:10.4,position:[0,2.2,13.6],look:[0,1.8,8],caption:'UNAUTHORIZED ACCESS DETECTED'},
 {at:13.0,position:[0,1.7,10.2],look:[0,1.6,6.5],caption:'SECURITY VESTIBULE'},
 {at:15.1,position:[0,1.7,7],look:[-7.7,1.7,6.5],caption:'FOLLOW THE ALARM'},
 {at:17.7,position:[-8,1.7,6.5],look:[-8,1.7,-7.2],caption:'WEST CORRIDOR'},
 {at:20.8,position:[-8,1.7,-9.4],look:[-13.4,1.7,-9.5],caption:'JACK’S LABORATORY'},
 {at:23.8,position:[-13.1,1.65,-9.9],look:[-14.5,1.4,-11.8],caption:'CHAPTER ONE · THE ALARM'},
];
function between(a:number,b:number,t:number):number{const v=Math.max(0,Math.min(1,(t-a)/(b-a)));return v*v*(3-2*v)}
function lerp(a:readonly[number,number,number],b:readonly[number,number,number],t:number,out:THREE.Vector3):THREE.Vector3{return out.set(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t)}
export interface CinematicHooks {onCaption?:(caption:string)=>void;onEffects?:(strength:number)=>void;onComplete?:(event:'intro'|'activation')=>void}
/** Animates camera only. Dialogue, checkpoints and canonical story beats remain external. */
export class CinematicDirector{
 private action:'idle'|'intro'|'activation'='idle';
 private t=0;
 private a=new THREE.Vector3();private b=new THREE.Vector3();
 readonly camera:THREE.PerspectiveCamera;
 constructor(camera:THREE.PerspectiveCamera,private readonly town:TownScaleController,private readonly lab:LabState,private readonly hooks:CinematicHooks={}){this.camera=camera}
 get isPlaying():boolean{return this.action!=='idle'}
 startIntro():void{this.action='intro';this.t=0;this.town.setScale(1);this.lab.setMode('night')}
 triggerActivation():void{this.action='activation';this.t=0;this.lab.setMode('activation');this.hooks.onCaption?.('TOMBS ARRAY · ACTIVATION')}
 stop():void{this.action='idle';this.hooks.onEffects?.(0)}
 update(dt:number):void{
  if(this.action==='idle')return;
  this.t+=Math.max(0,dt);
  if(this.action==='intro'){
   if(this.t>=8.0&&!this.lab.isOpen('security-outer'))this.lab.setDoor('security-outer',true);
   if(this.t>=11.2&&!this.lab.isOpen('security-inner'))this.lab.setDoor('security-inner',true);
   if(this.t>=18.1&&!this.lab.isOpen('jack-door'))this.lab.setDoor('jack-door',true);
   const last=KEYS[KEYS.length-1];if(this.t>=last.at){this.placeKey(last);this.finish('intro');return}
   for(let i=0;i<KEYS.length-1;i++){const k=KEYS[i],next=KEYS[i+1];if(this.t<k.at||this.t>=next.at)continue;
    const t=between(k.at,next.at,this.t);this.camera.position.copy(lerp(k.position,next.position,t,this.a));this.lookAtLocal(lerp(k.look,next.look,t,this.b));
    this.hooks.onCaption?.(k.caption);break;
   }
   return;
  }
  // Array pulses, then one coordinated scale transition. Camera is parented to the town so it
  // contracts with the people/building, leaving their local POV stable while insects stay large.
  if(this.t<2.4){this.hooks.onCaption?.('TOMBS ARRAY · ACTIVATION');this.hooks.onEffects?.(.15+.10*Math.sin(this.t*18));return}
  if(this.t<3.3){this.hooks.onCaption?.('WARNING · ARRAY OUTPUT RISING');this.hooks.onEffects?.(.5);return}
  if(this.t<7.9){
   if(this.t-dt<3.3)this.town.shrink(4.6);
   this.hooks.onCaption?.('TOWN SCALE CHANGING');
   this.hooks.onEffects?.(.85*Math.sin(Math.PI*(this.t-3.3)/4.6));return;
  }
  this.town.setScale(1/180);this.lab.setMode('emergency');this.hooks.onEffects?.(0);
  this.hooks.onCaption?.('THE TOWN HAS SHRUNK · THE ISLAND HAS NOT');
  this.finish('activation');
 }
 private lookAtLocal(target:THREE.Vector3):void{this.town.townRoot.updateWorldMatrix(true,false);this.camera.lookAt(this.town.townRoot.localToWorld(target.clone()))}
 private placeKey(k:Key):void{this.camera.position.set(...k.position);this.lookAtLocal(new THREE.Vector3(...k.look));this.hooks.onCaption?.(k.caption)}
 private finish(kind:'intro'|'activation'):void{this.action='idle';this.hooks.onEffects?.(0);this.hooks.onComplete?.(kind)}
}

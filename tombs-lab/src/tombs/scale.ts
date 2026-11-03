import * as THREE from 'three';

/**
 * SINGLE source of truth for town shrink. Island/insects belong OUTSIDE townRoot.
 * All humans/buildings/props/cameras inside it remain in consistent LOCAL METRES.
 * For TMB integration, metresToIslandUnits = UNITS_PER_METRE (currently 100).
 * For the standalone preview it is 1. The island transform and floating origin are
 * the caller's responsibility. Never multiply each child scale by 1/180.
 */
export const SHRINK_RATIO=180;
export type TownPhase='normal'|'transition'|'small';
export class TownScaleController{
 readonly townRoot:THREE.Group;
 readonly metreBridge:THREE.Group;
 private readonly localAnchor=new THREE.Vector3();
 private seconds=0;
 private duration=3.8;
 private from=1;
 private target=1;
 private factor=1;
 onProgress?: (relative:number,phase:TownPhase)=>void;
 constructor(islandParent:THREE.Object3D, metresToIslandUnits=1){
  if(!(metresToIslandUnits>0))throw new Error('metresToIslandUnits must be positive');
  this.metreBridge=new THREE.Group();this.metreBridge.name='TOMBS:metric-to-island';this.metreBridge.scale.setScalar(metresToIslandUnits);
  this.townRoot=new THREE.Group();this.townRoot.name='TOWN:SHRINK-ROOT';this.metreBridge.add(this.townRoot);islandParent.add(this.metreBridge);
 }
 get relativeScale(){return this.factor}
 get phase():TownPhase{return this.seconds>0&&this.factor!==this.target?'transition':this.factor<=1/SHRINK_RATIO+1e-8?'small':'normal'}
 /** The authoritative world anchor is supplied at the adapter boundary. */
 setWorldAnchor(x:number,y:number,z:number):void{this.metreBridge.position.set(x,y,z);}
 setTownPivot(x:number,y:number,z:number):void{this.localAnchor.set(x,y,z);this.townRoot.position.copy(this.localAnchor).multiplyScalar(1-this.factor);}
 setScale(value:number):void{
  if(!(value>0&&value<=1))throw new Error('Town relative scale must be (0,1]');
  this.factor=this.target=this.from=value;this.seconds=0;
  this.apply();
 }
 shrink(duration=3.8):void{this.transitionTo(1/SHRINK_RATIO,duration)}
 restore(duration=3.8):void{this.transitionTo(1,duration)}
 private transitionTo(target:number,duration:number):void{
  if(duration<=0){this.setScale(target);return}
  this.from=this.factor;this.target=target;this.seconds=0;this.duration=duration;
 }
 update(dt:number):void{
  if(this.factor===this.target)return;
  this.seconds=Math.min(this.duration,this.seconds+Math.max(0,dt));
  const t=this.seconds/this.duration;const e=t*t*(3-2*t);
  // Log interpolation avoids feeling like a sudden plunge in the final metre of shrink.
  this.factor=Math.exp(Math.log(this.from)*(1-e)+Math.log(this.target)*e);
  if(this.seconds===this.duration)this.factor=this.target;
  this.apply();
 }
 private apply():void{
  this.townRoot.scale.setScalar(this.factor);
  this.townRoot.position.copy(this.localAnchor).multiplyScalar(1-this.factor);
  this.onProgress?.(this.factor,this.phase);
 }
 /** Use Three's matrix hierarchy: conversions cover translation, rotation and scale together. */
 localToIsland(local:THREE.Vector3,out=new THREE.Vector3()):THREE.Vector3{this.townRoot.updateWorldMatrix(true,false);return out.copy(local).applyMatrix4(this.townRoot.matrixWorld)}
 islandToLocal(world:THREE.Vector3,out=new THREE.Vector3()):THREE.Vector3{this.townRoot.updateWorldMatrix(true,false);return out.copy(world).applyMatrix4(new THREE.Matrix4().copy(this.townRoot.matrixWorld).invert())}
}
/** Independent of Three: authoritative scale math for physics, diagnostics and tests. */
export function scaledMetres(normalMetres:number,relative:number):number{return normalMetres*relative}
export function expectedHumanHeight(m=1.7):number{return m/SHRINK_RATIO}

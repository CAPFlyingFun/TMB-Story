import type {DoorId, LabMode} from './types';
import {PLAN} from './spec';
export interface LabSnapshot { mode:LabMode; doors:Record<DoorId,boolean>; flags:Record<string,boolean>; }
export class LabState{
 mode:LabMode='night';
 readonly doors=new Map<DoorId,boolean>();
 readonly flags=new Map<string,boolean>();
 readonly listeners=new Set<()=>void>();
 constructor(){for(const d of PLAN.doors)this.doors.set(d.id,false)}
 isOpen(id:DoorId):boolean{return this.doors.get(id)??false}
 setDoor(id:DoorId,open:boolean):boolean{
  if(!this.doors.has(id))return false;
  const spec=PLAN.doors.find(d=>d.id===id)!;
  if(spec.locked&&open&&!this.flags.get('arrayAuthorized'))return false;
  this.doors.set(id,open);this.changed();return true;
 }
 toggleDoor(id:DoorId):boolean{return this.setDoor(id,!this.isOpen(id))}
 setMode(mode:LabMode):void{this.mode=mode;if(mode==='emergency')this.flags.set('shutdown',true);this.changed()}
 setFlag(id:string,value:boolean):void{this.flags.set(id,value);this.changed()}
 changed():void{for(const fn of this.listeners)fn()}
 snapshot():LabSnapshot{return {mode:this.mode,doors:Object.fromEntries(this.doors) as Record<DoorId,boolean>,flags:Object.fromEntries(this.flags)}}
 restore(snapshot:LabSnapshot):void{this.mode=snapshot.mode;for(const d of PLAN.doors)this.doors.set(d.id,!!snapshot.doors?.[d.id]);this.flags.clear();for(const [k,v] of Object.entries(snapshot.flags??{}))this.flags.set(k,v);this.changed()}
}

import { PLAN,anchor } from './spec';
import type {DoorId} from './types';
import {LabState} from './state';
export interface UsePoint { readonly id:string; readonly label:string; readonly x:number; readonly y:number; readonly z:number; readonly range:number }
export const OBJECTS:readonly UsePoint[]=[
 // Positions are the furniture they belong to (furniture.ts).
 {id:'tombs.jack.intercom',label:'Call Sarah on intercom',x:-12.25,y:.86,z:-12.7,range:2.2},
 {id:'tombs.jack.primary_console',label:'Inspect unauthorized access',x:-13.0,y:1,z:-12.5,range:2.4},
 {id:'tombs.sarah.tablet',label:'Pick up Sarah’s tablet',x:16.3,y:.75,z:-9.75,range:2.5},
 {id:'tombs.control.emergency_lever',label:'Pull emergency shutdown',x:-4.6,y:1.1,z:-12.6,range:2.2},
 {id:'tombs.security.entry_reader',label:'Access security scanner',x:2.86,y:1.25,z:9.05,range:2.5},
 {id:'tombs.control.sensor_drawer',label:'Collect field sensor',x:4.6,y:.9,z:-12.4,range:1.8},
];
export type Nearby={id:string,label:string,distance:number,kind:'door'|'object'};
export function nearestUse(x:number,z:number,maxDistance=2.6):Nearby|null{
 const all:Nearby[]=[...PLAN.doors.map(d=>({id:d.id,label:`${d.id.replaceAll('-',' ')} door`,distance:Math.hypot(x-d.at[0],z-d.at[1]),kind:'door' as const})),
 ...OBJECTS.map(o=>({id:o.id,label:o.label,distance:Math.hypot(x-o.x,z-o.z),kind:'object' as const}))];
 return all.filter(o=>o.distance<=maxDistance).sort((a,b)=>a.distance-b.distance)[0]??null;
}
export function useObject(state:LabState,id:string):string{
 const door=PLAN.doors.find(d=>d.id===id);
 if(door){const ok=state.toggleDoor(id as DoorId);return ok?`${door.id}: ${state.isOpen(door.id)?'OPEN':'CLOSED'}`:'Door locked. Authorization required.'}
 switch(id){
 case 'tombs.jack.intercom':state.setFlag('calledSarah',true);return 'Intercom connected. Sarah is on her way.';
 case 'tombs.jack.primary_console':state.setFlag('logsInspected',true);state.setMode('alarm');return 'Unauthorized access detected. System logs corrupted.';
 case 'tombs.sarah.tablet':state.setFlag('tabletCollected',true);return 'Sarah’s tablet collected.';
 case 'tombs.control.emergency_lever':state.setFlag('arrayAuthorized',true);state.setMode('emergency');return 'EMERGENCY SHUTDOWN. Array rings stopping…';
 case 'tombs.security.entry_reader':state.setFlag('securityScanned',true);return 'Badge event logged. Entry camera acknowledged.';
 case 'tombs.control.sensor_drawer':state.setFlag('sensorCollected',true);return 'Environmental sensor equipped.';
 default:return `No action for ${id}`;
 }
}
export const SHOT_ANCHORS={jackSeat:anchor('jackDeskSeat'),sarahArrival:anchor('sceneHandoffEnd'),controlGlass:anchor('arrayGlassLook'),exterior:anchor('labExit')};

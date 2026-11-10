import type { Anchor, Door, Hall, LabPlan, Portal, Rect, Room, RoomId, Wall, WalkRegion } from './types';

/** Local human-scale metres: origin centred on facility floor, +X east, +Y up, +Z south. */
export const DIMENSIONS = Object.freeze({ width:36, depth:28, maxHeight:8, shellThickness:.28, partitionThickness:.16,
  staffCeiling:3.2, controlCeiling:4, chamberCeiling:7.5, corridorWidth:2.8, observationWidth:8,
  mainDoubleDoorWidth:2.4, doorWidth:1.25, islandUnitsPerMetre:100, shrinkFactor:180,
});
const rect = (x0:number,x1:number,z0:number,z1:number): Rect => ({x0,x1,z0,z1});
const R: readonly Room[] = [
  {id:'jack',label:"JACK'S LABORATORY",bounds:rect(-17,-10.5,-13.1,-7.6),ceiling:3.4,use:'Research, prototypes, monitors'},
  {id:'control',label:'MAIN CONTROL ROOM',bounds:rect(-6,6,-13.1,-8.1),ceiling:4,use:'Array observation and control consoles'},
  {id:'sarah',label:"SARAH'S OFFICE",bounds:rect(10.5,17,-13.1,-7.6),ceiling:3.4,use:'Research, planning, tablet'},
  {id:'storage',label:'EQUIPMENT STORAGE',bounds:rect(-17,-12,-7.6,-3.6),ceiling:3.2,use:'Sensors, tools and field equipment'},
  {id:'break',label:'BREAK NOOK',bounds:rect(-17,-12,-3.6,.4),ceiling:3.2,use:'Coffee and small table'},
  {id:'utility',label:'SERVER / UTILITY',bounds:rect(12,17,-7.6,-1.6),ceiling:3.6,use:'Server racks and power'},
  {id:'array',label:'TOMBS ARRAY',bounds:rect(-9,9,-5.2,5.5),ceiling:7.5,use:'Ring apparatus and central platform'},
  {id:'vestibule',label:'SECURITY VESTIBULE',bounds:rect(-3,3,8.5,11.5),ceiling:3.3,use:'Badge reader and access control'},
];
/** The corridor loop, as on the Draft C blueprint: a ring about 3 m wide between the Array
 * chamber's octagon and the rooms, with the observation gallery in front of the control room's
 * glass and a short connection from it to Jack's and Sarah's doors. (The first draft had a small
 * chamber standing in one wide open hall, with dead space between the wings.) */
const H: readonly Hall[] = [
 {id:'loop-west',bounds:rect(-12,-9,-7.6,8.5),ceiling:3.4},
 {id:'loop-east',bounds:rect(9,12,-7.6,8.5),ceiling:3.4},
 {id:'loop-south',bounds:rect(-12,12,5.5,8.5),ceiling:3.4},
 {id:'jack-connection',bounds:rect(-10.5,-6,-11.1,-7.6),ceiling:3.4},
 {id:'sarah-connection',bounds:rect(6,10.5,-11.1,-7.6),ceiling:3.4},
 {id:'south-entrance',bounds:rect(-3,3,8.35,8.6),ceiling:3.3},
 {id:'north-observation-gallery',bounds:rect(-9,9,-8.1,-5.2),ceiling:4},
];
const D: readonly Door[] = [
 {id:'jack-door',at:[-10.5,-9.45],along:'z',width:1.3,height:2.35,sliding:true},
 {id:'sarah-door',at:[10.5,-9.45],along:'z',width:1.3,height:2.35,sliding:true},
 {id:'control-west',at:[-6,-9.5],along:'z',width:1.35,height:2.4,sliding:true},
 {id:'control-east',at:[6,-9.5],along:'z',width:1.35,height:2.4,sliding:true},
 {id:'storage-door',at:[-12,-5.45],along:'z',width:1.25,height:2.25,sliding:false},
 {id:'break-door',at:[-12,-1.8],along:'z',width:1.25,height:2.25,sliding:false},
 {id:'utility-door',at:[12,-4.45],along:'z',width:1.25,height:2.4,sliding:true},
 {id:'array-service',at:[9,0],along:'z',width:1.35,height:2.7,sliding:true,locked:true},
 {id:'security-inner',at:[0,8.5],along:'x',width:2.4,height:2.6,sliding:true},
 {id:'security-outer',at:[0,11.5],along:'x',width:2.4,height:2.6,sliding:true},
];
/** A glass observation pane in the array's NORTH wall; solids and renderer use same intervals. */
const P:readonly Portal[]=[
 {id:'array-observation',at:[0,-5.2],along:'x',width:10,sill:.95,height:2.1,kind:'glass'},
 {id:'control-external',at:[0,-13.1],along:'x',width:4,sill:1.15,height:1.6,kind:'glass'},
 // The control room's own reinforced window onto the Array (Ch 2). The first draft had glass only
 // in the chamber wall, behind a solid control-room wall: the consoles could not see the Array.
 {id:'control-observation',at:[0,-8.1],along:'x',width:9,sill:.95,height:2.1,kind:'glass'},
 {id:'jack-external',at:[-14.5,-13.1],along:'x',width:2.2,sill:1.1,height:1.3,kind:'glass'},
 {id:'sarah-external',at:[14.5,-13.1],along:'x',width:2.2,sill:1.1,height:1.3,kind:'glass'},
];
const W:Wall[]=[];
const addWall=(id:string,from:readonly[number,number],to:readonly[number,number],height:number,openings:readonly string[]=[],material:Wall['material']='internal')=>{W.push({id,from,to,height,openings,material})};
// `skip`: a side another room's wall already covers (two walls in one place flicker).
const edges=(room:Room, open:Partial<Record<'n'|'s'|'e'|'w',readonly string[]>>={}, skip:readonly('n'|'s'|'e'|'w')[]=[])=>{
  const {x0,x1,z0,z1}=room.bounds,h=room.ceiling,id=room.id;
  if(!skip.includes('n'))addWall(`${id}-north`,[x0,z0],[x1,z0],h,open.n??[],room.id==='array'?'reinforced':'external');
  addWall(`${id}-east`,[x1,z0],[x1,z1],h,open.e??[],room.id==='array'?'array':'internal');
  addWall(`${id}-south`,[x0,z1],[x1,z1],h,open.s??[],room.id==='array'?'array':'internal');
  addWall(`${id}-west`,[x0,z0],[x0,z1],h,open.w??[],room.id==='array'?'array':'internal');
};
edges(R[0],{n:['jack-external'],e:['jack-door']});
edges(R[1],{n:['control-external'],s:['control-observation'],e:['control-east'],w:['control-west']});
edges(R[2],{n:['sarah-external'],w:['sarah-door']});
// The west wing is one stack, Jack's laboratory, storage and the break nook sharing walls, and
// the east wing Sarah's office over the server room, as on the blueprint.
edges(R[3],{e:['storage-door']},['n']);edges(R[4],{e:['break-door']},['n']);edges(R[5],{w:['utility-door']},['n']);
// Eight planar panels with chamfered corners, not a rectangle around the array.
// 18 m by 10.7 m, its corners cut 3 m, so the corridor round it is about 3 m wide.
export const ARRAY_OCTAGON:readonly (readonly[number,number])[]=[[-6,-5.2],[6,-5.2],[9,-2.2],[9,2.5],[6,5.5],[-6,5.5],[-9,2.5],[-9,-2.2]];
const oct=ARRAY_OCTAGON;
for(let i=0;i<8;i++){const a=oct[i],b=oct[(i+1)%8];addWall(`array-wall-${i}`,a,b,7.5,i===0?['array-observation']:i===2?['array-service']:[], 'array')}
edges(R[7],{n:['security-inner'],s:['security-outer']});
// The outside walls the rooms do not already give: the notch in the north face between the
// office wings and the control room, and the corridor's outer walls down each side, across the
// cut corners and along the south face either side of the entrance.
addWall('north-notch-west',[-10.5,-11.1],[-6,-11.1],3.4,[],'external');
addWall('north-notch-east',[6,-11.1],[10.5,-11.1],3.4,[],'external');
addWall('west-outside',[-12,.4],[-12,5.5],3.4,[],'external');
addWall('southwest-outside',[-12,5.5],[-9,8.5],3.4,[],'external');
addWall('south-outside-west',[-9,8.5],[-3,8.5],3.4,[],'external');
addWall('east-outside',[12,-1.6],[12,5.5],3.4,[],'external');
addWall('southeast-outside',[12,5.5],[9,8.5],3.4,[],'external');
addWall('south-outside-east',[3,8.5],[9,8.5],3.4,[],'external');
/** The building's outline, for the floor slab and the plan. */
export const FOOTPRINT:readonly (readonly[number,number])[]=[[-17,-13.1],[-10.5,-13.1],[-10.5,-11.1],[-6,-11.1],[-6,-13.1],[6,-13.1],[6,-11.1],[10.5,-11.1],[10.5,-13.1],[17,-13.1],[17,-1.6],[12,-1.6],[12,5.5],[9,8.5],[3,8.5],[3,11.5],[-3,11.5],[-3,8.5],[-9,8.5],[-12,5.5],[-12,.4],[-17,.4]];
const walk:WalkRegion[]=[...R.map(r=>({id:`room:${r.id}`,bounds:r.bounds})),...H.map(h=>({id:`hall:${h.id}`,bounds:h.bounds})),{id:'outside:forecourt',bounds:rect(-2.1,2.1,11.5,15)}];
const anchors:Anchor[]=[
 // Seats match furniture.ts. A seat's yaw turns a figure built facing +z to face its desk.
 {id:'jackDeskSeat',xyz:[-13.0,0,-11.55],yaw:Math.PI,label:'Jack at primary workstation'},
 {id:'jackBenchChair',xyz:[-14.0,0,-8.85],yaw:0,label:'The bench chair Jack fetches (Ch 1)'},
 {id:'intercomTarget',xyz:[-12.25,.86,-12.3],yaw:Math.PI,label:'Chapter 1 intercom, on Jack\u2019s desk'},
 {id:'sarahDeskSeat',xyz:[15.55,0,-10.4],yaw:Math.PI/2,label:'Sarah at desk; desk opposite doorway'},
 {id:'tabletPickup',xyz:[16.3,.75,-9.75],yaw:Math.PI/2,label:'Sarah tablet'},
 {id:'sceneHandoffStart',xyz:[-11,1.75,-9.5],yaw:0,label:'Camera departs Jack'},
 {id:'sceneHandoffEnd',xyz:[13.4,1.65,-9.7],yaw:Math.PI/2,label:'Camera arrives behind Sarah'},
 {id:'arrayGlassLook',xyz:[0,1.7,-10.6],yaw:0,label:'Array view from the control room, over the consoles'},
 {id:'emergencyLever',xyz:[-4.6,1.1,-12.6],yaw:Math.PI,label:'Manual Array shutdown'},
 {id:'securityScanner',xyz:[2.86,1.25,9.05],yaw:-Math.PI/2,label:'Badge access'},
 {id:'labExit',xyz:[0,0,11.9],yaw:0,label:'Exterior entrance'},
 {id:'vehicleSpawn',xyz:[0,0,18],yaw:Math.PI,label:'Vehicle staging outside'},
 {id:'jackSpawn',xyz:[-13,0,-10.6],yaw:Math.PI,label:'Chapter 1 Jack'},
 {id:'sarahSpawn',xyz:[15.0,0,-10.4],yaw:Math.PI/2,label:'Chapter 1 Sarah'},
];
export const PLAN:LabPlan={rooms:R,halls:H,doors:D,portals:P,walls:W,walk,anchors,bounds:rect(-18,18,-14,14)};
export function roomAt(x:number,z:number):RoomId| 'corridor' | 'outside' { const r=PLAN.rooms.find(v=>inRect(x,z,v.bounds));return r?.id??(PLAN.halls.some(v=>inRect(x,z,v.bounds))?'corridor':'outside'); }
export function inRect(x:number,z:number,r:Rect,epsilon=0):boolean{return x>=r.x0-epsilon&&x<=r.x1+epsilon&&z>=r.z0-epsilon&&z<=r.z1+epsilon}
export function anchor(id:string):Anchor {const a=PLAN.anchors.find(a=>a.id===id);if(!a)throw new Error(`Unknown TOMBS anchor: ${id}`);return a}
export function getRoom(id:RoomId):Room {const r=PLAN.rooms.find(r=>r.id===id);if(!r)throw new Error(`Missing TOMBS room: ${id}`);return r}

/** Restrict the playable prototype to the floor footprint (the island integration owns outdoor terrain). */
export function isWalkable(x:number,z:number):boolean{return PLAN.walk.some(w=>inRect(x,z,w.bounds))}

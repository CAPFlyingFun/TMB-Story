import {PLAN,isWalkable} from './spec';
import type {CollisionSegment, DoorId, Portal, Wall} from './types';

/** Straight wall sections come from the SAME opening cuts used by the renderer. */
export function cutWall(wall:Wall, portals:readonly Portal[]=PLAN.portals):{ from:readonly[number,number]; to:readonly[number,number]; y0:number; y1:number; glass:boolean; id:string }[]{
  const ax=wall.from[0], az=wall.from[1], bx=wall.to[0], bz=wall.to[1];
  const dx=bx-ax,dz=bz-az,L=Math.hypot(dx,dz),ux=dx/L,uz=dz/L;
  const holes=wall.openings.map(id=>{const d=PLAN.doors.find(x=>x.id===id);const p=portals.find(x=>x.id===id);if(!d&&!p)throw new Error(`No such opening ${id}`);
    const at=(d??p)!.at,centre=(at[0]-ax)*ux+(at[1]-az)*uz;
    return {id,start:Math.max(0,centre-(d?.width??p!.width)/2),end:Math.min(L,centre+(d?.width??p!.width)/2),sill:p?.sill??0,height:d?.height??p!.height,kind:p?.kind??'door'};
  }).filter(h=>h.start<h.end).sort((a,b)=>a.start-b.start);
  const pieces:{from:readonly[number,number];to:readonly[number,number];y0:number;y1:number;glass:boolean;id:string}[]=[];
  const section=(t0:number,t1:number,y0:number,y1:number,glass=false,id=wall.id)=>{if(t1-t0<.005||y1-y0<.005)return;
    pieces.push({from:[ax+ux*t0,az+uz*t0],to:[ax+ux*t1,az+uz*t1],y0,y1,glass,id});};
  let prev=0;
  for(const h of holes){if(h.start<prev-.001)throw new Error(`Overlapping openings in ${wall.id}`);
    section(prev,h.start,0,wall.height);
    section(h.start,h.end,0,h.sill,false,`${h.id}:sill`);
    section(h.start,h.end,h.sill+h.height,wall.height,false,`${h.id}:lintel`);
    if(h.kind==='glass') section(h.start,h.end,h.sill,h.sill+h.height,true,`${h.id}:pane`);
    prev=h.end;
  }
  section(prev,L,0,wall.height);
  return pieces;
}
export function collisionSegments():CollisionSegment[]{
 const s:CollisionSegment[]=[];
 for(const w of PLAN.walls) for(const p of cutWall(w)) if(p.y0<1.8 && p.y1>0){
   s.push({id:p.id,x0:p.from[0],z0:p.from[1],x1:p.to[0],z1:p.to[1],height:p.y1,glass:p.glass});
 }
 for(const d of PLAN.doors){const wall=PLAN.walls.find(w=>w.openings.includes(d.id));if(!wall)throw new Error(`Door ${d.id} has no wall`);
  const ax=wall.from[0],az=wall.from[1],bx=wall.to[0],bz=wall.to[1],len=Math.hypot(bx-ax,bz-az),tx=(bx-ax)/len,tz=(bz-az)/len;
  s.push({id:`${d.id}:closed`,doorId:d.id,x0:d.at[0]-tx*d.width/2,z0:d.at[1]-tz*d.width/2,x1:d.at[0]+tx*d.width/2,z1:d.at[1]+tz*d.width/2,height:d.height});
 }
 return s;
}
export const SOLIDS=collisionSegments();
export function pointSegDistanceSquared(x:number,z:number,s:CollisionSegment):number {
 const dx=s.x1-s.x0,dz=s.z1-s.z0,len=dx*dx+dz*dz;
 const t=len>0?Math.max(0,Math.min(1,((x-s.x0)*dx+(z-s.z0)*dz)/len)):0;
 const qx=s.x0+t*dx,qz=s.z0+t*dz;return (x-qx)**2+(z-qz)**2;
}
export function collides(x:number,z:number,radius:number,doorOpen:(id:DoorId)=>boolean):boolean{
 if(!isWalkable(x,z))return true;
 return SOLIDS.some(s=>(!s.doorId||!doorOpen(s.doorId))&&pointSegDistanceSquared(x,z,s)<(radius+.12)**2);
}
/** Slide independently across X then Z, with collision substeps to avoid tunnelling. */
export function moveWithWalls(x:number,z:number,dx:number,dz:number,radius:number,doorOpen:(id:DoorId)=>boolean):readonly[number,number]{
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/Math.max(radius*.7,.06)));
 for(let i=0;i<steps;i++){
  const nx=x+dx/steps, nz=z+dz/steps;
  if(!collides(nx,z,radius,doorOpen))x=nx;
  if(!collides(x,nz,radius,doorOpen))z=nz;
 }
 return [x,z];
}

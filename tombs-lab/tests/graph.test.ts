import {describe,it,expect} from 'vitest';
import {collides} from '../src/tombs/collision';
import {anchor} from '../src/tombs/spec';

/** Deterministic flood-fill through open doors, rejects disconnected floating rooms. */
function connected(from:readonly[number,number],to:readonly[number,number],step=.2):boolean{
 const precision=(v:number)=>Math.round(v/step);
 const key=(x:number,z:number)=>`${precision(x)},${precision(z)}`;
 const queue:[number,number][]=[[precision(from[0])*step,precision(from[1])*step]];
 const visited=new Set<string>([key(...queue[0])]);let index=0;
 while(index<queue.length&&index<26000){const [x,z]=queue[index++];if(Math.hypot(x-to[0],z-to[1])<step*1.5)return true;
  for(const [dx,dz] of [[step,0],[-step,0],[0,step],[0,-step]]){
   const nx=Math.round((x+dx)*1000)/1000,nz=Math.round((z+dz)*1000)/1000,k=key(nx,nz);
   if(visited.has(k)||collides(nx,nz,.14,()=>true))continue;visited.add(k);queue.push([nx,nz]);
  }
 }
 return false;
}
describe('connected route',()=>{
 it('Jack can reach Sarah, the Array and the outer vestibule',()=>{
  const A=anchor('jackSpawn').xyz;
  const pos:(readonly[number,number])[]=[[anchor('sarahSpawn').xyz[0],anchor('sarahSpawn').xyz[2]],[0,0],[0,12.5]];
  for(const end of pos)expect(connected([A[0],A[2]],end)).toBe(true);
 });
});

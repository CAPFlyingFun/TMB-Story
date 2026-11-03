import {describe,it,expect} from 'vitest';
import {PLAN,DIMENSIONS,anchor,isWalkable} from '../src/tombs/spec';
import {cutWall,collisionSegments,collides,moveWithWalls} from '../src/tombs/collision';
import {LabState} from '../src/tombs/state';
import {nearestUse,useObject} from '../src/tombs/interactions';
import {expectedHumanHeight,scaledMetres,SHRINK_RATIO} from '../src/tombs/scale';

describe('metric Draft C',()=>{
 it('has all blueprint rooms, a U corridor, and exact root footprint',()=>{
  expect(PLAN.rooms.map(r=>r.id).sort()).toEqual(['array','break','control','jack','sarah','storage','utility','vestibule'].sort());
  expect(DIMENSIONS.width).toBe(36);expect(DIMENSIONS.depth).toBe(28);
  expect(PLAN.halls.some(x=>x.id==='loop-west')).toBe(true);
  expect(PLAN.halls.some(x=>x.id==='loop-east')).toBe(true);
  expect(PLAN.halls.some(x=>x.id==='loop-south')).toBe(true);
  expect(isWalkable(0,-6.5)).toBe(true);
 });
 it('retains stable interaction and story anchors',()=>{
  expect(anchor('jackDeskSeat').xyz[0]).toBeLessThan(0);
  expect(anchor('sarahDeskSeat').xyz[0]).toBeGreaterThan(0);
  expect(anchor('arrayGlassLook').xyz[2]).toBeLessThan(0);
  expect(nearestUse(-12.25,-12.0)?.id).toBe('tombs.jack.intercom');
 });
 it('cuts identical openings for geometry and collision',()=>{
  for(const w of PLAN.walls){const p=cutWall(w);expect(p.length).toBeGreaterThan(0);for(const v of p){expect(v.y1).toBeGreaterThan(v.y0);}}
  expect(collisionSegments().some(x=>x.id==='array-observation:pane'&&x.glass)).toBe(true);
 });
 it('a closed door blocks and an open door allows passage',()=>{
  const state=new LabState();const isOpen=(id:Parameters<typeof state.isOpen>[0])=>state.isOpen(id);
  expect(collides(-10.5,-9.45,.20,isOpen)).toBe(true);
  expect(state.toggleDoor('jack-door')).toBe(true);
  expect(collides(-10.5,-9.45,.20,isOpen)).toBe(false);
  expect(moveWithWalls(-11,-9.45,1,0,.18,isOpen)[0]).toBeGreaterThan(-10.5);
 });
 it('requires authorization for array entry',()=>{
  const state=new LabState();expect(state.toggleDoor('array-service')).toBe(false);
  useObject(state,'tombs.control.emergency_lever');expect(state.toggleDoor('array-service')).toBe(true);
  const snapshot=state.snapshot();const other=new LabState();other.restore(snapshot);
  expect(other.isOpen('array-service')).toBe(true);expect(other.mode).toBe('emergency');
 });
 it('keeps the island outside the 1:180 town transform',()=>{
  expect(SHRINK_RATIO).toBe(180);
  expect(scaledMetres(36,1/SHRINK_RATIO)).toBeCloseTo(.2,12);
  expect(expectedHumanHeight(1.7)).toBeCloseTo(.0094444444,7);
 });
});

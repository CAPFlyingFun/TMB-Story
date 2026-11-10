import * as THREE from 'three';
import {PLAN,FOOTPRINT,ARRAY_OCTAGON} from './spec';
import {cutWall} from './collision';
import type {DoorId} from './types';
import {LabState} from './state';
import {FURNITURE,type Furniture} from './furniture';
import {buildDressing,type LabDressing} from './dressing';
import {floorTiles,laminate,nightFoliage} from './textures';

// 2026-11-10, toward Joshua's approved Chapter 1 stills (the lab at night): light grey walls, a
// dark grey tiled floor, grey laminate desk tops on steel legs, white cabinets, dark consoles.
const palette={floor:0x8b9096,ceiling:0x233143,wall:0xc2c8ce,external:0x9aa5ae,
 partition:0x637c8e,arrayWall:0x345468,blue:0x46c4ff,amber:0xffb557,red:0xf46c73,
 console:0x1d2228,metal:0x8f979f,desk:0x8a9097,chair:0x2f343b,grass:0x24544d,cabinet:0xe2e5e8};
type Block={x:number;y:number;z:number;sx:number;sy:number;sz:number;ry:number};
class Batch{
 private lists=new Map<string,Block[]>();
 constructor(private readonly root:THREE.Group,private readonly mat:Map<string,THREE.Material>){}
 add(name:string,x:number,y:number,z:number,sx:number,sy:number,sz:number,ry=0):void{
  let a=this.lists.get(name);if(!a){a=[];this.lists.set(name,a)}a.push({x,y,z,sx,sy,sz,ry})
 }
 build():number{
  const unit=new THREE.BoxGeometry(1,1,1),obj=new THREE.Object3D();
  for(const [name,blocks] of this.lists){const mesh=new THREE.InstancedMesh(unit,this.mat.get(name)!,blocks.length);mesh.name=`TOMBS:batch:${name}`;
    blocks.forEach((b,i)=>{obj.position.set(b.x,b.y,b.z);obj.rotation.set(0,b.ry,0);obj.scale.set(b.sx,b.sy,b.sz);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix)});
    mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();this.root.add(mesh)
  }
  return this.lists.size;
 }
}
function labelSprite(text:string,width=3.1):THREE.Sprite{
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const c=canvas.getContext('2d')!;
 c.fillStyle='rgba(8,26,41,.78)';c.fillRect(0,0,512,96);c.strokeStyle='#5ad6f5';c.lineWidth=3;c.strokeRect(3,3,506,90);
 c.textAlign='center';c.textBaseline='middle';c.font='bold 30px system-ui';c.fillStyle='#daf7ff';c.fillText(text,256,49,485);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false}));sprite.scale.set(width,width*96/512,1);return sprite;
}
function boxMaterial(hex:number,emissive=0,opacity=1):THREE.MeshStandardMaterial{return new THREE.MeshStandardMaterial({color:hex,roughness:.75,metalness:.18,emissive,emissiveIntensity:emissive? .35:0,transparent:opacity<1,opacity})}
function shaded(o:THREE.Object3D,cast:boolean):void{o.castShadow=cast;o.receiveShadow=true}
export interface LabDisplay{
 readonly group:THREE.Group;
 readonly roof:THREE.Group;
 readonly doors:ReadonlyMap<DoorId,THREE.Group>;
 readonly arrayRings:readonly THREE.Mesh[];
 readonly stats:{staticDrawGroups:number;roomCount:number;doorCount:number};
 /** The pieces a story or a game moves or switches: chairs, named screens, their glows, desk lamps (dressing.ts). */
 readonly dressing:LabDressing;
 /** What is seen through the outside windows (night foliage); hide it once the view outside is something else. */
 readonly outside:THREE.Group;
 setRoof(on:boolean):void;
 /** Room name tags. They draw through walls, so they belong to the top view, not to walking around. */
 setLabels(on:boolean):void;
 update(dt:number,state:LabState):void;
 dispose():void;
}
/** Builds editable procedural meshes, NOT a baked disconnected environment. */
export function buildLab(_state:LabState):LabDisplay{
 const root=new THREE.Group();root.name='TOMBS:DRAFT-C:LAB';
 const shell=new THREE.Group();shell.name='TOMBS:static-facility';root.add(shell);
 const roof=new THREE.Group();roof.name='TOMBS:removable-roof';root.add(roof);roof.visible=false;
 const labels=new THREE.Group();labels.name='TOMBS:room-labels';root.add(labels);labels.visible=false;
 const m=new Map<string,THREE.Material>([
  ['floor',new THREE.MeshStandardMaterial({color:palette.floor,roughness:.42,metalness:.12,map:floorTiles()})],['wall',new THREE.MeshStandardMaterial({color:palette.wall,roughness:.88,metalness:0})],['external',new THREE.MeshStandardMaterial({color:palette.external,roughness:.88,metalness:0})],
  ['array',boxMaterial(palette.arrayWall)],['metal',new THREE.MeshStandardMaterial({color:palette.metal,roughness:.35,metalness:.7})],['desk',new THREE.MeshStandardMaterial({color:palette.desk,roughness:.4,metalness:.35,map:laminate()})],
  ['cabinet',new THREE.MeshStandardMaterial({color:palette.cabinet,roughness:.6,metalness:.05})],
  ['console',boxMaterial(palette.console)],['chair',boxMaterial(palette.chair)],
  ['light',new THREE.MeshBasicMaterial({color:0xa5e9ff})],['screen',new THREE.MeshBasicMaterial({color:0x2cbcf2})],
  ['red',new THREE.MeshBasicMaterial({color:0xe35f61})],['yellow',new THREE.MeshBasicMaterial({color:0xf3c37c})],
  ['plant',boxMaterial(0x3f7d4f)],['pot',boxMaterial(0x6e5a4a)],['fabric',boxMaterial(0x46607a)],['book',boxMaterial(0x8a6f52)],
 ]);
 const batch=new Batch(shell,m);
 // ONE floor slab under the whole building, traced along the outside walls. Per-room and per-hall
 // boxes left gaps wherever no room or hall rectangle reached (between the wings, beside the
 // chamber) and overlapped where halls crossed, and overlapping tops at y=0 z-fight.
 const placeFloor=(x0:number,x1:number,z0:number,z1:number)=>batch.add('floor',(x0+x1)/2,-.12,(z0+z1)/2,x1-x0,.24,z1-z0);
 {
  // The building's outline (spec.ts FOOTPRINT) pushed out 8 cm, under the outer face of the
  // thinner outside walls.
  const outline=offsetPolygon(FOOTPRINT,.08);
  const shape=new THREE.Shape(outline.map(([x,z])=>new THREE.Vector2(x,-z)));
  const slab=new THREE.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:false});slab.rotateX(-Math.PI/2);
  const floor=new THREE.Mesh(slab,m.get('floor'));floor.position.y=-.24;floor.name='TOMBS:floor-slab';shell.add(floor);
 }
 // Forecourt is WORLD-side integration marker: small normal-scale section here only for preview.
 placeFloor(-2.2,2.2,11.5+.08,14); // starts where the slab ends: overlapping tops at y=0 flicker
 // The corridor reads as a U even from overhead thanks to continuous floor markers.
 for(const [x,z,ry,len] of [[-10.5,-1.5,0,12],[10.5,-1.5,0,12],[0,7,Math.PI/2,18]] as const){ // down the middle of the corridor ring
   batch.add('light',x,.012,z,.032,.014,len,ry);
 }
 // Real walls, carefully cut around doors and windows. Geometry and collision share cutWall().
 const glassMat=new THREE.MeshPhysicalMaterial({color:0x91d7ef,transparent:true,opacity:.32,metalness:.05,roughness:.12,side:THREE.DoubleSide,depthWrite:false});
 // Does another wall meet this one at `end` and run on in the same straight line?
 const continues=(wall:(typeof PLAN.walls)[number],end:readonly[number,number])=>PLAN.walls.some(o=>{
  if(o===wall)return false;
  const touches=[o.from,o.to].some(q=>Math.abs(q[0]-end[0])<.001&&Math.abs(q[1]-end[1])<.001);
  if(!touches)return false;
  const ax=wall.to[0]-wall.from[0],az=wall.to[1]-wall.from[1],bx=o.to[0]-o.from[0],bz=o.to[1]-o.from[1];
  return Math.abs(ax*bz-az*bx)<1e-6*Math.hypot(ax,az)*Math.hypot(bx,bz);
 });
 PLAN.walls.forEach((wall,wallIndex)=>{for(const part of cutWall(wall)){
  const dx=part.to[0]-part.from[0],dz=part.to[1]-part.from[1],len=Math.hypot(dx,dz),h=part.y1-part.y0,yaw=Math.atan2(-dz,dx);
  const x=(part.from[0]+part.to[0])/2,z=(part.from[1]+part.to[1])/2;
  const thick=wall.material==='external'?.28:wall.material==='array'?.25:.16;
  if(part.glass){
   // A little short of the sill and lintel, so the pane's ends never share their faces.
   const pane=new THREE.Mesh(new THREE.BoxGeometry(len-.012,h-.012,.046),glassMat);pane.position.set(x,part.y0+h/2,z);pane.rotation.y=yaw;pane.name=`tombs:glass:${part.id}`;root.add(pane);
   batch.add('metal',x,part.y0+.036,z,len+.05,.07,.11,yaw);batch.add('metal',x,part.y1-.036,z,len+.05,.07,.11,yaw);
  }else{
   // A solid piece that ends at a wall's own end runs on by just under half its thickness, so
   // two walls meeting at a corner fill the corner instead of leaving a notch, without any two
   // faces landing in the same plane. Tops are staggered by a millimetre or two per wall for
   // the same reason: walls of one room share a height, and their overlapping corner tops
   // flickered from above.
   const ext=thick/2-.004,full=Math.hypot(wall.to[0]-wall.from[0],wall.to[1]-wall.from[1]);
   const ux=dx/len,uz=dz/len;
   const t0=Math.hypot(part.from[0]-wall.from[0],part.from[1]-wall.from[1]),t1=Math.hypot(part.to[0]-wall.from[0],part.to[1]-wall.from[1]);
   // ...but not where the wall carries straight on into another wall: two collinear walls
   // overlapping put their faces in the same plane, which is the flicker this is avoiding.
   const e0=t0<.001&&!continues(wall,wall.from)?ext:0,e1=Math.abs(t1-full)<.001&&!continues(wall,wall.to)?ext:0;
   const lift=part.y1>=wall.height-.001?(wallIndex%7)*.0015:0;
   // A sill or lintel over an opening reaches a centimetre into the wall on each side, a
   // millimetre thinner than it: butted exactly edge to edge, the pieces showed a sparkling
   // crack up the side of every door and window.
   const bridge=/:(sill|lintel)$/.test(part.id);
   const L2=len+e0+e1+(bridge?.02:0),cx=x+ux*(e1-e0)/2,cz=z+uz*(e1-e0)/2;
   batch.add(wall.material==='external'?'external':wall.material==='array'?'array':'wall',cx,part.y0+(h+lift)/2,cz,L2,h+lift,bridge?thick-.002:thick,yaw);
  }
 }});
 // Octagonal Array base, central machinery and independent ring articulations.
 // The apparatus is 15% larger than the first draft's, for the larger chamber; its rings still
 // clear the 7.5 m ceiling at any angle.
 const chamber=new THREE.Group();chamber.name='tombs.array';chamber.scale.setScalar(1.15);root.add(chamber);
 const platform=new THREE.Mesh(new THREE.CylinderGeometry(1.65,1.9,.62,32),boxMaterial(0x6b8296));platform.position.y=.36;chamber.add(platform);
 const concentric=new THREE.Mesh(new THREE.TorusGeometry(1.5,.035,8,64),new THREE.MeshBasicMaterial({color:0x65d9f8}));
 concentric.rotation.x=-Math.PI/2;concentric.position.y=.71;chamber.add(concentric);
 const arrayRings:THREE.Mesh[]=[];
 for(let i=0;i<5;i++){
  const t=new THREE.Mesh(new THREE.TorusGeometry(2.65-i*.34,.17-i*.014,9,64),new THREE.MeshStandardMaterial({color:i%2?0x7e9eaf:0x9dc4d2,metalness:.72,roughness:.26,emissive:0x073f59,emissiveIntensity:.18}));
  t.rotation.set(.25+i*.3,i*.55,i*.15);t.position.y=3.55;t.name=`tombs.array.ring-${i}`;arrayRings.push(t);chamber.add(t);
 }
 for(let i=0;i<8;i++){const a=i*2*Math.PI/8,x=Math.cos(a)*4.4,z=Math.sin(a)*4.4;
  batch.add('metal',x,1,z,.3,2,.3);batch.add('light',x,2.05,z,.16,.13,.16);
 }
 // Furniture, from the one list in furniture.ts that the collision and the plan also read.
 buildFurniture(batch,root,m);
 const dressing=buildDressing();root.add(dressing.group);
 // Through each outside window, the island's night: foliage under a moonlit sky, a little way out.
 const outside=new THREE.Group();outside.name='TOMBS:outside-windows';root.add(outside);
 {const fol=nightFoliage();const folMat=new THREE.MeshBasicMaterial({color:0x8a9aa6,map:fol});
  for(const d of PLAN.portals){if(d.kind!=='glass'||!d.id.endsWith('-external'))continue;
   const w=d.width+1.8,h=d.height+1.4,y=d.sill+d.height/2;
   const plane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),folMat);plane.position.set(d.at[0],y,d.at[1]-1.1);plane.name=`tombs:outside:${d.id}`;outside.add(plane);
  }}
 // Area lighting strips (no 100+ point lights).
 for(const r of PLAN.rooms){const x=(r.bounds.x0+r.bounds.x1)/2,z=(r.bounds.z0+r.bounds.z1)/2;
  for(let i=-1;i<=1;i++)batch.add('light',x+i*1.35,r.ceiling-.12,z,1.0,.04,.11);
  const name=labelSprite(r.label,r.id==='control'?4:3);name.position.set(x,Math.min(r.ceiling-.65,3),z);labels.add(name);
 }
 for(const h of PLAN.halls){const x=(h.bounds.x0+h.bounds.x1)/2,z=(h.bounds.z0+h.bounds.z1)/2;
  batch.add('light',x,h.ceiling-.12,z,.55,.05,.10);
 }
 // Roof in a completely separate group; remove it for top-down inspection or cinematic interior.
 const roofMat=new THREE.MeshStandardMaterial({color:0x243a48,metalness:.28,roughness:.55,transparent:true,opacity:.88,side:THREE.DoubleSide});
 for(const r of PLAN.rooms){if(r.id==='array')continue;
  const b=r.bounds;const panel=new THREE.Mesh(new THREE.BoxGeometry(b.x1-b.x0,.18,b.z1-b.z0),roofMat);
  panel.position.set((b.x0+b.x1)/2,r.ceiling+.10,(b.z0+b.z1)/2);roof.add(panel);
 }
 {const sh=new THREE.Shape(ARRAY_OCTAGON.map(([x,z])=>new THREE.Vector2(x,-z)));const g=new THREE.ExtrudeGeometry(sh,{depth:.18,bevelEnabled:false});g.rotateX(-Math.PI/2);
  const arrayRoof=new THREE.Mesh(g,roofMat);arrayRoof.position.y=7.55;roof.add(arrayRoof);}
 for(const h of PLAN.halls){const b=h.bounds;const panel=new THREE.Mesh(new THREE.BoxGeometry(b.x1-b.x0,.13,b.z1-b.z0),roofMat);
 panel.position.set((b.x0+b.x1)/2,h.ceiling+.1,(b.z0+b.z1)/2);roof.add(panel)}
 const doorGroups=new Map<DoorId,THREE.Group>();
 // Each door is one leaf, or two for the wide paired entrance doors, and each leaf slides into
 // its own wall: the longer side of it, by no more than that side holds. A leaf is a few
 // millimetres inside its opening on every side, and its top strip a few millimetres inside the
 // leaf's ends: faces that share a plane flicker (z-fighting), worst when a door stands open
 // with its edge in the opening.
 type Leaf={node:THREE.Group;slide:[number,number]};
 const doorLeaves=new Map<DoorId,Leaf[]>();
 const doorMaterial=boxMaterial(0x8ba7b5);const glassDoorMaterial=new THREE.MeshPhysicalMaterial({color:0x75bfd4,metalness:.12,roughness:.2,transparent:true,opacity:.72});
 const edgeMaterial=new THREE.MeshBasicMaterial({color:0x4cc7eb});
 const frameMaterial=boxMaterial(0x5d7486);
 for(const d of PLAN.doors){const g=new THREE.Group();g.name=`tombs:door:${d.id}`;g.position.set(d.at[0],0,d.at[1]);root.add(g);doorGroups.set(d.id,g);
  const wall=PLAN.walls.find(w=>w.openings.includes(d.id))!;
  const L=Math.hypot(wall.to[0]-wall.from[0],wall.to[1]-wall.from[1]),ux=(wall.to[0]-wall.from[0])/L,uz=(wall.to[1]-wall.from[1])/L;
  const c=(d.at[0]-wall.from[0])*ux+(d.at[1]-wall.from[1])*uz;
  const before=c-d.width/2-.05,after=L-c-d.width/2-.05;
  const yaw=Math.atan2(-uz,ux);
  const paired=d.width>=2;
  const spans:[number,number,number][]=paired?[[-d.width/4,d.width/2,-1],[d.width/4,d.width/2,1]]:[[0,d.width,after>=before?1:-1]];
  const leaves:Leaf[]=[];
  for(const [offset,width,dir] of spans){
   const room=dir>0?after:before;
   // A pocket door: open, the leaf goes ALL the way into its wall, a few centimetres past the
   // opening's edge, so no sliver of it is left standing in the doorway (that sliver, a few
   // centimetres from the jamb, shimmered like z-fighting). Only a wall too short to hold it
   // stops it sooner.
   const travel=Math.max(0,Math.min(width+.08,room));
   const leaf=new THREE.Group();leaf.position.set(ux*offset,0,uz*offset);leaf.rotation.y=yaw;g.add(leaf);
   const lw=width-.024,lh=d.height-.014;
   const panel=new THREE.Mesh(new THREE.BoxGeometry(lw,lh,.085),d.id.startsWith('security')?glassDoorMaterial:doorMaterial);panel.position.y=lh/2;panel.name=`door:panel:${d.id}`;leaf.add(panel);
   // The top strip is a hair thinner than the leaf itself, so it never stands out of the leaf's
   // faces to catch the light inside the wall's pocket.
   const edge=new THREE.Mesh(new THREE.BoxGeometry(lw-.012,.06,.08),edgeMaterial);edge.position.y=lh-.045;leaf.add(edge);
   leaves.push({node:leaf,slide:[ux*dir*travel,uz*dir*travel]});
  }
  doorLeaves.set(d.id,leaves);
  // A door frame (casing) on both faces of the wall: two jambs and a head, a little deeper than
  // the wall so they stand proud of it, and overlapping the opening by 3.5 cm so the leaf's
  // edges, the gap round a closed door and the cut ends of the wall all sit behind them.
  {
   const thick=wall.material==='external'?.28:wall.material==='array'?.25:.16,depth=thick+.03,t=.07;
   for(const side of [-1,1]){
    const jamb=new THREE.Mesh(new THREE.BoxGeometry(t,d.height,depth),frameMaterial);
    jamb.position.set(ux*side*d.width/2,d.height/2,uz*side*d.width/2);jamb.rotation.y=yaw;g.add(jamb);
   }
   const head=new THREE.Mesh(new THREE.BoxGeometry(d.width+2*t,t,depth+.006),frameMaterial);
   head.position.set(0,d.height,0);head.rotation.y=yaw;g.add(head);
  }
 }
 // Lamps belong to town, so they naturally follow a 1:180 shrink.
 const ambient=new THREE.HemisphereLight(0xa7dbff,0x1a2027,1.4);ambient.name='TOMBS:fill';root.add(ambient);
 const highlights:THREE.PointLight[]=[];
 for(const [x,y,z] of [[-13.6,3.0,-10.2],[0,3,-10],[13.6,3.0,-10.2],[0,5,0]] as const){
  const light=new THREE.PointLight(0x9adbff,26,16,2);light.position.set(x,y,z);highlights.push(light);root.add(light);
 }
 const staticDrawGroups=batch.build();
 shell.traverse(o=>{if(o instanceof THREE.Mesh){const n=o.name;shaded(o,/batch:(desk|metal|cabinet|console)$/.test(n))}});
 const animatedDoor=new Map<DoorId,number>();for(const d of PLAN.doors)animatedDoor.set(d.id,0);
 const spinRate=[.35,-.28,.22,-.18,.14];
 function update(dt:number,s:LabState):void{
  const mode=s.mode;const alarm=mode==='alarm'||mode==='emergency';
  // night (the approved stills): the ceiling lights soft and cool, the room's warmth from its desk lamps
  for(const [i,l] of highlights.entries()){l.color.setHex(alarm?(i%2?0xff6355:0xedac6b):mode==='dawn'?0xffd9b1:0xa8c8e8);l.intensity=alarm?12:mode==='night'?9:21}
  ambient.intensity=mode==='night'?.62:alarm?.55:1.4;
  for(const d of PLAN.doors){const old=animatedDoor.get(d.id)??0,target=s.isOpen(d.id)?1:0;
    // Ease toward the target and STOP there. The first draft stepped "down" whenever it was not
    // below the target, so an open door (at 1, target 1) stepped back every other frame and
    // shuddered between nearly open and open: the flicker Joshua saw.
    const step=dt*1.6,next=old<target?Math.min(target,old+step):Math.max(target,old-step);animatedDoor.set(d.id,next);
    for(const leaf of doorLeaves.get(d.id)!){const base=leaf.node.userData.base??(leaf.node.userData.base=leaf.node.position.clone());
     leaf.node.position.set(base.x+next*leaf.slide[0],0,base.z+next*leaf.slide[1]);}
  }
  if(mode==='activation'){arrayRings.forEach((ring,i)=>{ring.rotation.y+=spinRate[i]*dt;ring.rotation.x+=spinRate[i]*dt*.42})}
 }
 return {group:root,roof,doors:doorGroups,arrayRings,stats:{staticDrawGroups,roomCount:PLAN.rooms.length,doorCount:PLAN.doors.length},
  dressing,outside,
  setRoof:(on:boolean)=>{roof.visible=on},setLabels:(on:boolean)=>{labels.visible=on},update,dispose(){root.traverse(o=>{
    if(o instanceof THREE.Mesh){o.geometry.dispose();const arr=Array.isArray(o.material)?o.material:[o.material];for(const mat of arr)mat.dispose()}
    if(o instanceof THREE.Sprite){o.material.map?.dispose();o.material.dispose()}
   });dressing.dispose();for(const mat of m.values())mat.dispose();glassMat.dispose();roofMat.dispose();doorMaterial.dispose();glassDoorMaterial.dispose();edgeMaterial.dispose();frameMaterial.dispose();root.removeFromParent();}
 };
}
/** Decorative only: insects and landscape remain in island world, OUTSIDE townRoot. */
export function buildIslandScaleReferences():THREE.Group{
 const root=new THREE.Group();root.name='ISLAND:UNSCALED-REFERENCE';
 const grassMat=new THREE.MeshStandardMaterial({color:0x276854,side:THREE.DoubleSide,roughness:1});
 for(let i=0;i<30;i++){
  const ang=i*2.399,s=.095+Math.sqrt(i+1)*.06,x=Math.cos(ang)*s,z=.24+Math.sin(ang)*s;
  const h=.12+(i%7)*.06;
  const blade=new THREE.Mesh(new THREE.ConeGeometry(.012,h,3),grassMat);blade.position.set(x,h/2,z);blade.rotation.z=(i%5-2)*.085;root.add(blade)
 }
 // A 5 mm ant is a procedural SCALE REFERENCE, not a replacement for the game's real insects.
 const ant=new THREE.Group();ant.name='ISLAND:ant-placeholder-only';ant.position.set(.12,.006,.18);
 const black=boxMaterial(0x40251b);const head=new THREE.Mesh(new THREE.SphereGeometry(.0012,8,6),black);head.position.x=-.002;ant.add(head);
 const thorax=new THREE.Mesh(new THREE.SphereGeometry(.0008,8,6),black);ant.add(thorax);
 const abdomen=new THREE.Mesh(new THREE.SphereGeometry(.0017,8,6),black);abdomen.position.x=.0025;ant.add(abdomen);
 for(let i=0;i<3;i++)for(const side of [-1,1]){
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(.00012,.00010,.004,4),black);leg.position.set((i-1)*.0014,.0006,side*.002);leg.rotation.x=side*.78;ant.add(leg)
 }
 root.add(ant);root.visible=false;return root;
}

/** Furniture from furniture.ts, built of boxes in each piece's own frame: `a` across it, `b`
 * along the way its user looks (so the user's side is negative b), `y` up from its underside. */
function buildFurniture(batch:{add(name:string,x:number,y:number,z:number,sx:number,sy:number,sz:number,ry?:number):void},root:THREE.Group,m:Map<string,THREE.Material>):void{
 const F={n:[0,-1],s:[0,1],e:[1,0],w:[-1,0]} as const;
 for(const it of FURNITURE){
  const [fx,fz]=F[it.facing],rx=-fz,rz=fx;
  const along=fz!==0; // looks along z: its width runs along x
  const W=along?it.w:it.d,D=along?it.d:it.w,H=it.h,y0=it.y0??0;
  const box=(mat:string,a:number,b:number,y:number,sa:number,sb:number,sy:number)=>{
   const x=it.x+a*rx+b*fx,z=it.z+a*rz+b*fz;
   batch.add(mat,x,y0+y,z,along?sa:sb,sy,along?sb:sa);
  };
  piece(it,W,D,H,box,root,m,y0);
 }
}
function piece(it:Furniture,W:number,D:number,H:number,box:(mat:string,a:number,b:number,y:number,sa:number,sb:number,sy:number)=>void,root:THREE.Group,m:Map<string,THREE.Material>,y0:number):void{
 switch(it.kind){
 case 'desk':{
  // the top and its steel frame; its monitors, keyboard and mouse are dressing.ts's (named screens)
  box('desk',0,0,H-.025,W,D,.05);
  for(const sa of [-1,1])for(const sb of [-1,1])box('metal',sa*(W/2-.05),sb*(D/2-.05),(H-.05)/2,.05,.05,H-.05);
  for(const sa of [-1,1])box('metal',sa*(W/2-.05),0,.06,.04,D-.1,.04);
  box('metal',0,D/2-.06,H-.12,W-.12,.02,.14);
  break}
 case 'console':{
  box('console',0,.02,(H-.04)/2,W,D-.04,H-.04);box('desk',0,0,H-.02,W+.02,D,.04);
  for(const a of [-.72,0,.72]){box('console',a,D/2-.18,H+.3,.62,.05,.4);box('screen',a,D/2-.21,H+.3,.57,.01,.35);}
  box('light',0,-D/2+.004,H-.12,W*.8,.008,.03);
  break}
 case 'chair':break; // a movable group of its own (dressing.ts)
 case 'bench':{
  // white drawer units under a steel top, and one instrument case at its end
  box('cabinet',0,.03,(H-.05)/2,W-.04,D-.06,H-.05);box('metal',0,0,H-.025,W,D,.05);
  for(let i=0;i<5;i++){const a=-W/2+W*(i+.5)/5;for(let k=1;k<4;k++)box('metal',a,-D/2+.024,k*(H-.05)/4,W/5-.12,.008,.012);box('console',a,-D/2+.026,(H-.05)*.9,.12,.01,.025)}
  box('console',-W/4,D/2-.22,H+.15,.5,.32,.3);box('light',-W/4,-.06+D/2-.22-.16,H+.22,.06,.004,.02);
  break}
 case 'shelf':{
  for(const s of [-1,1])box('metal',s*(W/2-.03),0,H/2,.04,D,H);
  for(let i=0;i<5;i++)box('metal',0,0,.08+i*(H-.12)/4,W-.06,D,.03);
  for(let i=0;i<4;i++)box('console',(i%2?.15:-.12),.02,.1+i*(H-.12)/4+.17,W*.55,D*.75,.3);
  break}
 case 'rack':{
  box('console',0,0,H/2,W,D,H);
  for(let i=0;i<6;i++)box(i%2?'light':'screen',0,-D/2-.006,.3+i*.3,W*.6,.012,.05);
  break}
 case 'cabinet':{
  box('console',0,0,H/2,W,D,H);
  for(let i=1;i<4;i++)box('metal',0,-D/2-.005,i*H/4,W*.9,.01,.012);
  box('light',W*.3,-D/2-.006,H-.12,.08,.01,.05);
  break}
 case 'counter':{
  box('metal',0,.02,(H-.04)/2,W-.02,D-.04,H-.04);box('desk',0,0,H-.02,W,D,.04);
  break}
 case 'round-table':{
  const top=new THREE.Mesh(new THREE.CylinderGeometry(W/2,W/2,.04,24),m.get('desk'));top.position.set(it.x,y0+H-.02,it.z);root.add(top);
  box('metal',0,0,(H-.04)/2,.07,.07,H-.04);box('metal',0,0,.015,W*.5,W*.5,.03);
  break}
 case 'fridge':{box('metal',0,0,H/2,W,D,H);box('console',W*.35,-D/2-.01,H*.6,.03,.02,.5);box('metal',0,-D/2-.004,H*.42,W*.95,.008,.01);break}
 case 'emergency-panel':{
  box('console',0,0,H/2,W,D,H);box('red',0,-D/2-.006,H-.12,W*.9,.012,.05);
  box('yellow',0,-D/2-.06,H*.62,.08,.1,.42);box('metal',0,-D/2-.03,H*.62-.24,.18,.06,.06);
  break}
 case 'reader':{box('console',0,0,H/2,W,D,H);box('light',0,-W/2-.004,H*.65,.012,D*.6,.05);break}
 case 'credenza':{box('desk',0,0,H/2,W,D,H);for(const a of [-W/4,W/4])box('metal',a,-D/2-.004,H*.55,W*.4,.008,.012);break}
 case 'bookcase':{
  box('desk',0,0,H/2,W,D,H);
  for(let i=0;i<4;i++)box('book',(i%2?.08:-.06),-D/2+.12,.25+i*.45,W*.8,.22,.28);
  break}
 case 'armchair':{
  box('fabric',0,0,.22,W,D,.44);box('fabric',0,-D/2+.1,.62,W,.2,.4);
  for(const s of [-1,1])box('fabric',s*(W/2-.07),.05,.55,.14,D-.1,.26);
  break}
 case 'plant':{
  box('pot',0,0,.2,W*.75,D*.75,.4);
  const leaves=new THREE.Mesh(new THREE.SphereGeometry(Math.min(W,D)*.62,10,8),m.get('plant'));leaves.position.set(it.x,y0+.4+(H-.4)/2,it.z);leaves.scale.y=(H-.4)/(Math.min(W,D)*1.2);root.add(leaves);
  break}
 case 'crate':{box('metal',0,0,H/2,W,D,H);box('yellow',0,-D/2-.004,H*.7,W*.5,.008,.04);break}
 case 'intercom':break; // dressing.ts: its grille and green ring
 case 'glass-cabinet':case 'wall-shelf':case 'microscope':case 'tube-rack':case 'desk-lamp':case 'pot-plant':break; // dressing.ts
 case 'tablet':break; // dressing.ts: a prop a hand carries
 case 'coffee-machine':{box('console',0,0,H/2,W,D,H);box('red',W*.25,-D/2-.004,H*.75,.03,.008,.03);break}
 case 'electrical-panel':{box('metal',0,0,H/2,W,D,H);box('yellow',0,-D/2-.004,H*.8,W*.3,.008,.06);break}
 }
}

/** A simple polygon pushed outward by `d` (corners mitred). Counter-clockwise or clockwise both work. */
export function offsetPolygon(pts:readonly(readonly[number,number])[],d:number):[number,number][]{
 let area=0;for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];area+=a[0]*b[1]-b[0]*a[1]}
 const sgn=area>0?-1:1,n=pts.length,out:[number,number][]=[];
 for(let i=0;i<n;i++){
  const p=pts[(i+n-1)%n],c=pts[i],q=pts[(i+1)%n];
  const n1=norm(c[0]-p[0],c[1]-p[1]),n2=norm(q[0]-c[0],q[1]-c[1]);
  const o1:[number,number]=[sgn*-n1[1],sgn*n1[0]],o2:[number,number]=[sgn*-n2[1],sgn*n2[0]];
  const bx=o1[0]+o2[0],bz=o1[1]+o2[1],k=1+o1[0]*o2[0]+o1[1]*o2[1];
  out.push([c[0]+d*bx/k,c[1]+d*bz/k]);
 }
 return out;
}
function norm(x:number,z:number):[number,number]{const l=Math.hypot(x,z)||1;return [x/l,z/l]}

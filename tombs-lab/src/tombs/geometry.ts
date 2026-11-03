import * as THREE from 'three';
import {PLAN} from './spec';
import {cutWall} from './collision';
import type {DoorId} from './types';
import {LabState} from './state';

const palette={floor:0x343f50,ceiling:0x233143,wall:0x98a8b2,external:0x4d6475,
 partition:0x637c8e,arrayWall:0x345468,blue:0x46c4ff,amber:0xffb557,red:0xf46c73,
 console:0x1e2e42,metal:0x728a9e,desk:0x526579,chair:0x293f53,grass:0x24544d};
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
export interface LabDisplay{
 readonly group:THREE.Group;
 readonly roof:THREE.Group;
 readonly doors:ReadonlyMap<DoorId,THREE.Group>;
 readonly arrayRings:readonly THREE.Mesh[];
 readonly stats:{staticDrawGroups:number;roomCount:number;doorCount:number};
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
  ['floor',boxMaterial(palette.floor)],['wall',boxMaterial(palette.wall)],['external',boxMaterial(palette.external)],
  ['array',boxMaterial(palette.arrayWall)],['metal',boxMaterial(palette.metal)],['desk',boxMaterial(palette.desk)],
  ['console',boxMaterial(palette.console)],['chair',boxMaterial(palette.chair)],
  ['light',new THREE.MeshBasicMaterial({color:0xa5e9ff})],['screen',new THREE.MeshBasicMaterial({color:0x2cbcf2})],
  ['red',new THREE.MeshBasicMaterial({color:0xe35f61})],['yellow',new THREE.MeshBasicMaterial({color:0xf3c37c})],
 ]);
 const batch=new Batch(shell,m);
 // ONE floor slab under the whole building, traced along the outside walls. Per-room and per-hall
 // boxes left gaps wherever no room or hall rectangle reached (between the wings, beside the
 // chamber) and overlapped where halls crossed, and overlapping tops at y=0 z-fight.
 const placeFloor=(x0:number,x1:number,z0:number,z1:number)=>batch.add('floor',(x0+x1)/2,-.12,(z0+z1)/2,x1-x0,.24,z1-z0);
 {
  const T=.08; // to the outer face of the thinner (0.16 m) outside walls; the 0.28 m ones overhang it a little
  const outline:[number,number][]=[[-17-T,-13.1-T],[17+T,-13.1-T],[17+T,5.3],[10.1,8.5+T],[3+T,8.5+T],[3+T,11.5+T],[-3-T,11.5+T],[-3-T,8.5+T],[-10.1,8.5+T],[-17-T,4.8]];
  const shape=new THREE.Shape(outline.map(([x,z])=>new THREE.Vector2(x,-z)));
  const slab=new THREE.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:false});slab.rotateX(-Math.PI/2);
  const floor=new THREE.Mesh(slab,m.get('floor'));floor.position.y=-.24;floor.name='TOMBS:floor-slab';shell.add(floor);
 }
 // Forecourt is WORLD-side integration marker: small normal-scale section here only for preview.
 placeFloor(-2.2,2.2,11.5+.08,14); // starts where the slab ends: overlapping tops at y=0 flicker
 // The corridor reads as a U even from overhead thanks to continuous floor markers.
 for(const [x,z,ry,len] of [[-8.1,-3.5,0,9],[8.1,-3.5,0,9],[0,7,Math.PI/2,14]] as const){
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
 const chamber=new THREE.Group();chamber.name='tombs.array';root.add(chamber);
 const platform=new THREE.Mesh(new THREE.CylinderGeometry(1.65,1.9,.62,32),boxMaterial(0x6b8296));platform.position.y=.36;chamber.add(platform);
 const concentric=new THREE.Mesh(new THREE.TorusGeometry(1.5,.035,8,64),new THREE.MeshBasicMaterial({color:0x65d9f8}));
 concentric.rotation.x=-Math.PI/2;concentric.position.y=.71;chamber.add(concentric);
 const arrayRings:THREE.Mesh[]=[];
 for(let i=0;i<5;i++){
  const t=new THREE.Mesh(new THREE.TorusGeometry(2.65-i*.34,.17-i*.014,9,64),new THREE.MeshStandardMaterial({color:i%2?0x7e9eaf:0x9dc4d2,metalness:.72,roughness:.26,emissive:0x073f59,emissiveIntensity:.18}));
  t.rotation.set(.25+i*.3,i*.55,i*.15);t.position.y=3.55;t.name=`tombs.array.ring-${i}`;arrayRings.push(t);chamber.add(t);
 }
 for(let i=0;i<8;i++){const a=i*2*Math.PI/8,x=Math.cos(a)*3.4,z=Math.sin(a)*3.4;
  batch.add('metal',x,1,z,.3,2,.3);batch.add('light',x,2.05,z,.16,.13,.16);
 }
 // Interior props. Everything decorative is grouped by material to limit draw calls on phones.
 function desk(x:number,z:number,angle=0):void{batch.add('desk',x,.73,z,2.2,.09,.84,angle);batch.add('metal',x-.9,.35,z,.12,.7,.12,angle);batch.add('metal',x+.9,.35,z,.12,.7,.12,angle);
   batch.add('console',x,.95,z-.28,.78,.44,.075,angle);batch.add('screen',x,.96,z-.235,.69,.32,.018,angle);
   batch.add('chair',x, .46,z+1,.62,.14,.58);batch.add('chair',x,.83,z+1.25,.60,.64,.12);
 }
 desk(-14.4,-11.75);desk(-12,-9.1);desk(14.1,-11.75);
 // Deep control-room consoles face the physical observation port.
 for(let i=0;i<5;i++){const x=-4.8+i*2.4;desk(x,-11.2)}
 // Secondary central workstation and manual shutdown panel.
 batch.add('console',-2.2,1,-9.7,.64,1.8,.3);
 batch.add('yellow',-2.2,1.65,-9.48,.08,.42,.1);
 // Storage shelving and crates.
 for(let i=0;i<4;i++){const z=-5.05+i*.94;batch.add('metal',-16.5,1.15,z,.65,2.25,.65);for(let j=0;j<3;j++)batch.add('console',-16.5,.42+j*.72,z,.57,.34,.57)}
 // Break nook: countertop, cupboards, tabletop and coffee fixtures.
 batch.add('desk',-15.2,.81,1.15,2.7,.12,.7);batch.add('metal',-15.1,.37,1.15,2.65,.62,.65);
 const table=new THREE.Mesh(new THREE.CylinderGeometry(.78,.78,.09,16),m.get('desk'));table.position.set(-14.4,.76,3.3);root.add(table);
 for(let i=0;i<4;i++){const a=i*Math.PI/2;batch.add('chair',-14.4+Math.cos(a)*1.36,.45,3.3+Math.sin(a)*1.36,.52,.45,.52)}
 // Server bank with glowing activity panels.
 for(let i=0;i<5;i++){const z=-3.7+i*1.05;batch.add('console',16,1.55,z,1.25,3.0,.8);for(let j=0;j<5;j++)batch.add(j%2?'light':'screen',15.53,.5+j*.48,z,.012,.09,.42)}
 // Security vestibule: badge reader, gate sensors, desk.
 batch.add('console',2.7,1.1,10.1,.25,.65,.2);batch.add('light',2.7,1.27,9.98,.13,.12,.04);
 batch.add('desk',-1.5,.95,10.65,1.1,.1,.5);
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
 const arrayRoof=new THREE.Mesh(new THREE.CylinderGeometry(5.45,5.45,.18,8),roofMat);arrayRoof.position.y=7.64;arrayRoof.rotation.y=Math.PI/8;roof.add(arrayRoof);
 for(const h of PLAN.halls){const b=h.bounds;const panel=new THREE.Mesh(new THREE.BoxGeometry(b.x1-b.x0,.13,b.z1-b.z0),roofMat);
 panel.position.set((b.x0+b.x1)/2,h.ceiling+.1,(b.z0+b.z1)/2);roof.add(panel)}
 const doorGroups=new Map<DoorId,THREE.Group>();
 // Where an open sliding door goes: into the longer part of its own wall, by no more than that
 // part holds. Sliding the full width the same way every time ran some doors out past the end
 // of their wall and into the corridor.
 const doorSlides=new Map<DoorId,[number,number]>();
 function doorSlide(d:(typeof PLAN.doors)[number]):[number,number]{
  const wall=PLAN.walls.find(w=>w.openings.includes(d.id))!;
  const L=Math.hypot(wall.to[0]-wall.from[0],wall.to[1]-wall.from[1]),ux=(wall.to[0]-wall.from[0])/L,uz=(wall.to[1]-wall.from[1])/L;
  const c=(d.at[0]-wall.from[0])*ux+(d.at[1]-wall.from[1])*uz;
  const before=c-d.width/2-.05,after=L-c-d.width/2-.05,sign=after>=before?1:-1;
  const travel=Math.max(0,Math.min(d.width*.95,Math.max(before,after)));
  return [ux*sign*travel,uz*sign*travel];
 }
 const doorMaterial=boxMaterial(0x8ba7b5);const glassDoorMaterial=new THREE.MeshPhysicalMaterial({color:0x75bfd4,metalness:.12,roughness:.2,transparent:true,opacity:.72});
 for(const d of PLAN.doors){const g=new THREE.Group();g.name=`tombs:door:${d.id}`;g.position.set(d.at[0],0,d.at[1]);root.add(g);doorGroups.set(d.id,g);
  const orientation=d.along==='x'?0:Math.PI/2;
  // A centimetre narrower and shorter than its opening: a panel exactly the opening's size put
  // its edges in the same planes as the jambs and the lintel, which flickered.
  const panel=new THREE.Mesh(new THREE.BoxGeometry(d.width-.02,d.height-.012,.085),d.id.startsWith('security')?glassDoorMaterial:doorMaterial);
  panel.rotation.y=orientation;panel.position.y=(d.height-.012)/2;panel.name=`door:panel:${d.id}`;g.add(panel);
  const edge=new THREE.Mesh(new THREE.BoxGeometry(d.width-.02,.06,.1),new THREE.MeshBasicMaterial({color:0x4cc7eb}));edge.position.y=d.height-.05;edge.rotation.y=orientation;g.add(edge);
  doorSlides.set(d.id,doorSlide(d));
 }
 // Lamps belong to town, so they naturally follow a 1:180 shrink.
 const ambient=new THREE.HemisphereLight(0xa7dbff,0x101821,1.4);ambient.name='TOMBS:fill';root.add(ambient);
 const highlights:THREE.PointLight[]=[];
 for(const [x,y,z] of [[-13,2.2,-10],[0,3,-10],[13,2.2,-10],[0,5,0]] as const){
  const light=new THREE.PointLight(0x9adbff,26,16,2);light.position.set(x,y,z);highlights.push(light);root.add(light);
 }
 const staticDrawGroups=batch.build();
 const animatedDoor=new Map<DoorId,number>();for(const d of PLAN.doors)animatedDoor.set(d.id,0);
 const spinRate=[.35,-.28,.22,-.18,.14];
 function update(dt:number,s:LabState):void{
  const mode=s.mode;const alarm=mode==='alarm'||mode==='emergency';
  for(const [i,l] of highlights.entries()){l.color.setHex(alarm?(i%2?0xff6355:0xedac6b):mode==='dawn'?0xffd9b1:0xa0dcff);l.intensity=alarm?16:mode==='night'?26:21}
  for(const d of PLAN.doors){const old=animatedDoor.get(d.id)??0,target=s.isOpen(d.id)?1:0;
    const next=Math.max(0,Math.min(1,old+(target>old?1:-1)*dt*1.6));animatedDoor.set(d.id,next);
    const g=doorGroups.get(d.id)!;const moving=g.children.filter(c=>c.name.startsWith('door:')||c.type==='Mesh');
    const [sx,sz]=doorSlides.get(d.id)!;
    for(const child of moving){child.position.x=next*sx;child.position.z=next*sz;}
  }
  if(mode==='activation'){arrayRings.forEach((ring,i)=>{ring.rotation.y+=spinRate[i]*dt;ring.rotation.x+=spinRate[i]*dt*.42})}
 }
 return {group:root,roof,doors:doorGroups,arrayRings,stats:{staticDrawGroups,roomCount:PLAN.rooms.length,doorCount:PLAN.doors.length},
  setRoof:(on:boolean)=>{roof.visible=on},setLabels:(on:boolean)=>{labels.visible=on},update,dispose(){root.traverse(o=>{
    if(o instanceof THREE.Mesh){o.geometry.dispose();const arr=Array.isArray(o.material)?o.material:[o.material];for(const mat of arr)mat.dispose()}
    if(o instanceof THREE.Sprite){o.material.map?.dispose();o.material.dispose()}
   });for(const mat of m.values())mat.dispose();glassMat.dispose();roofMat.dispose();doorMaterial.dispose();glassDoorMaterial.dispose();root.removeFromParent();}
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

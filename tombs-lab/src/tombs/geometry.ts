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
 update(dt:number,state:LabState):void;
 dispose():void;
}
/** Builds editable procedural meshes, NOT a baked disconnected environment. */
export function buildLab(_state:LabState):LabDisplay{
 const root=new THREE.Group();root.name='TOMBS:DRAFT-C:LAB';
 const shell=new THREE.Group();shell.name='TOMBS:static-facility';root.add(shell);
 const roof=new THREE.Group();roof.name='TOMBS:removable-roof';root.add(roof);roof.visible=false;
 const m=new Map<string,THREE.Material>([
  ['floor',boxMaterial(palette.floor)],['wall',boxMaterial(palette.wall)],['external',boxMaterial(palette.external)],
  ['array',boxMaterial(palette.arrayWall)],['metal',boxMaterial(palette.metal)],['desk',boxMaterial(palette.desk)],
  ['console',boxMaterial(palette.console)],['chair',boxMaterial(palette.chair)],
  ['light',new THREE.MeshBasicMaterial({color:0xa5e9ff})],['screen',new THREE.MeshBasicMaterial({color:0x2cbcf2})],
  ['red',new THREE.MeshBasicMaterial({color:0xe35f61})],['yellow',new THREE.MeshBasicMaterial({color:0xf3c37c})],
 ]);
 const batch=new Batch(shell,m);
 // Foundations and internal flooring are derived from exactly the same metric room and corridor manifest.
 const placeFloor=(x0:number,x1:number,z0:number,z1:number)=>batch.add('floor',(x0+x1)/2,-.12,(z0+z1)/2,x1-x0,.24,z1-z0);
 for(const r of PLAN.rooms)placeFloor(r.bounds.x0,r.bounds.x1,r.bounds.z0,r.bounds.z1);
 for(const h of PLAN.halls)placeFloor(h.bounds.x0,h.bounds.x1,h.bounds.z0,h.bounds.z1);
 // Forecourt is WORLD-side integration marker: small normal-scale section here only for preview.
 placeFloor(-2.2,2.2,11.5,14);
 // The corridor reads as a U even from overhead thanks to continuous floor markers.
 for(const [x,z,ry,len] of [[-8.1,-3.5,0,9],[8.1,-3.5,0,9],[0,7,Math.PI/2,14]] as const){
   batch.add('light',x,.012,z,.032,.014,len,ry);
 }
 // Real walls, carefully cut around doors and windows. Geometry and collision share cutWall().
 const glassMat=new THREE.MeshPhysicalMaterial({color:0x91d7ef,transparent:true,opacity:.32,metalness:.05,roughness:.12,side:THREE.DoubleSide,depthWrite:false});
 for(const wall of PLAN.walls)for(const part of cutWall(wall)){
  const dx=part.to[0]-part.from[0],dz=part.to[1]-part.from[1],len=Math.hypot(dx,dz),h=part.y1-part.y0;
  const x=(part.from[0]+part.to[0])/2,z=(part.from[1]+part.to[1])/2;
  const yaw=Math.atan2(-dz,dx),thick=wall.material==='external'?.28:wall.material==='array'?.25:.16;
  if(part.glass){
   const pane=new THREE.Mesh(new THREE.BoxGeometry(len,h,.046),glassMat);pane.position.set(x,part.y0+h/2,z);pane.rotation.y=yaw;pane.name=`tombs:glass:${part.id}`;root.add(pane);
   batch.add('metal',x,part.y0+.035,z,len+.05,.07,.11,yaw);batch.add('metal',x,part.y1-.035,z,len+.05,.07,.11,yaw);
  }else batch.add(wall.material==='external'?'external':wall.material==='array'?'array':'wall',x,part.y0+h/2,z,len,h,thick,yaw);
 }
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
  const name=labelSprite(r.label,r.id==='control'?4:3);name.position.set(x,Math.min(r.ceiling-.65,3),z);root.add(name);
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
 const doorMaterial=boxMaterial(0x8ba7b5);const glassDoorMaterial=new THREE.MeshPhysicalMaterial({color:0x75bfd4,metalness:.12,roughness:.2,transparent:true,opacity:.72});
 for(const d of PLAN.doors){const g=new THREE.Group();g.name=`tombs:door:${d.id}`;g.position.set(d.at[0],0,d.at[1]);root.add(g);doorGroups.set(d.id,g);
  const orientation=d.along==='x'?0:Math.PI/2;
  const panel=new THREE.Mesh(new THREE.BoxGeometry(d.width,d.height,.085),d.id.startsWith('security')?glassDoorMaterial:doorMaterial);
  panel.rotation.y=orientation;panel.position.y=d.height/2;panel.name=`door:panel:${d.id}`;g.add(panel);
  const edge=new THREE.Mesh(new THREE.BoxGeometry(d.width,.065,.1),new THREE.MeshBasicMaterial({color:0x4cc7eb}));edge.position.y=d.height-.02;edge.rotation.y=orientation;g.add(edge);
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
    for(const child of moving){child.position.x=d.along==='x'?next*d.width*.95:0;child.position.z=d.along==='z'?next*d.width*.95:0;}
  }
  if(mode==='activation'){arrayRings.forEach((ring,i)=>{ring.rotation.y+=spinRate[i]*dt;ring.rotation.x+=spinRate[i]*dt*.42})}
 }
 return {group:root,roof,doors:doorGroups,arrayRings,stats:{staticDrawGroups,roomCount:PLAN.rooms.length,doorCount:PLAN.doors.length},
  setRoof:(on:boolean)=>{roof.visible=on},update,dispose(){root.traverse(o=>{
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

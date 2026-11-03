import * as THREE from 'three';
import {anchor} from './spec';

/**
 * Asset-agnostic character mounts. Their local positions are always in human-scale metres.
 * Scene adapters can replace mannequins with Jack/Sarah GLBs, skin/face/pose rigs,
 * and costume presets without touching the laboratory geometry or the global shrink.
 */
export type CharacterId='jack'|'sarah';
export interface CharacterMounts {
 readonly group:THREE.Group;
 readonly anchors:Readonly<Record<CharacterId,THREE.Group>>;
 readonly placeholders:Readonly<Record<CharacterId,THREE.Object3D>>;
 replace(id:CharacterId,model:THREE.Object3D):void;
 setPlaceholdersVisible(visible:boolean):void;
}
const makeStandIn=(name:string,color:number):THREE.Group=>{
 const body=new THREE.Group();body.name=`PLACEHOLDER:${name}:replace-with-Character-Studio-asset`;
 const material=new THREE.MeshStandardMaterial({color,roughness:.8,metalness:.05});
 const head=new THREE.Mesh(new THREE.SphereGeometry(.105,12,8),material);head.position.y=1.59;body.add(head);
 const chest=new THREE.Mesh(new THREE.CapsuleGeometry(.24,.50,5,10),material);chest.position.y=1.17;body.add(chest);
 for(const x of [-.12,.12]){
  const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.57,4,8),material);leg.position.set(x,.41,0);body.add(leg);
  const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.075,.46,4,8),material);arm.position.set(x<0?-.32:.32,1.16,0);body.add(arm);
 }
 return body;
};
export function createCharacterMounts():CharacterMounts{
 const root=new THREE.Group();root.name='TOMBS:character-mounts';
 const jack=new THREE.Group(),sarah=new THREE.Group();
 for(const [id,node,marker] of [['jack',jack,'jackDeskSeat'],['sarah',sarah,'sarahDeskSeat']] as const){
  const a=anchor(marker);node.name=`TOMBS:${id}:character-anchor`;node.position.set(...a.xyz);node.rotation.y=a.yaw;root.add(node);
 }
 const j=makeStandIn('Jack',0x426e9c),s=makeStandIn('Sarah',0x9c697e);jack.add(j);sarah.add(s);
 const mounts:{jack:THREE.Group;sarah:THREE.Group}={jack,sarah};
 return {group:root,anchors:mounts,placeholders:{jack:j,sarah:s},
  replace(id,model){const node=mounts[id];node.clear();node.add(model)},
  setPlaceholdersVisible(visible){j.visible=visible;s.visible=visible},
 };
}

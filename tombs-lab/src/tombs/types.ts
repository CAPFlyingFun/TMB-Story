export type Vec2 = readonly [number, number];
export type RoomId = 'jack' | 'sarah' | 'control' | 'array' | 'storage' | 'break' | 'utility' | 'vestibule';
export type DoorId = 'jack-door' | 'sarah-door' | 'control-west' | 'control-east' | 'storage-door' | 'break-door' | 'utility-door' | 'array-service' | 'security-inner' | 'security-outer';
export type PortalKind = 'door' | 'glass' | 'open';
export interface Rect { readonly x0: number; readonly x1: number; readonly z0: number; readonly z1: number }
export interface Room { readonly id: RoomId; readonly label: string; readonly bounds: Rect; readonly ceiling: number; readonly use: string; }
export interface Hall { readonly id: string; readonly bounds: Rect; readonly ceiling: number }
export interface Door { readonly id: DoorId; readonly at: Vec2; readonly along: 'x' | 'z'; readonly width: number; readonly height: number; readonly sliding: boolean; readonly locked?: boolean; }
export interface Portal { readonly id: string; readonly at: Vec2; readonly along: 'x' | 'z'; readonly width: number; readonly sill: number; readonly height: number; readonly kind: PortalKind; }
export interface Wall { readonly id: string; readonly from: Vec2; readonly to: Vec2; readonly height: number; readonly openings: readonly string[]; readonly material: 'external' | 'internal' | 'reinforced' | 'array'; }
export interface WalkRegion { readonly id: string; readonly bounds: Rect }
export interface Anchor { readonly id: string; readonly xyz: readonly [number,number,number]; readonly yaw: number; readonly label: string }
export interface LabPlan { readonly rooms: readonly Room[]; readonly halls: readonly Hall[]; readonly doors: readonly Door[]; readonly portals: readonly Portal[]; readonly walls: readonly Wall[]; readonly walk: readonly WalkRegion[]; readonly anchors: readonly Anchor[]; readonly bounds: Rect; }
export interface CollisionSegment { readonly id: string; readonly x0:number; readonly z0:number; readonly x1:number; readonly z1:number; readonly height:number; readonly doorId?:DoorId; readonly glass?:boolean; }
export type LabMode = 'night' | 'alarm' | 'activation' | 'emergency' | 'dawn';

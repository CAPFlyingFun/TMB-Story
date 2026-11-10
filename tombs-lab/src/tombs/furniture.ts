import type { RoomId } from './types';

/**
 * Every piece of furniture in the lab, as data. The renderer (geometry.ts), the walk collision
 * (collision.ts) and the top-down plan (planSvg.ts) all read this one list, so what you see,
 * what you bump into and what the plan shows cannot disagree.
 *
 * Placed as a decorator would, room by room (2026-11-03, after Joshua found a desk standing
 * in front of Jack's door): every piece against a wall or deliberately free-standing, nothing
 * in a door's swing or walkway, desks where the story needs them, at least 0.9 m clear in
 * front of anything you sit at or open.
 *
 * Footprints are in world axes: `w` along x, `d` along z, both in metres, centred on (x, z).
 * `facing` is the way a person LOOKS while using it: a desk "facing north" is sat at from its
 * south side with the monitor on its north edge; a shelf against the west wall "faces west".
 * So an item's front, the side you use, is always on the side opposite `facing`. Interior wall
 * faces, for reference: outside walls 0.28 m thick, room partitions 0.16 m.
 */
export type Facing = 'n' | 's' | 'e' | 'w';
export type FurnitureKind =
  | 'desk' | 'console' | 'chair' | 'bench' | 'shelf' | 'rack' | 'cabinet' | 'counter'
  | 'round-table' | 'fridge' | 'emergency-panel' | 'reader' | 'credenza' | 'bookcase'
  | 'armchair' | 'plant' | 'crate' | 'intercom' | 'tablet' | 'coffee-machine' | 'electrical-panel'
  | 'glass-cabinet' | 'wall-shelf' | 'microscope' | 'tube-rack' | 'desk-lamp' | 'pot-plant';
export interface Furniture {
  readonly id: string;
  readonly room: RoomId;
  readonly kind: FurnitureKind;
  readonly x: number;
  readonly z: number;
  readonly w: number;
  readonly d: number;
  readonly h: number;
  readonly facing: Facing;
  /** Height of its underside above the floor (wall-mounted and on-desk things). */
  readonly y0?: number;
  /** Blocks walking. Chairs roll and small things sit on others, so they do not. */
  readonly solid: boolean;
  readonly note?: string;
}

const f = (id: string, room: RoomId, kind: FurnitureKind, x: number, z: number, w: number, d: number, h: number, facing: Facing, solid = true, extra: Partial<Furniture> = {}): Furniture =>
  ({ id, room, kind, x, z, w, d, h, facing, solid, ...extra });

export const FURNITURE: readonly Furniture[] = [
  // JACK'S LABORATORY (x -17..-10.5, z -13.1..-7.6). Door: east wall, z -10.1..-8.8; window: north.
  // Chapter 1: Jack's workstation and the "other console next to Jack" side by side, the
  // intercom within reach of his chair. The door's approach is left clear.
  // 2026-11-10, toward Joshua's approved Chapter 1 stills: the intercom stands at the front right
  // of his desk and his desk lamp at the back right; a tall glass cabinet on the east wall north
  // of the door; the bench carries a microscope, a tube rack and a bottle shelf over it. The
  // other console has no chair of its own: in Chapter 1 Sarah asks for Jack's, and Jack fetches
  // the bench's ("He crossed to the next workstation and dragged its chair back").
  f('jack.desk.primary', 'jack', 'desk', -13.0, -12.5, 2.0, 0.8, 0.74, 'n', true, { note: "Jack's workstation, under the window" }),
  f('jack.desk.secondary', 'jack', 'desk', -15.3, -12.5, 2.0, 0.8, 0.74, 'n', true, { note: 'the other console next to Jack (Ch 1)' }),
  f('jack.chair.primary', 'jack', 'chair', -13.0, -11.55, 0.62, 0.6, 0.95, 'n', false),
  f('jack.chair.bench', 'jack', 'chair', -14.0, -8.85, 0.62, 0.6, 0.95, 's', false, { note: "the bench's chair: the one Jack drags back in Ch 1" }),
  f('jack.intercom', 'jack', 'intercom', -12.25, -12.3, 0.12, 0.1, 0.14, 'n', false, { y0: 0.74, note: 'on his desk at the front right, within reach' }),
  f('jack.lamp', 'jack', 'desk-lamp', -12.2, -12.78, 0.16, 0.16, 0.62, 'n', false, { y0: 0.74, note: 'his desk lamp, back right' }),
  f('jack.bench', 'jack', 'bench', -14.5, -8.05, 3.0, 0.7, 0.9, 's', true, { note: 'prototype bench along the south wall, behind the chairs' }),
  f('jack.bench.shelf', 'jack', 'wall-shelf', -14.5, -7.82, 2.6, 0.24, 0.32, 's', false, { y0: 1.48, note: 'bottles over the bench' }),
  f('jack.microscope', 'jack', 'microscope', -15.6, -8.12, 0.24, 0.3, 0.44, 's', false, { y0: 0.9 }),
  f('jack.tubes', 'jack', 'tube-rack', -14.75, -8.2, 0.26, 0.1, 0.12, 's', false, { y0: 0.9 }),
  f('jack.plant', 'jack', 'pot-plant', -14.5, -7.86, 0.2, 0.2, 0.42, 's', false, { y0: 1.4925, note: 'on the bottle shelf' }),
  f('jack.cabinet', 'jack', 'glass-cabinet', -10.83, -12.35, 0.45, 1.1, 2.1, 'e', true, { note: 'glass-fronted, east wall north of the door' }),
  f('jack.rack', 'jack', 'rack', -16.6, -10.2, 0.6, 1.2, 2.0, 'w', true, { note: 'instrument rack on the west wall' }),

  // SARAH'S OFFICE (x 10.5..17, z -13.1..-7.6). Door: west wall, z -10.1..-8.8; window: north.
  // Design document: her desk against the wall opposite her doorway, so the camera that comes
  // in at the door finds the back of her chair.
  f('sarah.desk', 'sarah', 'desk', 16.48, -10.4, 0.8, 2.0, 0.74, 'e', true, { note: 'against the east wall, opposite the door' }),
  f('sarah.chair', 'sarah', 'chair', 15.55, -10.4, 0.6, 0.62, 0.95, 'e', false),
  f('sarah.tablet', 'sarah', 'tablet', 16.3, -9.75, 0.26, 0.18, 0.012, 'e', false, { y0: 0.74, note: "Sarah's tablet, on her desk" }),
  f('sarah.credenza', 'sarah', 'credenza', 14.5, -12.7, 2.0, 0.45, 0.75, 'n', true, { note: 'low, under the window' }),
  f('sarah.bookcase', 'sarah', 'bookcase', 14.4, -7.92, 1.6, 0.4, 2.0, 's', true),
  f('sarah.armchair', 'sarah', 'armchair', 11.25, -12.35, 0.8, 0.8, 0.85, 'e', true, { note: 'reading corner, clear of the door' }),
  f('sarah.plant', 'sarah', 'plant', 16.55, -12.6, 0.5, 0.5, 1.2, 'w', true),

  // MAIN CONTROL ROOM (x -6..6, z -13.1..-8.1). Doors: west and east walls, z -10.2..-8.8.
  // Its south wall is the reinforced observation window onto the Array; the consoles face it
  // (Ch 2). The north wall's exterior window is kept clear for the view of the settlement
  // (Ch 3, Ch 10). Three consoles leave 2.4 m clear inside each door.
  f('control.console.west', 'control', 'console', -2.4, -9.0, 2.2, 0.9, 0.78, 's'),
  f('control.console.centre', 'control', 'console', 0, -9.0, 2.2, 0.9, 0.78, 's'),
  f('control.console.east', 'control', 'console', 2.4, -9.0, 2.2, 0.9, 0.78, 's'),
  f('control.chair.west', 'control', 'chair', -2.4, -10.0, 0.62, 0.6, 0.95, 's', false),
  f('control.chair.centre', 'control', 'chair', 0, -10.0, 0.62, 0.6, 0.95, 's', false),
  f('control.chair.east', 'control', 'chair', 2.4, -10.0, 0.62, 0.6, 0.95, 's', false),
  f('control.emergency-panel', 'control', 'emergency-panel', -4.6, -12.8, 0.7, 0.3, 1.8, 'n', true, { note: 'the physical shutdown lever (Ch 2)' }),
  f('control.sensor-cabinet', 'control', 'cabinet', 4.6, -12.7, 0.9, 0.5, 1.0, 'n', true, { note: 'the drawer the environmental sensor comes out of (Ch 5)' }),

  // EQUIPMENT STORAGE (x -17..-12, z -7.6..-3.6). Door: east wall, z -6.1..-4.8.
  ...[-7.05, -6.15, -5.25, -4.35].map((z, i) => f(`storage.shelf.${i + 1}`, 'storage', 'shelf', -16.6, z, 0.6, 0.85, 2.2, 'w')),
  f('storage.workbench', 'storage', 'bench', -14.4, -7.2, 1.8, 0.6, 0.9, 'n'),
  f('storage.field-case', 'storage', 'crate', -14.6, -4.05, 1.0, 0.6, 0.5, 's'),

  // BREAK NOOK (x -17..-12, z -3.6..0.4). Door: east wall, z -2.4..-1.2.
  f('break.counter', 'break', 'counter', -15.3, -3.19, 2.8, 0.65, 0.9, 'n'),
  f('break.coffee', 'break', 'coffee-machine', -16.2, -3.22, 0.32, 0.38, 0.42, 'n', false, { y0: 0.9 }),
  f('break.fridge', 'break', 'fridge', -16.55, -0.1, 0.7, 0.7, 1.8, 'w'),
  f('break.table', 'break', 'round-table', -14.6, -1.1, 1.1, 1.1, 0.74, 'n'),
  f('break.chair.west', 'break', 'chair', -15.45, -1.1, 0.5, 0.5, 0.88, 'e', false),
  f('break.chair.north', 'break', 'chair', -14.6, -1.95, 0.5, 0.5, 0.88, 's', false),
  f('break.chair.south', 'break', 'chair', -14.6, -0.25, 0.5, 0.5, 0.88, 'n', false),
  f('break.plant', 'break', 'plant', -12.55, -0.1, 0.45, 0.45, 1.1, 'w'),

  // SERVER / UTILITY (x 12..17, z -7.6..-1.6). Door: west wall, z -5.1..-3.8.
  ...[-6.9, -6.05, -5.2, -4.35, -3.5].map((z, i) => f(`utility.rack.${i + 1}`, 'utility', 'rack', 16.35, z, 1.1, 0.8, 2.2, 'e')),
  f('utility.ups.1', 'utility', 'cabinet', 13.3, -7.2, 1.0, 0.6, 1.8, 'n'),
  f('utility.ups.2', 'utility', 'cabinet', 14.4, -7.2, 1.0, 0.6, 1.8, 'n'),
  f('utility.electrical', 'utility', 'electrical-panel', 14.5, -1.8, 0.9, 0.2, 1.4, 's', false, { y0: 0.8 }),

  // TOMBS ARRAY chamber (the octagon, x -9..9, z -5.2..5.5). Service door: east face, z -0.7..0.7.
  // Research stations along its west and east faces, as on the blueprint, clear of the door and
  // the cut corners; the platform and rings stay in the middle (geometry.ts).
  f('array.station.west.1', 'array', 'console', -8.3, -1.0, 0.9, 1.6, 0.78, 'w'),
  f('array.station.west.2', 'array', 'console', -8.3, 1.2, 0.9, 1.6, 0.78, 'w'),
  f('array.station.east.1', 'array', 'console', 8.3, -1.55, 0.9, 1.1, 0.78, 'e'),
  f('array.station.east.2', 'array', 'console', 8.3, 1.55, 0.9, 1.1, 0.78, 'e'),

  // SECURITY VESTIBULE (x -3..3, z 8.5..11.5). Paired doors 2.4 m wide at x 0, inner and outer:
  // the walkway x -1.2..1.2 stays clear end to end.
  f('vestibule.counter', 'vestibule', 'counter', -2.55, 10.0, 0.6, 1.6, 1.05, 'w'),
  f('vestibule.chair', 'vestibule', 'chair', -1.9, 10.0, 0.5, 0.5, 0.95, 'w', false),
  f('vestibule.reader', 'vestibule', 'reader', 2.86, 9.05, 0.08, 0.16, 0.22, 'e', false, { y0: 1.15, note: 'badge reader beside the inner door' }),
  f('vestibule.plant.west', 'vestibule', 'plant', -2.5, 11.05, 0.45, 0.45, 1.1, 'e'),
  f('vestibule.plant.east', 'vestibule', 'plant', 2.5, 11.05, 0.45, 0.45, 1.1, 'w'),
];

export function furniture(id: string): Furniture {
  const it = FURNITURE.find(x => x.id === id);
  if (!it) throw new Error(`Unknown TOMBS furniture: ${id}`);
  return it;
}

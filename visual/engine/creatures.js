// THE CREATURES (Chapters 5 to 9): Joshua's rigged Meshy spiders, walked through a built set
// by the scene's props. Each one is a skinned model with eight leg chains and no animation of
// its own, so the gait is made here: an alternating tetrapod (left 1 and 3 with right 2 and
// 4, then the others), each leg swinging forward and lifting on its own root joint.
//
// A creature is a set's `people3d.creatures` entry:
//   { model, lengthM, path: [[x, y, z], ...], prop, show, stride, roughness, legs }
// `prop` names the scene prop that is its progress along the path (0 .. 1, tweened by `prop`
// events like any other), `show` the prop that puts it in the set (0 or 1). The gait's phase
// is the DISTANCE walked, read off the path, never the clock -- a seek lands on the same
// step, and a creature that stops ("it is not moving") stops its feet.
//
// lengthM is the whole animal, legs and all, front to back, at the settlement's 1:180 (the
// chart in story-rules/reference). Where the chart has no leg span the full length is GAME
// TUNING sized from the animal's body (see each scene).

import * as THREE from "../vendor/three-human.js";

const Y = new THREE.Vector3(0, 1, 0);

// Leg chains, found from the skeleton: a run of at least six bones with no branches whose
// end reaches well out from the body. Side by the tip's x (the models face +z), front to
// back by the tip's z.
function findLegs(bones, extent, used) {
  const kids = new Map(bones.map((b) => [b, b.children.filter((c) => c.isBone)]));
  const legs = [];
  for (const b of bones) {
    if (!b.parent || !b.parent.isBone || kids.get(b.parent).length < 3) continue; // a leg starts at a hub
    let n = b, len = 1, skinned = used.get(bones.indexOf(b)) || 0;
    while (kids.get(n).length === 1) { n = kids.get(n)[0]; len++; skinned += used.get(bones.indexOf(n)) || 0; }
    const root = b.getWorldPosition(new THREE.Vector3()), tip = n.getWorldPosition(new THREE.Vector3());
    if (len < 6 || kids.get(n).length || skinned < used.total * 0.005) continue; // a leg with no skin on it is hidden
    if (Math.hypot(tip.x - root.x, tip.z - root.z) < 0.2 * extent) continue;
    legs.push({ root: b, second: kids.get(b)[0], tip, rootAt: root });
  }
  return legs;
}

export class Creatures {
  constructor(scene, specs, url) {
    this.scene = scene;
    this.specs = specs || {};
    this.url = url;
    this.list = [];
  }

  async load(buffers = {}) {
    const loader = new THREE.GLTFLoader();
    loader.setMeshoptDecoder(THREE.MeshoptDecoder);
    for (const [id, spec] of Object.entries(this.specs)) {
      const key = "creature:" + spec.model;
      const gltf = buffers[key] ? await loader.parseAsync(buffers[key], "") : await loader.loadAsync(this.url(spec.model));
      const model = gltf.scene;
      let skin = null;
      model.traverse((n) => {
        if (n.isSkinnedMesh) skin = n;
        if (n.isMesh) {
          n.frustumCulled = false;
          for (const m of [].concat(n.material)) if (spec.roughness !== undefined) m.roughness = spec.roughness;
        }
      });
      model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model);
      const extent = box.max.z - box.min.z;
      const bones = skin.skeleton.bones;
      // how many vertices hang mostly on each bone (a hidden leg keeps its bones, not its skin)
      const used = new Map(), si = skin.geometry.attributes.skinIndex, sw = skin.geometry.attributes.skinWeight;
      used.total = si.count;
      for (let i = 0; i < si.count; i++) {
        let best = 0;
        for (let k = 1; k < 4; k++) if (sw.getComponent(i, k) > sw.getComponent(i, best)) best = k;
        const j = si.getComponent(i, best);
        used.set(j, (used.get(j) || 0) + 1);
      }
      const legs = findLegs(bones, extent, used);
      // the order: per side, front to back, and the tetrapod's two groups
      for (const side of [-1, 1]) {
        const mine = legs.filter((l) => Math.sign(l.tip.x) === side).sort((a, b) => b.tip.z - a.tip.z);
        mine.forEach((l, i) => {
          l.side = side;
          l.rank = i;
          l.group = (i + (side < 0 ? 0 : 1)) % 2;
          const d = new THREE.Vector3(l.tip.x - l.rootAt.x, 0, l.tip.z - l.rootAt.z).normalize();
          l.swingAxis = Y; // fore-aft: about the vertical, signed by the side
          l.liftAxis = new THREE.Vector3(-d.z, 0, d.x); // turning about this raises the tip
        });
      }
      const bind = new Map(bones.map((b) => [b, b.quaternion.clone()]));
      const scale = spec.lengthM / extent;
      const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.5, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false }));
      shadow.rotation.x = -Math.PI / 2;
      shadow.scale.setScalar(spec.lengthM * 0.75);
      const holder = new THREE.Group();
      holder.add(model);
      model.scale.setScalar(scale);
      this.scene.add(holder, shadow);
      holder.visible = shadow.visible = false;
      // the path, measured once
      const P = spec.path.map((p) => new THREE.Vector3(...p));
      const cum = [0];
      for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + P[i].distanceTo(P[i - 1]));
      this.list.push({ id, spec, holder, model, bones, bind, legs, shadow, P, cum, total: cum[cum.length - 1], scale });
    }
  }

  at(c, u) {
    const d = Math.max(0, Math.min(1, u)) * c.total;
    let i = 1;
    while (i < c.cum.length - 1 && c.cum[i] < d) i++;
    const a = c.P[i - 1], b = c.P[i], k = (d - c.cum[i - 1]) / Math.max(1e-6, c.cum[i] - c.cum[i - 1]);
    return { p: a.clone().lerp(b, k), dir: b.clone().sub(a).setY(0).normalize(), d };
  }

  update(props, t) {
    for (const c of this.list) {
      const s = c.spec;
      const shown = (props[s.show] ?? 0) > 0.5;
      c.holder.visible = c.shadow.visible = shown;
      if (!shown) continue;
      const { p, dir, d } = this.at(c, props[s.prop] ?? 0);
      const stride = s.stride || c.spec.lengthM * 0.35;
      const phase = (d / stride) * Math.PI * 2;
      // the body rides a little on its steps
      const bob = s.lengthM * 0.012 * Math.abs(Math.sin(phase));
      c.holder.position.set(p.x, p.y + bob, p.z);
      c.holder.rotation.set(0, Math.atan2(dir.x, dir.z), 0);
      c.shadow.position.set(p.x, p.y + 0.01, p.z);
      // the legs, from their bind pose every frame
      for (const [b, q] of c.bind) b.quaternion.copy(q);
      c.model.updateMatrixWorld(true);
      const walking = d > 1e-3;
      const swing = (s.swingDeg ?? 14) * (Math.PI / 180), lift = (s.liftDeg ?? 16) * (Math.PI / 180);
      const Qm = c.model.getWorldQuaternion(new THREE.Quaternion());
      for (const l of c.legs) {
        const ph = phase + (l.group ? Math.PI : 0) + l.rank * 0.35;
        // fore-aft: back to front through the swing, front to back through the stance
        const fa = walking ? -Math.cos(ph) : 0, up = walking ? Math.max(0, Math.sin(ph)) : 0;
        const turn = new THREE.Quaternion().setFromAxisAngle(l.swingAxis, -l.side * swing * fa)
          .multiply(new THREE.Quaternion().setFromAxisAngle(l.liftAxis, lift * up));
        // a turn in the model's frame, as a turn in the world's
        const qw = Qm.clone().multiply(turn).multiply(Qm.clone().invert());
        const pw = l.root.parent.getWorldQuaternion(new THREE.Quaternion());
        const bw = l.root.getWorldQuaternion(new THREE.Quaternion());
        l.root.quaternion.copy(pw.invert().multiply(qw).multiply(bw));
      }
      c.model.updateMatrixWorld(true);
    }
  }
}

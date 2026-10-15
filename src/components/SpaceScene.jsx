import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, prefersReducedMotion } from '../hooks/scroll';

const TAU = Math.PI * 2;

// Möbius strip: x=(1+v/2·cos(u/2))cos u, y=(1+v/2·cos(u/2))sin u, z=v/2·sin(u/2)
function mobius(u, v, R = 1.55) {
  const k = 1 + (v / 2) * Math.cos(u / 2);
  return new THREE.Vector3(R * k * Math.cos(u), R * k * Math.sin(u), R * (v / 2) * Math.sin(u / 2));
}

const PALETTE = {
  dark: { line: '#cfd6ea', accent: '#ffd27a', cool: '#7fd8ff', star: '#ffffff', blending: THREE.AdditiveBlending, lineOpacity: 0.24 },
  light: { line: '#1b2030', accent: '#c2410c', cool: '#0a5bd8', star: '#1b2030', blending: THREE.NormalBlending, lineOpacity: 0.2 },
};

function MobiusStrip({ colors, isMobile }) {
  const travellers = useRef();
  const COUNT = isMobile ? 26 : 48;

  const lines = useMemo(() => {
    const pts = [];
    const along = isMobile ? 160 : 240;
    const vLines = 7;
    // long lines running round the strip
    for (let j = 0; j < vLines; j++) {
      const v = -1 + (2 * j) / (vLines - 1);
      for (let i = 0; i < along; i++) {
        const u0 = (i / along) * TAU;
        const u1 = ((i + 1) / along) * TAU;
        pts.push(mobius(u0, v), mobius(u1, v));
      }
    }
    // rulings across the width — the twist becomes visible here
    const rulings = isMobile ? 48 : 84;
    for (let i = 0; i < rulings; i++) {
      const u = (i / rulings) * TAU;
      pts.push(mobius(u, -1), mobius(u, 1));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [isMobile]);

  const travellerGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(COUNT * 3), 3));
    return g;
  }, [COUNT]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pos = travellerGeo.attributes.position;
    // a comet of points walking the single endless side: after one lap it is on the "other" face, after two it is home
    for (let i = 0; i < COUNT; i++) {
      const u = (t * 0.32 - i * 0.035) % (TAU * 2);
      const v = Math.sin(u * 0.5 + i * 0.02) * 0.15;
      const p = mobius(u, v);
      pos.setXYZ(i, p.x, p.y, p.z);
    }
    pos.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={colors.line} transparent opacity={colors.lineOpacity} blending={colors.blending} depthWrite={false} />
      </lineSegments>
      <points ref={travellers} geometry={travellerGeo}>
        <pointsMaterial color={colors.accent} size={isMobile ? 0.07 : 0.06} sizeAttenuation transparent opacity={0.95} blending={colors.blending} depthWrite={false} />
      </points>
    </group>
  );
}

function Orbits({ colors }) {
  const planets = useRef([]);
  const rings = useMemo(
    () =>
      [
        { r: 2.7, tilt: 1.15, spin: 0.2, speed: 0.22, size: 0.07, color: colors.cool },
        { r: 3.6, tilt: 1.32, spin: -0.5, speed: 0.13, size: 0.11, color: colors.accent },
        { r: 4.7, tilt: 1.05, spin: 0.9, speed: 0.08, size: 0.06, color: colors.line },
      ].map((o) => {
        const pts = [];
        for (let i = 0; i <= 200; i++) {
          const a = (i / 200) * TAU;
          pts.push(new THREE.Vector3(Math.cos(a) * o.r, Math.sin(a) * o.r, 0));
        }
        return { ...o, geo: new THREE.BufferGeometry().setFromPoints(pts) };
      }),
    [colors]
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    rings.forEach((o, i) => {
      const m = planets.current[i];
      if (!m) return;
      const a = t * o.speed + i * 2;
      m.position.set(Math.cos(a) * o.r, Math.sin(a) * o.r, 0);
    });
  });

  return rings.map((o, i) => (
    <group key={i} rotation={[o.tilt, o.spin, 0]}>
      <line geometry={o.geo}>
        <lineBasicMaterial color={colors.line} transparent opacity={0.12} blending={colors.blending} depthWrite={false} />
      </line>
      <mesh ref={(m) => (planets.current[i] = m)}>
        <sphereGeometry args={[o.size, 20, 20]} />
        <meshBasicMaterial color={o.color} transparent opacity={0.95} />
      </mesh>
    </group>
  ));
}

function Stars({ colors, isMobile }) {
  const ref = useRef();
  const geo = useMemo(() => {
    const n = isMobile ? 900 : 2200;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 14 + Math.random() * 30;
      const th = Math.random() * TAU;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      arr[i * 3 + 2] = r * Math.cos(ph);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    return g;
  }, [isMobile]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.006 + Math.abs(scrollState.velocity) * 0.00012;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={colors.star} size={0.06} sizeAttenuation transparent opacity={0.75} depthWrite={false} />
    </points>
  );
}

function Rig({ children, isMobile }) {
  const group = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useFrame(({ pointer: p, camera }, dt) => {
    const g = group.current;
    if (!g) return;
    const s = scrollState.progress;
    pointer.current.x += (p.x - pointer.current.x) * 0.04;
    pointer.current.y += (p.y - pointer.current.y) * 0.04;
    if (!reduced) g.rotation.z += dt * 0.05;
    // the strip drifts across the page as you scroll: right of the hero, centre-back mid-page, close at the end
    const targetX = isMobile ? 0 : -2.4 * Math.cos(s * Math.PI * 1.5);
    const targetY = isMobile ? 1.2 - s * 1.6 : 0.35 * Math.cos(s * Math.PI * 3);
    g.position.x += (targetX - g.position.x) * 0.05;
    g.position.y += (targetY - g.position.y) * 0.05;
    g.rotation.x = 0.95 + s * Math.PI * 0.9 + pointer.current.y * 0.18;
    g.rotation.y = s * Math.PI * 1.2 + pointer.current.x * 0.25;
    const zTarget = (isMobile ? 9.5 : 7.2) + Math.sin(s * Math.PI) * 2.2;
    camera.position.z += (zTarget - camera.position.z) * 0.05;
  });

  return <group ref={group}>{children}</group>;
}

export default function SpaceScene({ theme }) {
  const colors = PALETTE[theme] || PALETTE.dark;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 760;

  return (
    <div className="space" aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.25 : 1.6]}
        camera={{ position: [0, 0, 7.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Stars colors={colors} isMobile={isMobile} />
        <Rig isMobile={isMobile}>
          <MobiusStrip colors={colors} isMobile={isMobile} />
          <Orbits colors={colors} />
        </Rig>
      </Canvas>
    </div>
  );
}

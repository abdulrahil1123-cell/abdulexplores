import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const R = 4.2; // drift circle radius
const SPEED = 1.1; // rad/s around the circle
const DRIFT = 0.65; // extra yaw (radians) = drift angle
const SMOKE = 60;

function Car() {
  const group = useRef<THREE.Group>(null);
  const smoke = useRef<THREE.InstancedMesh>(null);
  const puffs = useMemo(
    () => Array.from({ length: SMOKE }, () => ({ p: new THREE.Vector3(0, -10, 0), age: 99, life: 1 })),
    [],
  );
  const t = useRef(0);
  const next = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    t.current += dt;
    const a = t.current * SPEED;
    const wobble = Math.sin(t.current * 2.3) * 0.12;
    const g = group.current!;
    g.position.set(Math.cos(a) * R, 0, Math.sin(a) * R);
    // tangent heading + drift angle (nose points into the circle)
    g.rotation.y = -a - DRIFT - wobble;
    g.rotation.z = 0.05;

    // emit smoke from rear wheels
    const back = new THREE.Vector3(0, 0.15, -1.3).applyEuler(g.rotation).add(g.position);
    for (let k = 0; k < 2; k++) {
      const pf = puffs[next.current]!;
      next.current = (next.current + 1) % SMOKE;
      const side = new THREE.Vector3(k ? 0.78 : -0.78, 0, 0).applyEuler(g.rotation);
      pf.p.copy(back).add(side);
      pf.age = 0;
      pf.life = 0.9 + Math.random() * 0.6;
    }
    puffs.forEach((pf, i) => {
      pf.age += dt;
      const k = Math.min(pf.age / pf.life, 1);
      pf.p.y += dt * 0.6;
      dummy.position.copy(pf.p);
      dummy.scale.setScalar(k >= 1 ? 0 : 0.25 + k * 0.9);
      dummy.updateMatrix();
      smoke.current!.setMatrixAt(i, dummy.matrix);
    });
    smoke.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <group ref={group}>
        <Baleno />
      </group>
      <instancedMesh ref={smoke} args={[undefined, undefined, SMOKE]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#d9d4cc" transparent opacity={0.35} depthWrite={false} />
      </instancedMesh>
    </>
  );
}

// Stylised Maruti Suzuki Baleno hatchback (forward = +z), built from shapes
const BLUE = "#1f3f8f";
function Wheel({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.33, z]} rotation-z={Math.PI / 2}>
      <mesh castShadow>
        <cylinderGeometry args={[0.33, 0.33, 0.24, 20]} />
        <meshStandardMaterial color="#151515" roughness={0.8} />
      </mesh>
      <mesh position-y={x > 0 ? 0.125 : -0.125}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 12]} />
        <meshStandardMaterial color="#c9ccd1" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}
function Baleno() {
  const cabin = useMemo(() => {
    // side profile: long sloping windscreen, short hatch at rear
    const sh = new THREE.Shape();
    sh.moveTo(-1.55, 0);
    sh.lineTo(1.0, 0);
    sh.lineTo(0.15, 0.55);
    sh.lineTo(-1.2, 0.55);
    sh.lineTo(-1.6, 0.05);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 1.3, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 2 });
    g.translate(0, 0, -0.65);
    g.rotateY(-Math.PI / 2);
    return g;
  }, []);
  return (
    <group>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.6, 0.48, 3.9]} />
        <meshStandardMaterial color={BLUE} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.85, 0.35]} geometry={cabin} castShadow>
        <meshStandardMaterial color="#1a2433" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.42, -0.55]}>
        <boxGeometry args={[1.38, 0.06, 1.3]} />
        <meshStandardMaterial color={BLUE} metalness={0.6} roughness={0.3} />
      </mesh>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.66, 1.96]}>
          <boxGeometry args={[0.4, 0.12, 0.04]} />
          <meshStandardMaterial color="#fff6d8" emissive="#fff1c0" emissiveIntensity={1.5} />
        </mesh>
      ))}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.68, -1.96]}>
          <boxGeometry args={[0.32, 0.14, 0.04]} />
          <meshStandardMaterial color="#c01818" emissive="#ff2020" emissiveIntensity={1.2} />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 1.96]}>
        <boxGeometry args={[0.8, 0.14, 0.03]} />
        <meshStandardMaterial color="#222" metalness={0.5} />
      </mesh>
      <Wheel x={0.78} z={1.25} />
      <Wheel x={-0.78} z={1.25} />
      <Wheel x={0.78} z={-1.2} />
      <Wheel x={-0.78} z={-1.2} />
    </group>
  );
}

function Ground() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const x = c.getContext("2d")!;
    x.fillStyle = "#2b2b2e";
    x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 6000; i++) {
      const v = 30 + Math.random() * 40;
      x.fillStyle = `rgb(${v},${v},${v + 3})`;
      x.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    // skid ring
    x.strokeStyle = "rgba(10,10,10,0.55)";
    for (const r of [150, 162, 176, 188]) {
      x.lineWidth = 5;
      x.beginPath();
      x.arc(256, 256, r, 0, Math.PI * 2);
      x.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <circleGeometry args={[14, 64]} />
      <meshStandardMaterial map={tex} roughness={0.9} />
    </mesh>
  );
}

export default function DriftScene() {
  return (
    <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 7, 11], fov: 45 }}>
      <fog attach="fog" args={["#1c1a1f", 12, 26]} />
      <color attach="background" args={["#1c1a1f"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 10, 4]} intensity={2.2} color="#ffd9a8" castShadow shadow-mapSize={[1024, 1024]} />
      <Environment>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
        <Lightformer intensity={1} color="#ffb070" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
      </Environment>
      <Ground />
      <Suspense fallback={null}>
        <Car />
      </Suspense>
      <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={20} blur={2} far={3} />
    </Canvas>
  );
}


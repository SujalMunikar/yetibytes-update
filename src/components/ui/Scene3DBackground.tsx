import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const FloatingShape = ({ 
  position, 
  scale, 
  speed, 
  geometry = "icosahedron" 
}: { 
  position: [number, number, number]; 
  scale: number; 
  speed: number;
  geometry?: "icosahedron" | "octahedron" | "dodecahedron";
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.1;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
        {geometry === "octahedron" && <octahedronGeometry args={[1, 0]} />}
        {geometry === "dodecahedron" && <dodecahedronGeometry args={[1, 0]} />}
        <meshStandardMaterial
          color="#4a7cf7"
          transparent
          opacity={0.06}
          roughness={0.1}
          metalness={0.9}
          wireframe
        />
      </mesh>
    </Float>
  );
};

const SmallParticles = ({ count = 40 }: { count?: number }) => {
  const points = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#4a7cf7"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
};

const SubScene = () => (
  <>
    <ambientLight intensity={0.2} />
    <directionalLight position={[3, 3, 3]} intensity={0.3} />
    <FloatingShape position={[-4, 2, -5]} scale={1.2} speed={0.3} geometry="octahedron" />
    <FloatingShape position={[4, -2, -6]} scale={1.5} speed={0.2} geometry="dodecahedron" />
    <FloatingShape position={[0, 3, -4]} scale={0.8} speed={0.4} geometry="icosahedron" />
    <SmallParticles count={50} />
  </>
);

const Scene3DBackground = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SubScene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3DBackground;

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

const FloatingIcosahedron = ({ position, scale, speed, color }: { position: [number, number, number]; scale: number; speed: number; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.15}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

const FloatingTorus = ({ position, scale, speed, color }: { position: [number, number, number]; scale: number; speed: number; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.2;
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.15;
    }
  });

  return (
    <Float speed={speed * 0.8} rotationIntensity={0.8} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.4, 16, 32]} />
        <MeshWobbleMaterial
          color={color}
          transparent
          opacity={0.12}
          factor={0.3}
          speed={1.5}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
};

const FloatingOctahedron = ({ position, scale, speed, color }: { position: [number, number, number]; scale: number; speed: number; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.25;
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.1;
    }
  });

  return (
    <Float speed={speed * 1.2} rotationIntensity={0.6} floatIntensity={1.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.1}
          roughness={0.1}
          metalness={0.9}
          wireframe
        />
      </mesh>
    </Float>
  );
};

const Particles = ({ count = 80 }: { count?: number }) => {
  const points = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#4a7cf7"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4a7cf7" />
      <pointLight position={[5, -3, 3]} intensity={0.2} color="#7c5cf7" />

      <FloatingIcosahedron position={[-4, 2, -3]} scale={1.5} speed={0.5} color="#3b6cf5" />
      <FloatingIcosahedron position={[4.5, -1.5, -4]} scale={1} speed={0.7} color="#5b8cf7" />
      <FloatingTorus position={[3, 3, -5]} scale={0.8} speed={0.4} color="#4a7cf7" />
      <FloatingTorus position={[-3.5, -2, -3]} scale={0.6} speed={0.6} color="#6a5cf7" />
      <FloatingOctahedron position={[0, -3, -4]} scale={1.2} speed={0.5} color="#4a7cf7" />
      <FloatingOctahedron position={[-5, 0, -6]} scale={1.8} speed={0.3} color="#3b6cf5" />
      <FloatingOctahedron position={[5, 1, -5]} scale={0.7} speed={0.8} color="#7c5cf7" />
      
      <Particles count={100} />
    </>
  );
};

const HeroScene3D = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene3D;

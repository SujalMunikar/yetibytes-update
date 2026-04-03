import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LocationDot {
  lat: number;
  lng: number;
  label: string;
  size?: number;
}

const locations: LocationDot[] = [
  { lat: 27.7172, lng: 85.324, label: "Kathmandu, Nepal", size: 1.5 },
  { lat: 40.7128, lng: -74.006, label: "New York, USA" },
  { lat: 51.5074, lng: -0.1278, label: "London, UK" },
  { lat: 1.3521, lng: 103.8198, label: "Singapore" },
  { lat: 35.6762, lng: 139.6503, label: "Tokyo, Japan" },
  { lat: -33.8688, lng: 151.2093, label: "Sydney, Australia" },
  { lat: 25.2048, lng: 55.2708, label: "Dubai, UAE" },
  { lat: 52.52, lng: 13.405, label: "Berlin, Germany" },
  { lat: 19.076, lng: 72.8777, label: "Mumbai, India" },
  { lat: 37.5665, lng: 126.978, label: "Seoul, South Korea" },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

const GlobeWireframe = () => {
  const globeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    const radius = 2;
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const points: THREE.Vector3[] = [];
      for (let lng = 0; lng <= 360; lng += 5) {
        points.push(latLngToVector3(lat, lng, radius));
      }
      lines.push(points);
    }
    // Longitude lines
    for (let lng = 0; lng < 360; lng += 30) {
      const points: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        points.push(latLngToVector3(lat, lng, radius));
      }
      lines.push(points);
    }
    return lines;
  }, []);

  const dotPositions = useMemo(() => {
    return locations.map((loc) => ({
      position: latLngToVector3(loc.lat, loc.lng, 2.02),
      size: loc.size || 1,
    }));
  }, []);

  // Connection lines from Kathmandu to other cities
  const connectionLines = useMemo(() => {
    const origin = latLngToVector3(locations[0].lat, locations[0].lng, 2.02);
    return locations.slice(1).map((loc) => {
      const dest = latLngToVector3(loc.lat, loc.lng, 2.02);
      const mid = new THREE.Vector3().addVectors(origin, dest).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(2.6);
      const curve = new THREE.QuadraticBezierCurve3(origin, mid, dest);
      return curve.getPoints(30);
    });
  }, []);

  return (
    <group ref={globeRef}>
      {/* Globe sphere */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#4a7cf7"
          transparent
          opacity={0.05}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>

      {/* Wireframe grid */}
      {gridLines.map((points, i) => (
        <line key={`grid-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#4a7cf7" transparent opacity={0.12} />
        </line>
      ))}

      {/* Location dots */}
      {dotPositions.map((dot, i) => (
        <mesh key={`dot-${i}`} position={dot.position}>
          <sphereGeometry args={[0.04 * dot.size, 12, 12]} />
          <meshStandardMaterial
            color={i === 0 ? "#60a5fa" : "#7c5cf7"}
            emissive={i === 0 ? "#60a5fa" : "#7c5cf7"}
            emissiveIntensity={i === 0 ? 2 : 1}
          />
        </mesh>
      ))}

      {/* Glow rings on Kathmandu */}
      <mesh position={dotPositions[0].position}>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Connection arcs */}
      {connectionLines.map((points, i) => (
        <line key={`conn-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#7c5cf7" transparent opacity={0.25} />
        </line>
      ))}
    </group>
  );
};

const Globe3D = () => {
  return (
    <div className="w-full h-[350px] md:h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#4a7cf7" />
          <pointLight position={[-5, -3, 3]} intensity={0.3} color="#7c5cf7" />
          <GlobeWireframe />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Globe3D;

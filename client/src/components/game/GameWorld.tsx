import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

interface GameWorldProps {
  children: React.ReactNode;
}

export const GameWorld = ({ children }: GameWorldProps) => {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
      }}
      dpr={Math.min(window.devicePixelRatio, 2)}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight
          position={[10, 15, 10]}
          intensity={0.8}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Neon environment lighting */}
        <pointLight position={[-10, 8, -10]} intensity={0.4} color="#00ffff" />
        <pointLight position={[10, 8, 10]} intensity={0.4} color="#ff00ff" />
        <pointLight position={[0, 20, 0]} intensity={0.3} color="#ffff00" />

        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 4, 8]} fov={75} />

        {/* Ground plane - neon grid */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            color="#0a0a0a"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Grid helper for neon effect */}
        <Grid
          args={[100, 100]}
          cellSize={1}
          cellColor="#00ffff"
          sectionSize={10}
          sectionColor="#ff00ff"
          fadeDistance={100}
          fadeStrength={1}
          infiniteGrid
        />

        {/* Neon walls for boundaries */}
        {/* Left wall */}
        <mesh position={[-50, 5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 20, 100]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Right wall */}
        <mesh position={[50, 5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 20, 100]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Back wall */}
        <mesh position={[0, 5, -50]} castShadow receiveShadow>
          <boxGeometry args={[100, 20, 1]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Front wall */}
        <mesh position={[0, 5, 50]} castShadow receiveShadow>
          <boxGeometry args={[100, 20, 1]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Obstacle platforms */}
        <mesh position={[0, 2, -20]} castShadow receiveShadow>
          <boxGeometry args={[8, 0.5, 8]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={0.2}
          />
        </mesh>

        <mesh position={[20, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 0.5, 8]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={0.2}
          />
        </mesh>

        <mesh position={[-20, 3, 20]} castShadow receiveShadow>
          <boxGeometry args={[8, 0.5, 8]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Danger zones (red) */}
        <mesh position={[30, 0.1, -30]} receiveShadow>
          <boxGeometry args={[10, 0.2, 10]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={0.4}
          />
        </mesh>

        <mesh position={[-30, 0.1, 30]} receiveShadow>
          <boxGeometry args={[10, 0.2, 10]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Game content */}
        {children}
      </Suspense>
    </Canvas>
  );
};

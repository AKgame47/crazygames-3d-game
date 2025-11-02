import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { soundManager } from '@/lib/soundManager';

interface TrapProps {
  position: [number, number, number];
  type: 'spike' | 'fire' | 'laser' | 'electric';
  damage?: number;
  cooldown?: number;
  onDamagePlayer?: (damage: number) => void;
  playerPosition?: THREE.Vector3;
}

export const Trap = ({
  position,
  type,
  damage = 20,
  cooldown = 1000,
  onDamagePlayer,
  playerPosition,
}: TrapProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lastDamageTimeRef = useRef(0);
  const [isActive, setIsActive] = useState(true);

  const trapConfig = {
    spike: {
      color: '#ff0000',
      emissive: '#ff0000',
      emissiveIntensity: 0.6,
      geometry: 'cone',
      scale: [0.5, 1, 0.5],
    },
    fire: {
      color: '#ff6600',
      emissive: '#ff6600',
      emissiveIntensity: 0.8,
      geometry: 'box',
      scale: [1, 0.5, 1],
    },
    laser: {
      color: '#00ff00',
      emissive: '#00ff00',
      emissiveIntensity: 1,
      geometry: 'cylinder',
      scale: [0.2, 3, 0.2],
    },
    electric: {
      color: '#ffff00',
      emissive: '#ffff00',
      emissiveIntensity: 0.9,
      geometry: 'box',
      scale: [0.8, 0.8, 0.8],
    },
  };

  const config = trapConfig[type];

  useFrame(() => {
    if (!meshRef.current || !playerPosition) return;

    // Rotate trap
    meshRef.current.rotation.y += 0.02;

    // Check collision with player
    const distance = new THREE.Vector3(...position).distanceTo(playerPosition);
    const detectionRadius = 2;

    if (distance < detectionRadius && isActive) {
      const now = Date.now();
      if (now - lastDamageTimeRef.current > cooldown) {
        lastDamageTimeRef.current = now;
        onDamagePlayer?.(damage);
        soundManager.playHitSound('heavy');

        // Flash effect
        if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
          const originalIntensity = meshRef.current.material.emissiveIntensity;
          meshRef.current.material.emissiveIntensity = 1;
          setTimeout(() => {
            if (meshRef.current?.material instanceof THREE.MeshStandardMaterial) {
              meshRef.current.material.emissiveIntensity = originalIntensity;
            }
          }, 100);
        }
      }
    }

    // Pulsing effect
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      const pulse = Math.sin(Date.now() * 0.003) * 0.3 + 0.5;
      meshRef.current.material.emissiveIntensity = config.emissiveIntensity * pulse;
    }
  });

  return (
    <group position={position}>
      {type === 'spike' && (
        <mesh ref={meshRef} position={[0, 0.5, 0]}>
          <coneGeometry args={[0.5, 1, 8]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={config.emissiveIntensity}
          />
        </mesh>
      )}

      {type === 'fire' && (
        <mesh ref={meshRef} position={[0, 0.25, 0]}>
          <boxGeometry args={[1, 0.5, 1]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={config.emissiveIntensity}
          />
        </mesh>
      )}

      {type === 'laser' && (
        <mesh ref={meshRef} position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 3, 8]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={config.emissiveIntensity}
          />
        </mesh>
      )}

      {type === 'electric' && (
        <mesh ref={meshRef} position={[0, 0.4, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={config.emissiveIntensity}
          />
        </mesh>
      )}

      {/* Detection radius indicator (debug) */}
      {/* <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 8, 8]} />
        <meshStandardMaterial transparent opacity={0.1} color="#ff0000" />
      </mesh> */}
    </group>
  );
};

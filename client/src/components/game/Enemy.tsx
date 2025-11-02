import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { soundManager } from '@/lib/soundManager';

interface EnemyProps {
  position: [number, number, number];
  health?: number;
  maxHealth?: number;
  speed?: number;
  damage?: number;
  onDeath?: () => void;
  playerPosition?: THREE.Vector3;
  difficulty?: 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate';
}

export const Enemy = ({
  position,
  health = 30,
  maxHealth = 30,
  speed = 0.15,
  damage = 5,
  onDeath,
  playerPosition,
  difficulty = 'noob',
}: EnemyProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentHealth, setCurrentHealth] = useState(health);
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackCooldown, setAttackCooldown] = useState(0);

  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const GRAVITY = 0.02;
  const ATTACK_RANGE = 2;
  const ATTACK_COOLDOWN = 1000;

  // Difficulty modifiers
  const difficultyMods = {
    noob: { speedMult: 0.8, damageMult: 0.8, healthMult: 0.8 },
    pro: { speedMult: 1.2, damageMult: 1.0, healthMult: 1.0 },
    god: { speedMult: 1.5, damageMult: 1.3, healthMult: 1.2 },
    psycho: { speedMult: 1.8, damageMult: 1.6, healthMult: 1.4 },
    ultimate: { speedMult: 2.0, damageMult: 2.0, healthMult: 1.8 },
  };

  const mod = difficultyMods[difficulty];
  const adjustedSpeed = speed * mod.speedMult;
  const adjustedDamage = damage * mod.damageMult;

  const takeDamage = (damageAmount: number) => {
    const newHealth = Math.max(0, currentHealth - damageAmount);
    setCurrentHealth(newHealth);
    soundManager.playHitSound('light');

    if (newHealth <= 0) {
      soundManager.playEnemyDeathSound();
      onDeath?.();
    }
  };

  useFrame(() => {
    if (!groupRef.current || !playerPosition) return;

    // Chase player
    const directionToPlayer = new THREE.Vector3().subVectors(playerPosition, groupRef.current.position);
    const distance = directionToPlayer.length();

    if (distance > 0.1) {
      directionToPlayer.normalize();
      velocity.current.x = directionToPlayer.x * adjustedSpeed;
      velocity.current.z = directionToPlayer.z * adjustedSpeed;

      // Rotate towards player
      const angle = Math.atan2(directionToPlayer.x, directionToPlayer.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        angle,
        0.1
      );
    }

    // Gravity
    if (groupRef.current.position.y > 0.5) {
      velocity.current.y -= GRAVITY;
    } else {
      groupRef.current.position.y = 0.5;
      velocity.current.y = 0;
    }

    // Apply velocity
    groupRef.current.position.add(velocity.current);

    // Attack logic
    if (distance < ATTACK_RANGE && attackCooldown <= 0) {
      setIsAttacking(true);
      setAttackCooldown(ATTACK_COOLDOWN);
      // Damage is handled by parent component
      setTimeout(() => setIsAttacking(false), 200);
    }

    // Update cooldowns
    if (attackCooldown > 0) {
      setAttackCooldown((prev) => prev - 16);
    }
  });

  const color = difficulty === 'noob' ? '#ff6600' : difficulty === 'pro' ? '#ff3300' : '#ff0000';
  const emissive = difficulty === 'noob' ? '#ff6600' : difficulty === 'pro' ? '#ff3300' : '#ff0000';

  return (
    <group ref={groupRef} position={position}>
      {/* Enemy body */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.6}
          wireframe={false}
        />
      </mesh>

      {/* Enemy head */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Enemy eyes - red glow */}
      <mesh position={[-0.12, 1.1, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={1}
        />
      </mesh>
      <mesh position={[0.12, 1.1, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Attack indicator */}
      {isAttacking && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={0.8}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Health bar */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[1, 0.08, 0.08]} />
        <meshStandardMaterial color="#330000" />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[(currentHealth / maxHealth) * 1, 0.08, 0.09]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

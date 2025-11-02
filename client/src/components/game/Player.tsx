import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useGameStore } from '@/lib/gameStore';
import { soundManager } from '@/lib/soundManager';

interface PlayerProps {
  position?: [number, number, number];
  onHealthChange?: (health: number) => void;
  onKill?: () => void;
}

export const Player = ({ position = [0, 1, 0], onHealthChange, onKill }: PlayerProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackCooldown, setAttackCooldown] = useState(0);
  const [jumpPower, setJumpPower] = useState(0);
  const [isGrounded, setIsGrounded] = useState(true);

  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const playerStats = useGameStore((state) => state.playerStats);
  const updatePlayerStats = useGameStore((state) => state.updatePlayerStats);

  const MOVE_SPEED = 0.3;
  const JUMP_FORCE = 0.5;
  const GRAVITY = 0.02;
  const ATTACK_COOLDOWN = 500;
  const ATTACK_RANGE = 3;
  const ATTACK_DAMAGE = 10;

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeys((prev) => ({ ...prev, [key]: true }));

      if (key === ' ') {
        e.preventDefault();
        if (isGrounded) {
          setJumpPower(JUMP_FORCE);
          setIsGrounded(false);
        }
      }

      if (key === 'shift' || e.code === 'ShiftLeft') {
        // Skill activation
        soundManager.playSkillActivationSound();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeys((prev) => ({ ...prev, [key]: false }));
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        // Left click for attack
        if (attackCooldown <= 0 && !isAttacking) {
          performAttack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isGrounded, attackCooldown, isAttacking]);

  const performAttack = () => {
    setIsAttacking(true);
    setAttackCooldown(ATTACK_COOLDOWN);
    soundManager.playAttackSound();

    // Attack animation
    if (meshRef.current) {
      const originalRotation = meshRef.current.rotation.z;
      meshRef.current.rotation.z += 0.5;
      setTimeout(() => {
        if (meshRef.current) {
          meshRef.current.rotation.z = originalRotation;
        }
      }, 100);
    }

    setTimeout(() => setIsAttacking(false), 200);
  };

  const takeDamage = (damage: number) => {
    const newHealth = Math.max(0, playerStats.health - damage);
    updatePlayerStats({ health: newHealth });
    soundManager.playHitSound('medium');
    onHealthChange?.(newHealth);

    if (newHealth <= 0) {
      soundManager.playGameOverSound();
      useGameStore.setState({ gameState: 'gameover' });
    }
  };

  // Main game loop
  useFrame(() => {
    if (!groupRef.current) return;

    // Movement
    const moveDirection = new THREE.Vector3();
    if (keys['w']) moveDirection.z -= MOVE_SPEED;
    if (keys['s']) moveDirection.z += MOVE_SPEED;
    if (keys['a']) moveDirection.x -= MOVE_SPEED;
    if (keys['d']) moveDirection.x += MOVE_SPEED;

    velocity.current.x = moveDirection.x;
    velocity.current.z = moveDirection.z;

    // Gravity and jumping
    if (isGrounded) {
      velocity.current.y = jumpPower;
      setJumpPower(0);
    } else {
      velocity.current.y -= GRAVITY;
    }

    // Ground collision
    if (groupRef.current.position.y <= 0.5) {
      groupRef.current.position.y = 0.5;
      setIsGrounded(true);
      velocity.current.y = 0;
    } else {
      setIsGrounded(false);
    }

    // Apply velocity
    groupRef.current.position.add(velocity.current);

    // Camera follow (third-person)
    const cameraDistance = 8;
    const cameraHeight = 4;
    const targetCameraPos = new THREE.Vector3(
      groupRef.current.position.x,
      groupRef.current.position.y + cameraHeight,
      groupRef.current.position.z + cameraDistance
    );

    camera.position.lerp(targetCameraPos, 0.1);
    camera.lookAt(
      groupRef.current.position.x,
      groupRef.current.position.y + 1,
      groupRef.current.position.z
    );

    // Update cooldowns
    if (attackCooldown > 0) {
      setAttackCooldown((prev) => prev - 16);
    }

    // Rotation based on movement
    if (moveDirection.length() > 0) {
      const angle = Math.atan2(moveDirection.x, moveDirection.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        angle,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Player body - neon cyan */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 1.8, 0.6]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          wireframe={false}
        />
      </mesh>

      {/* Player head - neon cyan */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Eyes glow */}
      <mesh position={[-0.15, 1.3, 0.35]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1}
        />
      </mesh>
      <mesh position={[0.15, 1.3, 0.35]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Attack indicator (glow when attacking) */}
      {isAttacking && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={0.8}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Health indicator bar */}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[(playerStats.health / playerStats.maxHealth) * 1.2, 0.1, 0.11]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

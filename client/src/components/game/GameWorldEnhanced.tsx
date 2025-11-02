import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Trap } from './Trap';
import { soundManager } from '@/lib/soundManager';

interface GameWorldEnhancedProps {
  mode: 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate';
  onGameOver: (stats: any) => void;
}

// Animated background component
function AnimatedBackground({ mode }: { mode: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.z += 0.0001;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const getBackgroundColor = () => {
    switch (mode) {
      case 'noob':
        return '#0a0e27';
      case 'pro':
        return '#1a0a2e';
      case 'god':
        return '#2d0a3a';
      case 'psycho':
        return '#3d0a2e';
      case 'ultimate':
        return '#1a0a1a';
      default:
        return '#0a0e27';
    }
  };

  return (
    <>
      {/* Background grid */}
      <group ref={groupRef}>
        <mesh position={[0, 0, -50]}>
          <planeGeometry args={[200, 200, 50, 50]} />
          <meshStandardMaterial
            color={getBackgroundColor()}
            wireframe={false}
            emissive={mode === 'psycho' ? '#ff00ff' : '#00ffff'}
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>

      {/* Animated grid lines */}
      <gridHelper args={[200, 50, '#00ffff', '#0088ff']} position={[0, 0, -49]} />

      {/* Floating particles/stars background */}
      <FloatingParticles mode={mode} />

      {/* Neon lights */}
      <pointLight position={[50, 50, 50]} intensity={1} color="#00ffff" />
      <pointLight position={[-50, 50, 50]} intensity={1} color="#ff00ff" />
      <pointLight position={[0, -50, 50]} intensity={0.8} color="#ffff00" />
      <ambientLight intensity={0.4} color="#ffffff" />
    </>
  );
}

// Floating particles component
function FloatingParticles({ mode }: { mode: string }) {
  const particlesRef = useRef<THREE.Points>(null);

  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 100 - 50;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const animate = () => {
      if (particlesRef.current) {
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < pos.length; i += 3) {
          pos[i + 1] -= 0.1;
          if (pos[i + 1] < -100) {
            pos[i + 1] = 100;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const particleColor = mode === 'psycho' ? '#ff00ff' : '#00ffff';

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.5}
        color={particleColor}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.6}
      />
    </points>
  );
}

export function GameWorldEnhanced({ mode, onGameOver }: GameWorldEnhancedProps) {
  const [enemies, setEnemies] = useState<any[]>([]);
  const [traps, setTraps] = useState<any[]>([]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 0));

  // Initialize game
  useEffect(() => {
    soundManager.playBackgroundMusic(mode);

    // Spawn initial enemies
    const spawnEnemies = () => {
      const enemyCount = 3 + wave;
      const newEnemies = Array.from({ length: enemyCount }, (_, i) => ({
        id: i,
        position: [
          (Math.random() - 0.5) * 30,
          0,
          (Math.random() - 0.5) * 30 + 10,
        ] as [number, number, number],
        health: 30 + wave * 10,
        speed: 0.1 + wave * 0.02,
      }));
      setEnemies(newEnemies);
    };

    // Spawn traps
    const spawnTraps = () => {
      if (mode === 'pro' || mode === 'god' || mode === 'psycho' || mode === 'ultimate') {
        const trapCount = mode === 'pro' ? 3 : mode === 'god' ? 5 : 8;
        const trapTypes = ['spike', 'fire', 'laser', 'electric'] as const;
        const newTraps = Array.from({ length: trapCount }, (_, i) => ({
          id: i,
          position: [
            (Math.random() - 0.5) * 40,
            0,
            (Math.random() - 0.5) * 40,
          ] as [number, number, number],
          type: trapTypes[Math.floor(Math.random() * trapTypes.length)],
        }));
        setTraps(newTraps);
      }
    };

    spawnEnemies();
    spawnTraps();
  }, [mode, wave]);

  const handleEnemyDeath = (enemyId: number) => {
    setEnemies((prev) => prev.filter((e) => e.id !== enemyId));
    const xpGain = 50 + wave * 10;
    setScore((prev) => prev + xpGain);
    soundManager.playHitSound('heavy');

    // Check if wave is complete
    setEnemies((prev) => {
      if (prev.length === 1) {
        setTimeout(() => {
          setWave((w) => w + 1);
        }, 1000);
      }
      return prev;
    });
  };

  const handlePlayerDamage = (damage: number) => {
    setPlayerHealth((prev) => {
      const newHealth = Math.max(0, prev - damage);
      if (newHealth === 0) {
        soundManager.playGameOverSound();
        onGameOver({
          score,
          wave,
          mode,
          health: newHealth,
        });
      }
      return newHealth;
    });
  };

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 15, 25], fov: 50 }}
        style={{ background: '#0a0e27' }}
      >
        <AnimatedBackground mode={mode} />

        {/* Player */}
        <Player
          position={[0, 0, 0]}
          onPositionChange={(pos) => {
            playerPosRef.current = pos;
          }}
          onDamage={handlePlayerDamage}
        />

        {/* Enemies */}
        {enemies.map((enemy) => (
          <Enemy
            key={enemy.id}
            position={enemy.position}
            health={enemy.health}
            speed={enemy.speed}
            playerPosition={playerPosRef.current}
            onDeath={() => handleEnemyDeath(enemy.id)}
            onDamagePlayer={handlePlayerDamage}
          />
        ))}

        {/* Traps */}
        {traps.map((trap) => (
          <Trap
            key={trap.id}
            position={trap.position}
            type={trap.type}
            playerPosition={playerPosRef.current}
            onDamagePlayer={handlePlayerDamage}
          />
        ))}
      </Canvas>

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between text-white font-bold">
        <div className="text-cyan-400">
          <div>Health: {playerHealth}/100</div>
          <div className="w-32 h-4 bg-gray-800 border border-cyan-400 mt-2">
            <div
              className="h-full bg-cyan-400 transition-all"
              style={{ width: `${playerHealth}%` }}
            />
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-magenta-500">WAVE {wave}</div>
          <div className="text-cyan-400">Score: {score}</div>
        </div>
        <div className="text-right text-yellow-400">
          <div>Mode: {mode.toUpperCase()}</div>
          <div>Enemies: {enemies.length}</div>
        </div>
      </div>
    </div>
  );
}

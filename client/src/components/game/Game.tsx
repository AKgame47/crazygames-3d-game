import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useGameStore } from '@/lib/gameStore';
import { soundManager } from '@/lib/soundManager';
import { GameWorld } from './GameWorld';
import { Player } from './Player';
import { Enemy } from './Enemy';

interface GameProps {
  mode: 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate';
  onGameOver?: (stats: any) => void;
}

interface EnemyInstance {
  id: string;
  position: [number, number, number];
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
}

export const Game = ({ mode, onGameOver }: GameProps) => {
  const playerPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.5, 0));
  const [enemies, setEnemies] = useState<EnemyInstance[]>([]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [waveNumber, setWaveNumber] = useState(1);
  const [gameTime, setGameTime] = useState(0);

  const gameStore = useGameStore();
  const playerStats = gameStore.playerStats;
  const updatePlayerStats = gameStore.updatePlayerStats;

  // Mode configuration
  const modeConfig = {
    noob: {
      initialEnemies: 3,
      enemyHealth: 20,
      enemySpeed: 0.1,
      enemyDamage: 3,
      spawnRate: 3000,
      waveIncrement: 2,
    },
    pro: {
      initialEnemies: 5,
      enemyHealth: 30,
      enemySpeed: 0.15,
      enemyDamage: 5,
      spawnRate: 2500,
      waveIncrement: 3,
    },
    god: {
      initialEnemies: 7,
      enemyHealth: 40,
      enemySpeed: 0.2,
      enemyDamage: 8,
      spawnRate: 2000,
      waveIncrement: 4,
    },
    psycho: {
      initialEnemies: 10,
      enemyHealth: 50,
      enemySpeed: 0.25,
      enemyDamage: 12,
      spawnRate: 1500,
      waveIncrement: 5,
    },
    ultimate: {
      initialEnemies: 15,
      enemyHealth: 60,
      enemySpeed: 0.3,
      enemyDamage: 15,
      spawnRate: 1000,
      waveIncrement: 10,
    },
  };

  const config = modeConfig[mode];

  // Initialize game
  useEffect(() => {
    soundManager.initialize().then(() => {
      soundManager.playBackgroundMusic(mode);
    });

    // Spawn initial enemies
    spawnWave(config.initialEnemies);

    // Game timer
    const gameTimer = setInterval(() => {
      setGameTime((prev) => {
        updatePlayerStats({
          timeAlive: prev + 1,
        });
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(gameTimer);
      soundManager.stopBackgroundMusic();
    };
  }, []);

  const spawnWave = (count: number) => {
    const newEnemies: EnemyInstance[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = 15 + Math.random() * 10;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;

      newEnemies.push({
        id: `enemy-${Date.now()}-${i}`,
        position: [x, 0.5, z],
        health: config.enemyHealth,
        maxHealth: config.enemyHealth,
        speed: config.enemySpeed,
        damage: config.enemyDamage,
      });
    }
    setEnemies((prev) => [...prev, ...newEnemies]);
  };

  const handleEnemyDeath = (enemyId: string) => {
    setEnemies((prev) => prev.filter((e) => e.id !== enemyId));

    // Reward player
    const xpReward = 10 + waveNumber * 5;
    const coinReward = 5 + waveNumber * 2;

    updatePlayerStats({
      xp: playerStats.xp + xpReward,
      coins: playerStats.coins + coinReward,
      kills: playerStats.kills + 1,
    });

    // Check for wave completion
    if (enemies.length === 1) {
      // Last enemy defeated
      completeWave();
    }
  };

  const completeWave = () => {
    setWaveNumber((prev) => {
      const nextWave = prev + 1;
      soundManager.playLevelUpSound();

      // Spawn next wave
      setTimeout(() => {
        spawnWave(config.initialEnemies + config.waveIncrement * nextWave);
      }, 2000);

      // Check for mode progression
      if (mode === 'noob' && nextWave >= 3) {
        gameStore.unlockMode('pro');
      }

      return nextWave;
    });
  };

  const handlePlayerHealthChange = (newHealth: number) => {
    setPlayerHealth(newHealth);
    if (newHealth <= 0) {
      endGame();
    }
  };

  const endGame = () => {
    soundManager.stopBackgroundMusic();
    gameStore.setGameState('gameover');

    const finalStats = {
      mode,
      wavesSurvived: waveNumber,
      enemiesDefeated: playerStats.kills,
      timeAlive: gameTime,
      xpEarned: playerStats.xp,
      coinsEarned: playerStats.coins,
    };

    // Update high score
    if (waveNumber > gameStore.progress.highScores[mode]) {
      gameStore.setHighScore(mode, waveNumber);
    }

    onGameOver?.(finalStats);
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <GameWorld>
        {/* Player */}
        <Player
          position={[0, 0.5, 0]}
          onHealthChange={handlePlayerHealthChange}
          onKill={() => {}}
        />

        {/* Enemies */}
        {enemies.map((enemy) => (
          <Enemy
            key={enemy.id}
            position={enemy.position}
            health={enemy.health}
            maxHealth={enemy.maxHealth}
            speed={enemy.speed}
            damage={enemy.damage}
            difficulty={mode}
            onDeath={() => handleEnemyDeath(enemy.id)}
            playerPosition={playerPositionRef.current}
          />
        ))}
      </GameWorld>

      {/* HUD */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          color: '#00ffff',
          textShadow: '0 0 10px #00ffff',
          fontSize: '16px',
        }}
      >
        {/* Top HUD */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div>Mode: {mode.toUpperCase()}</div>
            <div>Wave: {waveNumber}</div>
            <div>Time: {gameTime}s</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>Health: {playerHealth}/{playerStats.maxHealth}</div>
            <div>Kills: {playerStats.kills}</div>
            <div>XP: {playerStats.xp}</div>
            <div>Coins: {playerStats.coins}</div>
          </div>
        </div>

        {/* Bottom HUD */}
        <div style={{ textAlign: 'center' }}>
          <div>Enemies: {enemies.length}</div>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#ff00ff' }}>
            WASD: Move | SPACE: Jump | CLICK: Attack | SHIFT: Skill
          </div>
        </div>
      </div>
    </div>
  );
};

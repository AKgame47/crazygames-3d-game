import { useState } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { soundManager } from '@/lib/soundManager';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GameMenuProps {
  onStartGame: (mode: 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate') => void;
}

export default function GameMenu({ onStartGame }: GameMenuProps) {
  const [selectedMode, setSelectedMode] = useState<'noob' | 'pro' | 'god' | 'psycho' | 'ultimate' | null>(null);
  const gameStore = useGameStore();
  const progress = gameStore.progress;

  const modes = [
    {
      id: 'noob' as const,
      name: 'NOOB MODE',
      description: 'Easy start with basic movement tutorial',
      reward: 'Speed Boost',
      difficulty: 1,
      unlocked: true,
      highScore: progress.highScores.noob,
    },
    {
      id: 'pro' as const,
      name: 'PRO MODE',
      description: 'Faster enemies and traps appear',
      reward: 'Double Jump',
      difficulty: 2,
      unlocked: progress.unlockedModes.includes('pro'),
      highScore: progress.highScores.pro,
    },
    {
      id: 'god' as const,
      name: 'GOD MODE',
      description: 'Boss fights unlocked, use Energy Slash',
      reward: 'Energy Slash',
      difficulty: 3,
      unlocked: progress.unlockedModes.includes('god'),
      highScore: progress.highScores.god,
    },
    {
      id: 'psycho' as const,
      name: 'PSYCHO MODE',
      description: 'Gravity flips, slow-mo effects, pure chaos',
      reward: 'Time Freeze',
      difficulty: 4,
      unlocked: progress.unlockedModes.includes('psycho'),
      highScore: progress.highScores.psycho,
    },
    {
      id: 'ultimate' as const,
      name: 'ULTIMATE MODE',
      description: 'Endless waves with evolving enemies',
      reward: 'Shadow Skill',
      difficulty: 5,
      unlocked: progress.unlockedModes.includes('ultimate'),
      highScore: progress.highScores.ultimate,
    },
  ];

  const handleModeSelect = (mode: 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate') => {
    soundManager.playUISound('click');
    setSelectedMode(mode);
  };

  const handleStartGame = () => {
    if (selectedMode) {
      soundManager.playUISound('success');
      gameStore.setCurrentMode(selectedMode);
      gameStore.setGameState('playing');
      gameStore.resetPlayerStats();
      onStartGame(selectedMode);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0f0f1e 100%)',
        color: '#00ffff',
        fontFamily: 'Arial, sans-serif',
        padding: '40px 20px',
        textShadow: '0 0 10px #00ffff',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            color: '#ff00ff',
            textShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff',
          }}
        >
          MAD RUN
        </h1>
        <p
          style={{
            fontSize: '24px',
            color: '#00ffff',
            margin: '0',
            textShadow: '0 0 10px #00ffff',
          }}
        >
          Rise Through Insanity
        </p>
      </div>

      {/* Mode Selection */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        {modes.map((mode) => (
          <div
            key={mode.id}
            onClick={() => mode.unlocked && handleModeSelect(mode.id)}
            style={{
              padding: '20px',
              border: selectedMode === mode.id ? '3px solid #ff00ff' : '2px solid #00ffff',
              borderRadius: '10px',
              background: selectedMode === mode.id ? 'rgba(255, 0, 255, 0.1)' : 'rgba(0, 255, 255, 0.05)',
              cursor: mode.unlocked ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              opacity: mode.unlocked ? 1 : 0.5,
              boxShadow:
                selectedMode === mode.id
                  ? '0 0 20px #ff00ff, inset 0 0 10px #ff00ff'
                  : '0 0 10px #00ffff',
            }}
          >
            <h3
              style={{
                margin: '0 0 10px 0',
                fontSize: '20px',
                color: mode.unlocked ? '#ff00ff' : '#666666',
              }}
            >
              {mode.name}
            </h3>
            <p
              style={{
                margin: '0 0 10px 0',
                fontSize: '14px',
                color: '#00ffff',
              }}
            >
              {mode.description}
            </p>
            <div
              style={{
                fontSize: '12px',
                color: '#ffff00',
                marginBottom: '10px',
              }}
            >
              Difficulty: {'⭐'.repeat(mode.difficulty)}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#00ff00',
                marginBottom: '10px',
              }}
            >
              Reward: {mode.reward}
            </div>
            {mode.highScore > 0 && (
              <div
                style={{
                  fontSize: '12px',
                  color: '#ffff00',
                }}
              >
                High Score: Wave {mode.highScore}
              </div>
            )}
            {!mode.unlocked && (
              <div
                style={{
                  fontSize: '12px',
                  color: '#ff0000',
                  marginTop: '10px',
                }}
              >
                🔒 LOCKED
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Start Button */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Button
          onClick={handleStartGame}
          disabled={!selectedMode}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            background: selectedMode ? '#ff00ff' : '#666666',
            color: '#000000',
            border: 'none',
            borderRadius: '5px',
            cursor: selectedMode ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            boxShadow: selectedMode ? '0 0 20px #ff00ff' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          {selectedMode ? `START ${selectedMode.toUpperCase()} MODE` : 'SELECT A MODE'}
        </Button>
      </div>

      {/* Stats */}
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px',
          border: '2px solid #00ffff',
          borderRadius: '10px',
          background: 'rgba(0, 255, 255, 0.05)',
          textAlign: 'center',
        }}
      >
        <h3 style={{ margin: '0 0 15px 0', color: '#ff00ff' }}>YOUR PROGRESS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#00ffff' }}>Total Kills</div>
            <div style={{ fontSize: '24px', color: '#00ff00', fontWeight: 'bold' }}>
              {modes.reduce((sum, m) => sum + m.highScore, 0)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#00ffff' }}>Modes Unlocked</div>
            <div style={{ fontSize: '24px', color: '#00ff00', fontWeight: 'bold' }}>
              {progress.unlockedModes.length}/5
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#00ffff' }}>Skills Learned</div>
            <div style={{ fontSize: '24px', color: '#00ff00', fontWeight: 'bold' }}>
              {progress.unlockedAbilities.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#00ffff' }}>Costumes</div>
            <div style={{ fontSize: '24px', color: '#00ff00', fontWeight: 'bold' }}>
              {progress.unlockedCostumes.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

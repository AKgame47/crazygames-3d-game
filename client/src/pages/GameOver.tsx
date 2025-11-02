import { useGameStore } from '@/lib/gameStore';
import { soundManager } from '@/lib/soundManager';
import { Button } from '@/components/ui/button';

interface GameOverProps {
  stats: {
    mode: string;
    wavesSurvived: number;
    enemiesDefeated: number;
    timeAlive: number;
    xpEarned: number;
    coinsEarned: number;
  };
  onReturnToMenu: () => void;
  onRetryMode: () => void;
}

export default function GameOver({ stats, onReturnToMenu, onRetryMode }: GameOverProps) {
  const gameStore = useGameStore();
  const progress = gameStore.progress;

  const handleRetry = () => {
    soundManager.playUISound('click');
    onRetryMode();
  };

  const handleMenu = () => {
    soundManager.playUISound('click');
    gameStore.setGameState('menu');
    onReturnToMenu();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0f0f1e 100%)',
        color: '#00ffff',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        textShadow: '0 0 10px #00ffff',
      }}
    >
      {/* Game Over Title */}
      <h1
        style={{
          fontSize: '72px',
          fontWeight: 'bold',
          margin: '0 0 20px 0',
          color: '#ff0000',
          textShadow: '0 0 30px #ff0000, 0 0 60px #ff0000',
        }}
      >
        GAME OVER
      </h1>

      {/* Stats Card */}
      <div
        style={{
          maxWidth: '600px',
          padding: '40px',
          border: '3px solid #ff00ff',
          borderRadius: '10px',
          background: 'rgba(255, 0, 255, 0.1)',
          marginBottom: '40px',
          boxShadow: '0 0 30px #ff00ff, inset 0 0 20px #ff00ff',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            margin: '0 0 30px 0',
            fontSize: '32px',
            color: '#ffff00',
            textShadow: '0 0 10px #ffff00',
          }}
        >
          {stats.mode.toUpperCase()} MODE
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              padding: '15px',
              border: '1px solid #00ffff',
              borderRadius: '5px',
              background: 'rgba(0, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '12px', color: '#00ffff', marginBottom: '5px' }}>
              WAVES SURVIVED
            </div>
            <div style={{ fontSize: '32px', color: '#00ff00', fontWeight: 'bold' }}>
              {stats.wavesSurvived}
            </div>
          </div>

          <div
            style={{
              padding: '15px',
              border: '1px solid #00ffff',
              borderRadius: '5px',
              background: 'rgba(0, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '12px', color: '#00ffff', marginBottom: '5px' }}>
              ENEMIES DEFEATED
            </div>
            <div style={{ fontSize: '32px', color: '#00ff00', fontWeight: 'bold' }}>
              {stats.enemiesDefeated}
            </div>
          </div>

          <div
            style={{
              padding: '15px',
              border: '1px solid #00ffff',
              borderRadius: '5px',
              background: 'rgba(0, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '12px', color: '#00ffff', marginBottom: '5px' }}>
              TIME SURVIVED
            </div>
            <div style={{ fontSize: '32px', color: '#00ff00', fontWeight: 'bold' }}>
              {formatTime(stats.timeAlive)}
            </div>
          </div>

          <div
            style={{
              padding: '15px',
              border: '1px solid #00ffff',
              borderRadius: '5px',
              background: 'rgba(0, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '12px', color: '#00ffff', marginBottom: '5px' }}>
              TOTAL REWARDS
            </div>
            <div style={{ fontSize: '20px', color: '#ffff00', fontWeight: 'bold' }}>
              {stats.xpEarned} XP
            </div>
            <div style={{ fontSize: '20px', color: '#ffff00', fontWeight: 'bold' }}>
              {stats.coinsEarned} 💰
            </div>
          </div>
        </div>

        {/* Achievement */}
        {stats.wavesSurvived >= 10 && (
          <div
            style={{
              padding: '15px',
              border: '2px solid #ffff00',
              borderRadius: '5px',
              background: 'rgba(255, 255, 0, 0.1)',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '14px', color: '#ffff00', marginBottom: '5px' }}>
              🏆 ACHIEVEMENT UNLOCKED
            </div>
            <div style={{ fontSize: '16px', color: '#ffff00', fontWeight: 'bold' }}>
              WAVE MASTER - Survived 10+ waves!
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Button
          onClick={handleRetry}
          style={{
            padding: '15px 40px',
            fontSize: '16px',
            background: '#00ff00',
            color: '#000000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 20px #00ff00',
            transition: 'all 0.3s ease',
          }}
        >
          RETRY MODE
        </Button>

        <Button
          onClick={handleMenu}
          style={{
            padding: '15px 40px',
            fontSize: '16px',
            background: '#00ffff',
            color: '#000000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 20px #00ffff',
            transition: 'all 0.3s ease',
          }}
        >
          RETURN TO MENU
        </Button>
      </div>

      {/* Leaderboard Hint */}
      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          border: '1px solid #00ffff',
          borderRadius: '5px',
          background: 'rgba(0, 255, 255, 0.05)',
          textAlign: 'center',
          maxWidth: '600px',
        }}
      >
        <div style={{ fontSize: '12px', color: '#00ffff', marginBottom: '10px' }}>
          CURRENT HIGH SCORES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>Noob Mode</div>
            <div style={{ fontSize: '16px', color: '#00ff00' }}>
              Wave {progress.highScores.noob}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>Pro Mode</div>
            <div style={{ fontSize: '16px', color: '#00ff00' }}>
              Wave {progress.highScores.pro}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>God Mode</div>
            <div style={{ fontSize: '16px', color: '#00ff00' }}>
              Wave {progress.highScores.god}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>Psycho Mode</div>
            <div style={{ fontSize: '16px', color: '#00ff00' }}>
              Wave {progress.highScores.psycho}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

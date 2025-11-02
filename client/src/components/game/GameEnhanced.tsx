import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { GameWorldEnhanced } from './GameWorldEnhanced';
import { soundManager } from '@/lib/soundManager';

interface GameEnhancedProps {
  mode: 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate';
}

export function GameEnhanced({ mode }: GameEnhancedProps) {
  const [, setLocation] = useLocation();
  const [isPaused, setIsPaused] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start background music
    soundManager.playBackgroundMusic(mode);

    // Handle escape key to pause
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  const handleGameOver = (stats: any) => {
    soundManager.stopBackgroundMusic();
    // Navigate to game over screen with stats
    setLocation(`/game-over?mode=${mode}&score=${stats.score}&wave=${stats.wave}`);
  };

  return (
    <div ref={gameRef} className="w-full h-screen bg-black relative overflow-hidden">
      {/* Game canvas */}
      <GameWorldEnhanced mode={mode} onGameOver={handleGameOver} />

      {/* Pause overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-cyan-400 mb-8">PAUSED</h1>
            <div className="space-y-4">
              <button
                onClick={() => setIsPaused(false)}
                className="block w-48 px-6 py-3 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 transition"
              >
                Resume Game
              </button>
              <button
                onClick={() => {
                  soundManager.stopBackgroundMusic();
                  setLocation('/');
                }}
                className="block w-48 px-6 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition"
              >
                Back to Menu
              </button>
            </div>
            <p className="text-cyan-300 mt-8 text-sm">Press ESC to resume</p>
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 text-cyan-300 text-sm">
        <p>WASD: Move | SPACE: Jump | CLICK: Attack | SHIFT: Skill | ESC: Pause</p>
      </div>
    </div>
  );
}

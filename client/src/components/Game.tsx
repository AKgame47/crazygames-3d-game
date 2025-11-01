import React, { useEffect, useRef, useState } from 'react';
import { GameManager, GameState } from '@/lib/gameManager';
import { InputController } from '@/lib/inputController';
import { AudioManager } from '@/lib/audioManager';
import { Button } from '@/components/ui/button';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameManagerRef = useRef<GameManager | null>(null);
  const inputControllerRef = useRef<InputController | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const prevGameStateRef = useRef<GameState | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    combo: 0,
    height: 0,
    isGameOver: false,
    hyperMode: false,
    dropsCount: 0,
  });

  const [showGameOver, setShowGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize game systems
    const gameManager = new GameManager(canvasRef.current);
    const inputController = new InputController();
    const audioManager = new AudioManager();

    gameManagerRef.current = gameManager;
    inputControllerRef.current = inputController;
    audioManagerRef.current = audioManager;

    // Setup event handlers
    gameManager.onGameStateChange = (state: GameState) => {
      setGameState((prevState) => {
        // Play Hyper Mode sound when activated
        if (state.hyperMode && !prevState.hyperMode) {
          audioManager.playSound('hyperMode');
        }

        // Play sound based on combo
        if (state.combo > prevState.combo) {
          if (state.combo % 5 === 0) {
            audioManager.playSound('perfect');
          } else {
            audioManager.playSound('good');
          }
        }

        return state;
      });
    };

    gameManager.onGameOver = (score: number) => {
      setFinalScore(score);
      setShowGameOver(true);
      audioManager.playSound('gameOver');
      audioManager.stopMusic();
    };

    inputController.onDrop = () => {
      gameManager.dropBlock();
    };

    // Start game loop
    let lastTime = Date.now();
    const gameLoop = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      gameManager.update(deltaTime);
      gameManager.render();

      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    // Play background music
    audioManager.playMusic();

    // Start the game loop
    animationIdRef.current = requestAnimationFrame(gameLoop);

    // Handle window resize
    const handleResize = () => {
      gameManager.engine.onWindowResize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      gameManager.dispose();
      inputController.dispose();
      audioManager.dispose();
    };
  }, []);

  const handlePlayAgain = () => {
    if (gameManagerRef.current && audioManagerRef.current) {
      gameManagerRef.current.reset();
      setShowGameOver(false);
      setGameState({
        score: 0,
        combo: 0,
        height: 0,
        isGameOver: false,
        hyperMode: false,
        dropsCount: 0,
      });
      audioManagerRef.current.playMusic();
    }
  };

  const handleToggleMute = () => {
    if (audioManagerRef.current) {
      audioManagerRef.current.toggleMute();
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* HUD - Score and Stats */}
      <div className="absolute top-4 left-4 right-4 z-10 text-white font-bold">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-2xl md:text-3xl">Score: {gameState.score}</div>
            <div className="text-lg md:text-xl text-yellow-400">Combo: {gameState.combo}x</div>
            <div className="text-lg md:text-xl text-cyan-400">Height: {gameState.height}</div>
          </div>
          <div className="text-right">
            {gameState.hyperMode && (
              <div className="text-2xl md:text-3xl text-pink-500 animate-pulse font-black">
                🔥 HYPER MODE 🔥
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 text-white text-xs md:text-sm opacity-75">
        <div>Click / Tap / Press Space to Drop</div>
        <div>ESC to Pause</div>
      </div>

      {/* Mute Button */}
      <button
        onClick={handleToggleMute}
        className="absolute top-4 right-4 z-10 bg-white text-black px-3 py-2 rounded font-bold hover:bg-gray-200 text-lg"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* Game Over Screen */}
      {showGameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
          <div className="bg-gray-900 border-2 border-cyan-500 p-8 rounded-lg text-center max-w-md">
            <h1 className="text-4xl font-black text-white mb-4">GAME OVER</h1>
            <div className="text-5xl font-black text-yellow-400 mb-6">{finalScore}</div>
            <div className="text-xl text-gray-300 mb-2">Final Score</div>
            <div className="text-lg text-cyan-400 mb-6">
              Height Reached: {gameState.height} blocks
            </div>
            <Button
              onClick={handlePlayAgain}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-lg py-3 rounded"
            >
              Play Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

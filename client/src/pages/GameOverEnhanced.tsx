import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { soundManager } from '@/lib/soundManager';

export default function GameOverEnhanced() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState({
    mode: 'noob',
    score: 0,
    wave: 1,
  });

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(window.location.search);
    setStats({
      mode: params.get('mode') || 'noob',
      score: parseInt(params.get('score') || '0'),
      wave: parseInt(params.get('wave') || '1'),
    });

    soundManager.playGameOverSound();
  }, []);

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'noob':
        return 'text-green-400';
      case 'pro':
        return 'text-blue-400';
      case 'god':
        return 'text-purple-400';
      case 'psycho':
        return 'text-pink-400';
      case 'ultimate':
        return 'text-red-400';
      default:
        return 'text-cyan-400';
    }
  };

  const getAchievement = () => {
    if (stats.wave >= 20) return '🏆 LEGENDARY';
    if (stats.wave >= 15) return '⭐ MASTER';
    if (stats.wave >= 10) return '💪 CHAMPION';
    if (stats.wave >= 5) return '🎯 SKILLED';
    return '🌟 BRAVE';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-magenta-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Game Over Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-magenta-500 to-cyan-500 mb-2 animate-pulse">
            GAME OVER
          </h1>
          <p className="text-cyan-400 text-lg">Your journey ends here...</p>
        </div>

        {/* Stats Card */}
        <div className="bg-black/50 border-2 border-cyan-500 rounded-lg p-8 mb-8 backdrop-blur-sm">
          {/* Mode */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">DIFFICULTY</p>
            <p className={`text-3xl font-bold uppercase ${getModeColor(stats.mode)}`}>
              {stats.mode} Mode
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-cyan-500/30 my-6" />

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-cyan-500/10 border border-cyan-500/50 rounded p-4">
              <p className="text-cyan-300 text-sm mb-2">WAVES SURVIVED</p>
              <p className="text-4xl font-bold text-cyan-400">{stats.wave}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded p-4">
              <p className="text-yellow-300 text-sm mb-2">FINAL SCORE</p>
              <p className="text-4xl font-bold text-yellow-400">{stats.score}</p>
            </div>
          </div>

          {/* Achievement */}
          <div className="bg-magenta-500/10 border border-magenta-500/50 rounded p-4 mb-6">
            <p className="text-magenta-300 text-sm mb-2">ACHIEVEMENT</p>
            <p className="text-2xl font-bold text-magenta-400">{getAchievement()}</p>
          </div>

          {/* Divider */}
          <div className="border-t border-cyan-500/30 my-6" />

          {/* Stats Details */}
          <div className="text-left space-y-3 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Enemies Defeated:</span>
              <span className="text-cyan-400 font-bold">{stats.wave * 5}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>XP Earned:</span>
              <span className="text-cyan-400 font-bold">{stats.score}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Coins Collected:</span>
              <span className="text-yellow-400 font-bold">{Math.floor(stats.score / 10)}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => setLocation(`/game?mode=${stats.mode}`)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold py-3 rounded-lg transition-all transform hover:scale-105"
          >
            Try Again
          </Button>
          <Button
            onClick={() => setLocation('/')}
            className="w-full bg-gradient-to-r from-magenta-600 to-purple-600 hover:from-magenta-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
          >
            Back to Menu
          </Button>
        </div>

        {/* Tip */}
        <p className="text-gray-400 text-sm mt-8">
          💡 Tip: Use your skills wisely and dodge incoming attacks to survive longer!
        </p>
      </div>
    </div>
  );
}

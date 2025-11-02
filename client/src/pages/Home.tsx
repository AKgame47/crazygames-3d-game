import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add some initial animation
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in');
      }, i * 100);
    });
  }, []);

  const startGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLocation('/menu');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-magenta-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl">
        {/* Logo/Title */}
        <div className="fade-in mb-8">
          <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-magenta-500 to-cyan-400 mb-4 drop-shadow-lg">
            MAD RUN
          </h1>
          <p className="text-2xl md:text-3xl text-cyan-300 font-bold">Rise Through Insanity</p>
        </div>

        {/* Description */}
        <div className="fade-in mb-12 max-w-2xl mx-auto">
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Enter a neon-soaked cyberpunk world where survival is everything. Battle through 
            <span className="text-cyan-400 font-bold"> five insane difficulty modes</span>, 
            master devastating skills, and become <span className="text-magenta-400 font-bold">THE MAD ONE</span>.
          </p>
          <p className="text-gray-400 text-base">
            Can you survive the waves? Can you reach Ultimate Mode? Prove your worth.
          </p>
        </div>

        {/* Features Grid */}
        <div className="fade-in grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-cyan-500/10 border border-cyan-500/50 rounded-lg p-6 backdrop-blur-sm hover:bg-cyan-500/20 transition">
            <div className="text-3xl mb-3">⚔️</div>
            <h3 className="text-cyan-400 font-bold mb-2">Intense Combat</h3>
            <p className="text-gray-400 text-sm">Face waves of enemies with strategic skill usage</p>
          </div>
          <div className="bg-magenta-500/10 border border-magenta-500/50 rounded-lg p-6 backdrop-blur-sm hover:bg-magenta-500/20 transition">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-magenta-400 font-bold mb-2">5 Difficulty Modes</h3>
            <p className="text-gray-400 text-sm">From Noob to Ultimate - endless challenge awaits</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/50 rounded-lg p-6 backdrop-blur-sm hover:bg-purple-500/20 transition">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-purple-400 font-bold mb-2">Epic Skills</h3>
            <p className="text-gray-400 text-sm">Unlock powerful abilities as you progress</p>
          </div>
        </div>

        {/* Stats */}
        <div className="fade-in grid grid-cols-3 gap-4 mb-12">
          <div className="bg-black/50 border border-cyan-500/30 rounded p-4">
            <p className="text-cyan-400 text-2xl font-bold">10+</p>
            <p className="text-gray-400 text-sm">Unique Skills</p>
          </div>
          <div className="bg-black/50 border border-cyan-500/30 rounded p-4">
            <p className="text-cyan-400 text-2xl font-bold">5</p>
            <p className="text-gray-400 text-sm">Game Modes</p>
          </div>
          <div className="bg-black/50 border border-cyan-500/30 rounded p-4">
            <p className="text-cyan-400 text-2xl font-bold">∞</p>
            <p className="text-gray-400 text-sm">Replayability</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="fade-in">
          <Button
            onClick={startGame}
            disabled={isLoading}
            className="relative inline-block px-12 py-4 text-xl font-bold text-black bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/50"
          >
            {isLoading ? 'Loading...' : 'START GAME'}
          </Button>
        </div>

        {/* Footer */}
        <div className="fade-in mt-16 text-gray-500 text-sm">
          <p>Built with React • Three.js • Tone.js</p>
          <p className="mt-2">🎮 Powered by Manus</p>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .fade-in {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

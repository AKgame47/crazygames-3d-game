# Hyper-Stack: 3D Arcade Game

A highly addictive, fast-paced 3D HTML5 arcade game built with modern web technologies. Drop geometric blocks onto a moving tower with precision to achieve massive scores and unlock Hyper Mode.

## 🎮 Game Overview

**Hyper-Stack** is a physics-based stacking game designed to meet CrazyGames' publishing standards. The game combines simple, intuitive mechanics with escalating difficulty and satisfying feedback loops to create an addictive gameplay experience.

### Core Mechanics

- **Drop Blocks:** Click, tap, or press Space to drop blocks onto the tower
- **Perfect Placement:** Align blocks perfectly to earn combo multipliers
- **Progressive Difficulty:** Speed increases and block sizes shrink as you progress
- **Hyper Mode:** Achieve 5 consecutive perfect drops to unlock Hyper Mode and double your score
- **Height Milestones:** Earn bonus points at 10, 25, 50, and 100 blocks

## ✨ Features

### Gameplay
- **Addictive Core Loop:** Simple to learn, challenging to master
- **Combo System:** Build combos for exponential score growth
- **Progressive Difficulty:** Dynamic speed and size scaling
- **Hyper Mode:** Special power-up mode with visual effects
- **Height Bonuses:** Milestone rewards for reaching specific heights

### Audio & Visual
- **Dynamic Sound Effects:** Perfect drop chimes, good drop thuds, game over gongs
- **Background Music:** Upbeat electronic soundtrack
- **Vibrant Low-Poly Graphics:** Clean, colorful 3D aesthetic
- **Visual Feedback:** Hyper Mode neon glow effect
- **Responsive Design:** Optimized for desktop and mobile browsers

### Controls
- **Mouse:** Click to drop blocks
- **Keyboard:** Press Space or Enter to drop
- **Touch:** Tap to drop blocks
- **Audio:** Mute button for sound control

## 🛠 Technology Stack

### Frontend
- **Three.js** - 3D rendering and scene management
- **Cannon.js** - Physics engine for collision detection
- **Howler.js** - Audio management
- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Responsive styling

### Development
- **Vite** - Fast build tool
- **Node.js** - Runtime environment
- **pnpm** - Package manager

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/AKgame47/crazygames-3d-game.git
cd crazygames-3d-game

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The game will be available at `http://localhost:3000`

## 🎯 Gameplay Guide

### How to Play

1. **Start the Game:** The game begins automatically with a green foundation block
2. **Watch the Block:** A colored block will appear above the tower and move side to side
3. **Drop the Block:** Click, tap, or press Space when the block is aligned
4. **Build Your Tower:** Stack blocks to increase your height
5. **Earn Combos:** Perfect drops (minimal overhang) earn combo multipliers
6. **Unlock Hyper Mode:** Get 5 consecutive perfect drops to activate Hyper Mode
7. **Game Over:** The game ends when a block falls off the tower

### Scoring System

| Action | Points |
| :--- | :--- |
| Perfect Drop | 100 × (1 + combo) |
| Good Drop | 50 × combo |
| Missed Drop | 25 |
| Height Milestone (10) | 200 |
| Height Milestone (25) | 500 |
| Height Milestone (50) | 1000 |
| Height Milestone (100) | 2500 |
| Hyper Mode Activation | 1000 |

### Tips for High Scores

- **Aim for Perfect Drops:** Align blocks perfectly to build combos
- **Maintain Momentum:** Keep your combo multiplier going
- **Watch the Movement:** Predict where the block will be
- **Use Hyper Mode:** Activate it strategically for maximum points
- **Stay Focused:** Difficulty increases with height, so stay sharp

## 🎨 Art & Audio Style

### Visual Design
- **Low-Poly Aesthetic:** Clean, geometric shapes for fast loading
- **Vibrant Color Palette:** Each block has a distinct, bright color
- **Dark Background:** Gradient dark blue background makes blocks pop
- **Lighting:** Realistic shadows and ambient lighting

### Sound Design
- **Perfect Drop:** High-pitched chime (880 Hz sine wave)
- **Good Drop:** Soft thud (220 Hz sine wave)
- **Shave Sound:** Sharp slice (white noise with frequency sweep)
- **Game Over:** Deep gong (110 Hz with slow decay)
- **Hyper Mode:** Synth flourish (ascending note sequence)
- **Background Music:** Upbeat electronic loop

## 📱 Responsive Design

The game is fully responsive and optimized for:
- **Desktop:** Full 3D experience with mouse controls
- **Tablet:** Touch controls with optimized UI
- **Mobile:** Portrait and landscape orientations

## 🚀 Performance Optimization

- **Lightweight Assets:** Minimal geometry and textures
- **Efficient Physics:** Optimized collision detection
- **Smart Rendering:** Culling and LOD techniques
- **Audio Optimization:** Procedurally generated sounds
- **Mobile Friendly:** Optimized for low-end devices

## 🎯 CrazyGames Compliance

### Publishing Standards
- ✅ **100% Original:** No clones or copyrighted content
- ✅ **Fast Loading:** Lightweight and optimized
- ✅ **Engaging:** Addictive gameplay within 10 seconds
- ✅ **Cross-Browser:** Works on all modern browsers
- ✅ **Mobile Friendly:** Full touch support
- ✅ **No External SDKs:** Pure web technologies

### Ad Integration Points
- Pre-game loading screen (optional)
- Game Over screen (banner or interstitial)
- Rewarded video option (score doubler)

## 📊 Game Architecture

### Core Systems

| System | Purpose |
| :--- | :--- |
| **GameEngine** | Three.js scene, camera, renderer, physics world |
| **GameManager** | Game state, block management, scoring logic |
| **InputController** | Mouse, keyboard, and touch input handling |
| **AudioManager** | Sound effects and music playback |
| **ParticleSystem** | Visual effects for drops and shatters |
| **SoundGenerator** | Web Audio API sound synthesis |

### File Structure

```
client/
  src/
    lib/
      gameEngine.ts        # Three.js and Cannon.js initialization
      gameManager.ts       # Game logic and state management
      inputController.ts   # Input handling
      audioManager.ts      # Audio management
      soundGenerator.ts    # Web Audio API sound synthesis
      particleSystem.ts    # Particle effects
    components/
      Game.tsx            # Main game component
    pages/
      Home.tsx            # Home page (displays Game)
    App.tsx               # App router
```

## 🐛 Known Limitations

- Physics simulation runs at 60 FPS (fixed timestep)
- Particle effects are CPU-intensive on low-end devices
- Audio synthesis may not work on all browsers (fallback to silence)
- Maximum tower height is theoretically unlimited but practically limited by performance

## 🔮 Future Enhancements

- Leaderboard system with cloud storage
- Achievement/badge system
- Multiple game modes (Time Attack, Survival)
- Power-ups and special blocks
- Customizable themes and skins
- Multiplayer/competitive modes
- Advanced particle effects with post-processing

## 📄 License

This project is created for CrazyGames publishing. All rights reserved.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues, bugs, or feature requests, please open an issue on GitHub.

---

**Made with ❤️ using Three.js, Cannon.js, and React**

Enjoy the game and aim for the highest score! 🎮

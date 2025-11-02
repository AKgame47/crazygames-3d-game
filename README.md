# 🎮 MAD RUN: Rise Through Insanity

An ultra-addictive 3D single-player action survival game where you run, fight, and upgrade through five insane difficulty modes. Battle waves of enemies, master devastating skills, and become **THE MAD ONE**.

## 🚀 Features

### Core Gameplay
- **3D Action Combat**: Real-time combat system with enemy AI and pathfinding
- **Five Difficulty Modes**:
  - 🟢 **Noob Mode**: Tutorial with weak enemies, rewards Speed Boost
  - 🔵 **Pro Mode**: Faster enemies and traps, rewards Double Jump
  - 🟣 **God Mode**: Boss fights and Energy Slash ability
  - 🔴 **Psycho Mode**: Gravity flips and chaos effects, rewards Time Freeze
  - ⚫ **Ultimate Mode**: Endless waves with Shadow Clone reward

### Progression System
- 10+ unique skills with cooldown management
- XP, coins, and skill points system
- Mode-specific high score tracking
- Persistent player progression with database storage
- Achievement system with unlock tracking

### Sound Design
- Procedurally generated adaptive music (Tone.js)
- Attack, hit, and skill activation sound effects (Howler.js)
- UI interaction sounds
- Master volume controls

### Visuals
- Neon cyberpunk aesthetic with glowing effects
- Animated backgrounds for each game mode
- Particle effects for attacks and skills
- Dynamic lighting and grid-based environment
- Screen shake effects on impacts

### Leaderboards & Stats
- Global leaderboards for each difficulty mode
- Player statistics tracking (kills, playtime, XP earned)
- Mode-specific high score tracking
- Real-time leaderboard updates

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Three.js** - 3D rendering
- **Tailwind CSS** - Styling
- **Tone.js** - Audio synthesis
- **Howler.js** - Sound effects

### Backend
- **Express.js** - Server framework
- **tRPC** - Type-safe API
- **MySQL** - Database
- **Drizzle ORM** - Database management

### DevOps
- **Vite** - Build tool
- **pnpm** - Package manager
- **TypeScript** - Type checking

## 📦 Installation

### Prerequisites
- Node.js 18+
- pnpm (or npm)
- MySQL database

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AKgame47/crazygames-3d-game.git
   cd crazygames-3d-game
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=mysql://user:password@localhost:3306/mad_run
   JWT_SECRET=your-secret-key
   VITE_APP_ID=your-app-id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
   ```

4. **Setup database**
   ```bash
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Build for production**
   ```bash
   pnpm build
   ```

## 🎮 How to Play

### Controls
- **WASD** - Move your character
- **SPACE** - Jump to dodge attacks
- **CLICK** - Attack enemies
- **SHIFT** - Activate special skills
- **ESC** - Pause game

### Gameplay Tips
1. **Learn Enemy Patterns**: Each enemy type has predictable attack patterns
2. **Use Skills Wisely**: Skills have cooldowns - use them strategically
3. **Stay Mobile**: Keep moving to avoid enemy attacks and trap damage
4. **Watch Your Health**: The health bar shows your remaining HP
5. **Chain Attacks**: Combine attacks for bonus XP multipliers

### Progression
- Survive waves to earn XP and coins
- Unlock new abilities as you progress through modes
- Reach higher modes by completing challenges
- Compete on global leaderboards

## 📁 Project Structure

```
mad-run/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utility libraries
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routers.ts         # tRPC routes
│   ├── db.ts              # Database helpers
│   └── _core/             # Core server setup
├── drizzle/               # Database schema & migrations
├── shared/                # Shared types & constants
└── package.json           # Dependencies
```

## 🗄️ Database Schema

### Tables
- **users**: Player authentication and profile
- **playerProgress**: Game progress and statistics
- **gameSessions**: Individual game session records
- **leaderboard**: Global leaderboards per mode
- **achievements**: Player achievements and badges

## 🔧 API Endpoints

### Game Routes
- `GET /api/trpc/game.getProgress` - Get player progress
- `POST /api/trpc/game.saveSession` - Save game session
- `GET /api/trpc/game.getLeaderboard` - Get leaderboard
- `GET /api/trpc/game.getStats` - Get player stats
- `POST /api/trpc/game.unlockMode` - Unlock difficulty mode
- `POST /api/trpc/game.unlockAbility` - Unlock ability

## 🎯 Development Roadmap

- [ ] Multiplayer mode
- [ ] Custom game modes
- [ ] More enemy types
- [ ] Boss battles
- [ ] Seasonal events
- [ ] Mobile support
- [ ] Trading system
- [ ] Guilds/Clans

## 🐛 Known Issues & Fixes

See [OPTIMIZATION.md](./OPTIMIZATION.md) for performance optimization tips.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 🙏 Credits

Built with ❤️ using:
- React & Three.js for 3D rendering
- Tone.js for audio synthesis
- Manus platform for deployment

---

**Ready to become THE MAD ONE? Start playing now!** 🎮✨

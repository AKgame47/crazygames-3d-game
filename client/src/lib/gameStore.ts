import { create } from 'zustand';

export type GameMode = 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate';
export type GameState = 'menu' | 'playing' | 'paused' | 'gameover' | 'victory';

export interface PlayerStats {
  health: number;
  maxHealth: number;
  xp: number;
  coins: number;
  skillPoints: number;
  kills: number;
  timeAlive: number;
}

export interface GameProgress {
  unlockedModes: GameMode[];
  unlockedAbilities: string[];
  unlockedWeapons: string[];
  unlockedCostumes: string[];
  currentMode: GameMode;
  highScores: Record<GameMode, number>;
}

interface GameStore {
  // Game state
  gameState: GameState;
  setGameState: (state: GameState) => void;

  // Player stats
  playerStats: PlayerStats;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  resetPlayerStats: () => void;

  // Game progress
  progress: GameProgress;
  setCurrentMode: (mode: GameMode) => void;
  unlockMode: (mode: GameMode) => void;
  unlockAbility: (ability: string) => void;
  unlockWeapon: (weapon: string) => void;
  unlockCostume: (costume: string) => void;
  setHighScore: (mode: GameMode, score: number) => void;

  // Game settings
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;

  // Active skills
  activeSkills: string[];
  addActiveSkill: (skill: string) => void;
  removeActiveSkill: (skill: string) => void;
  clearActiveSkills: () => void;

  // Wave tracking (for Ultimate Mode)
  currentWave: number;
  enemiesDefeated: number;
  setCurrentWave: (wave: number) => void;
  setEnemiesDefeated: (count: number) => void;
}

const defaultPlayerStats: PlayerStats = {
  health: 100,
  maxHealth: 100,
  xp: 0,
  coins: 0,
  skillPoints: 0,
  kills: 0,
  timeAlive: 0,
};

const defaultProgress: GameProgress = {
  unlockedModes: ['noob'],
  unlockedAbilities: ['basicAttack'],
  unlockedWeapons: ['sword'],
  unlockedCostumes: ['default'],
  currentMode: 'noob',
  highScores: {
    noob: 0,
    pro: 0,
    god: 0,
    psycho: 0,
    ultimate: 0,
  },
};

export const useGameStore = create<GameStore>((set) => ({
  // Game state
  gameState: 'menu',
  setGameState: (state) => set({ gameState: state }),

  // Player stats
  playerStats: defaultPlayerStats,
  updatePlayerStats: (stats) =>
    set((state) => ({
      playerStats: { ...state.playerStats, ...stats },
    })),
  resetPlayerStats: () => set({ playerStats: defaultPlayerStats }),

  // Game progress
  progress: defaultProgress,
  setCurrentMode: (mode) =>
    set((state) => ({
      progress: { ...state.progress, currentMode: mode },
    })),
  unlockMode: (mode) =>
    set((state) => ({
      progress: {
        ...state.progress,
        unlockedModes: Array.from(new Set([...state.progress.unlockedModes, mode])),
      },
    })),
  unlockAbility: (ability) =>
    set((state) => ({
      progress: {
        ...state.progress,
        unlockedAbilities: Array.from(new Set([...state.progress.unlockedAbilities, ability])),
      },
    })),
  unlockWeapon: (weapon) =>
    set((state) => ({
      progress: {
        ...state.progress,
        unlockedWeapons: Array.from(new Set([...state.progress.unlockedWeapons, weapon])),
      },
    })),
  unlockCostume: (costume) =>
    set((state) => ({
      progress: {
        ...state.progress,
        unlockedCostumes: Array.from(new Set([...state.progress.unlockedCostumes, costume])),
      },
    })),
  setHighScore: (mode, score) =>
    set((state) => ({
      progress: {
        ...state.progress,
        highScores: { ...state.progress.highScores, [mode]: score },
      },
    })),

  // Game settings
  masterVolume: 0.8,
  musicVolume: 0.6,
  sfxVolume: 0.8,
  setMasterVolume: (volume) => set({ masterVolume: volume }),
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  setSfxVolume: (volume) => set({ sfxVolume: volume }),

  // Active skills
  activeSkills: [],
  addActiveSkill: (skill) =>
    set((state) => ({
      activeSkills: Array.from(new Set([...state.activeSkills, skill])),
    })),
  removeActiveSkill: (skill) =>
    set((state) => ({
      activeSkills: state.activeSkills.filter((s) => s !== skill),
    })),
  clearActiveSkills: () => set({ activeSkills: [] }),

  // Wave tracking
  currentWave: 1,
  enemiesDefeated: 0,
  setCurrentWave: (wave) => set({ currentWave: wave }),
  setEnemiesDefeated: (count) => set({ enemiesDefeated: count }),
}));

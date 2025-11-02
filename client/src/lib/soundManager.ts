import { Howl } from 'howler';
import * as Tone from 'tone';
import { useGameStore } from './gameStore';

class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, Howl> = new Map();
  private synths: Map<string, Tone.Synth> = new Map();
  private musicPlaying: Howl | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  async initialize() {
    if (this.initialized) return;
    await Tone.start();
    this.initialized = true;
    this.createSynths();
  }

  private createSynths() {
    // Create synth for UI sounds
    const uiSynth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination();
    this.synths.set('ui', uiSynth);

    // Create synth for attack sounds
    const attackSynth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.05 },
    }).toDestination();
    this.synths.set('attack', attackSynth);

    // Create synth for hit sounds
    const hitSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
    }).toDestination();
    this.synths.set('hit', hitSynth);
  }

  playUISound(type: 'click' | 'hover' | 'success' | 'error') {
    if (!this.initialized) return;

    const synth = this.synths.get('ui');
    if (!synth) return;

    const now = Tone.now();
    switch (type) {
      case 'click':
        synth.triggerAttackRelease('C4', '0.1', now);
        break;
      case 'hover':
        synth.triggerAttackRelease('D4', '0.05', now);
        break;
      case 'success':
        synth.triggerAttackRelease('G4', '0.2', now);
        synth.triggerAttackRelease('C5', '0.2', now + 0.1);
        break;
      case 'error':
        synth.triggerAttackRelease('A2', '0.2', now);
        synth.triggerAttackRelease('A2', '0.2', now + 0.1);
        break;
    }
  }

  playAttackSound() {
    if (!this.initialized) return;

    const synth = this.synths.get('attack');
    if (!synth) return;

    const now = Tone.now();
    synth.triggerAttackRelease('A3', '0.1', now);
    synth.triggerAttackRelease('D4', '0.05', now + 0.05);
  }

  playHitSound(intensity: 'light' | 'medium' | 'heavy' = 'medium') {
    if (!this.initialized) return;

    const synth = this.synths.get('hit');
    if (!synth) return;

    const now = Tone.now();
    const notes = {
      light: { note: 'C4', duration: '0.1' },
      medium: { note: 'A3', duration: '0.15' },
      heavy: { note: 'F2', duration: '0.2' },
    };

    const { note, duration } = notes[intensity];
    synth.triggerAttackRelease(note, duration, now);
  }

  playEnemyDeathSound() {
    if (!this.initialized) return;

    const synth = this.synths.get('attack');
    if (!synth) return;

    const now = Tone.now();
    synth.triggerAttackRelease('G2', '0.1', now);
    synth.triggerAttackRelease('D2', '0.15', now + 0.1);
    synth.triggerAttackRelease('A1', '0.2', now + 0.2);
  }

  playSkillActivationSound() {
    if (!this.initialized) return;

    const synth = this.synths.get('ui');
    if (!synth) return;

    const now = Tone.now();
    synth.triggerAttackRelease('E5', '0.1', now);
    synth.triggerAttackRelease('G5', '0.1', now + 0.1);
    synth.triggerAttackRelease('C6', '0.2', now + 0.2);
  }

  playLevelUpSound() {
    if (!this.initialized) return;

    const synth = this.synths.get('ui');
    if (!synth) return;

    const now = Tone.now();
    const notes = ['C4', 'E4', 'G4', 'C5'];
    notes.forEach((note, index) => {
      synth.triggerAttackRelease(note, '0.15', now + index * 0.1);
    });
  }

  playGameOverSound() {
    if (!this.initialized) return;

    const synth = this.synths.get('hit');
    if (!synth) return;

    const now = Tone.now();
    synth.triggerAttackRelease('C3', '0.3', now);
    synth.triggerAttackRelease('A2', '0.3', now + 0.3);
    synth.triggerAttackRelease('F2', '0.5', now + 0.6);
  }

  playVictorySound() {
    if (!this.initialized) return;

    const synth = this.synths.get('ui');
    if (!synth) return;

    const now = Tone.now();
    const notes = ['G4', 'C5', 'E5', 'G5'];
    notes.forEach((note, index) => {
      synth.triggerAttackRelease(note, '0.2', now + index * 0.15);
    });
  }

  playBackgroundMusic(mode: 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate') {
    if (!this.initialized) return;

    // Stop existing music
    if (this.musicPlaying) {
      this.musicPlaying.fade(1, 0, 500);
      setTimeout(() => this.musicPlaying?.stop(), 500);
    }

    // Create procedural music based on mode
    this.createProceduralMusic(mode);
  }

  private createProceduralMusic(mode: 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate') {
    // Create a simple looping pattern using Tone.js
    const now = Tone.now();
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.5 },
    }).toDestination();

    const patterns = {
      noob: {
        notes: ['C3', 'E3', 'G3', 'C4'],
        tempo: 0.5,
        volume: -12,
      },
      pro: {
        notes: ['A2', 'C3', 'E3', 'A3', 'C4'],
        tempo: 0.4,
        volume: -10,
      },
      god: {
        notes: ['D2', 'F2', 'A2', 'D3', 'F3', 'A3'],
        tempo: 0.3,
        volume: -8,
      },
      psycho: {
        notes: ['B1', 'D2', 'F2', 'B2', 'D3', 'F3', 'B3'],
        tempo: 0.25,
        volume: -6,
      },
      ultimate: {
        notes: ['G1', 'B1', 'D2', 'G2', 'B2', 'D3', 'G3', 'B3'],
        tempo: 0.2,
        volume: -4,
      },
    };

    const pattern = patterns[mode];
    synth.volume.value = pattern.volume;

    // Create a simple loop
    let noteIndex = 0;
    const loop = () => {
      const note = pattern.notes[noteIndex % pattern.notes.length];
      synth.triggerAttackRelease(note, '0.3');
      noteIndex++;
      setTimeout(loop, pattern.tempo * 1000);
    };

    loop();
  }

  stopBackgroundMusic() {
    if (this.musicPlaying) {
      this.musicPlaying.fade(1, 0, 500);
      setTimeout(() => this.musicPlaying?.stop(), 500);
      this.musicPlaying = null;
    }
  }

  setVolume(type: 'master' | 'music' | 'sfx', volume: number) {
    const clampedVolume = Math.max(0, Math.min(1, volume));

    if (type === 'master' || type === 'sfx') {
      Tone.Destination.volume.value = Tone.gainToDb(clampedVolume);
    }

    if (this.musicPlaying && (type === 'master' || type === 'music')) {
      this.musicPlaying.volume(clampedVolume);
    }
  }

  dispose() {
    this.stopBackgroundMusic();
    this.sounds.forEach((sound) => sound.unload());
    this.sounds.clear();
    this.synths.forEach((synth) => synth.dispose());
    this.synths.clear();
  }
}

export const soundManager = SoundManager.getInstance();

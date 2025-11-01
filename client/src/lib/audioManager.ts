import { Howl } from 'howler';
import { SoundGenerator } from './soundGenerator';

export class AudioManager {
  sounds: { [key: string]: Howl } = {};
  soundBuffers: { [key: string]: AudioBuffer } = {};
  soundGenerator: SoundGenerator;
  isMuted: boolean = false;
  masterVolume: number = 0.5;
  musicSource: AudioBufferSourceNode | null = null;

  constructor() {
    this.soundGenerator = new SoundGenerator();
    this.initializeSounds();
  }

  initializeSounds(): void {
    // Generate sounds using Web Audio API
    this.soundBuffers['perfect'] = this.soundGenerator.generatePerfectDropSound();
    this.soundBuffers['good'] = this.soundGenerator.generateGoodDropSound();
    this.soundBuffers['shave'] = this.soundGenerator.generateShaveSound();
    this.soundBuffers['gameOver'] = this.soundGenerator.generateGameOverSound();
    this.soundBuffers['hyperMode'] = this.soundGenerator.generateHyperModeSound();
  }

  playSound(soundKey: string): void {
    if (this.isMuted) return;

    try {
      if (this.soundBuffers[soundKey]) {
        this.soundGenerator.playSound(this.soundBuffers[soundKey], this.masterVolume);
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${soundKey}`, error);
    }
  }

  playMusic(): void {
    if (this.isMuted) return;

    try {
      this.soundGenerator.generateBackgroundMusic();
    } catch (error) {
      console.warn('Failed to play music', error);
    }
  }

  stopMusic(): void {
    if (this.musicSource) {
      try {
        this.musicSource.stop();
      } catch (error) {
        console.warn('Failed to stop music', error);
      }
    }
  }

  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
  }

  dispose(): void {
    this.stopMusic();
  }
}

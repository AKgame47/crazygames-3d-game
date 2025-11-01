// Sound generator using Web Audio API to create game sounds programmatically
export class SoundGenerator {
  audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Generate a perfect drop sound - high-pitched chime
  generatePerfectDropSound(): AudioBuffer {
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.3; // 300ms
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    const frequency = 880; // A5 note
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 8); // Exponential decay
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
    }

    return buffer;
  }

  // Generate a good drop sound - soft thud
  generateGoodDropSound(): AudioBuffer {
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.2;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    const frequency = 220; // A3 note
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 10);
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.2;
    }

    return buffer;
  }

  // Generate a shave sound - sharp slice
  generateShaveSound(): AudioBuffer {
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.15;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // White noise with frequency sweep
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 15);
      const frequency = 1200 + t * 2000; // Frequency sweep up
      data[i] = (Math.random() * 2 - 1) * envelope * 0.2;
      data[i] += Math.sin(2 * Math.PI * frequency * t) * envelope * 0.1;
    }

    return buffer;
  }

  // Generate a game over sound - deep gong
  generateGameOverSound(): AudioBuffer {
    const sampleRate = this.audioContext.sampleRate;
    const duration = 1; // 1 second
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    const frequency = 110; // A2 note
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 1.5); // Slow decay
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
      // Add some harmonics
      data[i] += Math.sin(2 * Math.PI * frequency * 1.5 * t) * envelope * 0.1;
    }

    return buffer;
  }

  // Generate Hyper Mode activation sound - synth flourish
  generateHyperModeSound(): AudioBuffer {
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.5;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    const frequencies = [440, 550, 660, 880]; // Ascending notes
    const noteDuration = duration / frequencies.length;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const noteIndex = Math.floor(t / noteDuration);
      const frequency = frequencies[Math.min(noteIndex, frequencies.length - 1)];
      const noteTime = t - noteIndex * noteDuration;
      const envelope = Math.exp(-noteTime * 5);

      data[i] = Math.sin(2 * Math.PI * frequency * noteTime) * envelope * 0.3;
    }

    return buffer;
  }

  // Play a sound buffer
  playSound(buffer: AudioBuffer, volume: number = 0.5): void {
    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start(0);
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }

  // Generate and play background music (simple beep pattern)
  generateBackgroundMusic(): void {
    // This is a placeholder - in production, you'd use a pre-recorded audio file
    // For now, we'll create a simple repeating pattern
    const sampleRate = this.audioContext.sampleRate;
    const duration = 2; // 2 second loop
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    const beatPattern = [440, 0, 440, 0, 550, 0, 660, 0]; // Simple beat pattern
    const beatDuration = duration / beatPattern.length;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const beatIndex = Math.floor(t / beatDuration) % beatPattern.length;
      const frequency = beatPattern[beatIndex];

      if (frequency > 0) {
        const beatTime = t - Math.floor(t / beatDuration) * beatDuration;
        const envelope = Math.exp(-beatTime * 5);
        data[i] = Math.sin(2 * Math.PI * frequency * beatTime) * envelope * 0.1;
      }
    }

    // Loop the music
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    source.loop = true;
    gainNode.gain.value = 0.2;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    source.start(0);
  }
}

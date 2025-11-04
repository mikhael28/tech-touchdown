/**
 * Audio Mixer Service
 * Combines microphone input with soundboard effects for podcast recording
 * Uses Web Audio API to mix multiple audio sources
 */

export interface SoundEffect {
  id: string;
  name: string;
  type: 'intro' | 'outro' | 'applause' | 'drumroll' | 'airhorn' | 'tada' | 'rimshot' | 'whoosh';
  duration: number;
  color: string;
}

export class AudioMixer {
  private audioContext: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private destination: MediaStreamAudioDestinationNode | null = null;
  private gainNodes: Map<string, GainNode> = new Map();
  private activeOscillators: Map<string, OscillatorNode> = new Map();

  /**
   * Initialize the audio mixer with microphone input
   */
  async initialize(): Promise<MediaStream> {
    // Create audio context
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Get microphone stream
    this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create nodes
    this.micSource = this.audioContext.createMediaStreamSource(this.micStream);
    this.destination = this.audioContext.createMediaStreamDestination();

    // Create gain node for microphone
    const micGain = this.audioContext.createGain();
    micGain.gain.value = 1.0;
    this.gainNodes.set('microphone', micGain);

    // Connect microphone to destination
    this.micSource.connect(micGain);
    micGain.connect(this.destination);

    return this.destination.stream;
  }

  /**
   * Play a sound effect
   */
  playSoundEffect(effect: SoundEffect): void {
    if (!this.audioContext || !this.destination) {
      console.error('Audio mixer not initialized');
      return;
    }

    // Create oscillator and gain for this effect
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // Configure based on effect type
    switch (effect.type) {
      case 'intro':
        // Upward sweep
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        break;

      case 'outro':
        // Downward sweep
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        break;

      case 'applause':
        // White noise with filter for applause effect
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noiseSource = this.audioContext.createBufferSource();
        noiseSource.buffer = buffer;
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
        gainNode.connect(this.destination);
        noiseSource.start();
        noiseSource.stop(this.audioContext.currentTime + 2);
        return;

      case 'drumroll':
        // Rapid percussion effect
        for (let i = 0; i < 20; i++) {
          const drumOsc = this.audioContext.createOscillator();
          const drumGain = this.audioContext.createGain();
          drumOsc.type = 'triangle';
          drumOsc.frequency.value = 80;
          drumGain.gain.setValueAtTime(0.3, this.audioContext.currentTime + i * 0.05);
          drumGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * 0.05 + 0.05);
          drumOsc.connect(drumGain);
          drumGain.connect(this.destination);
          drumOsc.start(this.audioContext.currentTime + i * 0.05);
          drumOsc.stop(this.audioContext.currentTime + i * 0.05 + 0.05);
        }
        return;

      case 'airhorn':
        // Loud, attention-grabbing sound
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 440;
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        break;

      case 'tada':
        // Celebratory ascending notes
        const notes = [262, 330, 392, 523]; // C, E, G, C
        notes.forEach((freq, i) => {
          const noteOsc = this.audioContext!.createOscillator();
          const noteGain = this.audioContext!.createGain();
          noteOsc.type = 'sine';
          noteOsc.frequency.value = freq;
          noteGain.gain.setValueAtTime(0.2, this.audioContext!.currentTime + i * 0.1);
          noteGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + i * 0.1 + 0.2);
          noteOsc.connect(noteGain);
          noteGain.connect(this.destination!);
          noteOsc.start(this.audioContext!.currentTime + i * 0.1);
          noteOsc.stop(this.audioContext!.currentTime + i * 0.1 + 0.2);
        });
        return;

      case 'rimshot':
        // Classic comedy rimshot
        const rimOsc1 = this.audioContext.createOscillator();
        const rimOsc2 = this.audioContext.createOscillator();
        const rimGain = this.audioContext.createGain();
        rimOsc1.type = 'triangle';
        rimOsc2.type = 'triangle';
        rimOsc1.frequency.value = 200;
        rimOsc2.frequency.value = 180;
        rimGain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        rimGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        rimOsc1.connect(rimGain);
        rimOsc2.connect(rimGain);
        rimGain.connect(this.destination);
        rimOsc1.start();
        rimOsc2.start();
        rimOsc1.stop(this.audioContext.currentTime + 0.1);
        rimOsc2.stop(this.audioContext.currentTime + 0.1);
        return;

      case 'whoosh':
        // Swoosh transition sound
        oscillator.type = 'sine';
        filter.type = 'lowpass';
        oscillator.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.4);
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        oscillator.connect(filter);
        filter.connect(gainNode);
        break;
    }

    // Connect and play (for non-special cases)
    if (!['applause', 'drumroll', 'tada', 'rimshot'].includes(effect.type)) {
      gainNode.connect(this.destination);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + (effect.duration / 1000));
    }
  }

  /**
   * Set microphone gain/volume
   */
  setMicrophoneGain(value: number): void {
    const micGain = this.gainNodes.get('microphone');
    if (micGain) {
      micGain.gain.value = value;
    }
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    // Stop all active oscillators
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.activeOscillators.clear();

    // Stop microphone stream
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
    }

    // Clear references
    this.micSource = null;
    this.destination = null;
    this.micStream = null;
    this.audioContext = null;
    this.gainNodes.clear();
  }
}

// Predefined sound effects
export const SOUND_EFFECTS: SoundEffect[] = [
  {
    id: 'intro',
    name: 'Intro Music',
    type: 'intro',
    duration: 500,
    color: 'bg-blue-500',
  },
  {
    id: 'outro',
    name: 'Outro Music',
    type: 'outro',
    duration: 500,
    color: 'bg-purple-500',
  },
  {
    id: 'applause',
    name: 'Applause',
    type: 'applause',
    duration: 2000,
    color: 'bg-green-500',
  },
  {
    id: 'drumroll',
    name: 'Drumroll',
    type: 'drumroll',
    duration: 1000,
    color: 'bg-yellow-500',
  },
  {
    id: 'airhorn',
    name: 'Air Horn',
    type: 'airhorn',
    duration: 300,
    color: 'bg-red-500',
  },
  {
    id: 'tada',
    name: 'Ta-Da!',
    type: 'tada',
    duration: 400,
    color: 'bg-pink-500',
  },
  {
    id: 'rimshot',
    name: 'Rimshot',
    type: 'rimshot',
    duration: 100,
    color: 'bg-orange-500',
  },
  {
    id: 'whoosh',
    name: 'Whoosh',
    type: 'whoosh',
    duration: 400,
    color: 'bg-teal-500',
  },
];

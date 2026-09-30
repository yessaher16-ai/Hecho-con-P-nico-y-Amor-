/**
 * Audio Engine supporting both:
 * 1. The official "Tokyo Drift - Teriyaki Boyz" soundtrack from the video clip (MP3 with real bass beat analysis).
 * 2. Atmospheric neon romantic synthesizer.
 */
import tokyoDriftAudioUrl from '../assets/audio/tokyo_drift.mp3';

class TokyoDriftAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private animFrameId: number | null = null;
  private isPlaying: boolean = false;
  private mode: 'tokyo-drift' | 'romantic' = 'tokyo-drift';
  private onBeatCallback: ((step: number) => void) | null = null;
  private synthTimerId: number | null = null;
  private synthStep: number = 0;
  private lastBeatTime: number = 0;

  // Romantic acoustic/celestial chord notes
  private readonly romanticNotes: (number | null)[] = [
    349.23, 440.0, 523.25, 659.25, // F4, A4, C5, E5
    392.00, 493.88, 587.33, 783.99, // G4, B4, D5, G5
    440.00, 523.25, 659.25, 880.00, // A4, C5, E5, A5
    349.23, 440.0, 523.25, 698.46, // F4, A4, C5, F5
  ];

  constructor() {
    // Initialized on demand upon user interaction
  }

  public setOnBeat(cb: (step: number) => void) {
    this.onBeatCallback = cb;
  }

  public setMode(newMode: 'tokyo-drift' | 'romantic') {
    if (this.mode === newMode) return;
    this.mode = newMode;

    if (this.isPlaying) {
      if (newMode === 'tokyo-drift') {
        this.stopRomanticSynth();
        this.startTokyoDriftAudio();
      } else {
        this.stopTokyoDriftAudio();
        this.startRomanticSynth();
      }
    }
  }

  public getMode(): 'tokyo-drift' | 'romantic' {
    return this.mode;
  }

  private initAudioElement() {
    if (!this.audioElement) {
      const audio = new Audio();
      audio.src = tokyoDriftAudioUrl || '/audio/tokyo_drift.mp3';
      audio.loop = true;
      audio.crossOrigin = 'anonymous';
      audio.volume = 0.85;

      // Prepare Web Audio analyser for bass pulsing
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.audioCtx = new AudioCtx();
          this.analyser = this.audioCtx.createAnalyser();
          this.analyser.fftSize = 256;
          this.analyser.smoothingTimeConstant = 0.8;

          this.sourceNode = this.audioCtx.createMediaElementSource(audio);
          this.sourceNode.connect(this.analyser);
          this.analyser.connect(this.audioCtx.destination);
        }
      } catch (e) {
        console.warn('Web Audio routing fallback to direct audio element:', e);
      }

      this.audioElement = audio;
    }
  }

  public play() {
    this.isPlaying = true;

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.mode === 'tokyo-drift') {
      this.startTokyoDriftAudio();
    } else {
      this.startRomanticSynth();
    }
  }

  public pause() {
    this.isPlaying = false;
    this.stopTokyoDriftAudio();
    this.stopRomanticSynth();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  // --- TOKYO DRIFT TRACK ---
  private startTokyoDriftAudio() {
    this.initAudioElement();
    if (!this.audioElement) return;

    this.audioElement.currentTime = 0;
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play restricted by browser policy:', err);
      });
    }

    // Start beat analyzer loop
    this.startBeatAnalysis();
  }

  private stopTokyoDriftAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private startBeatAnalysis() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    let beatCounter = 0;
    const bufferLength = this.analyser ? this.analyser.frequencyBinCount : 0;
    const dataArray = this.analyser ? new Uint8Array(bufferLength) : null;

    const checkBeat = () => {
      if (!this.isPlaying || this.mode !== 'tokyo-drift') return;

      const now = performance.now();

      if (this.analyser && dataArray) {
        this.analyser.getByteFrequencyData(dataArray);

        // Sub-bass and bass frequency energy (bins 1 to 5 correspond to ~40Hz - 170Hz)
        let bassEnergy = 0;
        for (let i = 1; i <= 5; i++) {
          bassEnergy += dataArray[i];
        }
        bassEnergy /= 5;

        // Dynamic threshold for bass kick hit
        if (bassEnergy > 195 && now - this.lastBeatTime > 230) {
          this.lastBeatTime = now;
          beatCounter++;
          if (this.onBeatCallback) {
            this.onBeatCallback(beatCounter * 4);
          }
        }
      } else {
        // Fallback steady BPM pulse (~130 BPM = ~461ms per beat)
        if (now - this.lastBeatTime > 460) {
          this.lastBeatTime = now;
          beatCounter++;
          if (this.onBeatCallback) {
            this.onBeatCallback(beatCounter * 4);
          }
        }
      }

      this.animFrameId = requestAnimationFrame(checkBeat);
    };

    this.animFrameId = requestAnimationFrame(checkBeat);
  }

  // --- ROMANTIC MODE SYNTHESIZER ---
  private startRomanticSynth() {
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    } catch (e) {
      console.warn('AudioContext unavailable:', e);
    }

    this.synthStep = 0;
    this.scheduleRomanticStep();
  }

  private stopRomanticSynth() {
    if (this.synthTimerId !== null) {
      clearTimeout(this.synthTimerId);
      this.synthTimerId = null;
    }
  }

  private scheduleRomanticStep() {
    if (!this.isPlaying || this.mode !== 'romantic' || !this.audioCtx) return;

    const time = this.audioCtx.currentTime;
    const note = this.romanticNotes[this.synthStep % this.romanticNotes.length];

    if (note) {
      this.playSineChime(note, time, 0.9, 0.22);
    }

    if (this.synthStep % 2 === 0 && this.onBeatCallback) {
      this.onBeatCallback(this.synthStep * 4);
    }

    this.synthStep++;
    this.synthTimerId = window.setTimeout(() => {
      this.scheduleRomanticStep();
    }, 650); // Gentle romantic pacing
  }

  private playSineChime(freq: number, time: number, duration: number, volume: number) {
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(time);
      osc.stop(time + duration);
    } catch {
      // Ignore audio synthesis errors on tab blur
    }
  }
}

export const audioManager = new TokyoDriftAudioEngine();

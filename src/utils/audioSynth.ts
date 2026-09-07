// Lightweight Web Audio ambient tone generator for preview experience
class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  public isPlaying = false;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playAmbientChord(frequencies: number[] = [220, 277.18, 329.63, 440]) {
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;
      this.stop();

      this.isPlaying = true;
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(0, now);
      this.masterGain.gain.linearRampToValueAtTime(0.08, now + 1.2);

      frequencies.forEach((freq) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.25, now);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        this.oscillators.push(osc);
      });
    } catch {
      // Audio context may be restricted by browser policy before user interaction
    }
  }

  public playTone(freq = 528, duration = 0.2) {
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // ignore
    }
  }

  public stop() {
    if (this.ctx && this.masterGain && this.isPlaying) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.4);
      setTimeout(() => {
        this.oscillators.forEach(osc => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // already stopped
          }
        });
        this.oscillators = [];
        this.isPlaying = false;
      }, 450);
    } else {
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.oscillators = [];
      this.isPlaying = false;
    }
  }
}

export const ambientSound = new AmbientAudioEngine();

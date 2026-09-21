// Web Audio API procedural sound synthesizer for instant Disney & Marvel audio effects

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check localStorage preference
    const saved = localStorage.getItem('disney_sound_muted');
    this.isMuted = saved === 'true';
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('disney_sound_muted', String(this.isMuted));
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Disney Magic Fairy Wand Chime
  public playMagicChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.65);
    });
  }

  // Iron Man Repulsor Blast
  public playRepulsorBlast() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // High frequency charge up
    const chargeOsc = ctx.createOscillator();
    const chargeGain = ctx.createGain();
    chargeOsc.type = 'sawtooth';
    chargeOsc.frequency.setValueAtTime(200, now);
    chargeOsc.frequency.exponentialRampToValueAtTime(1800, now + 0.18);

    chargeGain.gain.setValueAtTime(0.05, now);
    chargeGain.gain.linearRampToValueAtTime(0.2, now + 0.16);
    chargeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    chargeOsc.connect(chargeGain);
    chargeGain.connect(ctx.destination);
    chargeOsc.start(now);
    chargeOsc.stop(now + 0.2);

    // Blast punch
    const blastOsc = ctx.createOscillator();
    const blastGain = ctx.createGain();
    blastOsc.type = 'triangle';
    blastOsc.frequency.setValueAtTime(450, now + 0.18);
    blastOsc.frequency.exponentialRampToValueAtTime(60, now + 0.45);

    blastGain.gain.setValueAtTime(0.3, now + 0.18);
    blastGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    blastOsc.connect(blastGain);
    blastGain.connect(ctx.destination);
    blastOsc.start(now + 0.18);
    blastOsc.stop(now + 0.5);
  }

  // Thor's Mjolnir Thunder
  public playMjolnirThunder() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Low rumble noise + low frequencies
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.6);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  }

  // Spider-Man Web Shoot
  public playWebShoot() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Pirates of the Caribbean Sailing Ship Bell
  public playShipBell() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const strikes = [0, 0.22]; // Double bell chime

    strikes.forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now + offset); // B5

      gain.gain.setValueAtTime(0.2, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.75);
    });
  }

  // Fireworks Launch & Boom
  public playFireworksBoom() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Launch whistle
    const whistle = ctx.createOscillator();
    const whistleGain = ctx.createGain();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(600, now);
    whistle.frequency.exponentialRampToValueAtTime(1400, now + 0.25);
    whistleGain.gain.setValueAtTime(0.05, now);
    whistleGain.gain.linearRampToValueAtTime(0.12, now + 0.2);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    whistle.connect(whistleGain);
    whistleGain.connect(ctx.destination);
    whistle.start(now);
    whistle.stop(now + 0.26);

    // Boom explosion
    const boom = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boom.type = 'triangle';
    boom.frequency.setValueAtTime(180, now + 0.26);
    boom.frequency.exponentialRampToValueAtTime(40, now + 0.75);

    boomGain.gain.setValueAtTime(0.4, now + 0.26);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    boom.connect(boomGain);
    boomGain.connect(ctx.destination);
    boom.start(now + 0.26);
    boom.stop(now + 0.85);
  }

  // Ride Dispatch Whistle
  public playRideDispatch() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [0, 0.15].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(idx === 0 ? 880 : 1174.66, now + offset);

      gain.gain.setValueAtTime(0.18, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.35);
    });
  }

  // Subtle UI click
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Camera mechanical shutter click
  public playCameraShutter() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First click (mirror up)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1400, now);
    osc1.frequency.exponentialRampToValueAtTime(300, now + 0.035);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.045);

    // Second click (shutter curtain)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(900, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.09);
    gain2.gain.setValueAtTime(0.14, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.11);
  }

  // Social Post Published Success Chord
  public playSocialPostSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.55);
    });
  }
}

export const soundEffects = new SoundEffectsManager();

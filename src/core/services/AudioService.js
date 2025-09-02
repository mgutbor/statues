export class AudioService {
  constructor(src, { loop = true, volume = 0.75 } = {}) {
    if (typeof Audio === 'undefined') {
      console.warn("Audio API no soportada en este navegador.");
      this.audioElement = null;
      return;
    }
    this.audioElement = document.createElement('audio');
    this.audioElement.src = src;
    this.audioElement.loop = loop;
    this.audioElement.volume = volume;
    this.audioElement.preload = 'auto';
  }

  play() {
    if (!this.audioElement) return;
    return this.audioElement.play().catch(e => {
      console.warn("Audio bloqueado hasta interacción:", e);
    });
  }

  pause() {
    if (!this.audioElement) return;
    this.audioElement.pause();
  }

  stop() {
    if (!this.audioElement) return;
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }

  setPlaybackRate(rate) {
    if (!this.audioElement) return;
    try {
      this.audioElement.playbackRate = rate;
    } catch (e) {
      console.warn("No se pudo ajustar playbackRate:", e);
    }
  }

  remove() {
    if (!this.audioElement) return;
    this.audioElement.pause();
    this.audioElement.remove();
    this.audioElement = null;
  }
}
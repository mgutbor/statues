import { LitElement } from 'lit';
import { PlayerService } from '../../core/services/PlayerService.js';
import { AudioService } from '../../core/services/AudioService.js';

import {
  GREEN_LIGHT_BASE_DURATION,
  RED_LIGHT_DURATION,
  MIN_GREEN_LIGHT_DURATION,
  DEFAULT_AUDIO_VOLUME,
  MIN_PLAYBACK_RATE,
  GREEN_LIGHT_JITTER_RANGE,
  GREEN_LIGHT_JITTER_OFFSET,
  VIBRATION_FAIL_PATTERN,
  VIBRATION__STEP_PENALTY
} from './model/GameModel.js';

export class GameViewModel extends LitElement {
  static get properties() {
    return {
      /**
       * Objeto que representa al jugador actual.
       */
      player: { type: Object },

      /**
       * Booleano que indica si el semáforo esta en verde (true) o rojo (false).
       */
      isGreen: { type: Boolean },

      /**
       * Identificador del último botón pulsado, usado para alternar puntuación.
       */
      lastButton: { type: String },

      /**
       * Duración en milisegundos del estado verde.
       */
      greenLightDuration: { type: Number },

      /**
       * Duración en milisegundos del estado rojo.
       */
      redLightDuration: { type: Number },

      /**
       * Booleano que indica si se ha permitido reproducir audio.
       */
      audioAllowed: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.player = null;
    this.isGreen = false;
    this.lastButton = null;
    this.greenLightDuration = GREEN_LIGHT_BASE_DURATION;
    this.redLightDuration = RED_LIGHT_DURATION;
    this._greenTimeout = null; // timeout interno para ciclo verde
    this._redTimeout = null; // timeout interno para ciclo rojo
    this._audioElement = null; // elemento audio para música de fondo
    this.audioAllowed = false;

    this.audioService = new AudioService('/audio/game.mp3', { loop: true, volume: DEFAULT_AUDIO_VOLUME });
  }

  /**
   * Inicializa el jugador, el audio y el ciclo del juego.
   */
  connectedCallback() {
    super.connectedCallback();
    this.loadPlayer();
    this.startCycle();

    // Permitir audio en iOS/Android tras primer toque en PWA
    const enableAudio = () => {
      this.allowAudio();
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
    };
    window.addEventListener('click', enableAudio, { once: true });
    window.addEventListener('touchstart', enableAudio, { once: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._greenTimeout);
    clearTimeout(this._redTimeout);
    this.audioService?.remove();
  }

  loadPlayer() {
    const currentPlayer = PlayerService.loadCurrent();
    if (!currentPlayer) {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }
    this.player = currentPlayer;
  }

  savePlayer() {
    if (!this.player) return;
    PlayerService.save(this.player);
  }

  /**
   * Permite reproducir audio tras interacción del usuario.
   */
  allowAudio() {
    if (!this.audioAllowed && this.audioService) {
      this.audioService.play().then(() => {
        this.audioAllowed = true;
      });
    }
  }

  /**
   * Inicia el ciclo del juego (red -> green -> red ...).
   */
  startCycle() {
    this.toGreen();
  }

  toRed() {
    this.isGreen = false;
    this.lastButton = null;
    clearTimeout(this._greenTimeout);
    clearTimeout(this._redTimeout);
    this._redTimeout = setTimeout(() => this.toGreen(), this.redLightDuration);
    
    this.audioService?.pause();
  }

  toGreen() {
    this.isGreen = true;
    this.greenLightDuration = this._calculateGreenDuration();
    // adjust audio playback rate according to green duration
    if (this._audioElement) {
      this.audioService?.play();
      const rate = Math.max(MIN_PLAYBACK_RATE, GREEN_LIGHT_BASE_DURATION / this.greenLightDuration);
      this.audioService.setPlaybackRate(rate);
    }
    clearTimeout(this._greenTimeout);
    clearTimeout(this._redTimeout);
    this._greenTimeout = setTimeout(() => this.toRed(), this.greenLightDuration);
  }

  /**
   * Calcula la duración del estado verde del semáforo según puntuación (base) y azar (jitter).
   */
  _calculateGreenDuration() {
    const base = Math.max(GREEN_LIGHT_BASE_DURATION - (this.player?.score || 0) * 100, MIN_GREEN_LIGHT_DURATION);
    const jitter = Math.floor(Math.random() * GREEN_LIGHT_JITTER_RANGE) - GREEN_LIGHT_JITTER_OFFSET; // -1500..+1500
    return Math.max(MIN_GREEN_LIGHT_DURATION, base + jitter);
  }

  /**
   * Vibración segura según dispositivo.
   * @param ms duración en milisegundos o array de patrones
   */
  _vibrate(ms) {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(ms);
    }
  }

  /**
   * Maneja la acción de pulsar un botón de andar en el juego.
   * @param buttonId id del botón pulsado
   */
  handleMove(buttonId) {
    // si se pulsa con el semáforo en rojo perdemos todos los puntos
    if (!this.isGreen) {
      const lost = this.player && this.player.score > 0;
      this.player.score = 0;
      this.lastButton = null;
      this.savePlayer();
      
      if (lost) this._vibrate(VIBRATION_FAIL_PATTERN);
      this.requestUpdate();
      return;
    }

    // comportamiento con semáforo en verde: los botones alternos ganan 1 por clic, el mismo botón consecutivo -1
    if (this.lastButton === buttonId) {
      this.player.score = Math.max(0, this.player.score - 1);
      this._vibrate(VIBRATION__STEP_PENALTY);
    } else {
      this.player.score += 1;
    }

    this.lastButton = buttonId;
    if (this.player.score > this.player.maxScore) this.player.maxScore = this.player.score;
    this.savePlayer();
    this.requestUpdate();
  }

  exitToHome() {
    this.savePlayer();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  getGameLightVariantClasses() {
    return {
      'game__light--green': this.isGreen,
      'game__light--red': !this.isGreen,
    };
  }
}
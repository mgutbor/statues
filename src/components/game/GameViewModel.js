import { LitElement } from 'lit';
import { PlayerService } from '../../core/services/PlayerService.js';

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
    this.greenLightDuration = 10000;
    this.redLightDuration = 3000;
    this._greenTimeout = null; // timeout interno para ciclo verde
    this._redTimeout = null; // timeout interno para ciclo rojo
    this._audioElement = null; // elemento audio para música de fondo
    this.audioAllowed = false;
  }

  /**
   * Inicializa el jugador, el audio y el ciclo del juego.
   */
  connectedCallback() {
    super.connectedCallback();
    this.loadPlayer();
    this._setupAudio();
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
    if (this._audioElement) {
      this._audioElement.pause();
      this._audioElement.remove();
      this._audioElement = null;
    }
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
   * Configura el elemento de audio para el juego
   */
  _setupAudio() {
    // create once
    if (this._audioElement) return;

    if (typeof Audio === 'undefined') {
      console.warn("Audio API no soportada en este navegador.");
      return;
    }
    
    this._audioElement = document.createElement('audio');
    this._audioElement.src = '/audio/game.mp3';
    this._audioElement.loop = true;
    this._audioElement.volume = 0.75;
    this._audioElement.preload = 'auto';
  }

  /**
   * Permite reproducir audio tras interacción del usuario.
   */
  allowAudio() {
    if (!this.audioAllowed && this._audioElement) {
      this._audioElement.play()
        .then(() => { this.audioAllowed = true; })
        .catch(e => { console.warn('Audio bloqueado hasta interacción', e); });
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
    this.lastButton = null; // reset alternation at red
    this.requestUpdate();
    clearTimeout(this._greenTimeout);
    clearTimeout(this._redTimeout);
    this._redTimeout = setTimeout(() => this.toGreen(), this.redLightDuration);
    // pause audio
    if (this._audioElement) {
      try {
        this._audioElement.pause();
      } catch (e) {
        console.warn("No se pudo pausar el audio:", e);
      }
    }
  }

  toGreen() {
    this.isGreen = true;
    this.greenLightDuration = this._calculateGreenDuration();
    this.requestUpdate();
    // adjust audio playback rate according to green duration
    if (this._audioElement) {
      this._audioElement.play().catch(()=>{
        console.warn("El navegador bloqueó la reproducción automática.");
      });
      // normalize to base 10000ms -> playbackRate = 10000 / greenDuration
      try {
        this._audioElement.playbackRate = Math.max(0.5, 10000 / this.greenLightDuration);
      } catch (e) {
        // some browsers restrict playbackRate changes for certain sources
        console.warn("No se pudo ajustar la velocidad del audio:", e);
      }
    }
    clearTimeout(this._greenTimeout);
    clearTimeout(this._redTimeout);
    this._greenTimeout = setTimeout(() => this.toRed(), this.greenLightDuration);
  }

  /**
   * Calcula la duración del estado verde del semáforo según puntuación (base) y azar (jitter).
   */
  _calculateGreenDuration() {
    const base = Math.max(10000 - (this.player?.score || 0) * 100, 2000);
    const jitter = Math.floor(Math.random() * 3001) - 1500; // -1500..+1500
    return Math.max(2000, base + jitter);
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
      
      if (lost) this._vibrate([300, 100, 300]);
      this.requestUpdate();
      return;
    }

    // comportamiento con semáforo en verde: los botones alternos ganan 1 por clic, el mismo botón consecutivo -1
    if (this.lastButton === buttonId) {
      this.player.score = Math.max(0, this.player.score - 1);
      this._vibrate(200);
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
}
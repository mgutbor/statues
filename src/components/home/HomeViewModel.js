import { LitElement } from 'lit';
import { PlayerService } from '../../core/services/PlayerService.js';

export class HomeViewModel extends LitElement {
  static get properties() {
    return {
      /**
       * Nombre introducido por el jugador.
       * Se utiliza para identificarlo y guardar/cargar su progreso.
       */
      playerName: { type: String },

      /**
       * Indica si el nombre de jugador es válido (no vacío).
       * Se usa para habilitar o deshabilitar el botón "Iniciar".
       */
      isValid: { type: Boolean },

      /**
       * Guarda la referencia al `beforeinstallprompt` del navegador.
       * Permite mostrar el diálogo de instalación de la PWA.
       */
      deferredPrompt: { type: Object },
    };
  }

  constructor() {
    super();
    this.playerName = '';
    this.isValid = false;
    this.deferredPrompt = null;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('beforeinstallprompt', this._handleBeforeInstallPrompt);
  }

  /**
   * Maneja el evento de instalación de la PWA.
   * Llama a `prompt()` para abrir el popup de instalación
   * y espera la decisión del usuario.
   */
  async handlePWAInstall() {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.requestUpdate();
  }

  handleInput(e) {
    this.playerName = e.target.value;
    this.isValid = !!this.playerName.trim();
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleStart();
    }
  }

  handleStart() {
    if (!this.isValid) return;
    PlayerService.createOrLoad(this.playerName.trim());
    this._navigate('/game');
  }

  handleRanking() {
    this._navigate('/ranking');
  }

  _navigate(path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

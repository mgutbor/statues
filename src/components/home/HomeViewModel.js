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
    };
  }

  constructor() {
    super();
    this.playerName = '';
    this.isValid = false;
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

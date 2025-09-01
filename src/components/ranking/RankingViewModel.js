import { LitElement } from 'lit';
import { PlayerService } from '../../core/services/PlayerService.js';

export class RankingViewModel extends LitElement {
  static get properties() {
    return {
      /**
       * Array de jugadores que se mostrarán en el ranking.
       * Cada elemento es un objeto Player con propiedades como name, score y maxScore.
       */
      players: { type: Array }
    };
  }

  constructor() {
    super();
    this.players = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadRanking();
  }

  /**
   * Obtiene todos los jugadores desde PlayerService,
   * los ordena de mayor a menor según maxScore
   */
  loadRanking() {
    const getAllPlayers = PlayerService.getAll();
    this.players = getAllPlayers.sort((a,b) => b.maxScore - a.maxScore);
  }

  goHome() {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}
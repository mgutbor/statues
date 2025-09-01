import { html } from 'lit';
import { GameViewModel } from './GameViewModel.js';
import { GameStyles } from './css/game.styles.css.js';
import '../../core/components/layout/LayoutView.js';

export class GameView extends GameViewModel {
  static styles = [GameStyles];

  render() {
    return html`
      <app-layout>
        <div slot="header" class="game__header">
          <div class="game__user">
            <img src="./images/user.svg" alt="Avatar del jugador"/>
            <p>Jugador: <b>${this.player?.name}</b></p>
          </div>
          <div class="game__max-score">
            <img src="./images/score.svg" alt="Icono de máxima puntuación" />
            <p>Máxima puntuación: <b>${this.player?.maxScore}</b></p>
          </div>
          <button class="game__logout" type="button" @click=${() => this.exitToHome()}>
            <span>Salir</span><img src="./images/logout.svg" alt="Cerrar sesión" />
          </button>
        </div>
        <div slot="main" class="game__main">
          <section class="game__status">
            <div class="game__score" aria-label="Puntuación actual del jugador" aria-live="polite">
              Puntuación actual: ${this.player?.score}
            </div>
            <div
              class="game__light ${this.isGreen
                ? 'game__light--green'
                : 'game__light--red'}"
              role="status"
              aria-live="polite"
            >
              ${this.isGreen ? 'VERDE' : 'ROJO'}
            </div>
          </section>

          <section class="game__controls">
            <button @click=${() => this.handleMove('left')}>
              <img src="./images/left.svg" alt=""/> Izquierda
            </button>
            <button @click=${() => this.handleMove('right')}>
              Derecha <img src="./images/right.svg" alt=""/>
            </button>
          </section>
        </div>
      </app-layout>
    `;
  }
}

customElements.define('game-view', GameView);

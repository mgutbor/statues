import { html } from 'lit';
import { HomeViewModel } from './HomeViewModel.js';
import { HomeStyles } from './css/home.styles.css.js';
import '../../core/components/layout/LayoutView.js';

export class HomeView extends HomeViewModel {
  static styles = [HomeStyles];

  render() {
    return html`
      <app-layout>
        <div slot="header">
          <h1 class="home__title">Statues - Red Light, Green Light</h1>
        </div>
        <div slot="main" class="home__main">
          <input
            id="playerName"
            type="text"
            class="home__input"
            .value=${this.playerName}
            @input=${this.handleInput}
            @keydown=${this.handleKeyDown}
            placeholder="Introduce tu nombre y pulsa iniciar"
            aria-label="Nombre del jugador"
            aria-required="true"
            required
          />
          <section class="home__actions">
            <button
              ?disabled=${!this.isValid}
              @click=${this.handleStart}
              aria-disabled=${!this.isValid}
            >
              Iniciar
            </button>
            <button @click=${this.handleRanking}>Ranking</button>
          </section>
        </div>
      </app-layout>
    `;
  }
}

customElements.define('home-view', HomeView);

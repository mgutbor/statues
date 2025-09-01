import { html } from 'lit';
import { RankingViewModel } from './RankingViewModel.js';
import { RankingStyles } from './css/ranking.styles.css.js';
import '../../core/components/layout/LayoutView.js';

export class RankingView extends RankingViewModel {
  static styles = [RankingStyles];

  render() {
    return html`
    <app-layout>
      <div slot="header">
        <h1 class="ranking__title">Ranking</h1>
      </div>
      <div slot="main" class="ranking__main">
        <ol class="ranking__list" aria-label="Top 5 jugadores en puntuación">
          <li class="ranking__item">
              <span>RANK</span>
              <span>NAME</span>
              <span>MAX</span>
            </li>
          ${this.players.slice(0, 5).map((player, index) => html`
            <li class="ranking__item">
              <span>${index + 1}</span>
              <span>${player.name}</span>
              <span>${player.maxScore}</span>
            </li>`)}
        </ol>
        <div class="ranking__actions">
          <button 
            class="ranking__back"
            @click=${() => this.goHome()}
            aria-label="Volver a la pantalla principal">Volver</button>
        </div>
      </div>
    </app-layout>
    `;
  }
}

customElements.define('ranking-view', RankingView);
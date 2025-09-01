import { html } from 'lit';
import { LayoutViewModel } from './LayoutViewModel.js';
import { layoutStyles } from './css/layout.styles.css.js';

export class LayoutView extends LayoutViewModel {
  static styles = [layoutStyles];

  render() {
    return html`
      <header>
        <slot name="header"></slot>
      </header>
      <main>
        <slot name="main"></slot>
      </main>
      <footer>
        <slot name="footer"></slot>
      </footer>
    `;
  }
}

customElements.define('app-layout', LayoutView);
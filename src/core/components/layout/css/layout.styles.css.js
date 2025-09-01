import { css } from 'lit';

export const layoutStyles = css`
  :host {
    background: radial-gradient(circle, #62b9c7, #08424f);
    box-sizing: border-box;
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100vh;
    margin: 0;
    overflow: hidden;
    padding: 0;
    width: 100vw;
  }

  header {
    color: white;
    padding: 1rem;
    text-align: center;
  }

  main {
    align-items: center;
    display: flex;
    justify-content: center;
    overflow: auto;
    padding: 1rem;
  }

  footer {
    padding: 1rem;
    text-align: center;
  }
`;
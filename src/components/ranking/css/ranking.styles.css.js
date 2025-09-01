import { css } from 'lit';

export const RankingStyles = css`
  :host {
    display: block;
    font-family: 'Poppins', sans-serif;
    text-align: center;
  }

  .ranking__title {
    color: #d1f7fa;
    font-weight: 600;
  }

  .ranking__main {
    background: white;
    border-radius: 1rem;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    max-width: 500px;
    padding: 8rem 2rem;
    position: relative;
    text-align: center;
    width: 100%;
  }

  .ranking__list {
    padding-left: 1.1rem;
    text-align: left;
    margin-bottom: 2rem;
  }

  .ranking__item {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    font-size: 1.3rem;
    line-height: 2rem;
    font-family: 'Press Start 2P', sans-serif;
    color: #0d5b69;
  }

  .ranking__item:nth-child(1) {
    font-size: 1.5rem;
    color: #000000;
  }

  .ranking__item:nth-child(2) {
    color: #9e1d4e;
  }

  .ranking__item:nth-child(3) {
    color: #aa5520;
  }

  .ranking__item:nth-child(4) {
    color: #999900;
  }

  .ranking__back {
    background: #d60063;
    border-radius: 6px;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 0.75rem 0.75rem;
    width: 100%;
    font-family: 'Poppins', sans-serif;
  }

  .ranking__back:focus,
  .ranking__back:hover {
    outline: 3px solid #ffdd00;
    outline-offset: 2px;
    background: #b3004b;
  }

  @media (max-width: 601px) {
    .ranking__item:nth-child(1) {
      font-size: 1.2rem;
    }
  }
`;

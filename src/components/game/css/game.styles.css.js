import { css } from 'lit';

export const GameStyles = css`
  :host {
    display: block;
    font-family: 'Poppins', sans-serif;
    text-align: center;
  }

  .game__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    flex-wrap: wrap;
    gap: 10px;
  }

  .game__user,
  .game__max-score {
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    padding: 4px 8px;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .game__user img,
  .game__max-score img {
    width: 30px;
    height: 30px;
  }

  .game__user p,
  .game__max-score p {
    font-size: 1rem;
    margin: 0;
  }

  .game__logout {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 2px solid white;
    border-radius: 6px;
    background: #d60063;
    color: white;
    padding: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  .game__logout:focus,
  .game__logout:hover {
    outline: 3px solid #ffdd00;
    outline-offset: 2px;
    background: #b3004b;
  }

  .game__logout img {
    width: 24px;
    height: 24px;
  }

  .game__main {
    background: white;
    border-radius: 1rem;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 4px 8px -4px;
    max-width: 500px;
    padding: 2rem 1rem;
    margin: 1rem auto;
    width: 95%;
  }

  .game__status {
    margin-bottom: 1rem;
  }

  .game__score {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .game__light {
    width: 125px;
    height: 125px;
    border-radius: 50%;
    margin: 1rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.5rem;
  }

  .game__light--red {
    background: #ffcccc;
    color: #990000;
  }

  .game__light--green {
    background: #ddffdd;
    color: #006600;
  }

  .game__controls {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 2rem;
  }

  .game__controls button {
    flex: 1;
    padding: 0.6rem;
    background: #12778e;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 1.2rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  .game__controls button img {
    width: 24px;
  }

  .game__controls button:focus,
  .game__controls button:hover {
    outline: 3px solid #ffdd00;
    outline-offset: 2px;
    background: #106d7c;
  }

  @media (max-width: 601px) {
    .game__header {
      display: grid;
      grid-template-areas:
        'logout'
        'user'
        'max';
      grid-template-columns: 1fr;
      gap: 8px;
      width: 100%;
    }

    .game__logout {
      grid-area: logout;
      justify-self: end;
      font-size: 1.2rem;
      padding: 0.5rem;
    }

    .game__logout span {
      font-size: 1rem;
    }

    .game__logout img {
      width: 24px;
      height: 24px;
    }

    .game__user {
      grid-area: user;
    }

    .game__max-score {
      grid-area: max;
    }

    .game__main {
      padding: 1.5rem 1rem;
    }

    .game__score {
      font-size: 1.2rem;
    }

    .game__controls {
      flex-direction: column;
    }

    .game__controls button {
      width: 100%;
      font-size: 1.2rem;
      padding: 0.75rem;
    }
  }
`;

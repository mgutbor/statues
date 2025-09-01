import { css } from 'lit';

export const HomeStyles = css`
  :host {
    display: block;
    font-family: 'Poppins', sans-serif;
    text-align: center;
  }

  .home__title {
    color: #d1f7fa;
    font-weight: 600;
  }

  .home__main {
    background: white;
    border-radius: 1rem;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    max-width: 500px;
    padding: 8rem 2rem;
    position: relative;
    text-align: center;
    width: 100%;
  }

  .home__input {
    border-radius: 6px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-size: 1.2rem;
    font-size: 1rem;
    padding: 1rem;
    width: 100%;
    font-family: 'Poppins', sans-serif;
  }

  .home__input::placeholder {
    color: #666;
  }

  .home__actions {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 1rem;
  }

  button {
    background: #d60063;
    border-radius: 6px;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.75rem 0.75rem;
    width: 50%;
    font-family: 'Poppins', sans-serif;
  }

  button:disabled {
    cursor: default;
    opacity: 0.5;
  }

  .home__input:focus,
  button:focus,
  button:hover {
    outline: 3px solid #ffdd00; /* contraste alto para el foco */
    outline-offset: 2px;
  }

  button:focus,
  button:hover {
    background: #b3004b; /* aún más oscuro al interactuar */
  }

  button:disabled:focus,
  button:disabled:hover {
    background: #d60063; /* mantener el mismo color cuando está deshabilitado */
    outline: none; /* eliminar el contorno cuando está deshabilitado */
  }

  @media (max-width: 601px) {
    .home__actions {
      display: flex;
      flex-direction: column;
    }

    button {
      width: 100%;
    }
  }
`;

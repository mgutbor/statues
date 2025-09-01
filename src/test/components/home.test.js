// src/test/components/home.test.js
import { jest } from '@jest/globals';
import { fixture, html } from '@open-wc/testing';

// Mock de PlayerService ANTES de importar el componente
const createOrLoadMock = jest.fn();

beforeAll(async () => {
  await jest.unstable_mockModule('../../core/services/PlayerService.js', () => ({
    PlayerService: {
      createOrLoad: createOrLoadMock,
    },
  }));

  // Importa el custom element (define 'home-view')
  await import('../../components/home/HomeView.js');
});

// Reimport para acceder al mock si lo necesitas en asserts directos

/* eslint-disable no-unused-vars */
let PlayerServiceModule;
beforeAll(async () => {
  ({ PlayerService: PlayerServiceModule } = await import('../../core/services/PlayerService.js'));
});
/* eslint-enable no-unused-vars */

afterEach(() => {
  jest.clearAllMocks();
  // Resetea la URL entre tests
  window.history.pushState({}, '', '/');
});

describe('HomeView', () => {
  test('renderiza título, input y botones, con "Iniciar" deshabilitado por defecto', async () => {
    const el = await fixture(html`<home-view></home-view>`);

    const root = el.renderRoot;
    const title = root.querySelector('h1');
    const input = root.querySelector('#playerName');
    const buttons = root.querySelectorAll('button');

    expect(title)?.toBeTruthy();
    expect(title.textContent).toMatch(/Statues - Red Light, Green Light/i);

    expect(input)?.toBeTruthy();
    expect(input.getAttribute('placeholder')).toMatch(/Introduce tu nombre/i);

    expect(buttons.length).toBe(2);
    const startBtn = buttons[0];
    const rankingBtn = buttons[1];

    expect(startBtn.textContent).toMatch(/Iniciar/i);
    expect(rankingBtn.textContent).toMatch(/Ranking/i);

    // Por defecto isValid=false -> botón Iniciar deshabilitado
    expect(el.isValid).toBe(false);
    expect(startBtn.disabled).toBe(true);
  });

  test('actualiza playerName e isValid al escribir en el input (trim)', async () => {
    const el = await fixture(html`<home-view></home-view>`);
    const input = el.renderRoot.querySelector('#playerName');

    // Escribe nombre con espacios
    input.value = '   Pedro   ';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.playerName).toBe('   Pedro   '); // el binding mantiene el valor tal cual
    expect(el.isValid).toBe(true);

    // Vacía el input -> isValid=false
    input.value = '   ';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.isValid).toBe(false);
  });

  test('handleStart llama a PlayerService.createOrLoad con nombre "trim" y navega a /game', async () => {
    const el = await fixture(html`<home-view></home-view>`);
    const root = el.renderRoot;

    // setea un nombre válido
    const input = root.querySelector('#playerName');
    input.value = '  Ana  ';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    // espía navegación
    const navSpy = jest.spyOn(el, '_navigate');

    const startBtn = root.querySelector('.home__actions button'); // primer botón = Iniciar
    expect(startBtn.disabled).toBe(false);

    startBtn.click();
    await el.updateComplete;

    // Se llamó con nombre trim
    expect(createOrLoadMock).toHaveBeenCalledTimes(1);
    expect(createOrLoadMock).toHaveBeenCalledWith('Ana');

    // Navegación por método interno
    expect(navSpy).toHaveBeenCalledWith('/game');

    // Y realmente cambia el pathname (por pushState)
    expect(window.location.pathname).toBe('/game');
  });

  test('handleStart NO hace nada si isValid es falso', async () => {
    const el = await fixture(html`<home-view></home-view>`);
    const root = el.renderRoot;

    // Asegura estado inválido (vacío o espacios)
    const input = root.querySelector('#playerName');
    input.value = '   ';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    const navSpy = jest.spyOn(el, '_navigate');

    const startBtn = root.querySelector('button'); // Iniciar
    expect(el.isValid).toBe(false);
    expect(startBtn.disabled).toBe(true);

    startBtn.click();
    await el.updateComplete;

    expect(createOrLoadMock).not.toHaveBeenCalled();
    expect(navSpy).not.toHaveBeenCalled();
    // pathname permanece en la raíz
    expect(window.location.pathname).toBe('/');
  });

  test('handleRanking navega a /ranking y no llama a PlayerService', async () => {
    const el = await fixture(html`<home-view></home-view>`);
    const root = el.renderRoot;

    const navSpy = jest.spyOn(el, '_navigate');

    const buttons = root.querySelectorAll('button');
    const rankingBtn = buttons[1];
    rankingBtn.click();
    await el.updateComplete;

    expect(createOrLoadMock).not.toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith('/ranking');
    expect(window.location.pathname).toBe('/ranking');
  });
});
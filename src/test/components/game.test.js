// src/test/components/game.test.js
import { jest } from '@jest/globals';
import { fixture, html } from '@open-wc/testing';

const loadCurrentMock = jest.fn();
const saveMock = jest.fn();

beforeAll(async () => {
  // mock del servicio ANTES de importar el componente
  await jest.unstable_mockModule('../../core/services/PlayerService.js', () => ({
    PlayerService: {
      loadCurrent: loadCurrentMock,
      save: saveMock,
    },
  }));

  // importa el componente (define 'game-view')
  await import('../../components/game/GameView.js');
});

/* eslint-disable no-unused-vars */
let PlayerServiceModule;
beforeAll(async () => {
  ({ PlayerService: PlayerServiceModule } = await import('../../core/services/PlayerService.js'));
});
/* eslint-enable no-unused-vars */

describe('GameView', () => {
  let el;
  let originalAudio;
  let mathRandSpy;
  let consoleWarnSpy;

  beforeAll(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
  });
  
  beforeEach(async () => {
    jest.useFakeTimers();

    // evitar que _setupAudio cree audio
    originalAudio = globalThis.Audio;
    globalThis.Audio = undefined;

    // determinismo en jitter (Math.random -> 0.5 => jitter 0)
    mathRandSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    // fixture: PlayerService.loadCurrent devolverá un jugador por defecto
    loadCurrentMock.mockReturnValue({ name: 'Test', score: 0, maxScore: 0 });
    saveMock.mockClear();

    // crea el componente (disparará connectedCallback)
    el = await fixture(html`<game-view></game-view>`);
    await el.updateComplete;
  });

  afterEach(() => {
    jest.useRealTimers();
    if (mathRandSpy) mathRandSpy.mockRestore();
    globalThis.Audio = originalAudio;
    jest.clearAllMocks();
    loadCurrentMock.mockReset();
  });

  test('loadPlayer carga jugador actual y la vista muestra nombre y puntuaciones, empieza VERDE', () => {
    expect(el.player).toBeTruthy();
    expect(el.player.name).toBe('Test');

    const h1 = el.renderRoot.querySelector('.game__user p');
    expect(h1.textContent).toContain('Jugador: Test');

    const maxScoreDiv = el.renderRoot.querySelector('.game__max-score p');
    expect(maxScoreDiv.textContent).toContain('Máxima puntuación: 0');

    const scoreDiv = el.renderRoot.querySelector('.game__score');
    expect(scoreDiv.textContent).toContain('Puntuación actual: 0');

    const light = el.renderRoot.querySelector('.game__light');
    expect(light.classList.contains('game__light--green')).toBe(true);
    expect(light.textContent.trim()).toBe('VERDE');
  });

  test('green -> red cycle: toGreen establece greenLightDuration y tras avanzar timers pasa a ROJO', async () => {
    // initial greenLightDuration (player.score = 0, Math.random = 0.5) => 10000
    expect(el.greenLightDuration).toBe(10000);

    // avanzar tiempo: pasar al final del verde
    jest.advanceTimersByTime(el.greenLightDuration);
    await Promise.resolve(); // deja que se ejecute el callback
    await el.updateComplete;

    expect(el.isGreen).toBe(false);
    const light = el.renderRoot.querySelector('.game__light');
    expect(light.classList.contains('game__light--red')).toBe(true);
    expect(light.textContent.trim()).toBe('ROJO');
  });

  test('toRed -> vuelve a toGreen al avanzar redLightDuration', async () => {
    // ya empezamos en verde; forzamos paso a rojo
    jest.advanceTimersByTime(el.greenLightDuration);
    await Promise.resolve();
    await el.updateComplete;
    expect(el.isGreen).toBe(false);

    // en rojo ahora; avanzar redLightDuration (3000) debe devolver a verde
    jest.advanceTimersByTime(el.redLightDuration);
    await Promise.resolve();
    await el.updateComplete;

    expect(el.isGreen).toBe(true);
    const light = el.renderRoot.querySelector('.game__light');
    expect(light.classList.contains('game__light--green')).toBe(true);
    expect(light.textContent.trim()).toBe('VERDE');
  });

  test('handleMove en verde alterna y actualiza puntos y maxScore; save es llamado', () => {
    el.player.score = 0;
    el.player.maxScore = 0;
    el.isGreen = true;

    // primer click en left -> +1
    el.handleMove('left');
    expect(el.player.score).toBe(1);
    expect(el.player.maxScore).toBe(1);
    expect(saveMock).toHaveBeenCalled();

    // mismo botón consecutivo -> -1 (hasta 0)
    el.handleMove('left');
    expect(el.player.score).toBe(0);

    // alternar a right -> +1
    el.handleMove('right');
    expect(el.player.score).toBe(1);
    expect(el.player.maxScore).toBe(1);
  });

  test('handleMove en rojo hace perder todos los puntos y resetea lastButton', () => {
    el.player.score = 3;
    el.player.maxScore = 5;
    el.isGreen = false;

    el.handleMove('left');

    expect(el.player.score).toBe(0);
    expect(el.lastButton).toBeNull();
    expect(saveMock).toHaveBeenCalled();
  });

  test('_calculateGreenDuration devuelve valores esperados para distintos scores', () => {
    el.player = { score: 0 };
    expect(el._calculateGreenDuration()).toBe(10000);

    el.player = { score: 50 };
    expect(el._calculateGreenDuration()).toBe(5000);
  });

  test('exitToHome guarda player y realiza pushState a "/"', () => {
    el.player = { name: 'Test', score: 2, maxScore: 10 };
    const pushSpy = jest.spyOn(window.history, 'pushState');

    el.exitToHome();

    expect(saveMock).toHaveBeenCalled();
    expect(pushSpy).toHaveBeenCalledWith({}, '', '/');

    pushSpy.mockRestore();
  });

  test('la vista tiene botones de movimiento y exit que llaman a sus handlers', async () => {
    const leftBtn = el.renderRoot.querySelector('.game__controls button:nth-child(1)');
    const rightBtn = el.renderRoot.querySelector('.game__controls button:nth-child(2)');
    const exitBtn = el.renderRoot.querySelector('.game__logout');

    const hmSpy = jest.spyOn(el, 'handleMove');
    const exSpy = jest.spyOn(el, 'exitToHome');

    leftBtn.click();
    rightBtn.click();
    exitBtn.click();

    expect(hmSpy).toHaveBeenCalled();
    expect(exSpy).toHaveBeenCalled();

    hmSpy.mockRestore();
    exSpy.mockRestore();
  });
});
// src/test/components/ranking.test.js
import { jest } from '@jest/globals';
import { fixture, html } from '@open-wc/testing';

const getAllMock = jest.fn();

beforeAll(async () => {
  // mock del servicio ANTES de importar el componente
  await jest.unstable_mockModule('../../core/services/PlayerService.js', () => ({
    PlayerService: {
      getAll: getAllMock,
    },
  }));

  // importa el componente (define 'ranking-view')
  await import('../../components/ranking/RankingView.js');
});

/* eslint-disable no-unused-vars */
let PlayerServiceModule;
beforeAll(async () => {
  ({ PlayerService: PlayerServiceModule } = await import('../../core/services/PlayerService.js'));
});
/* eslint-enable no-unused-vars */

describe('RankingView', () => {
  let el;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('connectedCallback llama a PlayerService.getAll y carga players ordenados por maxScore descendente', async () => {
    // getAll devuelve jugadores en desorden
    getAllMock.mockReturnValue([
      { name: 'A', maxScore: 5 },
      { name: 'B', maxScore: 10 },
      { name: 'C', maxScore: 7 },
    ]);

    // crear componente (dispara connectedCallback -> loadRanking)
    el = await fixture(html`<ranking-view></ranking-view>`);
    await el.updateComplete;

    // PlayerService.getAll fue llamado
    expect(getAllMock).toHaveBeenCalled();

    // players internos deben estar ordenados desc por maxScore
    expect(Array.isArray(el.players)).toBe(true);
    expect(el.players.map(p => p.name)).toEqual(['B', 'C', 'A']);
    expect(el.players.map(p => p.maxScore)).toEqual([10, 7, 5]);

    // DOM: ol li debe respetar el orden
    const lis = el.renderRoot.querySelectorAll('ol li');
    expect(lis.length).toBe(el.players.length + 1); // +1 por el header

    const firstSpans = lis[1].querySelectorAll('span');
    expect(firstSpans[1].textContent.trim()).toBe('B');
    expect(firstSpans[2].textContent.trim()).toBe('10');

    const secondSpans = lis[2].querySelectorAll('span');
    expect(secondSpans[1].textContent.trim()).toBe('C');
    expect(secondSpans[2].textContent.trim()).toBe('7');
  });

  test('loadRanking con lista vacía deja players vacío y solo renderiza el header', async () => {
    getAllMock.mockReturnValue([]);
    el = await fixture(html`<ranking-view></ranking-view>`);
    await el.updateComplete;

    expect(el.players).toEqual([]);
    const lis = el.renderRoot.querySelectorAll('ol li');
    expect(lis.length).toBe(1); // solo el header
  });

  test('loadRanking con empates muestra ambos jugadores (mismo maxScore)', async () => {
    getAllMock.mockReturnValue([
      { name: 'X', maxScore: 8 },
      { name: 'Y', maxScore: 8 },
      { name: 'Z', maxScore: 3 },
    ]);

    el = await fixture(html`<ranking-view></ranking-view>`);
    await el.updateComplete;

    // ambos jugadores con maxScore 8 deben estar presentes
    const lis = el.renderRoot.querySelectorAll('ol li');
    const names = Array.from(lis).map(li => li.querySelectorAll('span')[1].textContent.trim());
    expect(names).toEqual(expect.arrayContaining(['X', 'Y', 'Z']));

    // comprobar que hay dos entradas con '8'
    const scores = Array.from(lis).map(li => li.querySelectorAll('span')[2].textContent.trim());
    const count8 = scores.filter(s => s === '8').length;
    expect(count8).toBe(2);
  });

  test('goHome realiza pushState a "/" y dispara popstate', async () => {
    // fixture mínima
    getAllMock.mockReturnValue([]);
    el = await fixture(html`<ranking-view></ranking-view>`);
    await el.updateComplete;

    const pushSpy = jest.spyOn(window.history, 'pushState');
    const popSpy = jest.fn();
    window.addEventListener('popstate', popSpy);

    el.goHome();

    expect(pushSpy).toHaveBeenCalledWith({}, '', '/');
    // el componente dispara la event 'popstate' manualmente
    expect(popSpy).toHaveBeenCalled();

    // limpieza
    pushSpy.mockRestore();
    window.removeEventListener('popstate', popSpy);
  });

  test('loadRanking puede actualizar dinámicamente la lista al llamar loadRanking', async () => {
    // primer valor
    getAllMock.mockReturnValue([
      { name: 'One', maxScore: 1 },
    ]);
    el = await fixture(html`<ranking-view></ranking-view>`);
    await el.updateComplete;

    expect(el.players.length).toBe(1);
    expect(el.renderRoot.querySelectorAll('ol li').length).toBe(el.players.length + 1); // +1 por el header

    // ahora cambiar lo que devuelve PlayerService y forzar recarga
    getAllMock.mockReturnValue([
      { name: 'NewTop', maxScore: 99 },
      { name: 'Other', maxScore: 2 },
    ]);
    // llamar al método público loadRanking
    el.loadRanking();
    await el.updateComplete;

    expect(el.players.length).toBe(2);
    const lis = el.renderRoot.querySelectorAll('ol li');
    expect(lis.length).toBe(el.players.length + 1); // +1 por el header
    expect(lis[1].querySelectorAll('span')[1].textContent.trim()).toBe('NewTop');
    expect(lis[1].querySelectorAll('span')[2].textContent.trim()).toBe('99');
  });
});
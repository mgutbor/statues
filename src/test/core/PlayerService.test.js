import { PlayerService } from '../../core/services/PlayerService.js';
import { Player } from '../../core/models/Player.js';

describe('PlayerService', () => {
  beforeEach(() => {
    // Inicializa jugadores en localStorage
    const testPlayer = new Player('Test');
    testPlayer.maxScore = 0;

    localStorage.setItem('players', JSON.stringify([testPlayer]));

    // Guarda solo el nombre como currentPlayer
    localStorage.setItem('currentPlayer', testPlayer.name);
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('createOrLoad crea un jugador nuevo si no existe', () => {
    const player = PlayerService.createOrLoad('Test');
    expect(player).toBeInstanceOf(Player);
    expect(player.name).toBe('Test');

    const raw = localStorage.getItem('players');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw);
    expect(parsed.length).toBe(1);
    expect(parsed[0].name).toBe('Test');

    // currentPlayer
    expect(localStorage.getItem('currentPlayer')).toBe('Test');
  });

  test('createOrLoad carga un jugador existente', () => {
    const p1 = PlayerService.createOrLoad('Test');
    p1.score = 10;
    PlayerService.save(p1);

    const loaded = PlayerService.createOrLoad('Test');
    expect(loaded.score).toBe(10);
  });

  test('save actualiza jugador existente y marca current', () => {
    const p = PlayerService.createOrLoad('Test');
    p.score = 42;
    PlayerService.save(p);

    const raw = localStorage.getItem('players');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw);
    expect(parsed[0].score).toBe(42);
    expect(localStorage.getItem('currentPlayer')).toBe('Test');
  });

  test('loadCurrent devuelve el jugador actual', () => {
    const loaded = PlayerService.loadCurrent();

    expect(loaded).not.toBeNull();
    expect(loaded).toBeInstanceOf(Player);
    expect(loaded.name).toBe('Test');
    expect(loaded.maxScore).toBe(0);
  });

  test('getAll devuelve todos los jugadores', () => {
    PlayerService.createOrLoad('A');
    PlayerService.createOrLoad('B');
    const all = PlayerService.getAll();
    const names = all.map(p => p.name);
    expect(names).toContain('A');
    expect(names).toContain('B');
  });
});

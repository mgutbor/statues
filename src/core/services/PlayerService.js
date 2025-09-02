import { Player } from '../models/Player.js';

const STORAGE_KEY = 'players';
const CURRENT_PLAYER_KEY = 'currentPlayer';

export class PlayerService {
  /**
   * Crea el jugador o lo carga (si existe) y lo marca como current
   */
  static createOrLoad(name) {
    const players = PlayerService._loadAll();
    let player = players.find(p => p.name === name);
    if (!player) {
      player = new Player(name);
      players.push(player);
      PlayerService._saveAll(players);
    }
    PlayerService._setCurrent(player.name);
    return player;
  }

  /**
   * Carga el jugador marcado como current
   */
  static loadCurrent() {
    const currentName = localStorage.getItem(CURRENT_PLAYER_KEY);
    if (!currentName) return null;
    const players = PlayerService._loadAll();
    return players.find(p => p.name === currentName) || null;
  }

  /**
   * Guarda un jugador (objeto con name, score, maxScore)
   */
  static save(player) {
    const players = PlayerService._loadAll();
    const index = players.findIndex(p => p.name === player.name);
    if (index >= 0) players[index] = player;
    else players.push(player);
    PlayerService._saveAll(players);
    PlayerService._setCurrent(player.name);
  }

  /**
   * devuelve todos los jugadores
   */
  static getAll() {
    return PlayerService._loadAll();
  }

  static _loadAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return parsed.map(p => new Player(p.name, p.score, p.maxScore));
    } catch {
      return [];
    }
  }

  static _saveAll(players) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  }

  static _setCurrent(name) {
    localStorage.setItem(CURRENT_PLAYER_KEY, name);
  }
}
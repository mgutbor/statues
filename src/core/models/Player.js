export class Player {
  constructor(name, score = 0, maxScore = 0) {
    this.name = name;
    this.score = score;
    this.maxScore = maxScore;
  }
}
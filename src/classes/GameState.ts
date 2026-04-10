import { CONFIG } from "../config.js";

export class GameState {
  score = 0;
  lives = CONFIG.initialLives;
  gameOver = false;
  hasShield = false;
  shieldTimer = 0;

  takeDamage(): boolean {
    if (this.hasShield) return false;
    this.lives--;
    return this.lives <= 0;
  }

  collectCoin(): void {
    this.score++;
  }

  activateShield(duration: number): void {
    this.hasShield = true;
    this.shieldTimer = duration;
  }

  updateShield(delta: number): void {
    if (this.hasShield) {
      this.shieldTimer -= delta;
      if (this.shieldTimer <= 0) this.hasShield = false;
    }
  }

  reset(): void {
    this.score = 0;
    this.lives = CONFIG.initialLives;
    this.gameOver = false;
    this.hasShield = false;
    this.shieldTimer = 0;
  }
}
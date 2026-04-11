import { Player } from "../entities/Player.js";
import { Coin } from "../entities/Coin.js";
import { Enemy } from "../entities/Enemy.js";
import { Powerup } from "../entities/Powerup.js";
import { Particle } from "../entities/Particle.js";
import { GameState } from "./GameState.js";
import { CONFIG } from "../../config.js";

export class EntityManager {
  private player: Player;
  private gameState: GameState;
  private canvas: HTMLCanvasElement;
  private hudHeight: number;
  private particles: Particle[] = [];

  constructor(player: Player, gameState: GameState, canvas: HTMLCanvasElement, hudHeight: number) {
    this.player = player;
    this.gameState = gameState;
    this.canvas = canvas;
    this.hudHeight = hudHeight;
  }

  update(delta: number, coins: Coin[], enemies: Enemy[], powerups: Powerup[]): void {
    this.updateParticles(delta);
    this.processEnemies(delta, enemies);
    this.processCoins(coins);
    this.processPowerups(powerups);
  }

  private updateParticles(delta: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(delta);
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  private processEnemies(delta: number, enemies: Enemy[]): void {
    const bounds = this.player.y + this.hudHeight + this.player.h;
    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].update(delta);
      if (enemies[i].isOutOfBounds(this.canvas.width, bounds)) {
        enemies.splice(i, 1);
        continue;
      }
      if (this.player.collidesWith(enemies[i])) {
        this.handleEnemyCollision();
        enemies.splice(i, 1);
      }
    }
  }

  private processCoins(coins: Coin[]): void {
    for (let i = coins.length - 1; i >= 0; i--) {
      coins[i].update();
      if (this.player.collidesWith(coins[i])) {
        this.gameState.collectCoin();
        this.spawnParticles(coins[i].x + coins[i].w / 2, coins[i].y + coins[i].h / 2, CONFIG.coin.color);
        coins.splice(i, 1);
      }
    }
  }

  private processPowerups(powerups: Powerup[]): void {
    for (let i = powerups.length - 1; i >= 0; i--) {
      powerups[i].update();
      if (this.player.collidesWith(powerups[i])) {
        this.gameState.activateShield(CONFIG.powerup.shieldDuration);
        this.spawnParticles(powerups[i].x + powerups[i].w / 2, powerups[i].y + powerups[i].h / 2, CONFIG.powerup.color, CONFIG.particle.defaultCount + 5);
        powerups.splice(i, 1);
      }
    }
  }

  private handleEnemyCollision(): void {
    const isDead = this.gameState.takeDamage();
    if (!this.gameState.hasShield) {
      this.spawnParticles(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, CONFIG.enemy.color, CONFIG.particle.defaultCount + 5);
    }
    if (isDead) this.gameState.gameOver = true;
  }

  private spawnParticles(x: number, y: number, color: string, count = CONFIG.particle.defaultCount): void {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach((p) => p.draw(ctx, this.hudHeight));
  }

  reset(): void {
    this.particles = [];
  }
}
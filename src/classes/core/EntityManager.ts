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

  createParticles(x: number, y: number, color: string, count: number): void {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  update(delta: number, coins: Coin[], enemies: Enemy[], powerups: Powerup[]): void {
    this.updateParticles(delta);
    this.updateEnemies(delta, enemies);
    this.updateCoins(coins);
    this.updatePowerups(powerups);
  }

  private updateParticles(delta: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(delta);
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateEnemies(delta: number, enemies: Enemy[]): void {
    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].update(delta);
      if (enemies[i].isOutOfBounds(this.canvas.width, this.player.y + this.hudHeight + this.player.h)) {
        enemies.splice(i, 1);
        continue;
      }
      if (this.player.collidesWith(enemies[i])) {
        const isDead = this.gameState.takeDamage();
        if (!this.gameState.hasShield) {
          this.createParticles(
            this.player.x + this.player.w / 2,
            this.player.y + this.player.h / 2,
            CONFIG.enemy.color,
            CONFIG.particle.defaultCount + 5
          );
        }
        enemies.splice(i, 1);
        if (isDead) {
          this.gameState.gameOver = true;
        }
      }
    }
  }

  private updateCoins(coins: Coin[]): void {
    for (let i = coins.length - 1; i >= 0; i--) {
      coins[i].update();
      if (this.player.collidesWith(coins[i])) {
        this.gameState.collectCoin();
        this.createParticles(
          coins[i].x + coins[i].w / 2,
          coins[i].y + coins[i].h / 2,
          CONFIG.coin.color,
          CONFIG.particle.defaultCount
        );
        coins.splice(i, 1);
      }
    }
  }

  private updatePowerups(powerups: Powerup[]): void {
    for (let i = powerups.length - 1; i >= 0; i--) {
      powerups[i].update();
      if (this.player.collidesWith(powerups[i])) {
        this.gameState.activateShield(CONFIG.powerup.shieldDuration);
        this.createParticles(
          powerups[i].x + powerups[i].w / 2,
          powerups[i].y + powerups[i].h / 2,
          CONFIG.powerup.color,
          CONFIG.particle.defaultCount + 5
        );
        powerups.splice(i, 1);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach((p) => p.draw(ctx, this.hudHeight));
  }

  reset(): void {
    this.particles = [];
  }
}
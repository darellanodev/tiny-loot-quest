import { Player } from "./Player.js";
import { Coin } from "./Coin.js";
import { Enemy } from "./Enemy.js";
import { Powerup } from "./Powerup.js";
import { Particle } from "./Particle.js";
import { CONFIG } from "../config.js";
import { TileMap } from "./TileMap.js";

export class Game {
  player: Player;
  tileMap: TileMap;
  canvas: HTMLCanvasElement;
  gameHeight: number;
  hudHeight: number;

  score = 0;
  lives = CONFIG.initialLives;
  gameOver = false;
  hasShield = false;
  shieldTimer = 0;

  coins: Coin[] = [];
  enemies: Enemy[] = [];
  powerups: Powerup[] = [];
  particles: Particle[] = [];

  private coinTimer = 0;
  private enemyTimer = 0;
  private powerupTimer = 0;
  private coinImage: HTMLImageElement;
  private enemyImage: HTMLImageElement;
  private powerupImage: HTMLImageElement;
  private enemySpeed: number;

  constructor(
    player: Player,
    tileMap: TileMap,
    canvas: HTMLCanvasElement,
    gameHeight: number,
    hudHeight: number,
    coinImage: HTMLImageElement,
    enemyImage: HTMLImageElement,
    powerupImage: HTMLImageElement
  ) {
    this.player = player;
    this.tileMap = tileMap;
    this.canvas = canvas;
    this.gameHeight = gameHeight;
    this.hudHeight = hudHeight;
    this.coinImage = coinImage;
    this.enemyImage = enemyImage;
    this.powerupImage = powerupImage;
    this.enemySpeed = 0.3;
    this.spawnCoin();
  }

  spawnCoin(): void {
    this.coins.push(new Coin(this.canvas, this.gameHeight, this.coinImage));
  }

  spawnEnemy(): void {
    this.enemies.push(new Enemy(this.canvas, this.gameHeight, this.enemySpeed, this.enemyImage));
  }

  spawnPowerup(): void {
    this.powerups.push(new Powerup(this.canvas, this.gameHeight, this.powerupImage));
  }

  createParticles(x: number, y: number, color: string, count: number): void {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  update(delta: number, keys: Record<string, boolean>): void {
    this.player.move(keys, this.canvas, delta, this.gameHeight);

    this.coinTimer += delta;
    if (this.coinTimer > CONFIG.coin.spawnInterval) {
      this.spawnCoin();
      this.coinTimer = 0;
    }

    this.enemyTimer += delta;
    if (
      this.enemyTimer >
      Math.max(
        CONFIG.enemy.minSpawnInterval,
        CONFIG.enemy.baseSpawnInterval - this.score * 2
      )
    ) {
      this.spawnEnemy();
      this.enemyTimer = 0;
    }

    this.powerupTimer += delta;
    if (this.powerupTimer > CONFIG.powerup.spawnInterval) {
      this.spawnPowerup();
      this.powerupTimer = 0;
    }

    if (this.hasShield) {
      this.shieldTimer -= delta;
      if (this.shieldTimer <= 0) this.hasShield = false;
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(delta);
      if (this.particles[i].isDead()) this.particles.splice(i, 1);
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      this.enemies[i].update(delta);
      if (this.enemies[i].isOutOfBounds(this.canvas.width, this.gameHeight)) {
        this.enemies.splice(i, 1);
        continue;
      }
      if (this.player.collidesWith(this.enemies[i])) {
        if (!this.hasShield) {
          this.lives--;
          this.createParticles(
            this.player.x + this.player.w / 2,
            this.player.y + this.player.h / 2,
            CONFIG.enemy.color,
            CONFIG.particle.defaultCount + 5
          );
        }
        this.enemies.splice(i, 1);
        if (this.lives <= 0) {
          this.gameOver = true;
        }
      }
    }

    for (let i = this.coins.length - 1; i >= 0; i--) {
      this.coins[i].update();
      if (this.player.collidesWith(this.coins[i])) {
        this.score++;
        this.createParticles(
          this.coins[i].x + this.coins[i].w / 2,
          this.coins[i].y + this.coins[i].h / 2,
          CONFIG.coin.color,
          CONFIG.particle.defaultCount
        );
        this.coins.splice(i, 1);
      }
    }

    for (let i = this.powerups.length - 1; i >= 0; i--) {
      this.powerups[i].update();
      if (this.player.collidesWith(this.powerups[i])) {
        this.hasShield = true;
        this.shieldTimer = CONFIG.powerup.shieldDuration;
        this.createParticles(
          this.powerups[i].x + this.powerups[i].w / 2,
          this.powerups[i].y + this.powerups[i].h / 2,
          CONFIG.powerup.color,
          CONFIG.particle.defaultCount + 5
        );
        this.powerups.splice(i, 1);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.tileMap.draw(ctx, this.hudHeight);

    this.coins.forEach((c) => c.draw(ctx, this.hudHeight));
    this.enemies.forEach((e) => e.draw(ctx, this.hudHeight));
    this.powerups.forEach((p) => p.draw(ctx, this.hudHeight));
    this.particles.forEach((p) => p.draw(ctx, this.hudHeight));

    this.player.draw(ctx, this.hudHeight);
    if (this.hasShield) {
      ctx.strokeStyle = CONFIG.powerup.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(
        this.player.x - 3,
        this.player.y + this.hudHeight - 3,
        this.player.w + 6,
        this.player.h + 6
      );
    }
  }

  drawHud(ctx: CanvasRenderingContext2D, hudImage: HTMLImageElement): void {
    ctx.drawImage(hudImage, 0, 0);
  }

  drawScore(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + this.score, 10, this.hudHeight - 15);
  }

  drawLives(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#ff6b6b";
    ctx.font = "20px Arial";
    ctx.fillText("Lives: " + this.lives, 10, this.hudHeight - 40);
  }

  drawGameOver(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("Final Score: " + this.score, this.canvas.width / 2, this.canvas.height / 2 + 20);
    ctx.fillText("Press SPACE to restart", this.canvas.width / 2, this.canvas.height / 2 + 60);
    ctx.textAlign = "left";
  }

  restart(): void {
    this.player.reset(CONFIG.player);
    this.score = 0;
    this.lives = CONFIG.initialLives;
    this.hasShield = false;
    this.shieldTimer = 0;
    this.coins = [];
    this.enemies = [];
    this.powerups = [];
    this.particles = [];
    this.gameOver = false;
    this.spawnCoin();
  }
}
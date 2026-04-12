import { Coin } from "../entities/Coin.js";
import { Enemy } from "../entities/Enemy.js";
import { Powerup } from "../entities/Powerup.js";
import { TileMap } from "../systems/TileMap.js";
import { CONFIG } from "../../config.js";

export class Spawner {
  private coinTimer = 0;
  private enemyTimer = 0;
  private powerupTimer = 0;

  private canvas: HTMLCanvasElement;
  private gameHeight: number;
  private coinImage: HTMLImageElement;
  private enemyImage: HTMLImageElement;
  private powerupImage: HTMLImageElement;
  private enemySpeed: number;
  private tileMap: TileMap | null = null;

  private coins: Coin[] = [];
  private enemies: Enemy[] = [];
  private powerups: Powerup[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    gameHeight: number,
    coinImage: HTMLImageElement,
    enemyImage: HTMLImageElement,
    powerupImage: HTMLImageElement
  ) {
    this.canvas = canvas;
    this.gameHeight = gameHeight;
    this.coinImage = coinImage;
    this.enemyImage = enemyImage;
    this.powerupImage = powerupImage;
    this.enemySpeed = CONFIG.enemy.speed;
  }

  setTileMap(tileMap: TileMap): void {
    this.tileMap = tileMap;
  }

  spawnCoin(): void {
    this.coins.push(new Coin(this.canvas, this.gameHeight, this.coinImage));
  }

  spawnEnemy(): void {
    const enemy = new Enemy(this.canvas, this.gameHeight, this.enemySpeed, this.enemyImage);
    if (this.tileMap) {
      enemy.setTileMap(this.tileMap);
    }
    this.enemies.push(enemy);
  }

  spawnPowerup(): void {
    this.powerups.push(new Powerup(this.canvas, this.gameHeight, this.powerupImage));
  }

  update(delta: number, score: number): void {
    this.coinTimer += delta;
    if (this.coinTimer > CONFIG.coin.spawnInterval) {
      this.spawnCoin();
      this.coinTimer = 0;
    }

    this.enemyTimer += delta;
    if (
      this.enemyTimer >
      Math.max(CONFIG.enemy.minSpawnInterval, CONFIG.enemy.baseSpawnInterval - score * CONFIG.difficulty.spawnDecreasePerScore)
    ) {
      this.spawnEnemy();
      this.enemyTimer = 0;
    }

    this.powerupTimer += delta;
    if (this.powerupTimer > CONFIG.powerup.spawnInterval) {
      this.spawnPowerup();
      this.powerupTimer = 0;
    }
  }

  getCoins(): Coin[] {
    return this.coins;
  }

  getEnemies(): Enemy[] {
    return this.enemies;
  }

  getPowerups(): Powerup[] {
    return this.powerups;
  }

  reset(): void {
    this.coinTimer = 0;
    this.enemyTimer = 0;
    this.powerupTimer = 0;
    this.coins = [];
    this.enemies = [];
    this.powerups = [];
  }
}
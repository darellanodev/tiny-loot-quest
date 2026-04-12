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

  private _coins: Coin[] = [];
  private _enemies: Enemy[] = [];
  private _powerups: Powerup[] = [];

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
    this._coins.push(new Coin(this.canvas, this.gameHeight, this.coinImage, this.tileMap));
  }

  spawnEnemy(): void {
    const enemy = new Enemy(this.canvas, this.gameHeight, this.enemySpeed, this.enemyImage, this.tileMap);
    this._enemies.push(enemy);
  }

  spawnPowerup(): void {
    this._powerups.push(new Powerup(this.canvas, this.gameHeight, this.powerupImage, this.tileMap));
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

  get coins(): Coin[] {
    return this._coins;
  }

  get enemies(): Enemy[] {
    return this._enemies;
  }

  get powerups(): Powerup[] {
    return this._powerups;
  }

  reset(): void {
    this.coinTimer = 0;
    this.enemyTimer = 0;
    this.powerupTimer = 0;
    this._coins = [];
    this._enemies = [];
    this._powerups = [];
  }
}
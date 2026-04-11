import { Player } from "../entities/Player.js";
import { TileMap } from "../systems/TileMap.js";
import { GameState } from "./GameState.js";
import { Spawner } from "./Spawner.js";
import { EntityManager } from "./EntityManager.js";
import { CONFIG } from "../../config.js";

export class Game {
  player: Player;
  tileMap: TileMap;
  canvas: HTMLCanvasElement;
  hudHeight: number;
  gameHeight: number;

  gameState: GameState;
  private spawner: Spawner;
  private entityManager: EntityManager;

  constructor(
    player: Player,
    tileMap: TileMap,
    canvas: HTMLCanvasElement,
    gameHeight: number,
    hudHeight: number,
    coinImage: HTMLImageElement,
    enemyImage: HTMLImageElement,
    powerupImage: HTMLImageElement,
  ) {
    this.player = player;
    this.tileMap = tileMap;
    this.canvas = canvas;
    this.gameHeight = gameHeight;
    this.hudHeight = hudHeight;

    this.gameState = new GameState();
    this.spawner = new Spawner(
      canvas,
      gameHeight,
      coinImage,
      enemyImage,
      powerupImage,
    );
    this.entityManager = new EntityManager(
      player,
      this.gameState,
      canvas,
      hudHeight,
    );

    this.spawner.spawnCoin();
  }

  update(delta: number, keys: Record<string, boolean>): void {
    this.player.move(keys, this.canvas, delta, this.gameHeight);
    this.gameState.updateShield(delta);
    this.spawner.update(delta, this.gameState.score);
    this.entityManager.update(
      delta,
      this.spawner.getCoins(),
      this.spawner.getEnemies(),
      this.spawner.getPowerups(),
    );
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.tileMap.draw(ctx, this.hudHeight);
    this.drawEntities(ctx);
    this.player.draw(ctx, this.hudHeight);
    this.drawShield(ctx);
  }

  private drawEntities(ctx: CanvasRenderingContext2D): void {
    this.spawner.getCoins().forEach((c) => c.draw(ctx, this.hudHeight));
    this.spawner.getEnemies().forEach((e) => e.draw(ctx, this.hudHeight));
    this.spawner.getPowerups().forEach((p) => p.draw(ctx, this.hudHeight));
    this.entityManager.draw(ctx);
  }

  private drawShield(ctx: CanvasRenderingContext2D): void {
    if (this.gameState.hasShield) {
      ctx.strokeStyle = CONFIG.ui.shieldColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(
        this.player.x - 3,
        this.player.y + this.hudHeight - 3,
        this.player.w + 6,
        this.player.h + 6,
      );
    }
  }

  drawHud(ctx: CanvasRenderingContext2D, hudImage: HTMLImageElement): void {
    ctx.drawImage(hudImage, 0, 0);
  }

  drawScore(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = CONFIG.ui.textColor;
    ctx.font = CONFIG.ui.font;
    ctx.fillText("Score: " + this.gameState.score, 10, this.hudHeight + CONFIG.ui.hudOffset.scoreY);
  }

  drawPlayerCoords(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = CONFIG.ui.textColor;
    ctx.font = CONFIG.ui.font;
    ctx.fillText(`Pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`, 10, this.hudHeight + CONFIG.ui.hudOffset.scoreY + 20);
  }

  drawLives(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = CONFIG.ui.livesColor;
    ctx.font = CONFIG.ui.font;
    ctx.fillText("Lives: " + this.gameState.lives, 10, this.hudHeight + CONFIG.ui.hudOffset.livesY);
  }

  drawGameOver(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = CONFIG.ui.gameOverBg;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = CONFIG.ui.textColor;
    ctx.font = CONFIG.ui.fontLarge;
    ctx.textAlign = "center";
    ctx.fillText(
      "GAME OVER",
      this.canvas.width / 2,
      this.canvas.height / 2 + CONFIG.ui.hudOffset.gameOverTitleY,
    );
    ctx.font = CONFIG.ui.font;
    ctx.fillText(
      "Final Score: " + this.gameState.score,
      this.canvas.width / 2,
      this.canvas.height / 2 + CONFIG.ui.hudOffset.gameOverScoreY,
    );
    ctx.fillText(
      "Press SPACE to restart",
      this.canvas.width / 2,
      this.canvas.height / 2 + CONFIG.ui.hudOffset.gameOverRestartY,
    );
    ctx.textAlign = "left";
  }

  restart(): void {
    this.player.reset({
      x: CONFIG.player.x,
      y: CONFIG.player.y,
      w: CONFIG.player.w,
      h: CONFIG.player.h,
      speed: CONFIG.player.speed,
      hitboxWidth: CONFIG.player.hitboxWidth,
      hitboxHeight: CONFIG.player.hitboxHeight,
      color: CONFIG.player.color,
    });
    this.gameState.reset();
    this.spawner.reset();
    this.entityManager.reset();
    this.spawner.spawnCoin();
  }

  get score(): number {
    return this.gameState.score;
  }

  get lives(): number {
    return this.gameState.lives;
  }

  get gameOver(): boolean {
    return this.gameState.gameOver;
  }
}

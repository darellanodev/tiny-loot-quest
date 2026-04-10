import { Player } from "./Player.js";
import { TileMap } from "./TileMap.js";
import { GameState } from "./GameState.js";
import { Spawner } from "./Spawner.js";
import { EntityManager } from "./EntityManager.js";

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
      ctx.strokeStyle = "#4ecdc4";
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
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + this.gameState.score, 10, this.hudHeight - 15);
  }

  drawLives(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#ff6b6b";
    ctx.font = "20px Arial";
    ctx.fillText("Lives: " + this.gameState.lives, 10, this.hudHeight - 40);
  }

  drawGameOver(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "GAME OVER",
      this.canvas.width / 2,
      this.canvas.height / 2 - 20,
    );
    ctx.font = "20px Arial";
    ctx.fillText(
      "Final Score: " + this.gameState.score,
      this.canvas.width / 2,
      this.canvas.height / 2 + 20,
    );
    ctx.fillText(
      "Press SPACE to restart",
      this.canvas.width / 2,
      this.canvas.height / 2 + 60,
    );
    ctx.textAlign = "left";
  }

  restart(): void {
    this.player.reset({
      x: 50,
      y: 200,
      w: 40,
      h: 40,
      speed: 200,
      hitboxWidth: 40,
      hitboxHeight: 40,
      color: "#ff0000",
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

import { Entity } from "./Entity.js";
import { PlayerConfig } from "../../config.js";
import { TileMap } from "../systems/TileMap.js";
import { CollisionChecker } from "../systems/CollisionChecker.js";

interface MovementResult {
  dx: number;
  dy: number;
  direction: number;
  moved: boolean;
}

export function calculateMovement(keys: Record<string, boolean>, speed: number, delta: number): MovementResult {
  let dx = 0;
  let dy = 0;
  let direction = 0;

  if (keys["ArrowUp"] || keys["w"]) {
    dy -= speed * delta;
    direction = 1;
  }
  if (keys["ArrowDown"] || keys["s"]) {
    dy += speed * delta;
    direction = 0;
  }
  if (keys["ArrowLeft"] || keys["a"]) {
    dx -= speed * delta;
    direction = 2;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    dx += speed * delta;
    direction = 3;
  }

  return { dx, dy, direction, moved: dx !== 0 || dy !== 0 };
}

export class Player extends Entity {
  private tileMap: TileMap | null = null;
  private collisionChecker: CollisionChecker = new CollisionChecker();

  constructor(config: PlayerConfig, image: HTMLImageElement) {
    super(config.x, config.y, config.w, config.color);
    this.speed = config.speed;
    this.sprite = image;
    this.frameWidth = 16;
    this.frameHeight = 16;
    this.sheetColumns = 4;
    this.sheetRows = 8;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.frameDelay = 10;
    this.direction = config.initialDirection ?? 0;
    this.isMoving = false;
  }

  setTileMap(tileMap: TileMap): void {
    this.tileMap = tileMap;
    this.collisionChecker.setTileMap(tileMap);
  }

  speed: number;
  sprite: HTMLImageElement;
  frameWidth: number;
  frameHeight: number;
  sheetColumns: number;
  sheetRows: number;
  currentFrame: number;
  frameTimer: number;
  frameDelay: number;
  direction: number; // 0 down, 1 up, 2 right, 3 left
  isMoving: boolean;

  move(keys: Record<string, boolean>, canvas: HTMLCanvasElement, delta: number, gameHeight: number): void {
    const { dx, dy, direction, moved } = calculateMovement(keys, this.speed, delta);
    
    if (!moved) {
      this.isMoving = false;
      return;
    }

    this.isMoving = true;
    this.direction = direction;
    
    const checkCollision = (newX: number, newY: number): boolean => {
      return this.collisionChecker.checkEntityCollision(newX, newY, this.w, this.h);
    };

    let newX = Math.max(0, Math.min(canvas.width - this.w, this.x + dx));
    let newY = Math.max(0, Math.min(gameHeight - this.h, this.y + dy));

    if (!checkCollision(newX, this.y)) this.x = newX;
    if (!checkCollision(this.x, newY)) this.y = newY;
  }

  reset(config: PlayerConfig): void {
    this.x = config.x;
    this.y = config.y;
  }

  draw(ctx: CanvasRenderingContext2D, offsetY: number = 0): void {
    if (this.sprite.complete && this.sprite.naturalWidth !== 0) {
      // Determine row based on direction
      const row = this.direction;
      // Animate only when moving
      if (this.isMoving) {
        this.frameTimer++;
        if (this.frameTimer >= this.frameDelay) {
          this.frameTimer = 0;
          this.currentFrame = (this.currentFrame + 1) % this.sheetColumns;
        }
      } else {
        // Reset to first frame when not moving
        this.currentFrame = 0;
      }

      const frameX = this.currentFrame * this.frameWidth;
      const frameY = row * this.frameHeight;
      ctx.drawImage(
        this.sprite,
        frameX,
        frameY,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y + offsetY,
        this.w,
        this.h,
      );
    } else {
      // Fallback to rectangle
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y + offsetY, this.w, this.h);
    }
  }
}

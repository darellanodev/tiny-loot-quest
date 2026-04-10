import { Entity } from "./Entity.js";
import { PlayerConfig } from "../config.js";
import { TileMap } from "./TileMap.js";

export class Player extends Entity {
  private tileMap: TileMap | null = null;

  constructor(config: PlayerConfig, image: HTMLImageElement) {
    super(config.x, config.y, config.w, config.h, config.color);
    this.speed = config.speed;
    this.sprite = image;
    this.frameWidth = 16;
    this.frameHeight = 16;
    this.sheetColumns = 4;
    this.sheetRows = 8;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.frameDelay = 10;
    this.direction = 0;
    this.isMoving = false;
  }

  setTileMap(tileMap: TileMap): void {
    this.tileMap = tileMap;
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
    this.isMoving = false;
    let moved = false;
    
    const checkCollision = (newX: number, newY: number): boolean => {
      if (!this.tileMap) return false;
      const corners = [
        { x: newX, y: newY },
        { x: newX + this.w - 0.1, y: newY },
        { x: newX, y: newY + this.h - 0.1 },
        { x: newX + this.w - 0.1, y: newY + this.h - 0.1 }
      ];
      return corners.some(c => this.tileMap!.isColliding(c.x, c.y));
    };
    
    let newX = this.x;
    let newY = this.y;

    if (keys["ArrowUp"] || keys["w"]) {
      newY -= this.speed * delta;
      this.direction = 1;
      moved = true;
    }
    if (keys["ArrowDown"] || keys["s"]) {
      newY += this.speed * delta;
      this.direction = 0;
      moved = true;
    }
    if (keys["ArrowLeft"] || keys["a"]) {
      newX -= this.speed * delta;
      this.direction = 2;
      moved = true;
    }
    if (keys["ArrowRight"] || keys["d"]) {
      newX += this.speed * delta;
      this.direction = 3;
      moved = true;
    }

    if (moved) {
      this.isMoving = true;
      newX = Math.max(0, Math.min(canvas.width - this.w, newX));
      newY = Math.max(0, Math.min(gameHeight - this.h, newY));
      
      if (!checkCollision(newX, this.y)) this.x = newX;
      if (!checkCollision(this.x, newY)) this.y = newY;
    }
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

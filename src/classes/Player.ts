import { Entity } from "./Entity.js";
import { PlayerConfig } from "../config.js";

export class Player extends Entity {
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
    this.frameDelay = 10; // frames per sprite change
    this.direction = 0; // 0: down, 1: up, 2: right, 3: left
    this.isMoving = false;
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

  move(keys: Record<string, boolean>, canvas: HTMLCanvasElement, delta: number): void {
    this.isMoving = false;
    let moved = false;
    if (keys["ArrowUp"] || keys["w"]) {
      this.y -= this.speed * delta;
      this.direction = 1; // up
      moved = true;
    }
    if (keys["ArrowDown"] || keys["s"]) {
      this.y += this.speed * delta;
      this.direction = 0; // down
      moved = true;
    }
    if (keys["ArrowLeft"] || keys["a"]) {
      this.x -= this.speed * delta;
      this.direction = 2; // left
      moved = true;
    }
    if (keys["ArrowRight"] || keys["d"]) {
      this.x += this.speed * delta;
      this.direction = 3; // right
      moved = true;
    }

    if (moved) {
      this.isMoving = true;
    }

    this.x = Math.max(0, Math.min(canvas.width - this.w, this.x));
    this.y = Math.max(0, Math.min(canvas.height - this.h, this.y));
  }

  reset(config: PlayerConfig): void {
    this.x = config.x;
    this.y = config.y;
  }

  draw(ctx: CanvasRenderingContext2D): void {
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
        this.y,
        this.w,
        this.h,
      );
    } else {
      // Fallback to rectangle
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  }
}

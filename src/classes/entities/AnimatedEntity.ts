import { Entity } from './Entity.js';

export class AnimatedEntity extends Entity {
  sprite: HTMLImageElement;
  frameWidth: number;
  frameHeight: number;
  sheetColumns: number;
  sheetRows: number;
  currentFrame: number;
  frameTimer: number;
  frameDelay: number;
  waitTimer: number;
  waitDelay: number;
  isAnimating: boolean;

  constructor(x: number, y: number, w: number, h: number, color: string, sprite: HTMLImageElement, frameWidth: number, frameHeight: number, sheetColumns: number, sheetRows: number, frameDelay: number, waitDelay: number) {
    super(x, y, w, h, color);
    this.sprite = sprite;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.sheetColumns = sheetColumns;
    this.sheetRows = sheetRows;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.frameDelay = frameDelay;
    this.waitTimer = 0;
    this.waitDelay = waitDelay;
    this.isAnimating = true;
  }

  update(): void {
    if (this.isAnimating) {
      this.frameTimer++;
      if (this.frameTimer >= this.frameDelay) {
        this.frameTimer = 0;
        this.currentFrame++;
        if (this.currentFrame >= this.sheetColumns) {
          this.currentFrame = 0;
          this.isAnimating = false;
        }
      }
    } else {
      this.waitTimer++;
      if (this.waitTimer >= this.waitDelay) {
        this.waitTimer = 0;
        this.isAnimating = true;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, offsetY: number = 0): void {
    if (this.sprite.complete && this.sprite.naturalWidth !== 0) {
      const frameX = this.currentFrame * this.frameWidth;
      const frameY = 0;
      ctx.drawImage(
        this.sprite,
        frameX,
        frameY,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y + offsetY,
        this.w,
        this.h
      );
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y + offsetY, this.w, this.h);
    }
  }
}
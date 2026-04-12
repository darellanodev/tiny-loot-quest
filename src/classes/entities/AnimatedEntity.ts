import { Entity } from './Entity.js';
import { Position } from '../core/Spawner.js';

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

  constructor(
    position: Position,
    size: number,
    color: string,
    sprite: HTMLImageElement,
    { frameWidth, frameHeight, sheetColumns, sheetRows, frameDelay, waitDelay }: {
      frameWidth: number;
      frameHeight: number;
      sheetColumns: number;
      sheetRows: number;
      frameDelay: number;
      waitDelay: number;
    }
  ) {
    super(position.x, position.y, size, color);
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
      if (this.frameTimer < this.frameDelay) return;

      this.frameTimer = 0;
      this.currentFrame++;
      if (this.currentFrame < this.sheetColumns) return;

      this.currentFrame = 0;
      this.isAnimating = false;
      return;
    }

    this.waitTimer++;
    if (this.waitTimer < this.waitDelay) return;

    this.waitTimer = 0;
    this.isAnimating = true;
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
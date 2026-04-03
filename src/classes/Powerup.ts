import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Powerup extends Entity {
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

    constructor(canvas: HTMLCanvasElement, sprite: HTMLImageElement) {
        const size = CONFIG.powerup.size;
        super(
            Math.random() * (canvas.width - size),
            Math.random() * (canvas.height - size),
            size,
            size,
            CONFIG.powerup.color
        );
        this.sprite = sprite;
        this.frameWidth = 16;
        this.frameHeight = 16;
        this.sheetColumns = 3;
        this.sheetRows = 1;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDelay = 30;
        this.waitTimer = 0;
        this.waitDelay = 180;
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

    draw(ctx: CanvasRenderingContext2D): void {
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
                this.y,
                this.w,
                this.h
            );
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    }
}
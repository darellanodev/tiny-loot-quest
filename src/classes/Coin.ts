import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Coin extends Entity {
    sprite: HTMLImageElement;
    frameWidth: number;
    frameHeight: number;
    sheetColumns: number;
    sheetRows: number;
    currentFrame: number;
    frameTimer: number;
    frameDelay: number;

    constructor(canvas: HTMLCanvasElement, sprite: HTMLImageElement) {
        const size = CONFIG.coin.size;
        super(
            Math.random() * (canvas.width - size),
            Math.random() * (canvas.height - size),
            size,
            size,
            CONFIG.coin.color
        );
        this.sprite = sprite;
        this.frameWidth = 11;
        this.frameHeight = 11;
        this.sheetColumns = 3;
        this.sheetRows = 1;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDelay = 8;
    }

    update(): void {
        this.frameTimer++;
        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % this.sheetColumns;
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
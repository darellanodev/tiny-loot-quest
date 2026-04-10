import { Entity } from './Entity.js';
import { CONFIG } from '../../config.js';

export class Enemy extends Entity {
    vx: number;
    vy: number;
    sprite: HTMLImageElement;
    frameWidth: number;
    frameHeight: number;
    sheetColumns: number;
    sheetRows: number;
    currentFrame: number;
    frameTimer: number;
    frameDelay: number;
    direction: number;

    constructor(canvas: HTMLCanvasElement, gameHeight: number, speed: number, sprite: HTMLImageElement) {
        const size = CONFIG.enemy.size;
        const side = Math.floor(Math.random() * 4);
        let x: number, y: number, vx: number, vy: number;

        if (side === 0) {
            x = Math.random() * canvas.width;
            y = -size;
            vx = 0;
            vy = speed;
        } else if (side === 1) {
            x = canvas.width;
            y = Math.random() * gameHeight;
            vx = -speed;
            vy = 0;
        } else if (side === 2) {
            x = Math.random() * canvas.width;
            y = gameHeight;
            vx = 0;
            vy = -speed;
        } else {
            x = -size;
            y = Math.random() * gameHeight;
            vx = speed;
            vy = 0;
        }

        super(x, y, size, size, CONFIG.enemy.color);
        this.vx = vx;
        this.vy = vy;
        this.sprite = sprite;
        this.frameWidth = 16;
        this.frameHeight = 16;
        this.sheetColumns = 3;
        this.sheetRows = 4;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDelay = 10;
        this.direction = 0;
    }

    update(delta: number): void {
        this.x += this.vx * delta;
        this.y += this.vy * delta;

        if (this.vx > 0) this.direction = 2;
        else if (this.vx < 0) this.direction = 1;
        else if (this.vy > 0) this.direction = 0;
        else if (this.vy < 0) this.direction = 3;

        this.frameTimer += delta;
        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % this.sheetColumns;
        }
    }

    isOutOfBounds(canvasWidth: number, gameHeight: number): boolean {
        return this.x < -50 || this.x > canvasWidth + 50 ||
               this.y < -50 || this.y > gameHeight + 50;
    }

    draw(ctx: CanvasRenderingContext2D, offsetY: number = 0): void {
        if (this.sprite.complete && this.sprite.naturalWidth !== 0) {
            const frameX = this.currentFrame * this.frameWidth;
            const frameY = this.direction * this.frameHeight;
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
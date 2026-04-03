import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

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

    constructor(canvas: HTMLCanvasElement, difficulty: number, sprite: HTMLImageElement) {
        const size = CONFIG.enemy.size;
        const speed = difficulty;
        const side = Math.floor(Math.random() * 4);
        let x: number, y: number, vx: number, vy: number;

        if (side === 0) {
            x = Math.random() * canvas.width;
            y = -size;
            vx = (Math.random() - 0.5) * 2 * speed;
            vy = Math.random() * 2 + speed;
        } else if (side === 1) {
            x = canvas.width;
            y = Math.random() * canvas.height;
            vx = -(Math.random() * 2 + speed);
            vy = (Math.random() - 0.5) * 2 * speed;
        } else if (side === 2) {
            x = Math.random() * canvas.width;
            y = canvas.height;
            vx = (Math.random() - 0.5) * 2 * speed;
            vy = -(Math.random() * 2 + speed);
        } else {
            x = -size;
            y = Math.random() * canvas.height;
            vx = Math.random() * 2 + speed;
            vy = (Math.random() - 0.5) * 2 * speed;
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

    update(_canvas: HTMLCanvasElement, delta: number): void {
        this.x += this.vx * delta;
        this.y += this.vy * delta;

        if (Math.abs(this.vx) > Math.abs(this.vy)) {
            this.direction = this.vx > 0 ? 2 : 1;
        } else {
            this.direction = this.vy > 0 ? 0 : 3;
        }

        this.frameTimer += delta;
        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % this.sheetColumns;
        }
    }

    isOutOfBounds(canvas: HTMLCanvasElement): boolean {
        return this.x < -50 || this.x > canvas.width + 50 ||
               this.y < -50 || this.y > canvas.height + 50;
    }

    draw(ctx: CanvasRenderingContext2D): void {
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
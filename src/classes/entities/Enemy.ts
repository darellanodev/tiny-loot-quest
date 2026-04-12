import { Entity } from './Entity.js';
import { CONFIG } from '../../config.js';
import { TileMap } from '../systems/TileMap.js';

interface SpawnPosition {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export function calculateSpawnPosition(
    canvasWidth: number,
    gameHeight: number,
    size: number,
    speed: number,
    tileMap: TileMap | null
): SpawnPosition {
    if (!tileMap) {
        return calculateSpawnPositionFallback(canvasWidth, gameHeight, size, speed);
    }

    const maxAttempts = 100;
    for (let i = 0; i < maxAttempts; i++) {
        const side = Math.floor(Math.random() * 4);
        let x: number, y: number, vx: number, vy: number;

        if (side === 0) {
            x = Math.random() * canvasWidth;
            y = -size;
            vx = 0;
            vy = speed;
        } else if (side === 1) {
            x = canvasWidth;
            y = Math.random() * gameHeight;
            vx = -speed;
            vy = 0;
        } else if (side === 2) {
            x = Math.random() * canvasWidth;
            y = gameHeight;
            vx = 0;
            vy = -speed;
        } else {
            x = -size;
            y = Math.random() * gameHeight;
            vx = speed;
            vy = 0;
        }

        if (!tileMap.isColliding(x + size / 2, y + size / 2)) {
            return { x, y, vx, vy };
        }
    }

    return calculateSpawnPositionFallback(canvasWidth, gameHeight, size, speed);
}

function calculateSpawnPositionFallback(
    canvasWidth: number,
    gameHeight: number,
    size: number,
    speed: number
): SpawnPosition {
    const side = Math.floor(Math.random() * 4);
    
    if (side === 0) {
        return {
            x: Math.random() * canvasWidth,
            y: -size,
            vx: 0,
            vy: speed
        };
    }
    if (side === 1) {
        return {
            x: canvasWidth,
            y: Math.random() * gameHeight,
            vx: -speed,
            vy: 0
        };
    }
    if (side === 2) {
        return {
            x: Math.random() * canvasWidth,
            y: gameHeight,
            vx: 0,
            vy: -speed
        };
    }
    return {
        x: -size,
        y: Math.random() * gameHeight,
        vx: speed,
        vy: 0
    };
}

export class Enemy extends Entity {
    private tileMap: TileMap | null = null;
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

    setTileMap(tileMap: TileMap): void {
        this.tileMap = tileMap;
    }

    constructor(canvas: HTMLCanvasElement, gameHeight: number, speed: number, sprite: HTMLImageElement, tileMap: TileMap | null = null) {
        const size = CONFIG.enemy.size;
        const pos = calculateSpawnPosition(canvas.width, gameHeight, size, speed, tileMap);

        super(pos.x, pos.y, size, size, CONFIG.enemy.color);
        this.vx = pos.vx;
        this.vy = pos.vy;
        this.sprite = sprite;
        this.frameWidth = 16;
        this.frameHeight = 16;
        this.sheetColumns = 3;
        this.sheetRows = 4;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDelay = 10;
        this.direction = 0;
        this.tileMap = tileMap;
    }

    update(delta: number): void {
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

        const tryChangeDirection = (): void => {
            if (this.vx !== 0) {
                const newVy = Math.random() < 0.5 ? Math.abs(this.vx) : -Math.abs(this.vx);
                if (!checkCollision(this.x, this.y + newVy)) {
                    this.vx = 0;
                    this.vy = newVy;
                }
            } else if (this.vy !== 0) {
                const newVx = Math.random() < 0.5 ? Math.abs(this.vy) : -Math.abs(this.vy);
                if (!checkCollision(this.x + newVx, this.y)) {
                    this.vy = 0;
                    this.vx = newVx;
                }
            }
        };

        const moveX = this.x + this.vx * delta;
        const moveY = this.y + this.vy * delta;

        if (checkCollision(moveX, this.y)) {
            tryChangeDirection();
        } else {
            this.x = moveX;
        }

        if (checkCollision(this.x, moveY)) {
            tryChangeDirection();
        } else {
            this.y = moveY;
        }

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
        const buffer = CONFIG.enemy.outOfBoundsBuffer;
        return this.x < -buffer || this.x > canvasWidth + buffer ||
               this.y < -buffer || this.y > gameHeight + buffer;
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
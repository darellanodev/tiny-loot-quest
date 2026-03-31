import { Entity } from './Entity.js';

export class Player extends Entity {
    constructor(config) {
        super(config.x, config.y, config.w, config.h, config.color);
        this.speed = config.speed;
    }

    move(keys, canvas) {
        if (keys['ArrowUp'] || keys['w']) this.y -= this.speed;
        if (keys['ArrowDown'] || keys['s']) this.y += this.speed;
        if (keys['ArrowLeft'] || keys['a']) this.x -= this.speed;
        if (keys['ArrowRight'] || keys['d']) this.x += this.speed;

        this.x = Math.max(0, Math.min(canvas.width - this.w, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.h, this.y));
    }

    reset(config) {
        this.x = config.x;
        this.y = config.y;
    }
}
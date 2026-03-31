import { Entity } from './Entity.js';

export class Enemy extends Entity {
    constructor(canvas, difficulty) {
        const size = CONFIG.enemy.size;
        const speed = difficulty;
        const side = Math.floor(Math.random() * 4);
        let x, y, vx, vy;

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
    }

    update(canvas) {
        this.x += this.vx;
        this.y += this.vy;
    }

    isOutOfBounds(canvas) {
        return this.x < -50 || this.x > canvas.width + 50 ||
               this.y < -50 || this.y > canvas.height + 50;
    }
}
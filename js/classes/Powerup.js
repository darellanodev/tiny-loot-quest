import { Entity } from './Entity.js';

export class Powerup extends Entity {
    constructor(canvas) {
        const size = CONFIG.powerup.size;
        super(
            Math.random() * (canvas.width - size),
            Math.random() * (canvas.height - size),
            size,
            size,
            CONFIG.powerup.color
        );
    }
}
import { Entity } from './Entity.js';

export class Coin extends Entity {
    constructor(canvas) {
        const size = CONFIG.coin.size;
        super(
            Math.random() * (canvas.width - size),
            Math.random() * (canvas.height - size),
            size,
            size,
            CONFIG.coin.color
        );
    }
}
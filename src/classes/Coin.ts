import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Coin extends Entity {
    constructor(canvas: HTMLCanvasElement) {
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
import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Powerup extends Entity {
    constructor(canvas: HTMLCanvasElement) {
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
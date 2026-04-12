import { AnimatedEntity } from './AnimatedEntity.js';
import { CONFIG } from '../../config.js';
import { TileMap } from '../systems/TileMap.js';
import { getValidPosition } from '../core/Spawner.js';

export class Powerup extends AnimatedEntity {
  constructor(canvas: HTMLCanvasElement, gameHeight: number, sprite: HTMLImageElement, tileMap: TileMap | null = null) {
    const size = CONFIG.powerup.size;
    const position = getValidPosition(canvas, gameHeight, size, tileMap);
    super(position, size, CONFIG.powerup.color, sprite, CONFIG.powerup.animation);
  }
}
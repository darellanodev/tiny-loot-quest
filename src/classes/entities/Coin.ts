import { AnimatedEntity } from './AnimatedEntity.js';
import { CONFIG } from '../../config.js';
import { TileMap } from '../systems/TileMap.js';
import { getValidPosition } from '../core/Spawner.js';

export class Coin extends AnimatedEntity {
  constructor(canvas: HTMLCanvasElement, gameHeight: number, sprite: HTMLImageElement, tileMap: TileMap | null = null) {
    const size = CONFIG.coin.size;
    const pos = getValidPosition(canvas, gameHeight, size, tileMap);
    super(pos.x, pos.y, size, size, CONFIG.coin.color, sprite, 11, 11, 3, 1, 30, 90);
  }
}
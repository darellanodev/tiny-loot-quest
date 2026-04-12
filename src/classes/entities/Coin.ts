import { AnimatedEntity } from './AnimatedEntity.js';
import { CONFIG } from '../../config.js';
import { TileMap } from '../systems/TileMap.js';
import { getValidPosition } from '../core/Spawner.js';

export class Coin extends AnimatedEntity {
  constructor(canvas: HTMLCanvasElement, gameHeight: number, sprite: HTMLImageElement, tileMap: TileMap | null = null) {
    const size = CONFIG.coin.size;
    const position = getValidPosition(canvas, gameHeight, size, tileMap);
    super(position, size, CONFIG.coin.color, sprite, CONFIG.coin.animation);
  }
}
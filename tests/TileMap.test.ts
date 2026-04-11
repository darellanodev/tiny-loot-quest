import { describe, it, expect } from 'vitest';
import { TileMap, TileMapData } from '../src/classes/systems/TileMap.js';

describe('TileMap collision helpers', () => {
    const createTileMap = (collisionTiles: string[]) => {
        const data: TileMapData = {
            tileSize: 32,
            mapWidth: 10,
            mapHeight: 10,
            layers: [{
                name: 'floor',
                tiles: [],
                collider: true
            }]
        };
        return new TileMap(data, document.createElement('img'));
    };

    it('calculates tile coords correctly', () => {
        const map = createTileMap([]);
        expect(map.isColliding(50, 0)).toBe(false); // tile 1,0
    });

    it('detects collision tiles', () => {
        const data: TileMapData = {
            tileSize: 32,
            mapWidth: 10,
            mapHeight: 10,
            layers: [{
                name: 'floor',
                tiles: [{ id: '1', x: 1, y: 1 }],
                collider: true
            }]
        };
        const map = new TileMap(data, document.createElement('img'));
        expect(map.isColliding(50, 50)).toBe(true); // tile 1,1
    });

    it('returns false for non-colliding tiles', () => {
        const data: TileMapData = {
            tileSize: 32,
            mapWidth: 10,
            mapHeight: 10,
            layers: [{
                name: 'floor',
                tiles: [{ id: '1', x: 5, y: 5 }],
                collider: true
            }]
        };
        const map = new TileMap(data, document.createElement('img'));
        expect(map.isColliding(50, 50)).toBe(false); // tile 1,1, no collision
    });
});
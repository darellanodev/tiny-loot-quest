import { describe, it, expect } from 'vitest';
import { CollisionChecker } from '../src/classes/systems/CollisionChecker.js';
import { TileMap } from '../src/classes/systems/TileMap.js';

describe('CollisionChecker', () => {
    it('returns false when no corners collide', () => {
        const checker = new CollisionChecker();
        const tileMap = { isColliding: () => false } as unknown as TileMap;
        expect(checker.checkEntityCollision(10, 10, 5, 5, tileMap)).toBe(false);
    });

    it('returns true when top-left corner collides', () => {
        const checker = new CollisionChecker();
        const tileMap = { isColliding: (x: number, y: number) => x < 1 && y < 1 } as unknown as TileMap;
        expect(checker.checkEntityCollision(0, 0, 5, 5, tileMap)).toBe(true);
    });

    it('returns true when bottom-right corner collides', () => {
        const checker = new CollisionChecker();
        const tileMap = { isColliding: (x: number, y: number) => x > 9 && y > 9 } as unknown as TileMap;
        expect(checker.checkEntityCollision(5, 5, 5, 5, tileMap)).toBe(true);
    });

    it('checks all four corners', () => {
        const checker = new CollisionChecker();
        const tileMap = { isColliding: (x: number, y: number) => x > 9 && y > 4 && x < 11 && y < 6 } as unknown as TileMap;
        expect(checker.checkEntityCollision(5, 5, 5, 5, tileMap)).toBe(true);
    });

    it('returns false when tileMap is null', () => {
        const checker = new CollisionChecker();
        expect(checker.checkEntityCollision(0, 0, 5, 5, null)).toBe(false);
    });
});
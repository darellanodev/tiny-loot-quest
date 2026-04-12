import { describe, it, expect } from 'vitest';
import { CollisionChecker } from '../src/classes/systems/CollisionChecker.js';

describe('CollisionChecker', () => {
    it('returns false when no corners collide', () => {
        const checker = new CollisionChecker();
        const isColliding = (x: number, y: number) => x === 0 && y === 0;
        expect(checker.checkEntityCollision(10, 10, 5, 5, isColliding)).toBe(false);
    });

    it('returns true when top-left corner collides', () => {
        const checker = new CollisionChecker();
        const isColliding = (x: number, y: number) => x < 1 && y < 1;
        expect(checker.checkEntityCollision(0, 0, 5, 5, isColliding)).toBe(true);
    });

    it('returns true when bottom-right corner collides', () => {
        const checker = new CollisionChecker();
        const isColliding = (x: number, y: number) => x > 9 && y > 9;
        expect(checker.checkEntityCollision(5, 5, 5, 5, isColliding)).toBe(true);
    });

    it('checks all four corners', () => {
        const checker = new CollisionChecker();
        const isColliding = (x: number, y: number) => x > 9 && y > 4 && x < 11 && y < 6;
        expect(checker.checkEntityCollision(5, 5, 5, 5, isColliding)).toBe(true);
    });
});
import { describe, it, expect } from 'vitest';
import { calculateMovement } from '../src/classes/entities/Player.js';

describe('calculateMovement', () => {
    it('returns zero movement when no keys pressed', () => {
        const result = calculateMovement({}, 1, 1);
        expect(result).toEqual({ dx: 0, dy: 0, direction: 0, moved: false });
    });

    it('moves up when ArrowUp pressed', () => {
        const result = calculateMovement({ ArrowUp: true }, 10, 1);
        expect(result.dy).toBe(-10);
        expect(result.direction).toBe(1);
        expect(result.moved).toBe(true);
    });

    it('moves down when ArrowDown pressed', () => {
        const result = calculateMovement({ ArrowDown: true }, 10, 1);
        expect(result.dy).toBe(10);
        expect(result.direction).toBe(0);
        expect(result.moved).toBe(true);
    });

    it('moves left when ArrowLeft pressed', () => {
        const result = calculateMovement({ ArrowLeft: true }, 10, 1);
        expect(result.dx).toBe(-10);
        expect(result.direction).toBe(2);
        expect(result.moved).toBe(true);
    });

    it('moves right when ArrowRight pressed', () => {
        const result = calculateMovement({ ArrowRight: true }, 10, 1);
        expect(result.dx).toBe(10);
        expect(result.direction).toBe(3);
        expect(result.moved).toBe(true);
    });

    it('moves up with w key', () => {
        const result = calculateMovement({ w: true }, 10, 1);
        expect(result.dy).toBe(-10);
        expect(result.direction).toBe(1);
    });

    it('multiplies by delta', () => {
        const result = calculateMovement({ ArrowUp: true }, 10, 2);
        expect(result.dy).toBe(-20);
    });

    it('last pressed key wins for direction', () => {
        const result = calculateMovement({ ArrowUp: true, ArrowRight: true }, 10, 1);
        expect(result.moved).toBe(true);
    });
});
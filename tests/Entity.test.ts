import { describe, it, expect } from 'vitest';
import { Entity } from '../src/classes/entities/Entity.js';

describe('checkAABBCollision', () => {
    it('detects collision when rectangles overlap', () => {
        const a = { x: 0, y: 0, w: 10, h: 10 };
        const b = { x: 5, y: 5, w: 10, h: 10 };
        expect(Entity.collides(a as unknown as Entity, b as unknown as Entity)).toBe(true);
    });

    it('returns false when rectangles do not overlap', () => {
        const a = { x: 0, y: 0, w: 10, h: 10 };
        const b = { x: 20, y: 20, w: 10, h: 10 };
        expect(Entity.collides(a as unknown as Entity, b as unknown as Entity)).toBe(false);
    });

    it('returns false when rectangles touch at edge', () => {
        const a = { x: 0, y: 0, w: 10, h: 10 };
        const b = { x: 10, y: 0, w: 10, h: 10 };
        expect(Entity.collides(a as unknown as Entity, b as unknown as Entity)).toBe(false);
    });

    it('returns false when one rect is completely inside other', () => {
        const a = { x: 0, y: 0, w: 20, h: 20 };
        const b = { x: 5, y: 5, w: 5, h: 5 };
        expect(Entity.collides(a as unknown as Entity, b as unknown as Entity)).toBe(true);
    });
});
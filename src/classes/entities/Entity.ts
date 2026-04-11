function checkAABBCollision(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}

export class Entity {
    constructor(
        public x: number,
        public y: number,
        public w: number,
        public h: number,
        public color: string
    ) {}

    collidesWith(other: Entity): boolean {
        return checkAABBCollision(this.x, this.y, this.w, this.h, other.x, other.y, other.w, other.h);
    }

    static collides(a: Entity, b: Entity): boolean {
        return checkAABBCollision(a.x, a.y, a.w, a.h, b.x, b.y, b.w, b.h);
    }

    draw(ctx: CanvasRenderingContext2D, offsetY: number = 0): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y + offsetY, this.w, this.h);
    }
}
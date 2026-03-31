export class Entity {
    constructor(
        public x: number,
        public y: number,
        public w: number,
        public h: number,
        public color: string
    ) {}

    collidesWith(other: Entity): boolean {
        return this.x < other.x + other.w &&
               this.x + this.w > other.x &&
               this.y < other.y + other.h &&
               this.y + this.h > other.y;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
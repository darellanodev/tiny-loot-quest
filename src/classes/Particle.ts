export class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;

    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.life = 30 + Math.random() * 20;
        this.color = color;
        this.size = 3 + Math.random() * 4;
    }

    update(delta: number): void {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
        this.life -= delta;
        this.size *= 0.95;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.globalAlpha = this.life / 50;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }

    isDead(): boolean {
        return this.life <= 0;
    }
}
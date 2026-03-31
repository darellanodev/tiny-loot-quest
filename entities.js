class Entity {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    collidesWith(other) {
        return this.x < other.x + other.w &&
               this.x + this.w > other.x &&
               this.y < other.y + other.h &&
               this.y + this.h > other.y;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Player extends Entity {
    constructor(config) {
        super(config.x, config.y, config.w, config.h, config.color);
        this.speed = config.speed;
    }

    move(keys, canvas) {
        if (keys['ArrowUp'] || keys['w']) this.y -= this.speed;
        if (keys['ArrowDown'] || keys['s']) this.y += this.speed;
        if (keys['ArrowLeft'] || keys['a']) this.x -= this.speed;
        if (keys['ArrowRight'] || keys['d']) this.x += this.speed;

        this.x = Math.max(0, Math.min(canvas.width - this.w, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.h, this.y));
    }

    reset(config) {
        this.x = config.x;
        this.y = config.y;
    }
}

class Coin extends Entity {
    constructor(canvas) {
        const size = CONFIG.coin.size;
        super(
            Math.random() * (canvas.width - size),
            Math.random() * (canvas.height - size),
            size,
            size,
            CONFIG.coin.color
        );
    }
}

class Enemy extends Entity {
    constructor(canvas, difficulty) {
        const size = CONFIG.enemy.size;
        const speed = difficulty;
        const side = Math.floor(Math.random() * 4);
        let x, y, vx, vy;

        if (side === 0) {
            x = Math.random() * canvas.width;
            y = -size;
            vx = (Math.random() - 0.5) * 2 * speed;
            vy = Math.random() * 2 + speed;
        } else if (side === 1) {
            x = canvas.width;
            y = Math.random() * canvas.height;
            vx = -(Math.random() * 2 + speed);
            vy = (Math.random() - 0.5) * 2 * speed;
        } else if (side === 2) {
            x = Math.random() * canvas.width;
            y = canvas.height;
            vx = (Math.random() - 0.5) * 2 * speed;
            vy = -(Math.random() * 2 + speed);
        } else {
            x = -size;
            y = Math.random() * canvas.height;
            vx = Math.random() * 2 + speed;
            vy = (Math.random() - 0.5) * 2 * speed;
        }

        super(x, y, size, size, CONFIG.enemy.color);
        this.vx = vx;
        this.vy = vy;
    }

    update(canvas) {
        this.x += this.vx;
        this.y += this.vy;
    }

    isOutOfBounds(canvas) {
        return this.x < -50 || this.x > canvas.width + 50 ||
               this.y < -50 || this.y > canvas.height + 50;
    }
}

class Powerup extends Entity {
    constructor(canvas) {
        const size = CONFIG.powerup.size;
        super(
            Math.random() * (canvas.width - size),
            Math.random() * (canvas.height - size),
            size,
            size,
            CONFIG.powerup.color
        );
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.life = 30 + Math.random() * 20;
        this.color = color;
        this.size = 3 + Math.random() * 4;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.size *= 0.95;
    }

    draw(ctx) {
        ctx.globalAlpha = this.life / 50;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }

    isDead() {
        return this.life <= 0;
    }
}

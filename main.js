const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const player = { ...CONFIG.player };

const coins = [];
let coinTimer = 0;

const enemies = [];
let enemyTimer = 0;
let score = 0;
let gameOver = false;
let lives = CONFIG.initialLives;
let hasShield = false;
let shieldTimer = 0;
const powerups = [];
let powerupTimer = 0;
let difficulty = CONFIG.difficulty.base;
const particles = [];

function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 30 + Math.random() * 20,
            color: color,
            size: 3 + Math.random() * 4
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.size *= 0.95;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

function drawParticles() {
    particles.forEach(p => {
        ctx.globalAlpha = p.life / 50;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;
}

function spawnCoin() {
    coins.push({
        x: Math.random() * (canvas.width - CONFIG.coin.size),
        y: Math.random() * (canvas.height - CONFIG.coin.size),
        w: CONFIG.coin.size,
        h: CONFIG.coin.size,
        color: CONFIG.coin.color
    });
}

spawnCoin();

function spawnEnemy() {
    const side = Math.floor(Math.random() * 4);
    const speed = difficulty;
    const size = CONFIG.enemy.size;
    let x, y, vx, vy;
    if (side === 0) { x = Math.random() * canvas.width; y = -size; vx = (Math.random() - 0.5) * 2 * speed; vy = Math.random() * 2 + speed; }
    else if (side === 1) { x = canvas.width; y = Math.random() * canvas.height; vx = -(Math.random() * 2 + speed); vy = (Math.random() - 0.5) * 2 * speed; }
    else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height; vx = (Math.random() - 0.5) * 2 * speed; vy = -(Math.random() * 2 + speed); }
    else { x = -size; y = Math.random() * canvas.height; vx = Math.random() * 2 + speed; vy = (Math.random() - 0.5) * 2 * speed; }
    enemies.push({ x, y, w: size, h: size, vx, vy, color: CONFIG.enemy.color });
}

function spawnPowerup() {
    const size = CONFIG.powerup.size;
    powerups.push({
        x: Math.random() * (canvas.width - size),
        y: Math.random() * (canvas.height - size),
        w: size,
        h: size,
        color: CONFIG.powerup.color
    });
}

const keys = {};

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

function update() {
    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;

    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

    coinTimer++;
    if (coinTimer > CONFIG.coin.spawnInterval) {
        spawnCoin();
        coinTimer = 0;
    }

    enemyTimer++;
    difficulty = CONFIG.difficulty.base + Math.floor(score / CONFIG.difficulty.scorePerLevel) * CONFIG.difficulty.increment;
    if (enemyTimer > Math.max(CONFIG.enemy.minSpawnInterval, CONFIG.enemy.baseSpawnInterval - score * 2)) {
        spawnEnemy();
        enemyTimer = 0;
    }

    powerupTimer++;
    if (powerupTimer > CONFIG.powerup.spawnInterval) {
        spawnPowerup();
        powerupTimer = 0;
    }

    if (hasShield) {
        shieldTimer--;
        if (shieldTimer <= 0) hasShield = false;
    }

    updateParticles();

    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.x += e.vx;
        e.y += e.vy;
        if (e.x < -50 || e.x > canvas.width + 50 || e.y < -50 || e.y > canvas.height + 50) {
            enemies.splice(i, 1);
            continue;
        }
        if (player.x < e.x + e.w && player.x + player.w > e.x &&
            player.y < e.y + e.h && player.y + player.h > e.y) {
            if (!hasShield) {
                lives--;
                createParticles(player.x + player.w/2, player.y + player.h/2, CONFIG.enemy.color, CONFIG.particle.defaultCount + 5);
            }
            enemies.splice(i, 1);
            if (lives <= 0) {
                gameOver = true;
            }
        }
    }

    for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        if (player.x < c.x + c.w && player.x + player.w > c.x &&
            player.y < c.y + c.h && player.y + player.h > c.y) {
            score++;
            createParticles(c.x + c.w/2, c.y + c.h/2, CONFIG.coin.color, CONFIG.particle.defaultCount);
            coins.splice(i, 1);
        }
    }

    for (let i = powerups.length - 1; i >= 0; i--) {
        const p = powerups[i];
        if (player.x < p.x + p.w && player.x + player.w > p.x &&
            player.y < p.y + p.h && player.y + player.h > p.y) {
            hasShield = true;
            shieldTimer = CONFIG.powerup.shieldDuration;
            createParticles(p.x + p.w/2, p.y + p.h/2, CONFIG.powerup.color, CONFIG.particle.defaultCount + 5);
            powerups.splice(i, 1);
        }
    }
}

function drawBackground() {
    ctx.fillStyle = CONFIG.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.w, player.h);
}

function drawCoins() {
    coins.forEach(c => {
        ctx.fillStyle = c.color;
        ctx.fillRect(c.x, c.y, c.w, c.h);
    });
}

function drawEnemies() {
    enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.w, e.h);
    });
}

function drawPowerups() {
    powerups.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.w, p.h);
    });
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function drawLives() {
    ctx.fillStyle = '#ff6b6b';
    ctx.font = '20px Arial';
    ctx.fillText('Lives: ' + lives, 10, 60);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 60);
    ctx.textAlign = 'left';
}

function restart() {
    player.x = CONFIG.player.x;
    player.y = CONFIG.player.y;
    score = 0;
    lives = CONFIG.initialLives;
    coins.length = 0;
    enemies.length = 0;
    gameOver = false;
    spawnCoin();
}

window.addEventListener('keydown', e => {
    if (gameOver && e.key === ' ') {
        restart();
    }
});

function loop() {
    update();
    drawBackground();
    drawPlayer();
    drawCoins();
    drawEnemies();
    drawPowerups();
    drawParticles();
    drawScore();
    drawLives();
    if (gameOver) {
        drawGameOver();
    } else {
        requestAnimationFrame(loop);
    }
}

loop();

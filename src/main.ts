import "./style.css";
import { CONFIG } from "./config.js";
import { Player } from "./classes/Player.js";
import { Coin } from "./classes/Coin.js";
import { Enemy } from "./classes/Enemy.js";
import { Powerup } from "./classes/Powerup.js";
import { Particle } from "./classes/Particle.js";
import { ImageManager } from "./classes/ImageManager.js";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const imageManager = new ImageManager();
const imageCharacterURL = new URL(`./images/character.png`, import.meta.url).href;
const characterImage = await imageManager.load(imageCharacterURL);

const player = new Player(CONFIG.player, characterImage);
let score = 0;
let gameOver = false;
let lives = CONFIG.initialLives;
let hasShield = false;
let shieldTimer = 0;

const coins: Coin[] = [];
const enemies: Enemy[] = [];
const powerups: Powerup[] = [];
const particles: Particle[] = [];

let coinTimer = 0;
let enemyTimer = 0;
let powerupTimer = 0;
let difficulty = CONFIG.difficulty.base;

const keys: Record<string, boolean> = {};

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function createParticles(
  x: number,
  y: number,
  color: string,
  count: number,
): void {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, color));
  }
}

function spawnCoin(): void {
  coins.push(new Coin(canvas));
}

spawnCoin();

function spawnEnemy(): void {
  enemies.push(new Enemy(canvas, difficulty));
}

function spawnPowerup(): void {
  powerups.push(new Powerup(canvas));
}

function update(): void {
  player.move(keys, canvas);

  coinTimer++;
  if (coinTimer > CONFIG.coin.spawnInterval) {
    spawnCoin();
    coinTimer = 0;
  }

  enemyTimer++;
  difficulty =
    CONFIG.difficulty.base +
    Math.floor(score / CONFIG.difficulty.scorePerLevel) *
      CONFIG.difficulty.increment;
  if (
    enemyTimer >
    Math.max(
      CONFIG.enemy.minSpawnInterval,
      CONFIG.enemy.baseSpawnInterval - score * 2,
    )
  ) {
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

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].isDead()) particles.splice(i, 1);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update(canvas);
    if (enemies[i].isOutOfBounds(canvas)) {
      enemies.splice(i, 1);
      continue;
    }
    if (player.collidesWith(enemies[i])) {
      if (!hasShield) {
        lives--;
        createParticles(
          player.x + player.w / 2,
          player.y + player.h / 2,
          CONFIG.enemy.color,
          CONFIG.particle.defaultCount + 5,
        );
      }
      enemies.splice(i, 1);
      if (lives <= 0) {
        gameOver = true;
      }
    }
  }

  for (let i = coins.length - 1; i >= 0; i--) {
    if (player.collidesWith(coins[i])) {
      score++;
      createParticles(
        coins[i].x + coins[i].w / 2,
        coins[i].y + coins[i].h / 2,
        CONFIG.coin.color,
        CONFIG.particle.defaultCount,
      );
      coins.splice(i, 1);
    }
  }

  for (let i = powerups.length - 1; i >= 0; i--) {
    if (player.collidesWith(powerups[i])) {
      hasShield = true;
      shieldTimer = CONFIG.powerup.shieldDuration;
      createParticles(
        powerups[i].x + powerups[i].w / 2,
        powerups[i].y + powerups[i].h / 2,
        CONFIG.powerup.color,
        CONFIG.particle.defaultCount + 5,
      );
      powerups.splice(i, 1);
    }
  }
}

function drawBackground(): void {
  ctx.fillStyle = CONFIG.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer(): void {
  player.draw(ctx);
  if (hasShield) {
    ctx.strokeStyle = CONFIG.powerup.color;
    ctx.lineWidth = 3;
    ctx.strokeRect(player.x - 3, player.y - 3, player.w + 6, player.h + 6);
  }
}

function drawCoins(): void {
  coins.forEach((c) => c.draw(ctx));
}

function drawEnemies(): void {
  enemies.forEach((e) => e.draw(ctx));
}

function drawPowerups(): void {
  powerups.forEach((p) => p.draw(ctx));
}

function drawParticles(): void {
  particles.forEach((p) => p.draw(ctx));
}

function drawScore(): void {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function drawLives(): void {
  ctx.fillStyle = "#ff6b6b";
  ctx.font = "20px Arial";
  ctx.fillText("Lives: " + lives, 10, 60);
}

function drawGameOver(): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = "20px Arial";
  ctx.fillText(
    "Final Score: " + score,
    canvas.width / 2,
    canvas.height / 2 + 20,
  );
  ctx.fillText(
    "Press SPACE to restart",
    canvas.width / 2,
    canvas.height / 2 + 60,
  );
  ctx.textAlign = "left";
}

function restart(): void {
  player.reset(CONFIG.player);
  score = 0;
  lives = CONFIG.initialLives;
  hasShield = false;
  shieldTimer = 0;
  coins.length = 0;
  enemies.length = 0;
  powerups.length = 0;
  particles.length = 0;
  gameOver = false;
  spawnCoin();
}

window.addEventListener("keydown", (e) => {
  if (gameOver && e.key === " ") {
    restart();
  }
});

function loop(): void {
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

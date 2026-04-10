import "./style.css";
import { CONFIG } from "./config.js";
import { Player } from "./classes/Player.js";
import { ImageManager } from "./classes/ImageManager.js";
import { TileMap } from "./classes/TileMap.js";
import { Game } from "./classes/Game.js";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
ctx.imageSmoothingEnabled = false;

const imageManager = new ImageManager();
const mapURL = new URL(`./data/map.json`, import.meta.url).href;
const mapTilesetURL = new URL(`./images/map.png`, import.meta.url).href;
const tileMap = await TileMap.load(mapTilesetURL, mapURL, imageManager);
const imageHudURL = new URL(`./images/hud.png`, import.meta.url).href;
const hudImage = await imageManager.load(imageHudURL);
const HUD_HEIGHT = hudImage.height;

canvas.width = tileMap.mapWidth * tileMap.tileSize;
canvas.height = tileMap.mapHeight * tileMap.tileSize + HUD_HEIGHT;
const gameHeight = tileMap.mapHeight * tileMap.tileSize;

const imageCharacterURL = new URL(`./images/character.png`, import.meta.url).href;
const characterImage = await imageManager.load(imageCharacterURL);
const imageSkeletonURL = new URL(`./images/skeleton.png`, import.meta.url).href;
const skeletonImage = await imageManager.load(imageSkeletonURL);
const imageCoinURL = new URL(`./images/coin.png`, import.meta.url).href;
const coinImage = await imageManager.load(imageCoinURL);
const imagePowerupURL = new URL(`./images/powerup.png`, import.meta.url).href;
const powerupImage = await imageManager.load(imagePowerupURL);

const player = new Player(CONFIG.player, characterImage);
player.setTileMap(tileMap);

const game = new Game(
  player,
  tileMap,
  canvas,
  gameHeight,
  HUD_HEIGHT,
  coinImage,
  skeletonImage,
  powerupImage
);

const keys: Record<string, boolean> = {};

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

window.addEventListener("keydown", (e) => {
  if (game.gameOver && e.key === " ") {
    game.restart();
  }
});

let lastTime = performance.now();

function loop(currentTime: number): void {
  const delta = (currentTime - lastTime) / 16.667;
  lastTime = currentTime;

  game.update(delta, keys);
  game.draw(ctx);
  game.drawHud(ctx, hudImage);
  game.drawScore(ctx);
  game.drawLives(ctx);
  if (game.gameOver) {
    game.drawGameOver(ctx);
  } else {
    requestAnimationFrame(loop);
  }
}

loop(performance.now());
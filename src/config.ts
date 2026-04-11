export interface EntityConfig {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
}

export interface PlayerConfig extends EntityConfig {
    speed: number;
    hitboxWidth: number;
    hitboxHeight: number;
}

export interface CoinConfig {
    size: number;
    color: string;
    spawnInterval: number;
}

export interface EnemyConfig {
    size: number;
    hitboxWidth: number;
    color: string;
    baseSpawnInterval: number;
    minSpawnInterval: number;
}

export interface PowerupConfig {
    size: number;
    color: string;
    spawnInterval: number;
    shieldDuration: number;
}

export interface ParticleConfig {
    defaultCount: number;
}

export interface DifficultyConfig {
    base: number;
    increment: number;
    scorePerLevel: number;
}

export interface CanvasConfig {
    width: number;
    height: number;
}

export interface Config {
    canvas: CanvasConfig;
    background: string;
    player: PlayerConfig;
    coin: CoinConfig;
    enemy: EnemyConfig;
    powerup: PowerupConfig;
    particle: ParticleConfig;
    initialLives: number;
    difficulty: DifficultyConfig;
    ui: UIConfig;
}

export interface UIConfig {
    font: string;
    fontLarge: string;
    textColor: string;
    livesColor: string;
    shieldColor: string;
    gameOverBg: string;
    hudOffset: HUDOffsets;
}

export interface HUDOffsets {
    scoreY: number;
    livesY: number;
    gameOverTitleY: number;
    gameOverScoreY: number;
    gameOverRestartY: number;
}

export const CONFIG: Config = {
    canvas: { width: 600, height: 400 },
    background: '#1a1a2e',
    player: {
        x: 280,
        y: 220,
        w: 16,
        h: 16,
        hitboxWidth: 10,
        hitboxHeight: 12,
        color: '#00d4ff',
        speed: 1
    },
    coin: { size: 11, color: '#ffd700', spawnInterval: 120 },
    enemy: { size: 16, hitboxWidth: 8, color: '#ff4444', baseSpawnInterval: 90, minSpawnInterval: 30 },
    powerup: { size: 16, color: '#00ff88', spawnInterval: 600, shieldDuration: 300 },
    particle: { defaultCount: 10 },
    initialLives: 3,
    difficulty: { base: 0.3, increment: 0.05, scorePerLevel: 5 },
    ui: {
        font: "20px Arial",
        fontLarge: "40px Arial",
        textColor: "#fff",
        livesColor: "#ff6b6b",
        shieldColor: "#4ecdc4",
        gameOverBg: "rgba(0, 0, 0, 0.7)",
        hudOffset: { scoreY: -15, livesY: -40, gameOverTitleY: -20, gameOverScoreY: 20, gameOverRestartY: 60 }
    }
};
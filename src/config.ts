export interface EntityConfig {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
}

export interface PlayerConfig extends EntityConfig {
    speed: number;
}

export interface CoinConfig {
    size: number;
    color: string;
    spawnInterval: number;
}

export interface EnemyConfig {
    size: number;
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
}

export const CONFIG: Config = {
    canvas: { width: 600, height: 400 },
    background: '#1a1a2e',
    player: {
        x: 280,
        y: 180,
        w: 30,
        h: 30,
        color: '#00d4ff',
        speed: 4
    },
    coin: { size: 15, color: '#ffd700', spawnInterval: 120 },
    enemy: { size: 25, color: '#ff4444', baseSpawnInterval: 90, minSpawnInterval: 30 },
    powerup: { size: 20, color: '#00ff88', spawnInterval: 600, shieldDuration: 300 },
    particle: { defaultCount: 10 },
    initialLives: 3,
    difficulty: { base: 1, increment: 0.2, scorePerLevel: 5 }
};
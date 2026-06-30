# AGENTS.md — Tiny Loot Quest

## Project Overview

2D top-down pixel-art loot-collector game. Vanilla TypeScript on HTML5 Canvas — no game frameworks. Built with Vite, tested with Vitest.

## Commands

| Command | Description |
|---|---|
| `pnpm run dev` | Start dev server with HMR |
| `pnpm run build` | `tsc --noEmit && vite build` |
| `pnpm test` | Run all Vitest tests |
| `pnpm exec tsc --noEmit` | Type-check only |

## Project Structure

```
src/
├── main.ts                          # Entry: bootstrap, input, game loop
├── config.ts                        # All constants & Config interfaces
├── classes/
│   ├── core/
│   │   ├── Game.ts                  # Game loop orchestration (update/draw)
│   │   ├── GameState.ts             # Score, lives, shield state
│   │   ├── EntityManager.ts         # Collision detection + particles
│   │   └── Spawner.ts               # Timed entity spawning + getValidPosition()
│   ├── entities/
│   │   ├── Entity.ts                # Base: x, y, size, AABB collision
│   │   ├── AnimatedEntity.ts        # Sprite-sheet animation (frame cycling)
│   │   ├── Player.ts                # Input, tile-collision, 4-dir sprite
│   │   ├── Enemy.ts                 # Edge-spawn, move inward, direction change
│   │   ├── Coin.ts                  # Collectible (extends AnimatedEntity)
│   │   ├── Powerup.ts              # Shield powerup (extends AnimatedEntity)
│   │   └── Particle.ts             # Short-lived visual effect
│   └── systems/
│       ├── TileMap.ts               # JSON + tileset loading, rendering, collision set
│       ├── ImageManager.ts          # Promise-based image loading
│       └── CollisionChecker.ts      # 4-corner entity-vs-tilemap collision
├── data/map.json                    # Tile map data
├── images/                          # Sprite assets (png)
└── style.css                        # Page styling
tests/                               # Vitest test files (*.test.ts)
```

## Architecture

### Class Hierarchy

```
Entity (x, y, size, color, AABB)
├── AnimatedEntity (sprite frames, update/draw animation cycle)
│   ├── Coin      (spawns via getValidPosition)
│   └── Powerup   (spawns via getValidPosition)
├── Player        (input, tile-collision, 4-dir sprite, pure fn calculateMovement)
└── Enemy         (edge-spawn, edge-avoidance, pure fn calculateSpawnPosition)
Particle (standalone, short-lived)
```

### Core Systems

- **Game** owns `GameState`, `Spawner`, `EntityManager`; runs `update(delta, keys)` / `draw(ctx)` loop
- **Spawner** manages spawn timers + `getValidPosition()` (shared pure fn)
- **EntityManager** handles player-vs-entity collisions + particle spawning
- **TileMap** loads JSON + tileset, renders layers, provides collision set
- **CollisionChecker** 4-corner tile collision for entities

### Game Loop (in main.ts)

1. Compute `delta = (currentTime - lastTime) / 16.667`
2. `game.update(delta, keys)` — spawner ticks, entity updates, collision checks
3. `game.draw(ctx)` — tilemap, entities, particles
4. `game.drawHud()`, `drawScore()`, `drawLives()`, `drawPlayerCoords()`
5. `requestAnimationFrame(loop)` unless game over

## Coding Conventions

- **Files**: PascalCase for classes (`Player.ts`), camelCase for utilities (`config.ts`, `main.ts`). Test files mirror source names (`PlayerMovement.test.ts`).
- **Classes**: PascalCase, **named exports only** — no `export default`.
- **Functions/Methods**: camelCase. Export pure functions alongside classes for testability.
- **Private fields**: prefix `_` when backed by getter (`_coins` → `get coins()`).
- **Imports**: Always use `.js` extension (ESM convention, `allowImportingTsExtensions`).
- **Config**: Single `CONFIG` constant from `config.ts` with typed interfaces.
- **Drawing**: All `draw(ctx, offsetY: number = 0)` methods accept HUD offset parameter.
- **Fields**: Prefer `public` fields on entities; `private` on systems/core classes.

## Config Pattern (`config.ts`)

All game constants live in `src/config.ts` as a typed `Config` interface + `CONFIG` const. Sub-configs follow `*Config` naming: `PlayerConfig`, `CoinConfig`, `EnemyConfig`, `PowerupConfig`, `UIConfig`, etc.

## Testing (Vitest)

- **Environment**: `happy-dom` (fast, lightweight DOM)
- **Globals**: `describe`/`it`/`expect` available without imports
- **Location**: `tests/*.test.ts`
- **Mocking**: `vi.fn()`, `vi.spyOn()` for partial mocks
- **Pattern**: Export pure functions + test them; classes tested via their public API

### Existing tests:
- `Entity.test.ts` — AABB collision
- `PlayerMovement.test.ts` — `calculateMovement()` arrow/WASD keys
- `TileMap.test.ts` — `isColliding()` tile coordinate calculation
- `EnemySpawn.test.ts` — `calculateSpawnPosition()` edge selection
- `CollisionChecker.test.ts` — `checkEntityCollision()` 4-corner check

## Adding a New Entity

1. Create `src/classes/entities/YourEntity.ts` extending `Entity` or `AnimatedEntity`
2. Add config fields to `Config` in `src/config.ts`
3. Wire spawning into `Spawner.ts` (add timer + spawn method)
4. Wire collisions into `EntityManager.ts` (detect + react)
5. Add image loading in `main.ts` (pass to `Game` constructor)
6. Add test in `tests/YourEntity.test.ts`
7. Add sprite in `src/images/`

## CI/CD (GitHub Actions)

Push to `main` → pnpm install → `tsc --noEmit` → `vite build` → deploy `dist/` to GitHub Pages.

## Maintenance

Whenever making changes to the project, review this file and update it to stay coherent with the current state of the codebase.

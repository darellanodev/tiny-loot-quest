---
name: add-spritesheet
description: Add a spritesheet to a game entity class (Player, Enemy, Coin, Powerup, etc.)
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: game-development
---

## What I do
Add spritesheet support to a game entity class following the existing patterns in the codebase.

## When to use me
Use this when the user provides a new spritesheet image for a game entity (e.g., "I have a coin.png with 1 row x 3 columns at 11x11 pixels").

## Steps to follow

### 1. Load the image in main.ts
Find where other images are loaded (look for `imageManager.load`). Add:
```typescript
const image[name]URL = new URL(`./images/[filename].png`, import.meta.url).href;
const [name]Image = await imageManager.load(image[name]URL);
```
Pass the image to the class constructor.

### 2. Update the class constructor
- Add sprite parameter to constructor
- Add spritesheet properties:
  - `frameWidth`: pixels per frame horizontally
  - `frameHeight`: pixels per frame vertically  
  - `sheetColumns`: number of columns
  - `sheetRows`: number of rows
  - `currentFrame`: starts at 0
  - `frameTimer`: starts at 0
  - `frameDelay`: typically 8-10

### 3. Update config.ts
- Set `size` to match the sprite pixel size (not scaled size)
- Add `hitboxWidth`/`hitboxHeight` if needed for collision

### 4. Add update() method
Call in game loop. Animate frames:
```typescript
update(): void {
    this.frameTimer++;
    if (this.frameTimer >= this.frameDelay) {
        this.frameTimer = 0;
        this.currentFrame = (this.currentFrame + 1) % this.sheetColumns;
    }
}
```

### 5. Add draw() method
Render the current sprite frame:
```typescript
draw(ctx: CanvasRenderingContext2D): void {
    if (this.sprite.complete && this.sprite.naturalWidth !== 0) {
        const frameX = this.currentFrame * this.frameWidth;
        const frameY = row * this.frameHeight;
        ctx.drawImage(
            this.sprite,
            frameX, frameY,
            this.frameWidth, this.frameHeight,
            this.x, this.y,
            this.w, this.h
        );
    } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
```

### 6. Add update() call in main.ts loop
For each entity array, call `entity.update()` before collision checks.

### 7. Build and test
Run `npm run build` to verify no errors.

## Important notes
- Always update config.ts size to match sprite pixel dimensions, not scaled size
- Hitbox dimensions are independent and should be adjusted separately if needed
- Frame delay of 8-10 gives smooth animation at 60fps

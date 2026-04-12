import { TileMap } from "./TileMap.js";

export class CollisionChecker {
    setTileMap(tileMap: TileMap): void {}

    checkEntityCollision(
        x: number,
        y: number,
        w: number,
        h: number,
        isColliding: (x: number, y: number) => boolean
    ): boolean {
        const corners = [
            { x, y },
            { x: x + w - 0.1, y },
            { x, y: y + h - 0.1 },
            { x: x + w - 0.1, y: y + h - 0.1 }
        ];
        return corners.some(c => isColliding(c.x, c.y));
    }
}
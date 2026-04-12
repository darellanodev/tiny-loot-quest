import { TileMap } from "./TileMap.js";

export class CollisionChecker {
    private tileMap: TileMap | null = null;

    setTileMap(tileMap: TileMap): void {
        this.tileMap = tileMap;
    }

    checkEntityCollision(x: number, y: number, w: number, h: number): boolean {
        if (!this.tileMap) return false;
        const corners = [
            { x, y },
            { x: x + w - 0.1, y },
            { x, y: y + h - 0.1 },
            { x: x + w - 0.1, y: y + h - 0.1 }
        ];
        return corners.some(c => this.tileMap!.isColliding(c.x, c.y));
    }
}
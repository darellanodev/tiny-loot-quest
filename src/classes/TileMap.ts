import { ImageManager } from "./ImageManager.js";

export interface TileMapData {
    tileSize: number;
    mapWidth: number;
    mapHeight: number;
    layers: Layer[];
}

export interface Layer {
    name: string;
    tiles: Tile[];
    collider?: boolean;
}

export interface Tile {
    id: string;
    x: number;
    y: number;
}

export class TileMap {
    private data: TileMapData;
    private tilesetImage: HTMLImageElement;
    public tileSize: number;
    public mapWidth: number;
    public mapHeight: number;
    private collisionTiles: Set<string> = new Set();

    constructor(data: TileMapData, tilesetImage: HTMLImageElement) {
        this.data = data;
        this.tilesetImage = tilesetImage;
        this.tileSize = data.tileSize;
        this.mapWidth = data.mapWidth;
        this.mapHeight = data.mapHeight;
        
        for (const layer of this.data.layers) {
            if (layer.collider !== false) {
                for (const tile of layer.tiles) {
                    this.collisionTiles.add(`${tile.x},${tile.y}`);
                }
            }
        }
    }

    static async load(tilesetUrl: string, mapUrl: string, imageManager: ImageManager): Promise<TileMap> {
        const [tilesetImage, response] = await Promise.all([
            imageManager.load(tilesetUrl),
            fetch(mapUrl).then(res => res.json())
        ]);
        
        const data = response as TileMapData;
        return new TileMap(data, tilesetImage);
    }

    isColliding(x: number, y: number): boolean {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        return this.collisionTiles.has(`${tileX},${tileY}`);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const floorLayer = this.data.layers.find(l => l.name === "floor");
        const otherLayers = this.data.layers.filter(l => l.name !== "floor");
        
        if (floorLayer) this.drawLayer(ctx, floorLayer);
        for (const layer of otherLayers) {
            this.drawLayer(ctx, layer);
        }
    }

    drawLayer(ctx: CanvasRenderingContext2D, layer: Layer): void {
        const tilesPerRow = Math.floor(this.tilesetImage.width / this.tileSize);
        
        for (const tile of layer.tiles) {
            const tileId = parseInt(tile.id, 10);
            if (tileId < 0) continue;
            
            const srcX = (tileId % tilesPerRow) * this.tileSize;
            const srcY = Math.floor(tileId / tilesPerRow) * this.tileSize;
            
            const destX = tile.x * this.tileSize;
            const destY = tile.y * this.tileSize;
            
            ctx.drawImage(
                this.tilesetImage,
                srcX, srcY, this.tileSize, this.tileSize,
                destX, destY, this.tileSize, this.tileSize
            );
        }
    }
}

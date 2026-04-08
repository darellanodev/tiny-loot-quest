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

    constructor(data: TileMapData, tilesetImage: HTMLImageElement) {
        this.data = data;
        this.tilesetImage = tilesetImage;
        this.tileSize = data.tileSize;
        this.mapWidth = data.mapWidth;
        this.mapHeight = data.mapHeight;
    }

    static async load(tilesetUrl: string, mapUrl: string, imageManager: ImageManager): Promise<TileMap> {
        const [tilesetImage, response] = await Promise.all([
            imageManager.load(tilesetUrl),
            fetch(mapUrl).then(res => res.json())
        ]);
        
        const data = response as TileMapData;
        return new TileMap(data, tilesetImage);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (const layer of this.data.layers) {
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

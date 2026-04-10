export class ImageManager {
  load(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; 
      img.src = url;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = (e) => {
        reject(e);
      };
    });
  }

  async loadMultiple(urls: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(urls.map((url) => this.load(url)));
  }
}

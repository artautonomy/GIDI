import { Point } from ".";
export type Settings = {
    scale: number;
    threshold: number;
    slices: [number, number];
    indices: [number, number];
    filter: (threshold: number) => (...rgb: number[]) => boolean;
};
export declare class PolygonGenerator {
    vertices: number;
    points: Array<Point>;
    data: {
        areaReduction: number;
    };
    debug: boolean;
    index: Uint32Array;
    positions: Float32Array;
    uv: Float32Array;
    defaultSettings: Settings;
    settings: Settings;
    constructor(img: HTMLImageElement, settings: Partial<Settings>, vertices: number);
    getImageData(img: HTMLImageElement, canvas: HTMLCanvasElement): ImageData;
    /**
     * Iterates over the image and returns an array of points that are over the alpha threshold.
     * It reduces the number of returned points by excluding points that are surrounded by solid pixels.
     *
     * @param img An image element with the image already loaded
     * @param canvas A canvas element to draw the image on in order to get the color values
     * @returns
     */
    getPoints(img: HTMLImageElement, canvas: HTMLCanvasElement): Point[];
}

import { BufferGeometry, DataTexture, Texture } from "three";
type FlipbookData = [
    /**
     * the geometry used to render the flipbook
     */
    BufferGeometry,
    DataTexture,
    Float32Array,
    {
        avg: number;
        min: number;
        max: number;
    }
];
/**
 * Generates geometry data for a given flipbook image.
 */
export declare function createClippedFlipbook(imageOrTexture: HTMLImageElement | Texture, vertices: number, threshold: number, slices: [number, number]): FlipbookData;
export {};

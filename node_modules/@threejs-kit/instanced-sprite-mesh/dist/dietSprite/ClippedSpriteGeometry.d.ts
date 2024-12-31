import { BufferGeometry, Texture } from "three";
type Settings = {
    threshold: number;
    slices: [number, number];
    indices: [number, number];
};
export declare class ClippedSpriteGeometry extends BufferGeometry {
    image: HTMLImageElement;
    vertices: number;
    settings: Settings;
    constructor(imageOrTexture: HTMLImageElement | Texture, vertices?: number, threshold?: number, slices?: [number, number], indices?: [number, number]);
    build(): void;
}
export {};

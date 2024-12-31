import { Texture } from "three";
import { SpritesheetFormat } from "./material";
import { ClippedSpriteGeometry } from "./dietSprite";
type CreateSpritesheetBuildOptions = {
    makeSlimGeometry?: boolean;
    slimOptions?: {
        vertices: number;
        alphaThreshold: number;
    };
};
type AnimationMeta = {
    name: string;
    frameRange: [from: number, to: number];
}[] | string;
export declare const createSpritesheet: () => SpriteBuilder;
declare class SpriteBuilder {
    private animations;
    constructor();
    add(imageUrl: string, config: {
        type: "rowColumn" | "frameSize";
        width: number;
        height: number;
        name?: string;
    }, meta: AnimationMeta): this;
    build(options?: CreateSpritesheetBuildOptions): Promise<{
        spritesheet: SpritesheetFormat;
        texture: Texture;
        geometry?: ClippedSpriteGeometry;
    }>;
}
export {};

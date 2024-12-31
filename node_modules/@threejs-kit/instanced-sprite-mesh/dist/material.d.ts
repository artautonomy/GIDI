import { DataTexture, Material } from "three";
export declare const constructSpriteMaterial: (baseMaterial: Material, triGeometry: boolean | undefined) => Material;
/**
 * wip - basic aseprite json support
 * todo
 * */
export declare const parseAseprite: (json: any) => {
    frames: [x: number, y: number, w: number, h: number][];
    animations: Record<string, [frameId: number, duration: number][]>;
    sheetSize: [w: number, h: number];
    animationLengths: number[];
};
export type SpritesheetFormat = {
    frames: [x: number, y: number, width: number, height: number][];
    animations: Record<string, [frameId: number, duration: number][]>;
    sheetSize: [width: number, height: number];
    animationLengths: number[];
};
export declare const makeDataTexture: (data: SpritesheetFormat) => {
    dataTexture: DataTexture;
    dataWidth: number;
    dataHeight: number;
    animMap: Map<string, number>;
};

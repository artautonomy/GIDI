import type { TransformFactory } from '../types.js';
export interface HSBOptions {
    hue: string;
    saturation: string;
    brightness: string;
}
export declare const hsb: TransformFactory<HSBOptions>;

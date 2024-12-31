import type { TransformOption } from '../types.js';
export declare const fitValues: readonly ["cover", "contain", "fill", "inside", "outside"];
export type FitValue = (typeof fitValues)[number];
export interface FitOptions {
    fit: FitValue;
}
export declare const getFit: TransformOption<FitOptions, FitValue>;

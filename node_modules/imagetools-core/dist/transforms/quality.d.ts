import type { TransformOption } from '../types.js';
export interface QualityOptions {
    quality: string;
}
export declare const getQuality: TransformOption<QualityOptions, number>;

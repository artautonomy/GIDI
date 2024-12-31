import type { TransformFactory } from '../types.js';
export interface NormalizeOptions {
    normalize: '' | 'true';
}
export declare const normalize: TransformFactory<NormalizeOptions>;

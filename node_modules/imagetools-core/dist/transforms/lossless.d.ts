import type { TransformOption } from '../types.js';
export interface LosslessOptions {
    lossless: '' | 'true';
}
export declare const getLossless: TransformOption<LosslessOptions>;

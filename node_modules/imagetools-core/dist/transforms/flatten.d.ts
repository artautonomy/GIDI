import type { TransformFactory } from '../types.js';
export interface FlattenOptions {
    flatten: '' | 'true';
}
export declare const flatten: TransformFactory<FlattenOptions>;

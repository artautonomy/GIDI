import type { TransformFactory } from '../types.js';
import type { FormatEnum } from 'sharp';
export interface FormatOptions {
    format: keyof FormatEnum;
}
export declare const format: TransformFactory<FormatOptions>;

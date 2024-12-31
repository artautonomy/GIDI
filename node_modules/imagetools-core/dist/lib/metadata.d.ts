import type { Sharp } from 'sharp';
import type { ImageMetadata } from '../types.js';
export declare const METADATA: unique symbol;
declare module 'sharp' {
    interface Sharp {
        [METADATA]: ImageMetadata;
    }
}
export declare function setMetadata(image: Sharp, key: string, value: unknown): void;
export declare function getMetadata(image: Sharp, key: string): unknown;

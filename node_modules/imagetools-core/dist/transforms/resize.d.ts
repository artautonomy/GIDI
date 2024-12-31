import type { TransformFactory } from '../types.js';
export interface ResizeOptions {
    /** width in pixels */
    w: string;
    /** height in pixels */
    h: string;
    /** aspect ratio */
    aspect: string;
    /** Whether to allow making images larger. This is generally a waste, so is disabled by default. */
    allowUpscale: '' | 'true';
    /**
     * The width in pixels for the 1x pixel density descriptor.
     * If supplied, output will use pixel density descriptors rather than width descriptors.
     */
    basePixels: string;
}
export declare const resize: TransformFactory<ResizeOptions>;

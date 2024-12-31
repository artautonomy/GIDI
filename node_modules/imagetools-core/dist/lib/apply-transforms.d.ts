import type { Sharp } from 'sharp';
import type { ImageTransformation, TransformResult } from '../types.js';
export declare function applyTransforms(transforms: ImageTransformation[], image: Sharp, removeMetadata?: boolean): Promise<TransformResult>;

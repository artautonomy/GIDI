import type { ImageTransformation, ImageConfig, TransformFactory, Logger } from '../types.js';
export declare function generateTransforms(config: ImageConfig, factories: TransformFactory[], manualSearchParams: URLSearchParams, logger?: Logger): {
    transforms: ImageTransformation[];
    parametersUsed: Set<string>;
};

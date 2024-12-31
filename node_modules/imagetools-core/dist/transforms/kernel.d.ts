import type { TransformOption } from '../types.js';
export declare const kernelValues: readonly ["nearest", "cubic", "mitchell", "lanczos2", "lanczos3"];
export type KernelValue = (typeof kernelValues)[number];
export interface KernelOptions {
    kernel: KernelValue;
}
export declare const getKernel: TransformOption<KernelOptions, KernelValue>;

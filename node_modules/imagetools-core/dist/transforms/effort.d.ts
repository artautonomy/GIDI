import type { TransformOption } from '../types.js';
export interface EffortOptions {
    effort: string;
}
export declare const getEffort: TransformOption<EffortOptions, number>;

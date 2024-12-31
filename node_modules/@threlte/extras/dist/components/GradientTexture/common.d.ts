import type { GradientStop } from './types';
/**
 * applies `gradient` to `context`
 */
export declare const applyGradient: (context: OffscreenCanvasRenderingContext2D, gradient: CanvasGradient) => void;
/**
 * adds each `stop` of `stops` to the gradient
 */
export declare const addStops: (gradient: CanvasGradient, stops?: GradientStop[]) => CanvasGradient;

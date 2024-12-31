import { Vector3, type Vector3Tuple } from 'three';
import type { Readable } from 'svelte/store';
export interface Viewport {
    /** Viewport width in Three.js units */
    width: number;
    /** Viewport height in Three.js units */
    height: number;
    /** size.width / viewport.width */
    factor: number;
    /** Camera distance */
    distance: number;
}
export declare const useViewport: (target?: Vector3 | Vector3Tuple) => Readable<Viewport> & {
    current: Viewport;
};

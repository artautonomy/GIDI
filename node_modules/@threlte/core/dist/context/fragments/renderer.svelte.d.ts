import { type ColorSpace, type Renderer, type ShadowMapType, type ToneMapping } from 'three';
import type { Task } from '../../frame-scheduling';
import { type CurrentWritable } from '../../utilities';
type CreateRenderer<T extends Renderer> = (canvas: HTMLCanvasElement) => T;
type RendererContext = {
    renderer: Renderer;
    colorManagementEnabled: CurrentWritable<boolean>;
    colorSpace: CurrentWritable<ColorSpace>;
    toneMapping: CurrentWritable<ToneMapping>;
    shadows: CurrentWritable<boolean | ShadowMapType>;
    dpr: CurrentWritable<number>;
    autoRenderTask: Task;
};
export type CreateRendererContextOptions<T extends Renderer> = {
    createRenderer?: CreateRenderer<T>;
    /**
     * Colors supplied to three.js — from color pickers, textures, 3D models, and other sources —
     * each have an associated color space. Those not already in the Linear-sRGB working color
     * space must be converted, and textures be given the correct texture.colorSpace assignment.
     *
     * Set to true for certain conversions (for hexadecimal and CSS colors in sRGB) to be made automatically.
     *
     * This property is not reactive and must be enabled before initializing colors.
     *
     * @default true
     */
    colorManagementEnabled?: boolean;
    /**
     * @default 'srgb'
     */
    colorSpace?: ColorSpace;
    /**
     * @default AgXToneMapping
     */
    toneMapping?: ToneMapping;
    /**
     * @default PCFSoftShadowMap
     */
    shadows?: boolean | ShadowMapType;
    /**
     * @default window.devicePixelRatio
     */
    dpr?: number;
};
export declare const createRendererContext: <T extends Renderer>(options: CreateRendererContextOptions<T>) => RendererContext;
export declare const useRenderer: () => RendererContext;
export {};

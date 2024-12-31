import type { Plugin } from 'vite';
import type { VitePluginOptions } from './types.js';
export type { Include, Exclude, DefaultDirectives, ExtendTransforms, ExtendOutputFormats, ResolveConfigs, VitePluginOptions } from './types.js';
export * from 'imagetools-core';
export declare function imagetools(userOptions?: Partial<VitePluginOptions>): Plugin;

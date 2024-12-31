/// <reference types="node" resolution-mode="require"/>
import type { ImageConfig } from 'imagetools-core';
export declare const createBasePath: (base?: string) => string;
export declare function generateImageID(config: ImageConfig, imageHash: string): string;
export declare function hash(keyParts: Array<string | NodeJS.ArrayBufferView>): string;

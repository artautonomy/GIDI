import { useLoader, type UseLoaderLoadInput, type UseLoaderLoadResult, type UseLoaderOptions } from '@threlte/core';
import { TextureLoader } from 'three';
export declare const useTexture: <Input extends UseLoaderLoadInput>(input: Input, options?: UseLoaderOptions<typeof TextureLoader> & Parameters<ReturnType<typeof useLoader<typeof TextureLoader>>["load"]>[1]) => UseLoaderLoadResult<TextureLoader, Input>;

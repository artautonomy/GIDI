import { useLoader, useThrelte } from '@threlte/core';
import { TextureLoader } from 'three';
export const useTexture = (input, options) => {
    const loader = useLoader(TextureLoader, options);
    const { renderer } = useThrelte();
    return loader.load(input, {
        ...options,
        transform: (res) => {
            res.colorSpace = renderer.outputColorSpace;
            res.needsUpdate = true;
            return options?.transform?.(res) ?? res;
        }
    });
};

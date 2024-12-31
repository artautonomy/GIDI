import { getContext, setContext } from 'svelte';
import { Scene } from 'three';
export const createSceneContext = (scene) => {
    const context = { scene: scene || new Scene() };
    setContext('threlte-scene-context', context);
    return context;
};
export const useScene = () => {
    const context = getContext('threlte-scene-context');
    if (!context) {
        throw new Error('useScene can only be used in a child component to <Canvas>.');
    }
    return context;
};

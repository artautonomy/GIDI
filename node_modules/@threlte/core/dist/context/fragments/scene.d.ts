import { Scene } from 'three';
export type SceneContext = {
    scene: Scene;
};
export declare const createSceneContext: (scene?: Scene) => SceneContext;
export declare const useScene: () => SceneContext;

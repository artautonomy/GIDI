import type { Object3D } from 'three';
export type Nodes = Record<string, any>;
export type Materials = Record<string, any>;
export type SceneGraph = {
    nodes: Nodes;
    materials: Materials;
};
export declare const buildSceneGraph: <Graph extends SceneGraph = any>(object: Object3D) => Graph;

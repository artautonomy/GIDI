import { type AsyncWritable } from '@threlte/core';
import type { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import type { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import type { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { type SceneGraph } from '../lib/buildSceneGraph';
import type { ThrelteGltf } from '../types/types';
type UseGltfOptions = {
    dracoLoader?: DRACOLoader;
    meshoptDecoder?: typeof MeshoptDecoder;
    ktx2Loader?: KTX2Loader;
};
export declare function useGltf(options?: UseGltfOptions): {
    load: <Graph extends SceneGraph = {
        nodes: Record<string, any>;
        materials: Record<string, any>;
    }>(url: string) => AsyncWritable<ThrelteGltf<Graph>>;
};
export declare function useGltf<Graph extends SceneGraph = {
    nodes: Record<string, any>;
    materials: Record<string, any>;
}>(url: string, options?: UseGltfOptions): AsyncWritable<ThrelteGltf<Graph>>;
export {};

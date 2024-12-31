import { useLoader } from '@threlte/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { buildSceneGraph } from '../lib/buildSceneGraph';
export function useGltf(urlOrOptions, options) {
    const opts = typeof urlOrOptions === 'string' ? options : urlOrOptions;
    const loader = useLoader(GLTFLoader, {
        extend(loader) {
            if (opts?.dracoLoader) {
                loader.setDRACOLoader(opts.dracoLoader);
            }
            if (opts?.meshoptDecoder) {
                loader.setMeshoptDecoder(opts.meshoptDecoder);
            }
            if (opts?.ktx2Loader) {
                loader.setKTX2Loader(opts.ktx2Loader);
            }
        }
    });
    const load = (url) => {
        return loader.load(url, {
            transform(result) {
                return {
                    ...result,
                    ...buildSceneGraph(result.scene)
                };
            }
        });
    };
    const url = typeof urlOrOptions === 'string' ? urlOrOptions : undefined;
    if (url) {
        return load(url);
    }
    else {
        return {
            load
        };
    }
}

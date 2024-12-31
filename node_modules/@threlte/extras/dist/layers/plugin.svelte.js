import { injectPlugin, isInstanceOf, observe } from '@threlte/core';
import { getContext, setContext } from 'svelte';
export const injectLayersPlugin = () => {
    injectPlugin('layers', (args) => {
        if (!isInstanceOf(args.ref, 'Object3D'))
            return;
        const ctx = getContext('threlte-layers-context');
        const mergedLayers = $derived(args.props.layers ?? ctx?.layers);
        const mergedCtx = $derived(mergedLayers ? { layers: mergedLayers } : undefined);
        setContext('threlte-layers-context', mergedCtx);
        const applyLayers = (ref, layers) => {
            if (layers === 'all') {
                ref.layers.enableAll();
            }
            else if (layers === 'none') {
                ref.layers.disableAll();
            }
            else if (Array.isArray(layers)) {
                for (let index = 0; index < 32; index += 1) {
                    const layerIndex = index;
                    const enabled = layers.includes(layerIndex);
                    if (enabled) {
                        ref.layers.enable(index);
                    }
                    else {
                        ref.layers.disable(index);
                    }
                }
            }
            else if (layers !== undefined) {
                ref.layers.set(layers);
            }
        };
        observe.pre(() => [args.ref, mergedLayers], ([ref, layers]) => {
            if (!isInstanceOf(ref, 'Object3D'))
                return;
            applyLayers(ref, layers);
        });
        return {
            pluginProps: ['layers']
        };
    });
};

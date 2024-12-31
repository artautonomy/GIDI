import { currentWritable, useTask, watch } from '@threlte/core';
import { tick } from 'svelte';
import { derived, writable } from 'svelte/store';
import { AnimationMixer } from 'three';
const isRoot = (value) => !!value?.isObject3D;
const isGltfStore = (value) => !!value?.subscribe && typeof value.subscribe === 'function';
export function useGltfAnimations(rootOrGltf, maybeRoot) {
    const gltf = isGltfStore(rootOrGltf) ? rootOrGltf : writable(undefined);
    const root = currentWritable(isRoot(rootOrGltf) ? rootOrGltf : isRoot(maybeRoot) ? maybeRoot : undefined);
    const actualRoot = derived([root, gltf], ([root, gltf]) => {
        return root ?? gltf?.scene;
    });
    const actions = currentWritable({});
    const mixer = new AnimationMixer(undefined);
    watch([gltf, actualRoot], async ([gltf, actualRoot]) => {
        if (!gltf || !gltf.animations.length || !actualRoot)
            return;
        // we need to wait for the tick in order for the ref and
        // its children to be mounted properly
        await tick();
        // if there's a mixer, we stop all running actions
        const newActions = gltf.animations.reduce((acc, clip) => {
            const action = mixer.clipAction(clip, actualRoot);
            return {
                ...acc,
                [clip.name]: action
            };
        }, {});
        actions.set(newActions);
        return () => {
            Object.values(newActions).forEach((a) => {
                const action = a;
                action.stop();
                mixer.uncacheClip(action.getClip());
            });
        };
    });
    const { start, stop } = useTask((delta) => {
        mixer.update(delta);
    }, { autoStart: false });
    watch(actions, (actions) => {
        if (Object.keys(actions).length)
            start();
        else
            stop();
    });
    return {
        gltf,
        root,
        mixer,
        actions
    };
}

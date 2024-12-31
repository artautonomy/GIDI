import { type CurrentWritable } from '@threlte/core';
import { type Writable } from 'svelte/store';
import { AnimationMixer, type AnimationAction, type Object3D } from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
type UseGltfAnimationsReturnType<Actions> = {
    gltf: Writable<GLTF | undefined>;
    mixer: AnimationMixer;
    actions: CurrentWritable<Actions>;
    root: CurrentWritable<Root | undefined>;
};
type Root = Object3D;
type GltfStore = Writable<GLTF | undefined>;
/**
 * Convenience hook to use animations loaded with a <GLTF> Threlte component.
 *
 * ### Example
 *
 * ```svelte
 * <script lang="ts">
 *   import { GLTF, useGltfAnimations } from '@threlte/extras'
 *
 *   const { gltf, actions } = useGltfAnimations<'All Animations'>()
 *
 *   // play them whenever you need
 *   export const triggerAnimation = () => {
 *     $actions['All Animations']?.play()
 *   }
 * </script>
 *
 * <GLTF url={'/Bengal.glb'} bind:gltf={$gltf} />
 * ```
 * @param callback
 * @returns
 */
export declare function useGltfAnimations<T extends string, Actions extends Partial<Record<T, AnimationAction>> = Partial<Record<T, AnimationAction>>>(root?: Root): UseGltfAnimationsReturnType<Actions>;
export declare function useGltfAnimations<T extends string, Actions extends Partial<Record<T, AnimationAction>> = Partial<Record<T, AnimationAction>>>(gltf: GltfStore, root?: Root): UseGltfAnimationsReturnType<Actions>;
export {};

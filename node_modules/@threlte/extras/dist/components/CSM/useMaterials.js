import { injectPlugin, isInstanceOf } from '@threlte/core';
import { onDestroy, onMount } from 'svelte';
export const useMaterials = () => {
    let setupCallback = undefined;
    const allMaterials = new Set();
    const isSupportedMaterial = (material) => {
        return (isInstanceOf(material, 'MeshStandardMaterial') || isInstanceOf(material, 'MeshPhongMaterial'));
    };
    const addMaterial = (material) => {
        if (allMaterials.has(material))
            return;
        allMaterials.add(material);
        setupCallback?.(material);
    };
    const extractMaterials = (ref) => {
        // first check if it's a material
        if (isSupportedMaterial(ref)) {
            addMaterial(ref);
        }
        // then check if it's a mesh
        else if (isInstanceOf(ref, 'Mesh')) {
            if (Array.isArray(ref.material)) {
                ref.material.forEach((material) => {
                    if (isSupportedMaterial(material)) {
                        addMaterial(material);
                    }
                });
            }
            else {
                if (isSupportedMaterial(ref.material)) {
                    addMaterial(ref.material);
                }
            }
        }
    };
    /**
     * Callback to set up a material for CSM
     */
    const onNewMaterial = (callback) => {
        setupCallback = callback;
    };
    /**
     * Material Management Plugin
     *
     * This plugin extracts materials from meshes and adds them to the materials
     * queue. It will not listen to prop or ref changes.
     */
    injectPlugin('csm', (args) => {
        // we need to wait for mounting since otherwise the meshes probably have
        // default materials applied
        onMount(() => {
            extractMaterials(args.ref);
        });
    });
    onDestroy(() => (setupCallback = undefined));
    return { onNewMaterial, allMaterials };
};

<script lang="ts">import { currentWritable, useTask, useThrelte, watch } from '@threlte/core';
import { onDestroy } from 'svelte';
import { writable } from 'svelte/store';
import { CSM } from 'three/examples/jsm/csm/CSM.js';
import { useMaterials } from './useMaterials';
/**
 * Whether or not CSM is enabled. If `enabled={false}`, a slot named
 * `"disabled"` will be rendered.
 */
export let enabled = true;
/**
 * The arguments to pass to the CSM constructor.
 */
export let args = {};
/**
 * The camera to use for CSM. Defaults to the camera set by `makeDefault`.
 */
export let camera = undefined;
/**
 * A configuration callback, which is triggered when CSM is activated. This
 * callback facilitates advanced configurations, such as enabling the fade
 * feature.
 */
export let configure = undefined;
export let lightIntensity = undefined;
export let lightColor = undefined;
export let lightDirection = [1, -1, 1];
const enabledStore = writable(enabled);
$: enabledStore.set(enabled);
const { camera: defaultCamera, scene, size } = useThrelte();
const csmStore = currentWritable(undefined);
useTask(() => $csmStore?.update(), { autoInvalidate: false });
const { onNewMaterial, allMaterials } = useMaterials();
const disposeCsm = () => {
    $csmStore?.remove();
    $csmStore?.dispose();
    $csmStore = undefined;
};
watch([size, csmStore], ([_, csm]) => {
    if (!csm)
        return;
    csm.updateFrustums();
});
const cameraStore = writable(camera);
$: cameraStore.set(camera);
// set any CSM props that require frustum updates
watch([defaultCamera, cameraStore, csmStore], ([defaultCamera, camera, csm]) => {
    if (!csm)
        return;
    csm.camera = camera ?? defaultCamera;
    if (args.maxFar !== undefined)
        csm.maxFar = args.maxFar;
    if (args.mode !== undefined)
        csm.mode = args.mode;
    csm.updateFrustums();
});
watch(enabledStore, (enabled) => {
    if (enabled) {
        const csm = new CSM({
            camera: camera ?? $defaultCamera,
            parent: scene,
            ...args
        });
        configure?.(csm);
        for (const material of allMaterials) {
            csm.setupMaterial(material);
        }
        onNewMaterial((material) => csm.setupMaterial(material));
        csmStore.set(csm);
    }
    else {
        onNewMaterial(undefined);
        disposeCsm();
    }
});
const lightIntensityStore = writable(lightIntensity);
$: lightIntensityStore.set(lightIntensity);
const lightColorStore = writable(lightColor);
$: lightColorStore.set(lightColor);
watch([csmStore, lightIntensityStore, lightColorStore], ([csm, intensity, color]) => {
    csm?.lights.forEach((light) => {
        if (intensity !== undefined) {
            light.intensity = intensity / Math.PI;
        }
        if (color !== undefined) {
            light.color.set(color);
        }
    });
});
const lightDirectionStore = writable(lightDirection);
$: lightDirectionStore.set(lightDirection);
watch([csmStore, lightDirectionStore], ([csm, direction]) => {
    csm?.lightDirection.set(...direction).normalize();
});
onDestroy(disposeCsm);
</script>

<slot />

{#if !enabled}
  <slot name="disabled" />
{/if}

<script lang="ts">import { createInstanceIdContext } from '../useInstanceId';
import Instance from '../Instance.svelte';
import InnerInstancedMeshes from './InnerInstancedMeshes.svelte';
let { meshes, children, ...props } = $props();
const getInstance = (id) => {
    return (...args) => {
        createInstanceIdContext(id);
        return Instance(...args);
    };
};
const getInstanceComponentsArray = (meshes) => {
    return meshes.filter((mesh) => mesh.isMesh).map((mesh) => getInstance(mesh.uuid));
};
const getInstanceComponentsObject = (meshes) => {
    return Object.entries(meshes).reduce((acc, [id, mesh]) => {
        // filter out non-mesh objects
        if (!mesh.isMesh)
            return acc;
        acc[id] = getInstance(mesh.uuid);
        return acc;
    }, {});
};
let components = $derived(Array.isArray(meshes)
    ? getInstanceComponentsArray(meshes)
    : getInstanceComponentsObject(meshes));
let meshesArray = $derived(Array.isArray(meshes) ? meshes : Object.values(meshes));
let filteredMeshesArray = $derived(meshesArray.filter((mesh) => mesh.isMesh));
</script>

<InnerInstancedMeshes
  meshes={filteredMeshesArray}
  {...props}
>
  {@render children?.({ components })}
</InnerInstancedMeshes>

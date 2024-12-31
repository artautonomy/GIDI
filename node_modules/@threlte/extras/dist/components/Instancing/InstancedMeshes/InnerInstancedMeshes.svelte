<script lang="ts">import InstancedMesh from '../InstancedMesh.svelte';
import Self from './InnerInstancedMeshes.svelte';
let { meshes, index = meshes.length - 1, children, ...props } = $props();
const mesh = meshes[index];
</script>

{#if index > -1}
  <InstancedMesh
    geometry={mesh.geometry}
    material={mesh.material}
    id={mesh.uuid}
    {...props}
  >
    <Self
      {meshes}
      index={index - 1}
      {...props}
    >
      {@render children?.()}
    </Self>
  </InstancedMesh>
{:else}
  {@render children?.()}
{/if}

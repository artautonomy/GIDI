<script lang="ts">import { T, asyncWritable, useLoader } from '@threlte/core';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useSuspense } from '../../suspense/useSuspense';
let { text, font = 'https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json', size, depth, curveSegments, bevelEnabled, bevelThickness, bevelSize, bevelOffset, bevelSegments, smooth, extrudePath, steps, UVGenerator, ref = $bindable(), children, ...props } = $props();
const suspend = useSuspense();
let loadedFont = $derived(suspend(typeof font === 'string'
    ? useLoader(FontLoader).load(font)
    : asyncWritable(new Promise((resolve) => resolve(font)))));
let baseGeometry = $derived.by(() => {
    if (!$loadedFont)
        return;
    return new TextGeometry(text, {
        font: $loadedFont,
        size,
        depth,
        curveSegments,
        bevelEnabled,
        bevelThickness,
        bevelSize,
        bevelOffset,
        bevelSegments,
        extrudePath,
        steps,
        UVGenerator
    });
});
let creasedGeometry = $derived.by(() => {
    if (!baseGeometry)
        return;
    if (smooth === 0)
        return baseGeometry;
    return toCreasedNormals(baseGeometry, smooth);
});
</script>

{#if creasedGeometry}
  <T
    is={creasedGeometry}
    bind:ref
    {...props}
  >
    {@render children?.({ ref: creasedGeometry })}
  </T>
{/if}

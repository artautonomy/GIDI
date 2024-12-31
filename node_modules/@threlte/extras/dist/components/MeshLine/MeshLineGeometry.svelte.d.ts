import type { MeshLineGeometryProps } from './types';
/**
 * A stripped down version of THREE.MeshLine:
 *
 * https://github.com/spite/THREE.MeshLine/blob/master/src/THREE.MeshLine.js
 *
 * With peformance improvements inspired by:
 *
 * https://github.com/lume/three-meshline/blob/main/src/MeshLineGeometry.ts
 */
declare const MeshLineGeometry: import("svelte").Component<MeshLineGeometryProps, {}, "ref">;
export default MeshLineGeometry;

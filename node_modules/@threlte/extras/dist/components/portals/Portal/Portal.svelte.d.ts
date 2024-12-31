import type { Snippet } from 'svelte';
import { Object3D } from 'three';
declare const Portal: import("svelte").Component<{
    id?: string;
    object?: Object3D | undefined;
    children?: Snippet;
}, {}, "">;
export default Portal;

import { type Readable } from 'svelte/store';
import type { Object3D } from 'three';
type ParentObject3DContext = Readable<Object3D>;
export declare const createRootParentObject3DContext: (object: Object3D) => ParentObject3DContext;
/**
 * The parentObject3D context is used to access the parent `THREE.Object3D`
 * created by a `<T>` component. The context is automatically merged with the
 * parentObject3D context of the parent component when the local context store
 * is `undefined`.
 */
export declare const createParentObject3DContext: (object?: Object3D) => import("svelte/store").Writable<Object3D<import("three").Object3DEventMap> | undefined>;
/**
 * The parentObject3D context is used to access the parent `THREE.Object3D`
 * created by a `<T>` component.
 *
 * @example
 * ```svelte
 * <T.Mesh>
 *   <T.MeshStandardMaterial>
 *     <CustomComponent />
 *   </T.MeshStandardMaterial>
 * </T.Mesh>
 * ```
 *
 * The parentObject3D as retrieved inside the component `<CustomComponent>`
 * will be the mesh created by the `<T.Mesh>` component.
 */
export declare const useParentObject3D: () => ParentObject3DContext;
export {};

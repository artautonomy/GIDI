import { getContext, setContext } from 'svelte';
import { derived, readable, writable } from 'svelte/store';
const parentObject3DContextKey = Symbol('threlte-parent-object3d-context');
export const createRootParentObject3DContext = (object) => {
    const ctx = readable(object);
    setContext(parentObject3DContextKey, ctx);
    return ctx;
};
/**
 * The parentObject3D context is used to access the parent `THREE.Object3D`
 * created by a `<T>` component. The context is automatically merged with the
 * parentObject3D context of the parent component when the local context store
 * is `undefined`.
 */
export const createParentObject3DContext = (object) => {
    const parentObject3D = getContext(parentObject3DContextKey);
    const object3D = writable(object);
    const ctx = derived([object3D, parentObject3D], ([object3D, parentObject3D]) => {
        return object3D ?? parentObject3D;
    });
    setContext(parentObject3DContextKey, ctx);
    return object3D;
};
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
export const useParentObject3D = () => {
    return getContext(parentObject3DContextKey);
};

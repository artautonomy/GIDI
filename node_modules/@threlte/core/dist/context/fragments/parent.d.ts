import { type CurrentWritable } from '../../utilities';
type ParentContext = CurrentWritable<unknown>;
/**
 * The parent context is used to access the parent object created by a `<T>`
 * component.
 */
export declare const createParentContext: <T>(parent?: T) => ParentContext;
/**
 * The parent context is used to access the parent object created by a `<T>`
 * component.
 *
 * @example
 * ```svelte
 * <T.Mesh>
 *   <CustomComponent />
 * </T.Mesh>
 * ```
 *
 * The parent as retrieved inside the component `<CustomComponent>`
 * will be the mesh created by the `<T.Mesh>` component.
 */
export declare const useParent: () => ParentContext;
export {};

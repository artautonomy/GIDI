/**
 * ### `resolvePropertyPath`
 *
 * This function resolves a property path to a target object and the property
 * key. The property path can include dots to indicate nested objects.
 *
 *  ```ts
 * const object = { position: { x: 0 } }
 * const { target, key } = resolvePropertyPath(object, 'position.x')
 *
 * // target is { x: 0 }
 * // key is 'x'
 * ```
 */
export declare const resolvePropertyPath: (target: any, propertyPath: string) => {
    target: any;
    key: string;
};

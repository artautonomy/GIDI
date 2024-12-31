/**
 * Check if an object is an instance of a given THREE class. Can be used as a
 * type guard and as an alternative to `instanceof` which is prone to error and
 * slower. It uses the `isFoo` property that THREE classes have to determine if
 * an object is of a particular class.
 *
 * @example
 * ```ts
 * const obj = new THREE.Object3D()
 * isInstanceOf(obj, 'Object3D') // true
 * ```
 *
 * @param obj - The object to check.
 * @param type - The class name to check against.
 * @returns `true` if the object is an instance of the class, `false` otherwise.
 */
export const isInstanceOf = (obj, type) => {
    return obj?.[`is${type}`] === true;
};

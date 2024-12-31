import { useThrelte } from '../../../context/compounds/useThrelte';
import { resolvePropertyPath } from '../../../utilities';
const ignoredProps = new Set(['$$scope', '$$slots', 'type', 'args', 'attach', 'instance']);
const updateProjectionMatrixKeys = new Set([
    'fov',
    'aspect',
    'near',
    'far',
    'left',
    'right',
    'top',
    'bottom',
    'zoom'
]);
/**
 * Only scalar values are memoized, objects and arrays are considered
 * non-equa by default, to ensure reactivity works as you would
 * expect in svelte.
 * @param value
 * @returns
 */
export const memoizeProp = (value) => {
    // scalar values are memoized
    if (typeof value === 'string')
        return true;
    if (typeof value === 'number')
        return true;
    if (typeof value === 'boolean')
        return true;
    if (typeof value === 'undefined')
        return true;
    if (value === null)
        return true;
    // objects and arrays cannot be reliably memoized
    return false;
};
const createSetter = (target, key, value) => {
    if (!Array.isArray(value) &&
        typeof value === 'number' &&
        typeof target[key]?.setScalar === 'function' &&
        // colors do have a setScalar function, but we don't want to use it, because
        // the hex notation (i.e. 0xff0000) is very popular and matches the number
        // type. So we exclude colors here.
        !target[key]?.isColor) {
        // edge case of setScalar setters
        return (target, key, value) => {
            target[key].setScalar(value);
        };
    }
    else {
        if (typeof target[key]?.set === 'function') {
            // if the property has a "set" function, we can use it
            if (Array.isArray(value)) {
                return (target, key, value) => {
                    target[key].set(...value);
                };
            }
            else {
                return (target, key, value) => {
                    target[key].set(value);
                };
            }
        }
        else {
            // otherwise, we just set the value
            return (target, key, value) => {
                target[key] = value;
            };
        }
    }
};
export const useProps = () => {
    const { invalidate } = useThrelte();
    const memoizedProps = new Map();
    const memoizedSetters = new Map();
    const setProp = (instance, propertyPath, value, options) => {
        if (memoizeProp(value)) {
            const memoizedProp = memoizedProps.get(propertyPath);
            if (memoizedProp && memoizedProp.instance === instance && memoizedProp.value === value) {
                return;
            }
            memoizedProps.set(propertyPath, {
                instance,
                value
            });
        }
        const { key, target } = resolvePropertyPath(instance, propertyPath);
        if (value !== undefined && value !== null) {
            const memoizedSetter = memoizedSetters.get(propertyPath);
            if (memoizedSetter) {
                memoizedSetter(target, key, value);
            }
            else {
                const setter = createSetter(target, key, value);
                memoizedSetters.set(propertyPath, setter);
                setter(target, key, value);
            }
        }
        else {
            createSetter(target, key, value)(target, key, value);
        }
        if (options.manualCamera)
            return;
        if (updateProjectionMatrixKeys.has(key) &&
            (target.isPerspectiveCamera || target.isOrthographicCamera)) {
            target.updateProjectionMatrix();
        }
    };
    const updateProp = (instance, key, value, options) => {
        if (!ignoredProps.has(key) && !options.pluginsProps?.includes(key)) {
            setProp(instance, key, value, options);
        }
        invalidate();
    };
    return {
        updateProp
    };
};

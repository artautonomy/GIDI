import { writable } from 'svelte/store';
/**
 * ### `currentWritable`
 *
 * A writable store that also has a `current` property that is updated synchronously.
 * For use in non-reactive contexts e.g. loops where unwrapping a store every frame is expensive.
 *
 * ```ts
 * const store = currentWritable(0)
 *
 * useTask(() => {
 * 	console.log(store.current) // 0
 * })
 *
 * @param value
 * @returns
 */
export const currentWritable = (value) => {
    const store = writable(value);
    const extendedWritable = {
        set: (value) => {
            extendedWritable.current = value;
            store.set(value);
        },
        subscribe: store.subscribe,
        update: (fn) => {
            const newValue = fn(extendedWritable.current);
            extendedWritable.current = newValue;
            store.set(newValue);
        },
        current: value
    };
    return extendedWritable;
};
export const toCurrentReadable = (store) => {
    return {
        subscribe: store.subscribe,
        get current() {
            return store.current;
        }
    };
};

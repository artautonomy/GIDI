import { type Readable, type Writable } from 'svelte/store';
export type CurrentWritable<T = unknown> = Writable<T> & {
    current: T;
};
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
export declare const currentWritable: <T>(value: T) => CurrentWritable<T>;
export type CurrentReadable<T = unknown> = Readable<T> & {
    current: T;
};
export declare const toCurrentReadable: <T>(store: CurrentWritable<T>) => CurrentReadable<T>;

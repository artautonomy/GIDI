import type { Readable } from 'svelte/store';
import type { CurrentWritable } from '@threlte/core';
export type CurrentReadable<T = unknown> = Readable<T> & {
    current: T;
};
export declare const toCurrentReadable: <T>(store: CurrentWritable<T>) => CurrentReadable<T>;

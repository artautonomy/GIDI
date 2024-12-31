import { type Readable } from 'svelte/store';
export type SuspenseContext = {
    suspend: (promise: Promise<unknown>) => void;
    suspended: Readable<boolean>;
    onComponentDestroy: (promise: Promise<unknown>) => void;
};
export declare const suspenseContextIdentifier: unique symbol;
export declare const createSuspenseContext: (options?: {
    final?: boolean;
}) => {
    promises: import("@threlte/core").CurrentWritable<Set<Promise<unknown>>>;
    suspended: Readable<boolean>;
    errors: Readable<Error[]>;
    setFinal: (final?: boolean) => void;
};

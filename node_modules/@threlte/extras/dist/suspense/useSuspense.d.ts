import { type Writable } from 'svelte/store';
type Suspend = <T extends Promise<unknown>>(promise: T) => T;
/**
 * This hook is used to suspend the component until the promise is resolved.
 * It also works outside the boundaries of the <Suspense> component.
 */
export declare const useSuspense: () => Suspend & {
    suspended: Writable<boolean>;
};
export {};

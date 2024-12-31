import { currentWritable } from '@threlte/core';
import { setContext } from 'svelte';
import { derived, writable } from 'svelte/store';
export const suspenseContextIdentifier = Symbol('THRELTE_SUSPENSE_CONTEXT_IDENTIFIER');
export const createSuspenseContext = (options) => {
    /**
     * This set contains all the promises that are currently being suspended.
     */
    const promises = currentWritable(new Set());
    /**
     * This map contains all the errors that were thrown during the suspension.
     */
    const errors = currentWritable(new Map());
    const finalized = writable(false);
    const checkFinalized = () => {
        if (promises.current.size === 0 && errors.current.size === 0)
            finalized.set(true);
    };
    const finalStore = writable(options?.final ?? false);
    const addPromise = (promise) => {
        promises.update((set) => {
            set.add(promise);
            return set;
        });
    };
    const removePromise = (promise) => {
        promises.update((set) => {
            set.delete(promise);
            return set;
        });
    };
    const addError = (promise, error) => {
        errors.update((map) => {
            map.set(promise, error);
            return map;
        });
    };
    const removeError = (promise) => {
        errors.update((map) => {
            map.delete(promise);
            return map;
        });
    };
    /**
     * A Suspense component is suspending its children if it has any pending
     * promises or errors.
     * "suspended" means that the default slot is not rendered.
     * If the final prop is set to true, the Suspense component will not
     * suspend its children once all promises are resolved and all errors are
     * handled.
     */
    const suspended = derived([promises, errors, finalStore, finalized], ([promises, errors, final, finalized]) => {
        if (final && finalized) {
            // if the suspense settled *once*, it will never suspend again.
            return false;
        }
        else if (errors.size > 0) {
            // suspense if there are errors
            return true;
        }
        else {
            // suspense if there are pending promises
            return promises.size > 0;
        }
    });
    const context = {
        suspend(promise) {
            addPromise(promise);
            promise
                .catch((error) => {
                addError(promise, error);
            })
                .finally(() => {
                removePromise(promise);
                checkFinalized();
            });
        },
        onComponentDestroy(promise) {
            removePromise(promise);
            removeError(promise);
            checkFinalized();
        },
        suspended
    };
    const errorsArray = derived(errors, (errors) => Array.from(errors.values()));
    setContext(suspenseContextIdentifier, context);
    return {
        promises,
        suspended,
        errors: errorsArray,
        setFinal: (final) => finalStore.set(final ?? false)
    };
};

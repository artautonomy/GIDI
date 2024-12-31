import { getContext, onDestroy, setContext } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import { useDisposal } from '../../../context/fragments/disposal';
import { isInstanceOf, watch } from '../../../utilities';
const contextName = Symbol('threlte-disposable-object-context');
/**
 * Checks if the given object is a disposable object. Scenes are not disposable.
 * @param object - The object to check.
 * @returns True if the object is a disposable object, false otherwise.
 */
const isDisposableObject = (object) => {
    return typeof object?.dispose === 'function' && !isInstanceOf(object, 'Scene');
};
export const useDispose = (dispose) => {
    let previousRef = undefined;
    const currentRef = writable(undefined);
    const localDispose = writable(dispose);
    const { disposableObjectMounted, disposableObjectUnmounted, removeObjectFromDisposal } = useDisposal();
    const parentDispose = getContext(contextName);
    // We merge the local dispose with the parent dispose. If the parent dispose
    // is not set, we use true as default.
    const mergedDispose = derived([localDispose, parentDispose ?? writable(true)], ([localDispose, parentDispose]) => localDispose ?? parentDispose ?? true);
    setContext(contextName, mergedDispose);
    watch([currentRef, mergedDispose], ([ref, mergedDispose]) => {
        if (ref === previousRef) {
            // dispose changed
            if (!mergedDispose) {
                // disposal is no longer enabled, so we need to deregister the previous ref
                if (previousRef)
                    removeObjectFromDisposal(previousRef);
            }
            else {
                // disposal is enabled, so we need to register the previous ref
                if (previousRef)
                    disposableObjectMounted(previousRef);
            }
        }
        else {
            // ref changed
            if (mergedDispose) {
                // we're disposing the old ref
                if (previousRef)
                    disposableObjectUnmounted(previousRef);
                // and registering the new ref
                if (ref)
                    disposableObjectMounted(ref);
            }
        }
        previousRef = ref;
    });
    onDestroy(() => {
        if (!get(mergedDispose))
            return;
        const ref = get(currentRef);
        if (ref)
            disposableObjectUnmounted(ref);
    });
    const updateRef = (ref) => {
        if (!isDisposableObject(ref))
            return;
        currentRef.set(ref);
    };
    const updateDispose = (dispose) => {
        localDispose.set(dispose);
    };
    return {
        updateRef,
        updateDispose
    };
};

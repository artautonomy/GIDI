import { onDestroy, onMount } from 'svelte';
export const useCreateEvent = (oncreate) => {
    let cleanupFunction;
    let ref = undefined;
    let mounted = false;
    const dispatchCreateEvent = () => {
        cleanupFunction?.();
        cleanupFunction = oncreate?.(ref);
    };
    const updateRef = (newRef) => {
        ref = newRef;
        if (!mounted)
            return;
        dispatchCreateEvent();
    };
    onMount(() => {
        dispatchCreateEvent();
        mounted = true;
    });
    onDestroy(() => cleanupFunction?.());
    return {
        updateRef
    };
};

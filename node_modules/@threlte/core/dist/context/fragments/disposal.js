import { getContext, onDestroy, setContext, tick } from 'svelte';
export const createDisposalContext = () => {
    const context = {
        removeObjectFromDisposal: (object) => {
            context.disposableObjects.delete(object);
        },
        disposableObjectMounted: (object) => {
            const currentValue = context.disposableObjects.get(object);
            if (currentValue) {
                context.disposableObjects.set(object, currentValue + 1);
            }
            else {
                context.disposableObjects.set(object, 1);
            }
        },
        disposableObjectUnmounted: (object) => {
            const currentValue = context.disposableObjects.get(object);
            if (currentValue && currentValue > 0) {
                context.disposableObjects.set(object, currentValue - 1);
                if (currentValue - 1 <= 0) {
                    context.shouldDispose = true;
                }
            }
        },
        disposableObjects: new Map(),
        shouldDispose: false,
        dispose: async (force = false) => {
            await tick();
            if (!context.shouldDispose && !force)
                return;
            context.disposableObjects.forEach((mounted, object) => {
                if (mounted === 0 || force) {
                    object?.dispose?.();
                    context.disposableObjects.delete(object);
                }
            });
            context.shouldDispose = false;
        }
    };
    onDestroy(() => {
        context.dispose(true);
    });
    setContext('threlte-disposal-context', context);
    return context;
};
export const useDisposal = () => {
    const context = getContext('threlte-disposal-context');
    if (!context) {
        throw new Error('useDisposal can only be used in a child component to <Canvas>.');
    }
    return context;
};

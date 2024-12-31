export type DisposableObject = {
    dispose: () => void;
};
export type DisposalContext = {
    /**
     * Dispose objects, happens automatically as part of a task.
     * @param force - Force disposal
     */
    dispose: (force?: boolean) => void;
    /** Register an object that should be disposed at the end of its lifecycle,
     * effectivly incrementing the mount count. */
    disposableObjectMounted: (object: DisposableObject) => void;
    /** Mark an object as unmounted, effectivly decrementing the mount count. If
     * the mount count is 0, the object will be disposed. */
    disposableObjectUnmounted: (object: DisposableObject) => void;
    /** Remove an object from the disposal context */
    removeObjectFromDisposal: (object: DisposableObject) => void;
    /** Objects that *can* be disposed */
    disposableObjects: Map<DisposableObject, number>;
    shouldDispose: boolean;
};
export declare const createDisposalContext: () => DisposalContext;
export declare const useDisposal: () => DisposalContext;

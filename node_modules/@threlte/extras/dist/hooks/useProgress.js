import { currentWritable } from '@threlte/core';
import { DefaultLoadingManager } from 'three';
import { toCurrentReadable } from '../lib/storeUtils';
let previousTotalLoaded = 0;
const finishedOnce = currentWritable(false);
const activeStore = currentWritable(false);
const itemStore = currentWritable(undefined);
const loadedStore = currentWritable(0);
const totalStore = currentWritable(0);
const errorsStore = currentWritable([]);
const progressStore = currentWritable(0);
const { onStart, onLoad, onError } = DefaultLoadingManager;
DefaultLoadingManager.onStart = (url, loaded, total) => {
    onStart?.(url, loaded, total);
    activeStore.set(true);
    itemStore.set(url);
    loadedStore.set(loaded);
    totalStore.set(total);
    const progress = (loaded - previousTotalLoaded) / (total - previousTotalLoaded);
    progressStore.set(progress);
    if (progress === 1)
        finishedOnce.set(true);
};
DefaultLoadingManager.onLoad = () => {
    onLoad?.();
    activeStore.set(false);
};
DefaultLoadingManager.onError = (url) => {
    onError?.(url);
    errorsStore.update((errors) => {
        return [...errors, url];
    });
};
DefaultLoadingManager.onProgress = (url, loaded, total) => {
    if (loaded === total) {
        previousTotalLoaded = total;
    }
    activeStore.set(true);
    itemStore.set(url);
    loadedStore.set(loaded);
    totalStore.set(total);
    const progress = (loaded - previousTotalLoaded) / (total - previousTotalLoaded) || 1;
    progressStore.set(progress);
    if (progress === 1)
        finishedOnce.set(true);
};
const stores = {
    active: toCurrentReadable(activeStore),
    item: toCurrentReadable(itemStore),
    loaded: toCurrentReadable(loadedStore),
    total: toCurrentReadable(totalStore),
    errors: toCurrentReadable(errorsStore),
    progress: toCurrentReadable(progressStore),
    finishedOnce: toCurrentReadable(finishedOnce)
};
export const useProgress = () => {
    return stores;
};

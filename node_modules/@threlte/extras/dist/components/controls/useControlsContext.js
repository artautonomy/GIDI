import { useThrelteUserContext } from '@threlte/core';
import { writable } from 'svelte/store';
/**
 * ### `useControlsContext`
 *
 * This hook is used to register the `OrbitControls` or `TrackballControls instance
 * with the `ControlsContext`. We're using this context to enable and disable the
 * controls when the user is interacting with the TransformControls.
 */
export const useControlsContext = () => {
    return useThrelteUserContext('threlte-controls', {
        orbitControls: writable(undefined),
        trackballControls: writable(undefined)
    });
};

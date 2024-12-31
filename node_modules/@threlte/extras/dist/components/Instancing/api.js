import { getContext, setContext } from 'svelte';
import { currentWritable } from '@threlte/core';
const getContextId = (instancedMeshId) => `threlte-instanced-mesh-${instancedMeshId}`;
export const createApi = (instancedMesh, instancedMeshId) => {
    const api = {
        instancedMesh: currentWritable(instancedMesh),
        addInstance(instance) {
            api.instances.update((arr) => {
                arr.push(instance);
                return arr;
            });
        },
        removeInstance(instance) {
            api.instances.update((arr) => {
                const index = arr.indexOf(instance);
                if (index > -1)
                    arr.splice(index, 1);
                return arr;
            });
        },
        instances: currentWritable([])
    };
    setContext(getContextId(instancedMeshId), api);
    return api;
};
export const useApi = (instancedMeshId) => {
    const context = getContext(getContextId(instancedMeshId));
    if (!context)
        throw new Error(`No <InstancedMesh> component found for id ${instancedMeshId}`);
    return context;
};

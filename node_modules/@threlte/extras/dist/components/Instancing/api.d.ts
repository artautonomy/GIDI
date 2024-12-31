import type { InstancedMesh } from 'three';
import type { PositionMesh } from './PositionMesh';
import { type CurrentWritable } from '@threlte/core';
type InstancedMeshContext = {
    instancedMesh: CurrentWritable<InstancedMesh>;
    instances: CurrentWritable<PositionMesh[]>;
    addInstance: (instance: PositionMesh) => void;
    removeInstance: (instance: PositionMesh) => void;
};
export declare const createApi: (instancedMesh: InstancedMesh, instancedMeshId: string) => InstancedMeshContext;
export declare const useApi: (instancedMeshId: string) => InstancedMeshContext;
export {};

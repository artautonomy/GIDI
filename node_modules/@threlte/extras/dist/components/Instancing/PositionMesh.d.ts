import { type CurrentWritable } from '@threlte/core';
import { BufferGeometry, Color, Group, Raycaster, type InstancedMesh, type Intersection } from 'three';
export declare class PositionMesh extends Group {
    color: Color;
    instancedMesh: CurrentWritable<InstancedMesh | undefined>;
    instances: CurrentWritable<PositionMesh[]>;
    constructor(instancedMesh: CurrentWritable<InstancedMesh>, instances: CurrentWritable<PositionMesh[]>);
    get geometry(): BufferGeometry | undefined;
    raycast(raycaster: Raycaster, intersects: Intersection[]): void;
}

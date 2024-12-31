import { type CurrentWritable } from '@threlte/core';
import { Vector2, Raycaster, type Object3D, type Intersection } from 'three';
import type { IntersectionEvent, DomEvent } from './types';
export type FilterFunction = (items: Intersection[], context: InteractivityContext) => Intersection[];
export type ComputeFunction = (event: DomEvent, context: InteractivityContext) => void;
export type InteractivityOptions = {
    enabled?: boolean;
    /**
     * The compute function is responsible for updating the state of the interactivity plugin.
     * It needs to set up the raycaster and the pointer vector. If no compute function is provided,
     * the plugin will use the default compute function.
     */
    compute?: ComputeFunction;
    target?: HTMLElement;
    /**
     * The filter function is responsible for filtering and sorting the
     * intersections. By default, the intersections are sorted by distance. If no
     * filter function is provided, the plugin will use the default filter function.
     */
    filter?: FilterFunction;
};
type Events = Record<string, (arg: unknown) => void>;
export type InteractivityContext = {
    enabled: CurrentWritable<boolean>;
    target: CurrentWritable<HTMLElement | undefined>;
    pointer: CurrentWritable<Vector2>;
    pointerOverTarget: CurrentWritable<boolean>;
    lastEvent: DomEvent | undefined;
    raycaster: Raycaster;
    initialClick: [x: number, y: number];
    initialHits: Object3D[];
    hovered: Map<string, IntersectionEvent<DomEvent>>;
    interactiveObjects: Object3D[];
    handlers: WeakMap<Object3D, Events>;
    compute: ComputeFunction;
    filter?: FilterFunction;
    addInteractiveObject: (object: Object3D, events: Events) => void;
    removeInteractiveObject: (object: Object3D) => void;
};
export declare const getInteractivityContext: () => InteractivityContext;
export declare const setInteractivityContext: (options?: InteractivityOptions) => InteractivityContext;
export declare const useInteractivity: () => InteractivityContext;
export {};

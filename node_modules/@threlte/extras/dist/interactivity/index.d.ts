import { type InteractivityOptions } from './context';
declare const interactivity: (options?: InteractivityOptions) => import("./context").InteractivityContext;
export { useInteractivity } from './context';
export type { DomEvent, Intersection, IntersectionEvent, ThrelteEvents as EventMap, InteractivityProps } from './types';
export { interactivity };

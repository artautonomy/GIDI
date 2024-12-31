import { Camera, Matrix4, Object3D, OrthographicCamera, PerspectiveCamera, Raycaster, Vector3 } from 'three';
export declare const defaultCalculatePosition: (obj: Object3D, camera: Camera, size: {
    width: number;
    height: number;
}) => [number, number];
export declare const isObjectBehindCamera: (el: Object3D, camera: Camera) => boolean;
export declare const isObjectVisible: (el: Object3D, camera: Camera, raycaster: Raycaster, occlude: Object3D[]) => boolean;
export declare const objectScale: (el: Object3D, camera: Camera) => number;
export declare const objectZIndex: (el: Object3D, camera: OrthographicCamera | PerspectiveCamera, zIndexRange: Array<number>) => number | undefined;
export declare const epsilon: (value: number) => number;
export declare const getCSSMatrix: (mat4: Matrix4, m: number[], prepend?: string) => string;
export declare const getCameraCSSMatrix: (matrix: Matrix4) => string;
export declare const getObjectCSSMatrix: (matrix: Matrix4, factor: number) => string;
export declare const getViewportFactor: (camera: Camera, target: Vector3, size: {
    width: number;
    height: number;
}) => number;

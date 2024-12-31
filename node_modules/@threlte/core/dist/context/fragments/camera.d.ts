import { type Camera } from 'three';
import { type CurrentWritable } from '../../utilities';
type CameraContext = {
    camera: CurrentWritable<Camera>;
};
export declare const createCameraContext: () => CameraContext;
export declare const useCamera: () => CameraContext;
export {};

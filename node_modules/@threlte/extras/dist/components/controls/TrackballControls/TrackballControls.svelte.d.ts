import type { TrackballControlsProps } from './types';
/**
 * `<TrackballControls>` allow the camera to orbit freely around a target
 * without causing gimbal lock. This type of camera controller is commonly used
 * when the concepts of up and down are less important than the ability to
 * carefully inspect a model from every angle.
 *
 * For an alternative camera controller, see
 * [`<OrbitControls>`](https://threlte.xyz/docs/reference/extras/orbit-controls).
 *
 * The component `<TrackballControls>` must be a direct child of a camera
 * component and will mount itself to that camera. By default, damping is
 * enabled. You can disable this by setting `staticMoving` to true.
 *
 * ## Usage
 *
 * ```svelte
 * <script>
 * import { TrackballControls } from '@threlte/extras'
 * import { T } from '@threlte/core'
 * </script>
 *
 * <T.PerspectiveCamera
 * makeDefault
 * fov={50}
 * >
 * <TrackballControls />
 * </T.PerspectiveCamera>
 * ```
 *
 * `<TrackballControls>` is a light wrapper that will use its parent as the target camera and the DOM element the renderer is rendering to as the DOM element to listen to. It will also by demand invalidate the frame loop.
 */
declare const TrackballControls: import("svelte").Component<TrackballControlsProps, {}, "ref">;
export default TrackballControls;

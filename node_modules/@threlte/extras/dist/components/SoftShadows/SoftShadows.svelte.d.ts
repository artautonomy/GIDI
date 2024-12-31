/**
 * This component injects Percentage-Closer Soft Shadows (PCSS) into
 * Three.js' shader chunk. Mounting and unmounting this component will lead to
 * all shaders being be re-compiled, although it will only cause overhead if
 * `<SoftShadows>` is mounted after the scene has already rendered, if it mounts
 * with everything else in your scene shaders will compile naturally.
 */
declare const SoftShadows: import("svelte").Component<{
    /** Size of the light source (the larger the softer the light), default: 25 */
    size?: number;
    /** Depth focus, use it to shift the focal point (where the shadow is the sharpest), default: 0 (the beginning) */
    focus?: number;
    /** Number of samples (more samples less noise but more expensive), default: 10 */
    samples?: number;
}, {}, "">;
export default SoftShadows;

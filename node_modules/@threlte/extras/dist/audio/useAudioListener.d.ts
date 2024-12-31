import type { AudioListener } from 'three';
/**
 * Convenience Hook to get a THREE.AudioListener
 * @param id
 */
export declare function useAudioListener(id?: string): {
    listener: AudioListener;
    context: AudioContext;
};
/**
 * Convenience hook to operate on a requested THREE.AudioListener and return
 * a dependency such as a filter.
 * ### Example
 * ```
 * const filter = useAudioListener(({ listener, context }) => {
 *   return context.createBiquadFilter()
 * })
 * ```
 * @param callback
 * @param id
 */
export declare function useAudioListener<T>(callback: (args: {
    listener: AudioListener;
    context: AudioContext;
}) => T, id?: string): T;

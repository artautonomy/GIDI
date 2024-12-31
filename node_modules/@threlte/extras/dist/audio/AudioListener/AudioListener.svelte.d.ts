import type { AudioListenerProps } from './types';
declare const AudioListener: import("svelte").Component<AudioListenerProps, {
    audioContext: AudioContext;
    resumeContext: () => Promise<void>;
}, "ref">;
export default AudioListener;

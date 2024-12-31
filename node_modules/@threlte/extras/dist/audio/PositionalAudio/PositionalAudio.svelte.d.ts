import { PositionalAudio as ThreePositionalAudio } from 'three';
import type { PositionalAudioProps } from './types';
declare const PositionalAudio: import("svelte").Component<PositionalAudioProps, {
    pause: () => ThreePositionalAudio | import("three").Audio<GainNode>;
    play: (delay?: number) => Promise<ThreePositionalAudio | import("three").Audio<GainNode> | undefined>;
    stop: () => ThreePositionalAudio | import("three").Audio<GainNode>;
}, "ref">;
export default PositionalAudio;

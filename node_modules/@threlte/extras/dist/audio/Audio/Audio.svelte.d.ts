import { Audio as ThreeAudio } from 'three';
import type { AudioProps } from './types';
declare const Audio: import("svelte").Component<AudioProps, {
    pause: () => import("three").PositionalAudio | ThreeAudio<GainNode>;
    play: (delay?: number) => Promise<import("three").PositionalAudio | ThreeAudio<GainNode> | undefined>;
    stop: () => import("three").PositionalAudio | ThreeAudio<GainNode>;
}, "ref">;
export default Audio;

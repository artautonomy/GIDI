import { type Audio, type PositionalAudio } from 'three';
type AudioSource = string | AudioBuffer | HTMLMediaElement | AudioBufferSourceNode | MediaStream;
type AudioVolume = number | undefined;
type AudioPlaybackRate = number | undefined;
export type AudioProps = {
    src: AudioSource;
    autoplay?: boolean;
    loop?: boolean;
    volume?: AudioVolume;
    playbackRate?: AudioPlaybackRate;
    detune?: number;
};
export type AudioEvents = {
    load: AudioBuffer | void;
    progress: ProgressEvent<EventTarget>;
    error: ErrorEvent;
};
/**
 * This hook handles basic audio functionality.
 * It’s used by the <Audio> and <PositionalAudio> components.
 */
export declare const useAudio: <T extends Audio<GainNode> | PositionalAudio>(audio: T, props?: Record<string, (arg?: unknown) => void>) => {
    setVolume: (volume: AudioProps["volume"]) => void;
    setSrc: (source: AudioProps["src"]) => Promise<void>;
    setPlaybackRate: (playbackRate: AudioProps["playbackRate"]) => void;
    setAutoPlay: (value?: AudioProps["autoplay"]) => void;
    setDetune: (value?: AudioProps["detune"]) => void;
    setLoop: (value?: AudioProps["loop"]) => void;
    play: (delay?: number) => Promise<PositionalAudio | Audio<GainNode> | undefined>;
    pause: () => PositionalAudio | Audio<GainNode>;
    stop: () => PositionalAudio | Audio<GainNode>;
};
export {};

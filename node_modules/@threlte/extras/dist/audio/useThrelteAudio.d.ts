import type { AudioListener } from 'three';
export type ThrelteAudioContext = {
    audioListeners: Map<string, AudioListener>;
    getAudioListener: (id?: string) => AudioListener | undefined;
    addAudioListener: (listener: AudioListener, id?: string) => void;
    removeAudioListener: (id?: string) => void;
};
export declare function useThrelteAudio(): ThrelteAudioContext;

import { useThrelteUserContext } from '@threlte/core';
const audioListeners = new Map();
const audioCtx = {
    audioListeners,
    addAudioListener: (listener, id = 'default') => {
        if (audioListeners.has(id)) {
            console.warn(`An AudioListener with the id "${id}" has already been added, aborting.`);
            return;
        }
        audioListeners.set(id, listener);
    },
    removeAudioListener: (id = 'default') => {
        if (!audioListeners.has(id)) {
            console.warn(`No AudioListener with the id "${id}" found, aborting.`);
            return;
        }
        audioListeners.delete(id);
    },
    getAudioListener: (id = 'default') => {
        if (!audioListeners.has(id)) {
            console.warn(`No AudioListener with the id "${id}" found, aborting.`);
            return;
        }
        return audioListeners.get(id);
    }
};
export function useThrelteAudio() {
    return useThrelteUserContext('threlte-audio', audioCtx);
}

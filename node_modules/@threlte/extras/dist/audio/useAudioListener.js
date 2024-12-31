import { useThrelteAudio } from './useThrelteAudio';
export function useAudioListener(callbackOrId, id) {
    const { getAudioListener } = useThrelteAudio();
    if (typeof callbackOrId === 'function') {
        const listener = getAudioListener(id);
        if (!listener)
            throw new Error('No AudioListener found.');
        return callbackOrId({
            listener,
            context: listener.context
        });
    }
    const listener = getAudioListener(callbackOrId);
    if (!listener)
        throw new Error('No AudioListener found.');
    return {
        listener,
        context: listener.context
    };
}

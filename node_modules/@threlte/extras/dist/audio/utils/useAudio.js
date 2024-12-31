import { currentWritable, useLoader, watch } from '@threlte/core';
import { onDestroy } from 'svelte';
import { AudioLoader } from 'three';
/**
 * This hook handles basic audio functionality.
 * It’s used by the <Audio> and <PositionalAudio> components.
 */
export const useAudio = (audio, props = {}) => {
    const loaded = currentWritable(false);
    const autoplay = currentWritable(false);
    const shouldPlay = currentWritable(false);
    let audioDestroyed = false;
    const loader = useLoader(AudioLoader);
    const setSrc = async (source) => {
        loaded.set(false);
        try {
            if (typeof source === 'string') {
                const audioBuffer = await loader.load(source, {
                    onProgress(event) {
                        props.onprogress?.(event);
                    }
                });
                audio.setBuffer(audioBuffer);
            }
            else if (source instanceof AudioBuffer) {
                audio.setBuffer(source);
            }
            else if (source instanceof HTMLMediaElement) {
                audio.setMediaElementSource(source);
            }
            else if (source instanceof AudioBufferSourceNode) {
                audio.setNodeSource(source);
            }
            else if (source instanceof MediaStream) {
                audio.setMediaStreamSource(source);
            }
            loaded.set(true);
            audio.buffer ? props.onload?.(audio.buffer) : props.onload?.();
        }
        catch (error) {
            props.onerror?.(error);
        }
    };
    const setVolume = (volume) => {
        audio.setVolume(volume ?? 1);
    };
    const setPlaybackRate = (playbackRate) => {
        audio.setPlaybackRate(playbackRate ?? 1);
    };
    const play = async (delay) => {
        // source is not loaded yet, so we should play it after it's loaded
        if (!loaded.current) {
            shouldPlay.set(true);
            return;
        }
        if (audio.context.state !== 'running') {
            await audio.context.resume();
            if (audioDestroyed) {
                return;
            }
        }
        return audio.play(delay);
    };
    const pause = () => {
        return audio.pause();
    };
    const stop = () => {
        if (!audio.source)
            return audio;
        return audio.stop();
    };
    const setAutoPlay = (value) => {
        autoplay.set(value ?? false);
    };
    const setDetune = (value) => {
        if (audio.source && audio.detune) {
            audio.setDetune(value ?? 0);
        }
    };
    const setLoop = (value) => {
        audio.setLoop(value ?? false);
    };
    watch([loaded, autoplay, shouldPlay], ([loaded, autoplay, shouldPlay]) => {
        if (!loaded) {
            if (audio.isPlaying)
                stop();
            return;
        }
        if (autoplay || shouldPlay) {
            play();
        }
    });
    onDestroy(() => {
        try {
            audioDestroyed = true;
            stop();
        }
        catch (error) {
            console.warn('Error while destroying audio', error);
        }
    });
    return {
        setVolume,
        setSrc,
        setPlaybackRate,
        setAutoPlay,
        setDetune,
        setLoop,
        play,
        pause,
        stop
    };
};

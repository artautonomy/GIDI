<script lang="ts">import { T } from '@threlte/core';
import { onDestroy } from 'svelte';
import { AudioListener as ThreeAudioListener } from 'three';
import { useThrelteAudio } from '../useThrelteAudio';
let { id, masterVolume, ref = $bindable(), children, ...props } = $props();
const listener = new ThreeAudioListener();
export const audioContext = listener.context;
export const resumeContext = () => listener.context.resume();
$effect.pre(() => {
    if (masterVolume !== undefined) {
        listener.setMasterVolume(masterVolume);
    }
});
const { addAudioListener, removeAudioListener } = useThrelteAudio();
addAudioListener(listener, id);
onDestroy(() => {
    removeAudioListener(id);
});
</script>

<T
  is={listener}
  bind:ref
  {...props}
>
  {@render children?.({ ref: listener })}
</T>

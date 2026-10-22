
import { writable } from "svelte/store";

export interface MIDIPlaybackState {
  pitches: number[];
  activeVelocities: Record<number, number>;
}

export const MIDIPlayback = writable<MIDIPlaybackState>({
  pitches: [],
  activeVelocities: {},
});

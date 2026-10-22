import { writable } from "svelte/store";

export const midiFileData = writable<ArrayBuffer | null>(null);
export const midiFileName = writable<string>("");
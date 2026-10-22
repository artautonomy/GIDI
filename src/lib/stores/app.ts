import { writable } from "svelte/store";

export const midiFileData = writable<ArrayBuffer | null>(null);
export const midiFileName = writable<string>("");

export const fadeIn = writable({ duration: 1000, delay: 500 });
export const fadeOut = writable({duration: 200 });
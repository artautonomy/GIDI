import { writable } from "svelte/store";

export interface MIDIMessage {
    note: number;
    velocity: number;
    position: {
        x: number;
        y: number;
        z: number;
    };
    scale: {
        x: number;
        y: number;
        z: number;
    };
}


interface Device {
    connected: boolean;
    id: string | null;
}

type Channel = {
    setting: number | null;
    id: number;
    value: number;
};

interface Channels {
    inputs: Channel[];
}

export const MIDI = writable<MIDIMessage[]>([]);

export const Device = writable<Device>({
    connected: false,
    id: null
});

export function storeMIDIPermission(data: string) {
    const accessRights = writable(data);

    accessRights.subscribe((value) => {
        localStorage.content = value;
    });
}

export const MIDIChannels = writable<Channels>({
    inputs: [],
});
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

type DeviceInput = {
    id: string;
    name: string;
    velocity: number;
};

interface Device {
    enableSearch: boolean;
    connected: boolean;
    selected: boolean;
    id: string | null;
    inputs: DeviceInput[];
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
    enableSearch: false,
    connected: false,
    selected: false,
    id: null,
    inputs: [],
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
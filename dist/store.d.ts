type MIDIMessage = {
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
};
export declare let MIDI: import("svelte/store").Writable<MIDIMessage[]>;
export declare let Settings: import("svelte/store").Writable<{
    page: string;
    scene: string;
    edit: boolean;
    styleReset: boolean;
    remap: boolean;
    font: string;
    orbitControls: boolean;
    zoom: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    attack: number;
    release: number;
    colours: {
        background: {
            r: number;
            g: number;
            b: number;
        };
        key: {
            r: number;
            g: number;
            b: number;
        };
        expression: {
            r: number;
            g: number;
            b: number;
        };
    };
    lighting: {
        above: number;
        front: number;
        side: number;
    };
}>;
export {};

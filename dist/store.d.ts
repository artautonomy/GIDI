type Messages = {
    note: number;
    velocity: number;
};
export declare let MIDI: import("svelte/store").Writable<Messages[]>;
export declare let Settings: import("svelte/store").Writable<{
    edit: boolean;
    reset: boolean;
    scene: string;
    font: string;
    orbitControls: boolean;
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
}>;
export {};

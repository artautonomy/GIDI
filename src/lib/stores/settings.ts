import { writable } from "svelte/store";


export const Settings = writable({
    edit: false,
    styleReset: false,
    font: "/fonts/Oxanium-Regular.ttf",
    zoom: true,
    menuSelected: "",
    sceneSelected: "Piano",
    notes: {
        styles: ["Piano", "Firework", "Mirror", "Swirl", "Cube"],
        colours: {
            key: {
                r: 255,
                g: 255,
                b: 255,
            },
            expression: {
                r: 145,
                g: 197,
                b: 77,
            },
        },
        attack: 35,
        release: 666,
        remap: false,
    },
    scene: {
        colours: {
            background: {
                r: 15,
                g: 15,
                b: 40,
            },
        },
        lighting: {
            above: 1.6,
            front: 0.5,
            side: 1,
        },
        gizmo: true,
    },
    camera: {
        autoRotate: {
            enabled: true,
            speed: 1.1,
        },
        sequence: {
            triggers: ["Note down", "Time interval"],
            selected: "Note down",
            recording: false,
            playing: false,
            speed: 500,
            reset: false,
        },
    },
});

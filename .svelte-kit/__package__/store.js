import { writable } from "svelte/store";
export let MIDI = writable([]);
export let Settings = writable({
    edit: false,
    reset: false,
    scene: 'Cube',
    font: "/fonts/Oxanium-Regular.ttf",
    orbitControls: false,
    autoRotate: true,
    autoRotateSpeed: 2,
    attack: 20,
    release: 750,
    colours: {
        background: {
            r: 4,
            g: 2,
            b: 25
        },
        key: {
            r: 222,
            g: 177,
            b: 22
        },
        expression: {
            r: 222,
            g: 66,
            b: 11
        },
    },
});

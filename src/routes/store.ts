import { writable } from "svelte/store";

type Messages = { note: number; velocity: number }

export let MIDI = writable<Messages[]>([]);

export let Settings = writable({

    edit: false,
    scene : 'Cube',
    font: "src/lib/assets/fonts/Oxanium-Regular.ttf",
    orbitControls: false,
    autoRotate: true,
    autoRotateSpeed: 1,
    attack: 40,
    release: 500,
    colours: {
        background: {

            r: 0,
            g: 0,
            b: 39
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
    
    
})

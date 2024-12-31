import { writable } from "svelte/store";

type Messages = { note: number; velocity: number }

export let MIDI = writable<Messages[]>([]);

export let Settings = writable({

    scene : 'Cube',
    orbitControls: false,
    autoRotate: true,
    autoRotateSpeed: 1,
    attack: 40,
    release: 500,
    colours: {
        background: {

            r: 27,
            g: 11,
            b: 40
        },
        key: {

            r: 122,
            g: 5,
            b: 122
        },
        expression: {

            r: 1,
            g: 23,
            b: 211
        }

    }
    
})

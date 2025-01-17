import { writable } from "svelte/store";

type MIDIMessage = { note: number; velocity: number }

export let MIDI = writable<MIDIMessage[]>([]);

export let Settings = writable({

    page: 'home',
    scene : 'Cube',
    edit: false,
    reset: false,
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

            r: 192,
            g: 147,
            b: 0
        },
        expression: {

            r: 202,
            g: 44,
            b: 0
        },
        

    },
    lighting: {

        above: 0.5,
        front: 2.5,
        side: 0.5
    }
    
    
})

import { writable } from "svelte/store";

interface MIDIMessage { 
    note: number; 
    velocity: number, 
    position: {
        x:number,
        y:number,
        z:number
    },
    scale: {
        x:number,
        y:number,
        z:number
    }
}

interface Device {
    connected: boolean;
    inputs: WebMidi.MIDIInput[];
}

export let MIDI = writable<MIDIMessage[]>([]);

export let Device = writable<Device>({
    connected: false,
    inputs: [], // Now TypeScript knows this is an array of WebMidi.MIDIInput
  });

export let Settings = writable({

   
    page: 'home',
    scene : 'Piano',
    edit: false,
    styleReset: false,
    remap: false,
    font: "/fonts/Oxanium-Regular.ttf",
    orbitControls: false,
    zoom: true,
    autoRotate: true,
    autoRotateSpeed: 1.1,
    attack: 10,
    release: 500,
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

        above: 1,
        front: 1,
        side: 3
    }
})

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
    accessRights: string;
    connected: boolean;
    inputs: [{id:string,name:string,velocity:number}];
    input: {id:string};
}

export let MIDI = writable<MIDIMessage[]>([]);

export let Device = writable<Device>({
    accessRights: "",
    connected: false,
    inputs: [{
        id: "",
        name: "",
        velocity: 0
    }], 
    input: {
        id: "",
    }
});

export let Settings = writable({

    edit: false,
    styleReset: false,
    font: "/fonts/Oxanium-Regular.ttf",
    orbitControls: false,
    zoom: true,
    sceneSelected: 'Piano',
    notes: {
        styles: ["Piano", "Firework", "Mirror","Swirl", "Cube"],
        colours: {
            key: {

                r: 225,
                g: 226,
                b: 245
            },
            expression: {

                r: 145,
                g: 197,
                b: 77
            }
        },
        attack: 5,
        release: 500,
        remap: false,

        
    },
    scene: {
        colours: {
            background: {

                r: 4,
                g: 2,
                b: 25
            }
        },
        lighting: {

            above: 2.5,
            front: 1,
            side: 3
        },
        autoRotate: true,
        autoRotateSpeed: 1.1,

    },
    record: {
        triggers: ["Note down", "Time"],
        selectedTrigger: "Note down",
        enabled: false,
        playback: false,
        reset: false,
        speed: 500
    }
})

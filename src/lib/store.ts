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

type DeviceInput = { id: string; name: string; velocity: number };

type Channel = { setting: string | null; id: number; value: number };

interface Device {
    enableSearch: boolean;
    connected: boolean;
    selected: boolean;
    id: string | null;
    inputs: DeviceInput[];
}

interface Channels{
    inputs: Channel[];
}

export let MIDI = writable<MIDIMessage[]>([]);

export let Device = writable<Device>({
    enableSearch: false,
    connected: false,
    selected: false,
    id:null,
    inputs: [] as DeviceInput[], 
    
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

                r: 255,
                g: 255,
                b: 255
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

            above: 1.6,
            front: 0.5,
            side: 1
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
            reset: false
        }
    }
})

export let Map = writable<Channels>({

    inputs: [] as Channel[]
    
});

export function storeMIDIPermission(data: string) {

   const accessRights = writable(data);

   accessRights.subscribe((value) => localStorage.content = value)
   
}
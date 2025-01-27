interface Props {
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
    velocity: number;
    attack: number;
    release: number;
    keyColour: {
        r: number;
        g: number;
        b: number;
    };
    expressionColour: {
        r: number;
        g: number;
        b: number;
    };
}
declare const Cube: import("svelte").Component<Props, {}, "">;
type Cube = ReturnType<typeof Cube>;
export default Cube;

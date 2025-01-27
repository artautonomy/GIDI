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
declare const Piano: import("svelte").Component<Props, {}, "">;
type Piano = ReturnType<typeof Piano>;
export default Piano;

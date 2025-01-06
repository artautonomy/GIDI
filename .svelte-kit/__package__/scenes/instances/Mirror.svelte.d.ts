interface Props {
    x: number;
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
declare const Mirror: import("svelte").Component<Props, {}, "">;
type Mirror = ReturnType<typeof Mirror>;
export default Mirror;

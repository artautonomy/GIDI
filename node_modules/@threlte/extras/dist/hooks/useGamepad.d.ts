type UseGamepadOptions = {
    /** The threshold value of any axis before change events are fired. Default is 0.05. */
    axisDeadzone?: number;
    /** An optional gamepad index, if multiple gamepads are used. */
    index?: number;
    xr?: never;
    hand?: never;
} | {
    /** The threshold value of any axis before change events are fired. Default is 0.05. */
    axisDeadzone?: number;
    xr: true;
    hand: 'left' | 'right';
};
declare const standardButtons: readonly ["clusterBottom", "clusterRight", "clusterLeft", "clusterTop", "leftBumper", "rightBumper", "leftTrigger", "rightTrigger", "select", "start", "leftStickButton", "rightStickButton", "directionalTop", "directionalBottom", "directionalLeft", "directionalRight", "center"];
declare const xrButtons: readonly ["trigger", "squeeze", "touchpadButton", "thumbstickButton", "clusterBottom", "clusterTop"];
declare const standardAxes: readonly ["leftStick", "rightStick"];
declare const xrAxes: readonly ["touchpad", "thumbstick"];
declare const gamepadEvents: readonly ["change", "press", "down", "up", "touch", "touchstart", "touchend"];
type StandardGamepadEvents = (typeof gamepadEvents)[number];
type StandardGamepadButtons = (typeof standardButtons)[number];
type StandardGamepadAxes = (typeof standardAxes)[number];
type XRGamepadButtons = (typeof xrButtons)[number];
type XRGamepadAxes = (typeof xrAxes)[number];
export type StandardGamepadEvent = {
    type: StandardGamepadEvents;
    target: StandardGamepadButtons;
    value: number;
} | {
    type: StandardGamepadEvents;
    target: XRGamepadButtons;
    value: number;
} | {
    type: 'change';
    target: StandardGamepadAxes;
    value: {
        x: number;
        y: number;
    };
} | {
    type: 'change';
    target: XRGamepadAxes;
    value: {
        x: number;
        y: number;
    };
};
type Fn = (event: StandardGamepadEvent) => void;
type Events = {
    [K in StandardGamepadEvents]?: Fn[];
};
declare const createXrStandard: (allEvents: Events, events: Events[]) => {
    on: (name: StandardGamepadEvents, fn: Fn) => () => void;
    off: (name: StandardGamepadEvents, fn: Fn) => void;
    /** The Gamepad connection status */
    connected: import("@threlte/core").CurrentWritable<boolean>;
    /** The raw Gamepad object */
    raw: Gamepad | null;
    /** buttons[0] - Primary trigger */
    trigger: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[1] - Primary squeeze button */
    squeeze: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[2] - Primary touchpad */
    touchpadButton: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[3] - Primary thumbstick */
    thumbstickButton: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[4] - Bottom cluster button */
    clusterBottom: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[5] - Top cluster button */
    clusterTop: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** axes[0], axes[1] - Horizontal / vertical axis for the primary touchpad */
    touchpad: {
        x: number;
        y: number;
        on: (name: "change", fn: Fn) => () => void;
        off: (name: "change", fn: Fn) => void;
    };
    /** axes[2], axes[3] - Horizontal / vertical axis for the primary thumbstick */
    thumbstick: {
        x: number;
        y: number;
        on: (name: "change", fn: Fn) => () => void;
        off: (name: "change", fn: Fn) => void;
    };
};
declare const createStandard: (allEvents: Events, events: Events[]) => {
    on: (name: StandardGamepadEvents, fn: Fn) => () => void;
    off: (name: StandardGamepadEvents, fn: Fn) => void;
    /** The Gamepad connection status */
    connected: import("@threlte/core").CurrentWritable<boolean>;
    /** The raw Gamepad object */
    raw: Gamepad | null;
    /** buttons[0] - Botton button in right cluster */
    clusterBottom: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[1] - Right button in right cluster */
    clusterRight: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[2] - Left button in right cluster */
    clusterLeft: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[3] - Top button in right cluster */
    clusterTop: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[4] - Top left front button */
    leftBumper: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[5] - Top right front button */
    rightBumper: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[6] - Bottom left front button */
    leftTrigger: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[7] - Bottom right front button */
    rightTrigger: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[8] - Left button in center cluster */
    select: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[9] - Right button in center cluster */
    start: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[10] - Left stick pressed button */
    leftStickButton: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[11] -	Right stick pressed button */
    rightStickButton: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[12] -	Top button in left cluster */
    directionalTop: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[13] -	Bottom button in left cluster */
    directionalBottom: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[14] -	Left button in left cluster */
    directionalLeft: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[15] -	Right button in left cluster */
    directionalRight: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** buttons[16] -	Center button in center cluster */
    center: {
        pressed: boolean;
        touched: boolean;
        value: number;
        on: (name: StandardGamepadEvents, fn: Fn) => () => void;
        off: (name: StandardGamepadEvents, fn: Fn) => void;
    };
    /** axes[0], axes[1] - Horizontal / vertical axis for left stick (negative left/positive right) */
    leftStick: {
        x: number;
        y: number;
        on: (name: "change", fn: Fn) => () => void;
        off: (name: "change", fn: Fn) => void;
    };
    /** axes[2], axes[3] - Horizontal / vertical axis for right stick (negative left/positive right) */
    rightStick: {
        x: number;
        y: number;
        on: (name: "change", fn: Fn) => () => void;
        off: (name: "change", fn: Fn) => void;
    };
};
type StandardGamepad = ReturnType<typeof createStandard>;
type StandardXRGamepad = ReturnType<typeof createXrStandard>;
export declare function useGamepad(): StandardGamepad;
export declare function useGamepad(options: UseGamepadOptions & {
    xr?: never;
}): StandardGamepad;
export declare function useGamepad(options: UseGamepadOptions & {
    xr: true;
}): StandardXRGamepad;
export {};

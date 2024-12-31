export type PerfMonitorProps = {
    /**
     * Dom element to which stats block will be attached to.
     * @default `document.body`
     */
    domElement?: HTMLElement;
    /**
     * Refresh rate of the logs
     * @default 10
     */
    logsPerSecond?: number;
    /**
     * Toggles cpu/gpu/fps graphs rendering
     * @default true
     */
    showGraph?: boolean;
    /**
     * Toggles memory info visiblity (geometries, textures, shaders)
     * @default true
     */
    memory?: boolean;
    /**
     * Toggles stats collection.
     * @default true
     */
    enabled?: boolean;
    /**
     * Toggles visibility of the monitor html element. Setting `false` does not stop collection of the stats.
     * @default true
     */
    visible?: boolean;
    /**
     * If set and given characters are typed in the the tab window, the three-perf dev gui will be shown. Disabled by default (empty string).
     * @default ""
     */
    actionToCallUI?: string;
    /**
     * Toggles Three-perf dev gui visiblity.
     * @default false
     */
    guiVisible?: boolean;
    /**
     * Stats block background opacity level.
     * @default 0.7
     */
    backgroundOpacity?: number;
    /**
     * Scale of the stats block html element.
     * @default 1
     */
    scale?: number;
    /**
     * Stats html element horizontal anchor.
     * @default "left"
     */
    anchorX?: 'left' | 'right';
    /**
     * Stats html element vertical anchor.
     * @default "top"
     */
    anchorY?: 'top' | 'bottom';
};

import { Pane } from 'tweakpane';
import { Mesh, WebGLRenderer } from 'three';
import { ThreePerfUI } from './ui/UI';
import { IGLLogger, ILogger, IProgramsPerfs } from './helpers/Types';
interface IThreePerfProps {
    renderer: THREE.WebGLRenderer;
    domElement: HTMLElement;
    overClock?: boolean;
    logsPerSecond?: number;
    deepAnalyze?: boolean;
    anchorX?: 'left' | 'right';
    anchorY?: 'top' | 'bottom';
    showGraph?: boolean;
    scale?: number;
    memory?: boolean;
    enabled?: boolean;
    visible?: boolean;
    actionToCallUI?: string;
    guiVisible?: boolean;
    backgroundOpacity?: number;
}
export declare class ThreePerf {
    gui: Pane;
    guiFolder: any;
    ui: ThreePerfUI;
    private perfEngine;
    deepAnalyze: boolean;
    log: any;
    paused: boolean;
    overclockingFps: boolean;
    fpsLimit: number;
    startTime: number;
    triggerProgramsUpdate: number;
    customData: number;
    accumulated: {
        totalFrames: number;
        log: ILogger;
        gl: IGLLogger;
        max: {
            log: ILogger;
            gl: IGLLogger;
        };
    };
    chart: {
        data: {
            [index: string]: number[];
        };
        circularId: number;
    };
    infos: {
        version: string;
        renderer: string;
        vendor: string;
    };
    gl: WebGLRenderer;
    programs: IProgramsPerfs;
    objectWithMaterials: Mesh[];
    renderPassesNumber: number;
    threeRenderer: WebGLRenderer;
    private _anchorX;
    private _anchorY;
    private _showGraph;
    private _memory;
    private _scale;
    private _visible;
    private _enabled;
    private _keypressed;
    private _guiVisible;
    actionToCallUI: string;
    private rendererRender;
    constructor(props: IThreePerfProps);
    begin(): void;
    end(): void;
    dispose(): void;
    private keypressHandler;
    private afterRender;
    get enabled(): boolean;
    set enabled(value: boolean);
    get visible(): boolean;
    set visible(value: boolean);
    get guiVisible(): boolean;
    set guiVisible(value: boolean);
    get anchorX(): 'left' | 'right';
    set anchorX(value: 'left' | 'right');
    get anchorY(): 'top' | 'bottom';
    set anchorY(value: 'top' | 'bottom');
    get showGraph(): boolean;
    set showGraph(value: boolean);
    get memory(): boolean;
    set memory(value: boolean);
    get scale(): number;
    set scale(value: number);
    get logsPerSecond(): number;
    set logsPerSecond(value: number);
    get backgroundOpacity(): number;
    set backgroundOpacity(value: number);
}
export {};

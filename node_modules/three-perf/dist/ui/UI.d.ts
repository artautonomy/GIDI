import { ThreePerf } from 'three-perf/ThreePerf';
export declare class ThreePerfUI {
    canvas: HTMLCanvasElement;
    wrapper: HTMLElement;
    private _perf;
    private _basicInfoElements;
    private _memInfoElements;
    private _charts;
    private _renderer;
    private _scene;
    private _camera;
    private _width;
    private _height;
    _backgroundOpacity: number;
    constructor(props: {
        perf: ThreePerf;
        domElement: HTMLElement;
        backgroundOpacity?: number;
    });
    setScale(value: number): void;
    initCanvas(): void;
    update(): void;
    private render;
    dispose(): void;
    toggleVisibility(value: boolean): void;
    toggleCharts(value: boolean): void;
    toggleMemoryInfo(value: boolean): void;
    setBackgroundOpacity(value: number): void;
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
}

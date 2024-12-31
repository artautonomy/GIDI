import { ThreePerf } from 'three-perf/ThreePerf';
import { IChart, ILogsAccums } from './helpers/Types';
declare global {
    interface Window {
        GLPerf: any;
    }
    interface Performance {
        memory: any;
    }
}
export declare const overLimitFps: {
    value: number;
    fpsLimit: number;
    isOverLimit: number;
};
export declare class GLPerf {
    names: string[];
    finished: any[];
    gl: WebGL2RenderingContext;
    extension: any;
    query: any;
    paused: boolean;
    overClock: boolean;
    queryHasResult: boolean;
    queryCreated: boolean;
    isWebGL2: boolean;
    memAccums: number[];
    gpuAccums: number[];
    activeAccums: boolean[];
    logsAccums: ILogsAccums;
    fpsChart: number[];
    gpuChart: number[];
    cpuChart: number[];
    memChart: number[];
    paramLogger: any;
    glFinish: any;
    chartLogger: any;
    chartLen: number;
    logsPerSecond: number;
    maxMemory: number;
    chartHz: number;
    startCpuProfiling: boolean;
    lastCalculateFixed: number;
    chartFrame: number;
    gpuTimeProcess: number;
    chartTime: number;
    activeQueries: number;
    circularId: number;
    detected: number;
    frameId: number;
    rafId: number;
    idleCbId: number;
    checkQueryId: number;
    uuid: string | undefined;
    currentCpu: number;
    currentMem: number;
    paramFrame: number;
    paramTime: number;
    now: any;
    t0: number;
    trackGPU: boolean;
    perf: ThreePerf;
    constructor(settings: {
        paramLogger: (logger: any) => void;
        chartLogger: (chart: IChart) => void;
        perf: ThreePerf;
        gl: WebGL2RenderingContext;
        trackGPU: boolean;
        overClock: boolean;
        chartLen?: any;
        chartHz?: any;
        logsPerSecond: number;
    });
    private initGpu;
    /**
     * 120hz device detection
     */
    private is120hz;
    /**
     * Explicit UI add
     * @param { string | undefined } name
     */
    private addUI;
    nextFps: (d: any) => void;
    /**
     * Increase frameID
     * @param { any | undefined } now
     */
    nextFrame: (now: any) => void;
    private startGpu;
    private endGpu;
    /**
     * Begin named measurement
     * @param { string | undefined } name
     */
    begin(name: string): void;
    /**
     * End named measure
     * @param { string | undefined } name
     */
    end(name: string): void;
    private updateAccums;
}

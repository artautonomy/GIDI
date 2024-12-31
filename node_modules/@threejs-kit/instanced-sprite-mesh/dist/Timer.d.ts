export declare class Timer {
    private _previousTime;
    private _currentTime;
    private _startTime;
    private _delta;
    private _elapsed;
    private _timescale;
    private _useFixedDelta;
    private _fixedDelta;
    private _usePageVisibilityAPI;
    private _pageVisibilityHandler;
    constructor();
    disableFixedDelta(): this;
    dispose(): this;
    enableFixedDelta(): this;
    getDelta(): number;
    getElapsed(): number;
    getFixedDelta(): number;
    getTimescale(): number;
    reset(): this;
    setFixedDelta(fixedDelta: number): this;
    setTimescale(timescale: number): this;
    update(): this;
}

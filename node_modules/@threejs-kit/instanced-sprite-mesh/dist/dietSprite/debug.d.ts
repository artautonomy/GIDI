import { Point } from ".";
export declare function styleCanvas(canvas: HTMLCanvasElement, width: number, height: number): void;
export declare function drawConvexHull(convexHull: Array<{
    x: number;
    y: number;
}>, canvas: HTMLCanvasElement, color?: string): void;
export declare function drawPoints(points: Point[], canvas: HTMLCanvasElement, offset?: number[]): void;
export declare function drawPoint(point: {
    x: number;
    y: number;
}, canvas: HTMLCanvasElement): void;
export declare function drawOriginalRect(canvas: HTMLCanvasElement): void;
export declare function drawGrid(canvas: HTMLCanvasElement, width: number, height: number): void;

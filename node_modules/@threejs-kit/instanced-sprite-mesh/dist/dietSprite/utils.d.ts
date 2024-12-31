import { Point } from ".";
export declare function fillBuffer(count: number, point: number[]): Float32Array;
export declare function addAxis(buffer: Float32Array, size: number, valueGenerator?: (j: number) => number): Float32Array;
export declare function createBufferFromListOfPoints(points: Point[]): Float32Array;
export declare function getUVsFromPositions(positions: Float32Array, horizontalSlices: number, verticalSlices: number, horizontalIndex: number, verticalIndex: number): Float32Array;
/**
 * @param i
 * @param width
 * @param height
 * @returns array of neighbouring points indices
 */
export declare function getNeighbours(i: number, width: number, height: number): (number | null)[];

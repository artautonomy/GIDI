import { Point } from ".";
export declare function calculateIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point;
export declare function calcPolygonArea(vertices: Array<{
    x: number;
    y: number;
}>): number;
/**
 *
 * A simple algorithm to simplify a convex hull to a defined number of points.
 * It works by going through all existing edges and collapsing the one that adds the lowest possible area to the hull.
 * Given vertices A B C D:
 * - build the triangle created by the intersection of AB and CD (A') and BC.
 * - calculate its area
 * - check if it is the smallest possible area
 *
 * Once the smallest triangle has been found, remove the BC edge and add the new A' vertex to the hull.
 * Repeat until the desired number of vertices is reached.
 *
 * The simplified polygon will still include all the original vertices - something we can't guarantee
 * by just using polyline simplification
 *
 * @param convexHull A list of points representing a convexHull polyline.
 * @param desiredNumberOfPoints The number of points after simplification
 * @returns
 */
export declare function simplifyConvexHull(convexHull: Point[], desiredNumberOfPoints?: number): Point[];
export declare namespace convexhull {
    function makeHull<P extends Point>(points: Readonly<Array<P>>): Array<P>;
    function makeHullPresorted<P extends Point>(points: Readonly<Array<P>>): Array<P>;
    function POINT_COMPARATOR(a: Point, b: Point): number;
}

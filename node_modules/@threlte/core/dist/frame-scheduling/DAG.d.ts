import { type Emitter } from 'mitt';
export type Key = string | symbol;
export type AddNodeOptions<T> = {
    before?: (Key | T) | (Key | T)[];
    after?: (Key | T) | (Key | T)[];
};
type Events<T> = {
    'node:added': {
        key: Key;
        value: T;
        type: 'isolated' | 'connected';
    };
    'node:removed': {
        key: Key;
        type: 'isolated' | 'connected';
    };
};
export declare class DAG<T extends {
    key: Key;
}> {
    private allVertices;
    /** Nodes that are fully unlinked */
    private isolatedVertices;
    private connectedVertices;
    private sortedConnectedValues;
    private needsSort;
    private emitter;
    private emit;
    on: Emitter<Events<T>>['on'];
    off: Emitter<Events<T>>['off'];
    protected get sortedVertices(): T[];
    private moveToIsolated;
    private moveToConnected;
    private getKey;
    protected add(key: Key, value: T, options?: AddNodeOptions<T>): void;
    protected remove(key: Key | T): void;
    protected mapNodes<U>(callback: (value: T, index: number) => U): U[];
    protected forEachNode(callback: (value: T, index: number) => void): void;
    protected getValueByKey(key: Key): T | undefined;
    protected getKeyByValue(value: T): Key | undefined;
    private sort;
    protected clear(): void;
    static isKey(value: any): value is Key;
    static isValue<T extends {
        key: Key;
    }>(value: any): value is T;
}
export {};

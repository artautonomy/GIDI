import { DAG, type AddNodeOptions, type Key } from './DAG';
import type { Scheduler } from './Scheduler';
import { Task, type TaskCallback } from './Task';
/**
 * A Stage is a collection of steps. The steps are run in a topological sort
 * order.
 */
export declare class Stage extends DAG<Task> {
    readonly key: Key;
    readonly scheduler: Scheduler;
    private runTask;
    stop(): void;
    start(): void;
    get tasks(): Task[];
    private callback;
    constructor(scheduler: Scheduler, key: Key, callback?: (delta: number, run: (deltaOverride?: number) => void) => void);
    createTask(key: Key, callback: TaskCallback, options?: AddNodeOptions<Task>): Task;
    getTask(key: Key): Task | undefined;
    removeTask: (key: Key | Task) => void;
    run(delta: number): void;
    runWithTiming(delta: number): Record<Key, number>;
    getSchedule(): string[];
}

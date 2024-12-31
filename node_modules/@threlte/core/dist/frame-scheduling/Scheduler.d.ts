import { DAG, type AddNodeOptions, type Key } from './DAG';
import { Stage } from './Stage';
export type Schedule = ReturnType<Scheduler['getSchedule']>;
export type CreateStageOptions = {
    callback?: (delta: number, runTasks: (deltaOverride?: number) => void) => void;
} & AddNodeOptions<Stage>;
/**
 * A Scheduler is responsible for running stages. It runs the stages in a
 * requestAnimationFrame stage.
 */
export declare class Scheduler extends DAG<Stage> {
    private lastTime;
    private clampDeltaTo;
    get stages(): Stage[];
    constructor(options?: {
        clampDeltaTo?: number;
    });
    createStage(key: Key, options?: CreateStageOptions): Stage;
    getStage(key: Key): Stage | undefined;
    removeStage: (key: Key | Stage) => void;
    /**
     * Runs all the stages in the scheduler.
     *
     * @param time The time in milliseconds since the start of the program.
     */
    run(time: number): void;
    runWithTiming(time: number): {
        total: number;
        stages: {
            [key: string]: {
                duration: number;
                tasks: Record<Key, number>;
            };
        };
    };
    getSchedule(include?: {
        tasks?: boolean;
    }): {
        stages: {
            tasks: string[] | undefined;
            key: string;
        }[];
    };
    dispose(): void;
}

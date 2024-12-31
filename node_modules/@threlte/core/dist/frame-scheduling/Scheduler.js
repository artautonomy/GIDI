import { DAG } from './DAG';
import { Stage } from './Stage';
/**
 * A Scheduler is responsible for running stages. It runs the stages in a
 * requestAnimationFrame stage.
 */
export class Scheduler extends DAG {
    lastTime = performance.now();
    clampDeltaTo = 0.1;
    get stages() {
        return this.sortedVertices;
    }
    constructor(options) {
        super();
        if (options?.clampDeltaTo)
            this.clampDeltaTo = options.clampDeltaTo;
        this.run = this.run.bind(this);
    }
    createStage(key, options) {
        const stage = new Stage(this, key, options?.callback);
        this.add(key, stage, {
            after: options?.after,
            before: options?.before
        });
        return stage;
    }
    getStage(key) {
        return this.getValueByKey(key);
    }
    removeStage = this.remove.bind(this);
    /**
     * Runs all the stages in the scheduler.
     *
     * @param time The time in milliseconds since the start of the program.
     */
    run(time) {
        const delta = time - this.lastTime;
        this.forEachNode((stage) => {
            // we pass the delta as seconds, not milliseconds,
            // this is in line with how Three.js, Unity and
            // other game engines do it. On top of that, it
            // needs to be clamped to prevent large delta
            // values from causing large jumps in the game
            // state.
            stage.run(Math.min(delta / 1000, this.clampDeltaTo));
        });
        this.lastTime = time;
    }
    runWithTiming(time) {
        const delta = time - this.lastTime;
        const stageTimings = {};
        const start = performance.now();
        this.forEachNode((stage) => {
            const start = performance.now();
            const taskTimings = stage.runWithTiming(Math.min(delta / 1000, this.clampDeltaTo));
            const duration = performance.now() - start;
            stageTimings[stage.key.toString()] = {
                duration,
                tasks: taskTimings
            };
        });
        return {
            total: performance.now() - start,
            stages: stageTimings
        };
    }
    getSchedule(include = {
        tasks: true
    }) {
        return {
            stages: this.mapNodes((stage) => {
                if (stage === undefined)
                    throw new Error('Stage not found');
                return {
                    key: stage.key.toString(),
                    ...{ tasks: include.tasks ? stage.getSchedule() : undefined }
                };
            })
        };
    }
    dispose() {
        this.clear();
    }
}

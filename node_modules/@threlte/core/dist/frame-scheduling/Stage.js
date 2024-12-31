import { DAG } from './DAG';
import { Task } from './Task';
/**
 * A Stage is a collection of steps. The steps are run in a topological sort
 * order.
 */
export class Stage extends DAG {
    key;
    scheduler;
    runTask = true;
    stop() {
        this.runTask = false;
    }
    start() {
        this.runTask = true;
    }
    get tasks() {
        return this.sortedVertices;
    }
    callback = (_, r) => r();
    constructor(scheduler, key, callback) {
        super();
        this.scheduler = scheduler;
        this.key = key;
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        if (callback)
            this.callback = callback.bind(this);
    }
    createTask(key, callback, options) {
        const task = new Task(this, key, callback);
        this.add(key, task, options);
        return task;
    }
    getTask(key) {
        return this.getValueByKey(key);
    }
    removeTask = this.remove.bind(this);
    run(delta) {
        if (!this.runTask)
            return;
        this.callback(delta, (deltaOverride) => {
            this.forEachNode((task) => {
                task.run(deltaOverride ?? delta);
            });
        });
    }
    runWithTiming(delta) {
        if (!this.runTask)
            return {};
        const taskTimings = {};
        this.callback(delta, (deltaOverride) => {
            this.forEachNode((task) => {
                const start = performance.now();
                task.run(deltaOverride ?? delta);
                const duration = performance.now() - start;
                taskTimings[task.key] = duration;
            });
        });
        return taskTimings;
    }
    getSchedule() {
        return this.mapNodes((l) => l.key.toString());
    }
}

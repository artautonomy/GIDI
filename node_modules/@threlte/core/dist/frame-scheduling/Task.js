export class Task {
    key;
    stage;
    callback;
    runTask = true;
    stop() {
        this.runTask = false;
    }
    start() {
        this.runTask = true;
    }
    constructor(stage, key, callback) {
        this.stage = stage;
        this.key = key;
        this.callback = callback;
    }
    run(delta) {
        if (!this.runTask)
            return;
        this.callback(delta);
    }
}

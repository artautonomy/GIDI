import { Pane } from "tweakpane";
import { Object3D } from "three";
import { ThreePerfUI } from "./ui/UI.mjs";
import { GLPerf } from "./GLPerf.mjs";
;
const updateMatrixWorldTemp = Object3D.prototype.updateMatrixWorld;
const updateWorldMatrixTemp = Object3D.prototype.updateWorldMatrix;
const updateMatrixTemp = Object3D.prototype.updateMatrix;
const maxGl = ["calls", "triangles", "points", "lines"];
const maxLog = ["gpu", "cpu", "mem", "fps"];
class ThreePerf {
  //
  constructor(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    this.gui = new Pane();
    this.accumulated = {
      totalFrames: 0,
      log: {
        i: 0,
        maxMemory: 0,
        gpu: 0,
        mem: 0,
        cpu: 0,
        fps: 0,
        duration: 0,
        frameCount: 0
      },
      gl: {
        calls: 0,
        triangles: 0,
        points: 0,
        lines: 0,
        counts: 0
      },
      max: {
        log: {
          i: 0,
          maxMemory: 0,
          gpu: 0,
          mem: 0,
          cpu: 0,
          fps: 0,
          duration: 0,
          frameCount: 0
        },
        gl: {
          calls: 0,
          triangles: 0,
          points: 0,
          lines: 0,
          counts: 0
        }
      }
    };
    this.renderPassesNumber = 0;
    this._keypressed = "";
    this._guiVisible = true;
    this.actionToCallUI = "dev";
    this.keypressHandler = (event) => {
      if (!this.actionToCallUI)
        return;
      this._keypressed += event.key;
      const keys = this._keypressed.split("");
      while (keys.length > this.actionToCallUI.length) {
        keys.shift();
      }
      if (keys.join("") === this.actionToCallUI) {
        this._keypressed = "";
        this.guiVisible = !this.guiVisible;
      }
    };
    this.afterRender = () => {
      if (!this._enabled)
        return;
      if (!this.perfEngine.paused) {
        this.perfEngine.nextFrame(window.performance.now());
        if (this.perfEngine.overClock && typeof window.requestIdleCallback !== "undefined") {
          this.perfEngine.idleCbId = requestIdleCallback(this.perfEngine.nextFps);
        }
      }
      if (this.perfEngine) {
        this.perfEngine.end("profiler");
      }
      if (window.performance) {
        window.performance.mark("cpu-started");
        this.perfEngine.startCpuProfiling = true;
      }
      if (this.deepAnalyze) {
      }
    };
    this.deepAnalyze = (_a = props.deepAnalyze) != null ? _a : false;
    this.threeRenderer = props.renderer;
    this.ui = new ThreePerfUI({ perf: this, domElement: props.domElement, backgroundOpacity: props.backgroundOpacity });
    this._visible = (_b = props.visible) != null ? _b : true;
    this._enabled = (_c = props.enabled) != null ? _c : true;
    this.scale = (_d = props.scale) != null ? _d : 1;
    this.anchorX = (_e = props.anchorX) != null ? _e : "left";
    this.anchorY = (_f = props.anchorY) != null ? _f : "top";
    this.showGraph = (_g = props.showGraph) != null ? _g : true;
    this.memory = (_h = props.memory) != null ? _h : true;
    this.actionToCallUI = (_i = props.actionToCallUI) != null ? _i : "";
    this.guiVisible = (_j = props.guiVisible) != null ? _j : false;
    this.gui.element.parentElement.style.width = "300px";
    window.addEventListener("keypress", this.keypressHandler);
    const overClock = (_k = props.overClock) != null ? _k : true;
    this.perfEngine = new GLPerf({
      perf: this,
      trackGPU: true,
      overClock,
      chartLen: 120,
      // chart ? chart.length : 120,
      chartHz: 60,
      // chart ? chart.hz : 60,
      logsPerSecond: (_l = props.logsPerSecond) != null ? _l : 10,
      gl: props.renderer.getContext(),
      chartLogger: (chart) => {
        this.chart = chart;
      },
      paramLogger: (logger) => {
        if (!this._enabled)
          return;
        const log = {
          maxMemory: logger.maxMemory,
          gpu: logger.gpu,
          cpu: logger.cpu,
          mem: logger.mem,
          fps: logger.fps,
          totalTime: logger.duration,
          frameCount: logger.frameCount
        };
        this.log = log;
        const accumulated = this.accumulated;
        const glRender = this.threeRenderer.info.render;
        accumulated.totalFrames++;
        accumulated.gl.calls += glRender.calls;
        accumulated.gl.triangles += glRender.triangles;
        accumulated.gl.points += glRender.points;
        accumulated.gl.lines += glRender.lines;
        accumulated.log.gpu += logger.gpu;
        accumulated.log.cpu += logger.cpu;
        accumulated.log.mem += logger.mem;
        accumulated.log.fps += logger.fps;
        for (let i = 0; i < maxGl.length; i++) {
          const key = maxGl[i];
          const value = glRender[key];
          if (value > accumulated.max.gl[key]) {
            accumulated.max.gl[key] = value;
          }
        }
        for (let i = 0; i < maxLog.length; i++) {
          const key = maxLog[i];
          const value = logger[key];
          if (value > accumulated.max.log[key]) {
            accumulated.max.log[key] = value;
          }
        }
        this.accumulated = accumulated;
        this.ui.update();
      }
    });
    const ctx = props.renderer.getContext();
    let glRenderer = null;
    let glVendor = null;
    const rendererInfo = ctx.getExtension("WEBGL_debug_renderer_info");
    const glVersion = ctx.getParameter(ctx.VERSION);
    if (rendererInfo != null) {
      glRenderer = ctx.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL);
      glVendor = ctx.getParameter(rendererInfo.UNMASKED_VENDOR_WEBGL);
    }
    if (!glVendor) {
      glVendor = "Unknown vendor";
    }
    if (!glRenderer) {
      glRenderer = ctx.getParameter(ctx.RENDERER);
    }
    this.startTime = performance.now();
    this.infos = {
      version: glVersion,
      renderer: glRenderer,
      vendor: glVendor
    };
    this.rendererRender = this.threeRenderer.render;
    this.threeRenderer.info.autoReset = false;
    this.threeRenderer.render = (scene, camera) => {
      this.renderPassesNumber++;
      this.rendererRender.call(this.threeRenderer, scene, camera);
    };
    this.guiFolder = this.gui.addFolder({ title: "Settings" });
    const perfFolder = this.guiFolder.addFolder({ title: "ThreePerf" });
    perfFolder.addInput(this, "visible", { label: "Visible" });
    perfFolder.addInput(this, "enabled", { label: "Enabled" });
    perfFolder.addInput(this, "anchorX", { label: "xAnchor", options: { left: "left", right: "right" } });
    perfFolder.addInput(this, "anchorY", { label: "yAnchor", options: { top: "top", bottom: "bottom" } });
    perfFolder.addInput(this, "backgroundOpacity", { label: "Background opacity", min: 0, max: 1, step: 0.1 });
    perfFolder.addInput(this, "memory", { label: "Memory" });
    perfFolder.addInput(this, "showGraph", { label: "Charts" });
    perfFolder.addInput(this, "scale", { label: "Scale", min: 0.1, max: 2, step: 0.1 });
    perfFolder.addInput(this, "logsPerSecond", { label: "LogsPerSecond", min: 1, max: 60, step: 1 });
    console.log("ThreePerf inited.");
  }
  begin() {
    this.perfEngine.begin("profiler");
  }
  end() {
    this.afterRender();
    this.renderPassesNumber = 0;
    this.threeRenderer.info.reset();
  }
  dispose() {
    var _a;
    this.ui.dispose();
    (_a = this.gui.element.parentElement) == null ? void 0 : _a.remove();
    window.removeEventListener("keypress", this.keypressHandler);
  }
  //
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
    this.ui.toggleVisibility(value);
  }
  get guiVisible() {
    return this._guiVisible;
  }
  set guiVisible(value) {
    this._guiVisible = value;
    this.gui.element.parentElement.style["display"] = value ? "block" : "none";
  }
  get anchorX() {
    return this._anchorX;
  }
  set anchorX(value) {
    this._anchorX = value;
    if (this._anchorX === "left") {
      this.ui.wrapper.style.left = "0";
      this.ui.wrapper.style.right = "";
    } else {
      this.ui.wrapper.style.left = "";
      this.ui.wrapper.style.right = "0";
    }
  }
  get anchorY() {
    return this._anchorY;
  }
  set anchorY(value) {
    this._anchorY = value;
    if (this._anchorY === "top") {
      this.ui.wrapper.style.top = "0";
      this.ui.wrapper.style.bottom = "";
    } else {
      this.ui.wrapper.style.top = "";
      this.ui.wrapper.style.bottom = "0";
    }
  }
  get showGraph() {
    return this._showGraph;
  }
  set showGraph(value) {
    this._showGraph = value;
    this.ui.toggleCharts(value);
  }
  get memory() {
    return this._memory;
  }
  set memory(value) {
    this._memory = value;
    this.ui.toggleMemoryInfo(value);
  }
  get scale() {
    return this._scale;
  }
  set scale(value) {
    this._scale = value;
    this.ui.setScale(value);
  }
  get logsPerSecond() {
    return this.perfEngine.logsPerSecond;
  }
  set logsPerSecond(value) {
    this.perfEngine.logsPerSecond = value;
  }
  get backgroundOpacity() {
    return this.ui._backgroundOpacity;
  }
  set backgroundOpacity(value) {
    this.ui.setBackgroundOpacity(value);
  }
}
;
export {
  ThreePerf
};
//# sourceMappingURL=ThreePerf.mjs.map

"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const troikaThreeText = require("troika-three-text");
const three = require("three");
class ThreePerfUI {
  //
  constructor(props) {
    var _a;
    this._charts = /* @__PURE__ */ new Map();
    this._width = 400;
    this._height = 110;
    this._backgroundOpacity = 0.7;
    this._perf = props.perf;
    this._backgroundOpacity = (_a = props.backgroundOpacity) != null ? _a : this._backgroundOpacity;
    this.wrapper = document.createElement("div");
    this.wrapper.id = "three-perf-ui";
    this.wrapper.style.position = "fixed";
    this.wrapper.style.bottom = "0";
    this.wrapper.style.left = "0";
    this.wrapper.style.width = this._width + "px";
    this.wrapper.style.height = this._height + "px";
    props.domElement.appendChild(this.wrapper);
    this.canvas = document.createElement("canvas");
    this.canvas.width = this._width;
    this.canvas.height = this._height;
    this.canvas.style.position = "absolute";
    this.wrapper.appendChild(this.canvas);
    this.initCanvas();
  }
  setScale(value) {
    this.wrapper.style.width = value * this.width + "px";
    this.wrapper.style.height = value * this.height + "px";
    this._renderer.setSize(this._width * value, this._height * value, true);
  }
  initCanvas() {
    this._renderer = new three.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this._renderer.setClearColor(0, this._backgroundOpacity);
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._scene = new three.Scene();
    this._camera = new three.OrthographicCamera(0, this._width, 0, -this._height, 0.1, 100);
    this._camera.position.set(0, 0, 10);
    this._camera.lookAt(0, 0, 0);
    this._camera.updateProjectionMatrix();
    this._scene.add(this._camera);
    this._scene.userData.useStats = false;
    const gpuValue = new troikaThreeText.Text();
    gpuValue.anchorX = "right";
    gpuValue.position.set(45, -8, 0);
    gpuValue.text = "0.000";
    gpuValue.fontSize = 15;
    gpuValue.color = "rgb(253, 151, 31)";
    gpuValue.sync();
    this._scene.add(gpuValue);
    const gpuMs = new troikaThreeText.Text();
    gpuMs.anchorX = "right";
    gpuMs.position.set(65, -7, 0);
    gpuMs.text = "ms";
    gpuMs.fontSize = 9;
    gpuMs.color = "rgb(255, 255, 255)";
    gpuMs.sync();
    this._scene.add(gpuMs);
    const gpuLabel = new troikaThreeText.Text();
    gpuLabel.anchorX = "right";
    gpuLabel.position.set(65, -22, 0);
    gpuLabel.text = "GPU";
    gpuLabel.fontSize = 9;
    gpuLabel.color = "rgb(253, 151, 31)";
    gpuLabel.sync();
    this._scene.add(gpuLabel);
    const cpuValue = new troikaThreeText.Text();
    cpuValue.anchorX = "right";
    cpuValue.position.set(115, -8, 0);
    cpuValue.text = "0.000";
    cpuValue.fontSize = 15;
    cpuValue.color = "rgb(66, 226, 46)";
    cpuValue.sync();
    this._scene.add(cpuValue);
    const cpuMs = new troikaThreeText.Text();
    cpuMs.anchorX = "right";
    cpuMs.position.set(135, -7, 0);
    cpuMs.text = "ms";
    cpuMs.fontSize = 9;
    cpuMs.color = "rgb(255, 255, 255)";
    cpuMs.sync();
    this._scene.add(cpuMs);
    const cpuLabel = new troikaThreeText.Text();
    cpuLabel.anchorX = "right";
    cpuLabel.position.set(135, -22, 0);
    cpuLabel.text = "CPU";
    cpuLabel.fontSize = 9;
    cpuLabel.color = "rgb(66, 226, 46)";
    cpuLabel.sync();
    this._scene.add(cpuLabel);
    const fpsValue = new troikaThreeText.Text();
    fpsValue.anchorX = "center";
    fpsValue.position.set(165, -8, 0);
    fpsValue.text = "0";
    fpsValue.fontSize = 15;
    fpsValue.color = "rgb(238, 38, 110)";
    fpsValue.sync();
    this._scene.add(fpsValue);
    const fpsLabel = new troikaThreeText.Text();
    fpsLabel.anchorX = "center";
    fpsLabel.position.set(175, -22, 0);
    fpsLabel.text = "FPS";
    fpsLabel.fontSize = 9;
    fpsLabel.color = "rgb(238, 38, 110)";
    fpsLabel.sync();
    this._scene.add(fpsLabel);
    const callsValue = new troikaThreeText.Text();
    callsValue.anchorX = "right";
    callsValue.position.set(235, -8, 0);
    callsValue.text = "0";
    callsValue.fontSize = 15;
    callsValue.color = "#ffffff";
    callsValue.sync();
    this._scene.add(callsValue);
    const callsLabel = new troikaThreeText.Text();
    callsLabel.anchorX = "right";
    callsLabel.position.set(235, -22, 0);
    callsLabel.text = "calls";
    callsLabel.fontSize = 9;
    callsLabel.color = "rgb(101, 197, 188)";
    callsLabel.sync();
    this._scene.add(callsLabel);
    const trianglesValue = new troikaThreeText.Text();
    trianglesValue.anchorX = "right";
    trianglesValue.position.set(315, -8, 0);
    trianglesValue.text = "0";
    trianglesValue.fontSize = 15;
    trianglesValue.color = "#ffffff";
    trianglesValue.sync();
    this._scene.add(trianglesValue);
    const trianglesLabel = new troikaThreeText.Text();
    trianglesLabel.anchorX = "right";
    trianglesLabel.position.set(315, -22, 0);
    trianglesLabel.text = "triangles";
    trianglesLabel.fontSize = 9;
    trianglesLabel.color = "rgb(101, 197, 188)";
    trianglesLabel.sync();
    this._scene.add(trianglesLabel);
    const renderpassesValue = new troikaThreeText.Text();
    renderpassesValue.anchorX = "right";
    renderpassesValue.position.set(365, -8, 0);
    renderpassesValue.text = "0";
    renderpassesValue.fontSize = 15;
    renderpassesValue.color = "#ffffff";
    renderpassesValue.sync();
    this._scene.add(renderpassesValue);
    const renderpassesLabel = new troikaThreeText.Text();
    renderpassesLabel.anchorX = "right";
    renderpassesLabel.position.set(365, -22, 0);
    renderpassesLabel.text = "passes";
    renderpassesLabel.fontSize = 9;
    renderpassesLabel.color = "rgb(101, 197, 188)";
    renderpassesLabel.sync();
    this._scene.add(renderpassesLabel);
    this._basicInfoElements = {
      gpuValue,
      cpuValue,
      fpsValue,
      callsValue,
      trianglesValue,
      renderpassesValue
    };
    const geometriesValue = new troikaThreeText.Text();
    geometriesValue.anchorX = "right";
    geometriesValue.position.set(65, -39, 0);
    geometriesValue.text = "0";
    geometriesValue.fontSize = 15;
    geometriesValue.color = "#ffffff";
    geometriesValue.sync();
    this._scene.add(geometriesValue);
    const geometriesLabel = new troikaThreeText.Text();
    geometriesLabel.anchorX = "right";
    geometriesLabel.position.set(65, -53, 0);
    geometriesLabel.text = "geometries";
    geometriesLabel.fontSize = 9;
    geometriesLabel.color = "rgb(101, 197, 188)";
    geometriesLabel.sync();
    this._scene.add(geometriesLabel);
    const texturesValue = new troikaThreeText.Text();
    texturesValue.anchorX = "right";
    texturesValue.position.set(135, -39, 0);
    texturesValue.text = "0";
    texturesValue.fontSize = 15;
    texturesValue.color = "#ffffff";
    texturesValue.sync();
    this._scene.add(texturesValue);
    const texturesLabel = new troikaThreeText.Text();
    texturesLabel.anchorX = "right";
    texturesLabel.position.set(135, -53, 0);
    texturesLabel.text = "textures";
    texturesLabel.fontSize = 9;
    texturesLabel.color = "rgb(101, 197, 188)";
    texturesLabel.sync();
    this._scene.add(texturesLabel);
    const shadersValue = new troikaThreeText.Text();
    shadersValue.anchorX = "right";
    shadersValue.position.set(205, -39, 0);
    shadersValue.text = "0";
    shadersValue.fontSize = 15;
    shadersValue.color = "#ffffff";
    shadersValue.sync();
    this._scene.add(shadersValue);
    const shadersLabel = new troikaThreeText.Text();
    shadersLabel.anchorX = "right";
    shadersLabel.position.set(205, -53, 0);
    shadersLabel.text = "shaders";
    shadersLabel.fontSize = 9;
    shadersLabel.color = "rgb(101, 197, 188)";
    shadersLabel.sync();
    this._scene.add(shadersLabel);
    const linesValue = new troikaThreeText.Text();
    linesValue.anchorX = "right";
    linesValue.position.set(275, -39, 0);
    linesValue.text = "0";
    linesValue.fontSize = 15;
    linesValue.color = "#ffffff";
    linesValue.sync();
    this._scene.add(linesValue);
    const linesLabel = new troikaThreeText.Text();
    linesLabel.anchorX = "right";
    linesLabel.position.set(275, -53, 0);
    linesLabel.text = "lines";
    linesLabel.fontSize = 9;
    linesLabel.color = "rgb(101, 197, 188)";
    linesLabel.sync();
    this._scene.add(linesLabel);
    const pointsValue = new troikaThreeText.Text();
    pointsValue.anchorX = "right";
    pointsValue.position.set(345, -39, 0);
    pointsValue.text = "0";
    pointsValue.fontSize = 15;
    pointsValue.color = "#ffffff";
    pointsValue.sync();
    this._scene.add(pointsValue);
    const pointsLabel = new troikaThreeText.Text();
    pointsLabel.anchorX = "right";
    pointsLabel.position.set(345, -53, 0);
    pointsLabel.text = "points";
    pointsLabel.fontSize = 9;
    pointsLabel.color = "rgb(101, 197, 188)";
    pointsLabel.sync();
    this._scene.add(pointsLabel);
    this._memInfoElements = {
      geometriesValue,
      geometriesLabel,
      texturesValue,
      texturesLabel,
      shadersValue,
      shadersLabel,
      linesValue,
      linesLabel,
      pointsValue,
      pointsLabel
    };
    const gpuChartGeometry = new three.BufferGeometry();
    let positions = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      positions[3 * i + 0] = this._width / 59 * i;
      positions[3 * i + 1] = -110;
      positions[3 * i + 2] = 0;
    }
    let positionAttribute = new three.BufferAttribute(positions, 3);
    positionAttribute.usage = three.DynamicDrawUsage;
    gpuChartGeometry.setAttribute("position", positionAttribute);
    const gpuChart = new three.Line(gpuChartGeometry, new three.LineBasicMaterial({ color: "rgb(253, 151, 31)" }));
    this._scene.add(gpuChart);
    this._charts.set("gpu", gpuChart);
    const cpuChartGeometry = new three.BufferGeometry();
    positions = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      positions[3 * i + 0] = this._width / 59 * i;
      positions[3 * i + 1] = -110;
      positions[3 * i + 2] = 0;
    }
    positionAttribute = new three.BufferAttribute(positions, 3);
    positionAttribute.usage = three.DynamicDrawUsage;
    cpuChartGeometry.setAttribute("position", positionAttribute);
    const cpuChart = new three.Line(cpuChartGeometry, new three.LineBasicMaterial({ color: "rgb(66, 226, 46)" }));
    this._scene.add(cpuChart);
    this._charts.set("cpu", cpuChart);
    const fpsChartGeometry = new three.BufferGeometry();
    positions = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      positions[3 * i + 0] = this._width / 59 * i;
      positions[3 * i + 1] = -110;
      positions[3 * i + 2] = 0;
    }
    positionAttribute = new three.BufferAttribute(positions, 3);
    positionAttribute.usage = three.DynamicDrawUsage;
    fpsChartGeometry.setAttribute("position", positionAttribute);
    const fpsChart = new three.Line(fpsChartGeometry, new three.LineBasicMaterial({ color: "rgb(238, 38, 110)" }));
    this._scene.add(fpsChart);
    this._charts.set("fps", fpsChart);
  }
  update() {
    var _a, _b;
    if (this._perf.chart && this._perf.showGraph) {
      for (const chartName in this._perf.chart.data) {
        const chartData = this._perf.chart.data[chartName];
        if (!this._charts.get(chartName) || !chartData)
          continue;
        const geometry = this._charts.get(chartName).geometry;
        const positionAttr = geometry.attributes.position;
        let maxValue = 0;
        for (let i = 0; i < chartData.length; i++) {
          if (chartData[i] > maxValue)
            maxValue = chartData[i];
        }
        maxValue = Math.max(maxValue, 20);
        for (let i = 0; i < chartData.length; i++) {
          let id = (this._perf.chart.circularId + i + 1) % 60;
          positionAttr.setY(i, (chartData[id] / maxValue * 90 - 110) * this.height / 110);
        }
        positionAttr.needsUpdate = true;
      }
    }
    this._basicInfoElements.gpuValue.text = this._perf.log.gpu.toFixed(3);
    this._basicInfoElements.cpuValue.text = this._perf.log.cpu.toFixed(3);
    this._basicInfoElements.fpsValue.text = this._perf.log.fps.toFixed(0);
    this._basicInfoElements.callsValue.text = this._perf.threeRenderer.info.render.calls.toString();
    this._basicInfoElements.trianglesValue.text = this._perf.threeRenderer.info.render.triangles.toString();
    this._basicInfoElements.renderpassesValue.text = this._perf.renderPassesNumber.toString();
    this._memInfoElements.geometriesValue.text = this._perf.threeRenderer.info.memory.geometries.toString();
    this._memInfoElements.texturesValue.text = this._perf.threeRenderer.info.memory.textures.toString();
    this._memInfoElements.shadersValue.text = (_b = (_a = this._perf.threeRenderer.info.programs) == null ? void 0 : _a.length.toString()) != null ? _b : "";
    this._memInfoElements.linesValue.text = this._perf.threeRenderer.info.render.lines.toString();
    this._memInfoElements.pointsValue.text = this._perf.threeRenderer.info.render.points.toString();
    this.render();
  }
  render() {
    this._renderer.render(this._scene, this._camera);
  }
  dispose() {
    this.wrapper.remove();
  }
  //
  toggleVisibility(value) {
    this.wrapper.style.display = value ? "block" : "none";
  }
  toggleCharts(value) {
    this._charts.forEach((chart) => {
      chart.visible = value;
    });
    if (this._perf.showGraph) {
      this.height = this._perf.memory ? 110 : 70;
    } else {
      this.height = this._perf.memory ? 70 : 40;
    }
    this.wrapper.style.height = this._perf.scale * this.height + "px";
  }
  toggleMemoryInfo(value) {
    for (const key in this._memInfoElements) {
      this._memInfoElements[key].visible = value;
    }
    this.width = 380;
    if (this._perf.showGraph) {
      this.height = this._perf.memory ? 110 : 70;
    } else {
      this.height = this._perf.memory ? 70 : 40;
    }
    this.wrapper.style.width = this._perf.scale * this.width + "px";
    this.wrapper.style.height = this._perf.scale * this.height + "px";
  }
  setBackgroundOpacity(value) {
    this._backgroundOpacity = value;
    this._renderer.setClearColor(0, this._backgroundOpacity);
    this.render();
  }
  //
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = value;
    this._camera.right = value;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(this._perf.scale * this._width, this._perf.scale * this._height);
    this.render();
  }
  get height() {
    return this._height;
  }
  set height(value) {
    this._height = value;
    this._camera.bottom = -value;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(this._perf.scale * this._width, this._perf.scale * this._height);
    this.render();
  }
}
;
exports.ThreePerfUI = ThreePerfUI;
//# sourceMappingURL=UI.js.map

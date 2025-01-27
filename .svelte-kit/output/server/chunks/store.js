import { G as escape_html } from "./index.js";
import "clsx";
import { w as writable } from "./index2.js";
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (value == null || !value && is_boolean || value === "" && name === "class") return "";
  const normalized = name in replacements && replacements[name].get(value) || value;
  const assignment = is_boolean ? "" : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
let Settings = writable({
  page: "home",
  scene: "Piano",
  edit: false,
  styleReset: false,
  remap: false,
  font: "/fonts/Oxanium-Regular.ttf",
  orbitControls: false,
  zoom: true,
  autoRotate: true,
  autoRotateSpeed: 1.1,
  attack: 10,
  release: 500,
  colours: {
    background: {
      r: 4,
      g: 2,
      b: 25
    },
    key: {
      r: 192,
      g: 147,
      b: 0
    },
    expression: {
      r: 202,
      g: 44,
      b: 0
    }
  },
  lighting: {
    above: 1,
    front: 1,
    side: 3
  }
});
export {
  Settings as S,
  attr as a
};

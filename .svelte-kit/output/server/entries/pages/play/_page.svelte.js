import { D as escape_html, G as noop, I as render_effect, u as get, x as push, J as fallback, A as add_styles, K as stringify, M as bind_props, z as pop, N as copy_payload, O as assign_payload, P as slot, E as store_get, F as unsubscribe_stores, Q as css_props } from "../../../chunks/index.js";
import { t as tick, C as Canvas } from "../../../chunks/common.js";
import "clsx";
import "mitt";
import "@threejs-kit/instanced-sprite-mesh";
import { a as source, s as set } from "../../../chunks/sources.js";
import { w as writable } from "../../../chunks/index2.js";
import { colord } from "colord";
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
const now = () => Date.now();
const raf = {
  // don't access requestAnimationFrame eagerly outside method
  // this allows basic testing of user code without JSDOM
  // bunder will eval and remove ternary when the user's app is built
  tick: (
    /** @param {any} _ */
    (_) => noop()
  ),
  now: () => now(),
  tasks: /* @__PURE__ */ new Set()
};
function loop(callback) {
  let task;
  if (raf.tasks.size === 0) ;
  return {
    promise: new Promise((fulfill) => {
      raf.tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      raf.tasks.delete(task);
    }
  };
}
let Settings = writable({
  edit: false,
  reset: false,
  scene: "Cube",
  font: "/fonts/Oxanium-Regular.ttf",
  orbitControls: false,
  autoRotate: true,
  autoRotateSpeed: 2,
  attack: 20,
  release: 750,
  colours: {
    background: {
      r: 4,
      g: 2,
      b: 25
    },
    key: {
      r: 222,
      g: 177,
      b: 22
    },
    expression: {
      r: 222,
      g: 66,
      b: 11
    }
  }
});
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function linear(t) {
  return t;
}
function get_interpolator(a, b) {
  if (a === b || a !== a) return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = (
      /** @type {Array<any>} */
      b.map((bi, i) => {
        return get_interpolator(
          /** @type {Array<any>} */
          a[i],
          bi
        );
      })
    );
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b) {
      throw new Error("Object cannot be null");
    }
    if (is_date(a) && is_date(b)) {
      const an = a.getTime();
      const bn = b.getTime();
      const delta = bn - an;
      return (t) => new Date(an + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = (
      /** @type {number} */
      b - /** @type {number} */
      a
    );
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
class Tween {
  #current = source(
    /** @type {T} */
    void 0
  );
  #target = source(
    /** @type {T} */
    void 0
  );
  /** @type {TweenedOptions<T>} */
  #defaults;
  /** @type {import('../internal/client/types').Task | null} */
  #task = null;
  /**
   * @param {T} value
   * @param {TweenedOptions<T>} options
   */
  constructor(value, options = {}) {
    this.#current.v = this.#target.v = value;
    this.#defaults = options;
  }
  /**
   * Create a tween whose value is bound to the return value of `fn`. This must be called
   * inside an effect root (for example, during component initialisation).
   *
   * ```svelte
   * <script>
   * 	import { Tween } from 'svelte/motion';
   *
   * 	let { number } = $props();
   *
   * 	const tween = Tween.of(() => number);
   * <\/script>
   * ```
   * @template U
   * @param {() => U} fn
   * @param {TweenedOptions<U>} [options]
   */
  static of(fn, options) {
    const tween = new Tween(fn(), options);
    render_effect(() => {
      tween.set(fn());
    });
    return tween;
  }
  /**
   * Sets `tween.target` to `value` and returns a `Promise` that resolves if and when `tween.current` catches up to it.
   *
   * If `options` are provided, they will override the tween's defaults.
   * @param {T} value
   * @param {TweenedOptions<T>} [options]
   * @returns
   */
  set(value, options) {
    set(this.#target, value);
    let previous_value = this.#current.v;
    let previous_task = this.#task;
    let started = false;
    let {
      delay = 0,
      duration = 400,
      easing = linear,
      interpolate = get_interpolator
    } = { ...this.#defaults, ...options };
    const start = raf.now() + delay;
    let fn;
    this.#task = loop((now2) => {
      if (now2 < start) {
        return true;
      }
      if (!started) {
        started = true;
        fn = interpolate(
          /** @type {any} */
          previous_value,
          value
        );
        if (typeof duration === "function") {
          duration = duration(
            /** @type {any} */
            previous_value,
            value
          );
        }
        previous_task?.abort();
      }
      const elapsed = now2 - start;
      if (elapsed > /** @type {number} */
      duration) {
        set(this.#current, value);
        return false;
      }
      set(this.#current, fn(easing(elapsed / /** @type {number} */
      duration)));
      return true;
    });
    return this.#task.promise;
  }
  get current() {
    return get(this.#current);
  }
  get target() {
    return get(this.#target);
  }
  set target(v) {
    this.set(v);
  }
}
function Slider($$payload, $$props) {
  push();
  let _min, _max, position;
  let min = fallback($$props["min"], 0);
  let max = fallback($$props["max"], 100);
  let step = fallback($$props["step"], 1);
  let value = fallback($$props["value"], 50);
  let ariaValueText = fallback($$props["ariaValueText"], (current) => current.toString());
  let name = fallback($$props["name"], void 0);
  let direction = fallback($$props["direction"], "horizontal");
  let reverse = fallback($$props["reverse"], false);
  let keyboardOnly = fallback($$props["keyboardOnly"], false);
  let slider = fallback($$props["slider"], void 0);
  let ariaLabel = fallback($$props["ariaLabel"], void 0);
  let ariaLabelledBy = fallback($$props["ariaLabelledBy"], void 0);
  let ariaControls = fallback($$props["ariaControls"], void 0);
  let isDragging = fallback($$props["isDragging"], false);
  _min = typeof min === "string" ? parseFloat(min) : min;
  _max = typeof max === "string" ? parseFloat(max) : max;
  position = ((value - _min) / (_max - _min) * 1).toFixed(4);
  $$payload.out += `<div${add_styles({ "--position": position })}${attr("class", `slider svelte-w4j1dz ${stringify([reverse ? "reverse" : ""].filter(Boolean).join(" "))}`)} role="slider"${attr("aria-orientation", direction)}${attr("aria-valuemax", _max)}${attr("aria-valuemin", _min)}${attr("aria-valuenow", value)}${attr("aria-valuetext", ariaValueText(value))}${attr("aria-label", ariaLabel)}${attr("aria-labelledby", ariaLabelledBy)}${attr("aria-controls", ariaControls)} tabindex="0"><div class="track svelte-w4j1dz"></div> <div class="thumb svelte-w4j1dz"></div></div> `;
  if (name) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<input type="hidden"${attr("name", name)}${attr("value", value)}>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    min,
    max,
    step,
    value,
    ariaValueText,
    name,
    direction,
    reverse,
    keyboardOnly,
    slider,
    ariaLabel,
    ariaLabelledBy,
    ariaControls,
    isDragging
  });
  pop();
}
function Picker($$payload, $$props) {
  push();
  let components = $$props["components"];
  let h = $$props["h"];
  let s = $$props["s"];
  let v = $$props["v"];
  let isDark = $$props["isDark"];
  let texts = $$props["texts"];
  let picker;
  let pickerColorBg;
  let pos = { x: 100, y: 0 };
  if (typeof h === "number") pickerColorBg = colord({ h, s: 100, v: 100, a: 1 }).toHex();
  if (typeof s === "number" && typeof v === "number" && picker) pos = { x: s, y: 100 - v };
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div${add_styles({ "--picker-color-bg": pickerColorBg })} class="picker svelte-1x9tz9y"><!---->`;
    components.pickerIndicator?.($$payload2, { pos, isDark });
    $$payload2.out += `<!----> <div${add_styles({ "--pos-y": pos.y })} class="s svelte-1x9tz9y">`;
    Slider($$payload2, {
      keyboardOnly: true,
      ariaValueText: (value) => `${value}%`,
      ariaLabel: texts.label.s,
      get value() {
        return s;
      },
      set value($$value) {
        s = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----></div> <div${add_styles({ "--pos-x": pos.x })} class="v svelte-1x9tz9y">`;
    Slider($$payload2, {
      keyboardOnly: true,
      ariaValueText: (value) => `${value}%`,
      direction: "vertical",
      ariaLabel: texts.label.v,
      get value() {
        return v;
      },
      set value($$value) {
        v = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----></div></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { components, h, s, v, isDark, texts });
  pop();
}
function PickerIndicator($$payload, $$props) {
  push();
  let pos = $$props["pos"];
  let isDark = $$props["isDark"];
  $$payload.out += `<div${add_styles({ "--pos-x": pos.x, "--pos-y": pos.y })}${attr("class", `picker-indicator svelte-i5mg2p ${stringify([isDark ? "is-dark" : ""].filter(Boolean).join(" "))}`)}></div>`;
  bind_props($$props, { pos, isDark });
  pop();
}
function TextInput($$payload, $$props) {
  push();
  let nextMode, h, s, v, a;
  let isAlpha = $$props["isAlpha"];
  let rgb = $$props["rgb"];
  let hsv = $$props["hsv"];
  let hex = $$props["hex"];
  let textInputModes = $$props["textInputModes"];
  let texts = $$props["texts"];
  let mode = textInputModes[0] || "hex";
  nextMode = textInputModes[(textInputModes.indexOf(mode) + 1) % textInputModes.length];
  h = Math.round(hsv.h);
  s = Math.round(hsv.s);
  v = Math.round(hsv.v);
  a = hsv.a === void 0 ? 1 : Math.round(hsv.a * 100) / 100;
  $$payload.out += `<div class="text-input svelte-qtukzs"><div class="input-container svelte-qtukzs">`;
  if (mode === "hex") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<input${add_styles({ flex: 3 })}${attr("aria-label", texts.label.hex)}${attr("value", hex)} class="svelte-qtukzs">`;
  } else {
    $$payload.out += "<!--[!-->";
    if (mode === "rgb") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<input${attr("aria-label", texts.label.r)}${attr("value", rgb.r)} type="number" min="0" max="255" class="svelte-qtukzs"> <input${attr("aria-label", texts.label.g)}${attr("value", rgb.g)} type="number" min="0" max="255" class="svelte-qtukzs"> <input${attr("aria-label", texts.label.b)}${attr("value", rgb.b)} type="number" min="0" max="255" class="svelte-qtukzs">`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<input${attr("aria-label", texts.label.h)}${attr("value", h)} type="number" min="0" max="360" class="svelte-qtukzs"> <input${attr("aria-label", texts.label.s)}${attr("value", s)} type="number" min="0" max="100" class="svelte-qtukzs"> <input${attr("aria-label", texts.label.v)}${attr("value", v)} type="number" min="0" max="100" class="svelte-qtukzs">`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--> `;
  if (isAlpha) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<input${attr("aria-label", texts.label.a)}${attr("value", a)} type="number" min="0" max="1" step="0.01" class="svelte-qtukzs">`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> `;
  if (textInputModes.length > 1) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button type="button" class="svelte-qtukzs"><span class="disappear svelte-qtukzs" aria-hidden="true">${escape_html(texts.color[mode])}</span> <span class="appear svelte-qtukzs">${escape_html(texts.changeTo)} ${escape_html(nextMode)}</span></button>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="button-like svelte-qtukzs">${escape_html(texts.color[mode])}</div>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, {
    isAlpha,
    rgb,
    hsv,
    hex,
    textInputModes,
    texts
  });
  pop();
}
function Input($$payload, $$props) {
  let labelElement = $$props["labelElement"];
  let hex = $$props["hex"];
  let label = $$props["label"];
  let name = fallback($$props["name"], void 0);
  let isOpen = $$props["isOpen"];
  $$payload.out += `<label class="svelte-lemcb1"><div class="container svelte-lemcb1"><input type="color"${attr("name", name)}${attr("value", hex)} aria-haspopup="dialog" class="svelte-lemcb1"> <div class="alpha svelte-lemcb1"></div> <div${add_styles({ background: hex })} class="color svelte-lemcb1"></div></div> ${escape_html(label)}</label>`;
  bind_props($$props, { labelElement, hex, label, name, isOpen });
}
function Wrapper($$payload, $$props) {
  let wrapper = $$props["wrapper"];
  let isOpen = $$props["isOpen"];
  let isDialog = $$props["isDialog"];
  $$payload.out += `<div${attr("class", `wrapper svelte-h9ar9 ${stringify([isOpen ? "is-open" : ""].filter(Boolean).join(" "))}`)}${attr("role", isDialog ? "dialog" : void 0)} aria-label="color picker"><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></div>`;
  bind_props($$props, { wrapper, isOpen, isDialog });
}
const defaultTexts = {
  label: {
    h: "hue channel",
    s: "saturation channel",
    v: "brightness channel",
    r: "red channel",
    g: "green channel",
    b: "blue channel",
    a: "alpha channel",
    hex: "hex color",
    withoutColor: "without color"
  },
  color: {
    rgb: "rgb",
    hsv: "hsv",
    hex: "hex"
  },
  changeTo: "change to "
};
function NullabilityCheckbox($$payload, $$props) {
  push();
  let isUndefined = $$props["isUndefined"];
  let texts = $$props["texts"];
  $$payload.out += `<label class="nullability-checkbox svelte-oskb5b"><div class="svelte-oskb5b"><input type="checkbox"${attr("checked", isUndefined, true)} class="svelte-oskb5b"> <span class="svelte-oskb5b"></span></div> ${escape_html(texts.label.withoutColor)}</label>`;
  bind_props($$props, { isUndefined, texts });
  pop();
}
function ColorPicker($$payload, $$props) {
  push();
  let components = fallback($$props["components"], () => ({}), true);
  let label = fallback($$props["label"], "Choose a color");
  let name = fallback($$props["name"], void 0);
  let nullable = fallback($$props["nullable"], false);
  let rgb = fallback($$props["rgb"], () => nullable ? void 0 : { r: 255, g: 0, b: 0, a: 1 }, true);
  let hsv = fallback($$props["hsv"], () => nullable ? void 0 : { h: 0, s: 100, v: 100, a: 1 }, true);
  let hex = fallback($$props["hex"], nullable ? void 0 : "#ff0000");
  let color = fallback($$props["color"], void 0);
  let isDark = fallback($$props["isDark"], false);
  let isAlpha = fallback($$props["isAlpha"], true);
  let isDialog = fallback($$props["isDialog"], true);
  let isOpen = fallback($$props["isOpen"], () => !isDialog, true);
  let position = fallback($$props["position"], "fixed");
  let isTextInput = fallback($$props["isTextInput"], true);
  let textInputModes = fallback($$props["textInputModes"], () => ["hex", "rgb", "hsv"], true);
  let sliderDirection = fallback($$props["sliderDirection"], "vertical");
  let disableCloseClickOutside = fallback($$props["disableCloseClickOutside"], false);
  let a11yColors = fallback($$props["a11yColors"], () => [{ bgHex: "#ffffff" }], true);
  let a11yLevel = fallback($$props["a11yLevel"], "AA");
  let texts = fallback($$props["texts"], void 0);
  let a11yTexts = fallback($$props["a11yTexts"], void 0);
  let _rgb = { r: 255, g: 0, b: 0, a: 1 };
  let _hsv = { h: 0, s: 100, v: 100, a: 1 };
  let _hex = "#ff0000";
  let isUndefined = false;
  let _isUndefined = isUndefined;
  let labelElement;
  let wrapper;
  let innerWidth;
  let innerHeight;
  const wrapperPadding = 12;
  const default_components = {
    pickerIndicator: PickerIndicator,
    textInput: TextInput,
    input: Input,
    nullabilityCheckbox: NullabilityCheckbox,
    wrapper: Wrapper
  };
  function getComponents() {
    return { ...default_components, ...components };
  }
  function getTexts() {
    return {
      label: { ...defaultTexts.label, ...texts?.label },
      color: { ...defaultTexts.color, ...texts?.color },
      changeTo: texts?.changeTo ?? defaultTexts.changeTo
    };
  }
  function updateColor() {
    if (isUndefined && !_isUndefined) {
      _isUndefined = true;
      hsv = rgb = hex = void 0;
      return;
    } else if (_isUndefined && !isUndefined) {
      _isUndefined = false;
      hsv = _hsv;
      rgb = _rgb;
      hex = _hex;
      return;
    }
    if (!hsv && !rgb && !hex) {
      isUndefined = true;
      _isUndefined = true;
      return;
    }
    if (hsv && rgb && hsv.h === _hsv.h && hsv.s === _hsv.s && hsv.v === _hsv.v && hsv.a === _hsv.a && rgb.r === _rgb.r && rgb.g === _rgb.g && rgb.b === _rgb.b && rgb.a === _rgb.a && hex === _hex) {
      return;
    }
    isUndefined = false;
    if (hsv && hsv.a === void 0) hsv.a = 1;
    if (_hsv.a === void 0) _hsv.a = 1;
    if (rgb && rgb.a === void 0) rgb.a = 1;
    if (_rgb.a === void 0) _rgb.a = 1;
    if (hex?.substring(7) === "ff") hex = hex.substring(0, 7);
    if (hex?.substring(7) === "ff") hex = hex.substring(0, 7);
    if (hsv && (hsv.h !== _hsv.h || hsv.s !== _hsv.s || hsv.v !== _hsv.v || hsv.a !== _hsv.a || !rgb && !hex)) {
      color = colord(hsv);
      rgb = color.toRgb();
      hex = color.toHex();
    } else if (rgb && (rgb.r !== _rgb.r || rgb.g !== _rgb.g || rgb.b !== _rgb.b || rgb.a !== _rgb.a || !hsv && !hex)) {
      color = colord(rgb);
      hex = color.toHex();
      hsv = color.toHsv();
    } else if (hex && (hex !== _hex || !hsv && !rgb)) {
      color = colord(hex);
      rgb = color.toRgb();
      hsv = color.toHsv();
    }
    if (color) {
      isDark = color.isDark();
    }
    if (!hex) return;
    _hsv = Object.assign({}, hsv);
    _rgb = Object.assign({}, rgb);
    _hex = hex;
    _isUndefined = isUndefined;
  }
  async function wrapperBoundaryCheck() {
    await tick();
    if (position !== "fixed" && isOpen && isDialog && labelElement && wrapper) {
      const rect = wrapper.getBoundingClientRect();
      const labelRect = labelElement.getBoundingClientRect();
      if (position === "responsive" || position === "responsive-y") {
        if (labelRect.top + rect.height + wrapperPadding > innerHeight) {
          wrapper.style.top = `-${rect.height + wrapperPadding}px`;
        } else {
          wrapper.style.top = `${labelRect.height + wrapperPadding}px`;
        }
      }
      if (position === "responsive" || position === "responsive-x") {
        if (labelRect.left + rect.width + wrapperPadding > innerWidth) {
          wrapper.style.left = `-${rect.width - labelRect.width + wrapperPadding}px`;
        } else {
          wrapper.style.left = `${wrapperPadding}px`;
        }
      }
    }
  }
  if (hsv || rgb || hex) {
    updateColor();
  }
  updateColor();
  wrapperBoundaryCheck();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<span${attr("class", `color-picker ${stringify(sliderDirection)} svelte-tsvobk`)}>`;
    if (isDialog) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<!---->`;
      getComponents().input?.($$payload2, {
        isOpen: true,
        hex,
        label,
        name,
        get labelElement() {
          return labelElement;
        },
        set labelElement($$value) {
          labelElement = $$value;
          $$settled = false;
        }
      });
      $$payload2.out += `<!---->`;
    } else {
      $$payload2.out += "<!--[!-->";
      if (name) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<input type="hidden"${attr("value", hex)}${attr("name", name)}>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]-->`;
    }
    $$payload2.out += `<!--]--> <!---->`;
    getComponents().wrapper?.($$payload2, {
      isOpen,
      isDialog,
      get wrapper() {
        return wrapper;
      },
      set wrapper($$value) {
        wrapper = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        if (nullable) {
          $$payload3.out += "<!--[-->";
          $$payload3.out += `<!---->`;
          getComponents().nullabilityCheckbox?.($$payload3, {
            texts: getTexts(),
            get isUndefined() {
              return isUndefined;
            },
            set isUndefined($$value) {
              isUndefined = $$value;
              $$settled = false;
            }
          });
          $$payload3.out += `<!---->`;
        } else {
          $$payload3.out += "<!--[!-->";
        }
        $$payload3.out += `<!--]--> `;
        Picker($$payload3, {
          components: getComponents(),
          h: hsv?.h ?? _hsv.h,
          s: hsv?.s ?? _hsv.s,
          v: hsv?.v ?? _hsv.v,
          isDark,
          texts: getTexts()
        });
        $$payload3.out += `<!----> <div class="h svelte-tsvobk">`;
        Slider($$payload3, {
          min: 0,
          max: 360,
          step: 1,
          value: hsv?.h ?? _hsv.h,
          direction: sliderDirection,
          reverse: sliderDirection === "vertical",
          ariaLabel: getTexts().label.h
        });
        $$payload3.out += `<!----></div> `;
        if (isAlpha) {
          $$payload3.out += "<!--[-->";
          $$payload3.out += `<div${add_styles({
            "--alphaless-color": (hex ? hex : _hex).substring(0, 7)
          })} class="a svelte-tsvobk">`;
          Slider($$payload3, {
            min: 0,
            max: 1,
            step: 0.01,
            value: hsv?.a ?? _hsv.a,
            direction: sliderDirection,
            reverse: sliderDirection === "vertical",
            ariaLabel: getTexts().label.a
          });
          $$payload3.out += `<!----></div>`;
        } else {
          $$payload3.out += "<!--[!-->";
        }
        $$payload3.out += `<!--]--> `;
        if (isTextInput) {
          $$payload3.out += "<!--[-->";
          $$payload3.out += `<!---->`;
          getComponents().textInput?.($$payload3, {
            hex: hex ?? _hex,
            rgb: rgb ?? _rgb,
            hsv: hsv ?? _hsv,
            isAlpha,
            textInputModes,
            texts: getTexts()
          });
          $$payload3.out += `<!---->`;
        } else {
          $$payload3.out += "<!--[!-->";
        }
        $$payload3.out += `<!--]--> `;
        if (getComponents().a11yNotice) {
          $$payload3.out += "<!--[-->";
          $$payload3.out += `<!---->`;
          getComponents().a11yNotice?.($$payload3, {
            components: getComponents(),
            a11yColors,
            hex: hex || "#00000000",
            a11yTexts,
            a11yLevel
          });
          $$payload3.out += `<!---->`;
        } else {
          $$payload3.out += "<!--[!-->";
        }
        $$payload3.out += `<!--]-->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></span>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, {
    components,
    label,
    name,
    nullable,
    rgb,
    hsv,
    hex,
    color,
    isDark,
    isAlpha,
    isDialog,
    isOpen,
    position,
    isTextInput,
    textInputModes,
    sliderDirection,
    disableCloseClickOutside,
    a11yColors,
    a11yLevel,
    texts,
    a11yTexts
  });
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  const menuOpacity = new Tween(0);
  let rgb = {
    r: store_get($$store_subs ??= {}, "$Settings", Settings).colours.key.r,
    g: store_get($$store_subs ??= {}, "$Settings", Settings).colours.key.g,
    b: store_get($$store_subs ??= {}, "$Settings", Settings).colours.key.b,
    a: 1
  };
  let hsv = colord(`rgb(${store_get($$store_subs ??= {}, "$Settings", Settings).colours.expression.r}, ${store_get($$store_subs ??= {}, "$Settings", Settings).colours.expression.g}, ${store_get($$store_subs ??= {}, "$Settings", Settings).colours.expression.b})`).toHsv();
  let hex = colord(`rgb(${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.r}, ${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.g}, ${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.b})`).toHex();
  let menuColour = colord(`rgb(${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.r}, ${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.g}, ${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.b})`).invert().desaturate(0.3).darken(0.1);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    Canvas($$payload2);
    $$payload2.out += `<!----> <menu${attr("style", `opacity:${stringify(menuOpacity.current)}; --keyColour:${stringify(menuColour.toHex())}; --menuTextColour: ${stringify(menuColour.isLight() ? "black" : "white")}`)} class="svelte-1wj37j7"><setting class="svelte-1wj37j7"><h1 class="svelte-1wj37j7">Scene</h1> <label for="mirror" class="svelte-1wj37j7">Style</label> <select name="styles" id="styles" class="svelte-1wj37j7"><option value="Cube" class="svelte-1wj37j7">Cube</option><option value="Mirror" class="svelte-1wj37j7">Mirror</option></select> <label for="autoRotate" class="svelte-1wj37j7">Autorotate</label> <input id="autoRotate" type="checkbox" class="svelte-1wj37j7"> <label for="rotateSpeed" class="svelte-1wj37j7">Rotate Speed</label> <input type="range" min="1" max="3" step="0.1" id="rotateSpeed"${attr("value", store_get($$store_subs ??= {}, "$Settings", Settings).autoRotateSpeed)} class="svelte-1wj37j7"></setting> <setting class="svelte-1wj37j7"><h1 class="svelte-1wj37j7">Colours</h1> <label for="Key Colour" class="svelte-1wj37j7">Key Colour</label> `;
    css_props(
      $$payload2,
      true,
      {
        "--cp-bg-color": `rgba(${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.r},${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.g},${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.b},1)`,
        "--picker-height": "150px",
        "--picker-width": "150px",
        "--slider-width": "15px",
        "--picker-indicator-size": "10px"
      },
      () => {
        ColorPicker($$payload2, {
          label: "",
          isAlpha: false,
          textInputModes: ["rgb"],
          sliderDirection: "vertical",
          get rgb() {
            return rgb;
          },
          set rgb($$value) {
            rgb = $$value;
            $$settled = false;
          }
        });
      }
    );
    $$payload2.out += ` <label for="Expression Colour" class="svelte-1wj37j7">Expression Colour</label> `;
    css_props(
      $$payload2,
      true,
      {
        "--cp-bg-color": `rgba(${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.r},${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.g},${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.b},1)`,
        "--picker-height": "150px",
        "--picker-width": "150px",
        "--slider-width": "15px",
        "--picker-indicator-size": "10px"
      },
      () => {
        ColorPicker($$payload2, {
          label: "",
          isAlpha: false,
          textInputModes: ["hsv"],
          sliderDirection: "vertical",
          get hsv() {
            return hsv;
          },
          set hsv($$value) {
            hsv = $$value;
            $$settled = false;
          }
        });
      }
    );
    $$payload2.out += ` <label for="Background Colour" class="svelte-1wj37j7">Background Colour</label> `;
    css_props(
      $$payload2,
      true,
      {
        "--cp-bg-color": `rgba(${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.r},${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.g},${store_get($$store_subs ??= {}, "$Settings", Settings).colours.background.b},1)`,
        "--picker-height": "150px",
        "--picker-width": "150px",
        "--slider-width": "15px",
        "--picker-indicator-size": "10px"
      },
      () => {
        ColorPicker($$payload2, {
          label: "",
          isAlpha: false,
          textInputModes: ["rgb"],
          sliderDirection: "vertical",
          get hex() {
            return hex;
          },
          set hex($$value) {
            hex = $$value;
            $$settled = false;
          }
        });
      }
    );
    $$payload2.out += `</setting> <setting class="svelte-1wj37j7"><h1 class="svelte-1wj37j7">Notes</h1> <label for="attack" class="svelte-1wj37j7">Attack</label> <input type="range" min="0" max="2500" id="attack"${attr("value", store_get($$store_subs ??= {}, "$Settings", Settings).attack)} class="svelte-1wj37j7"> <label for="release" class="svelte-1wj37j7">Release</label> <input type="range" min="0" max="2500" id="release"${attr("value", store_get($$store_subs ??= {}, "$Settings", Settings).release)} class="svelte-1wj37j7"> <label for="remapKeys" class="svelte-1wj37j7">Remap Keys</label> <button id="remapKeys" class="svelte-1wj37j7">Remap</button></setting> <button id="save" class="svelte-1wj37j7">Close</button></menu>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};

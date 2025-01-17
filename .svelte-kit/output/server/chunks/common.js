import "clsx";
import { a5 as current_component, F as getContext, y as setContext, z as pop, x as push, M as bind_props } from "./index.js";
import "mitt";
import * as THREE from "three";
import { REVISION, DefaultLoadingManager, Vector3, Sphere, Matrix4, Ray, Vector2, Mesh, ShaderChunk, Box3, Color } from "three";
import { shaderStructs, shaderIntersectFunction } from "three-mesh-bvh";
import { g as get, d as derived, w as writable } from "./index2.js";
function fromStore(store) {
  if ("set" in store) {
    return {
      get current() {
        return get(store);
      },
      set current(v) {
        store.set(v);
      }
    };
  }
  return {
    get current() {
      return get(store);
    }
  };
}
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
async function tick() {
}
const signal = Symbol();
const isStore = (dep) => {
  return typeof dep?.subscribe === "function";
};
const runObserve = (dependencies, callback, pre) => {
  const stores = dependencies().map((d) => {
    if (isStore(d)) {
      return fromStore(d);
    }
    return signal;
  });
  dependencies().map((d, i) => {
    if (stores[i] === signal) return d;
    return stores[i].current;
  });
};
const observePost = (dependencies, callback) => {
  return runObserve(dependencies);
};
const observePre = (dependencies, callback) => {
  return runObserve(dependencies);
};
Object.assign(observePost, { pre: observePre });
const isInstanceOf = (obj, type) => {
  return obj?.[`is${type}`] === true;
};
REVISION.replace("dev", "");
const watch = (stores, callback) => {
  const d = derived(stores, (values) => {
    return values;
  });
  let cleanupFn;
  const unsubscribe = d.subscribe(async (values) => {
    if (cleanupFn)
      cleanupFn();
    const fn = await callback(values);
    if (fn)
      cleanupFn = fn;
  });
  onDestroy(() => {
    unsubscribe();
    if (cleanupFn)
      cleanupFn();
  });
};
const currentWritable = (value) => {
  const store = writable(value);
  const extendedWritable = {
    set: (value2) => {
      extendedWritable.current = value2;
      store.set(value2);
    },
    subscribe: store.subscribe,
    update: (fn) => {
      const newValue = fn(extendedWritable.current);
      extendedWritable.current = newValue;
      store.set(newValue);
    },
    current: value
  };
  return extendedWritable;
};
const resolvePropertyPath = (target, propertyPath) => {
  if (propertyPath.includes(".")) {
    const path = propertyPath.split(".");
    const key = path.pop();
    for (let i = 0; i < path.length; i += 1) {
      target = target[path[i]];
    }
    return {
      target,
      key
    };
  } else {
    return {
      target,
      key: propertyPath
    };
  }
};
const useCanvas = () => {
  const context = getContext("threlte-canvas-context");
  if (!context) {
    throw new Error("useCanvas can only be used in a child component to <Canvas>.");
  }
  return context;
};
const useScheduler = () => {
  const context = getContext("threlte-scheduler-context");
  if (!context) {
    throw new Error("useScheduler can only be used in a child component to <Canvas>.");
  }
  return context;
};
const useCamera$1 = () => {
  const context = getContext("threlte-camera-context");
  if (!context) {
    throw new Error("useCamera can only be used in a child component to <Canvas>.");
  }
  return context;
};
const useDisposal = () => {
  const context = getContext("threlte-disposal-context");
  if (!context) {
    throw new Error("useDisposal can only be used in a child component to <Canvas>.");
  }
  return context;
};
const parentContextKey = Symbol("threlte-parent-context");
const createParentContext = (parent) => {
  const ctx = currentWritable(parent);
  setContext(parentContextKey, ctx);
  return ctx;
};
const useParent = () => {
  const parent = getContext(parentContextKey);
  return parent;
};
const parentObject3DContextKey = Symbol("threlte-parent-object3d-context");
const createParentObject3DContext = (object) => {
  const parentObject3D = getContext(parentObject3DContextKey);
  const object3D = writable(object);
  const ctx = derived([object3D, parentObject3D], ([object3D2, parentObject3D2]) => {
    return object3D2 ?? parentObject3D2;
  });
  setContext(parentObject3DContextKey, ctx);
  return object3D;
};
const useParentObject3D = () => {
  return getContext(parentObject3DContextKey);
};
const useScene = () => {
  const context = getContext("threlte-scene-context");
  if (!context) {
    throw new Error("useScene can only be used in a child component to <Canvas>.");
  }
  return context;
};
const useRenderer = () => {
  const context = getContext("threlte-renderer-context");
  if (!context) {
    throw new Error("useRenderer can only be used in a child component to <Canvas>.");
  }
  return context;
};
function Canvas($$payload, $$props) {
  push();
  $$payload.out += `<div class="svelte-1osucwe"><canvas class="svelte-1osucwe">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></canvas></div>`;
  pop();
}
const useThrelte = () => {
  const schedulerCtx = useScheduler();
  const rendererCtx = useRenderer();
  const cameraCtx = useCamera$1();
  const sceneCtx = useScene();
  const canvasCtx = useCanvas();
  const context = {
    advance: schedulerCtx.advance,
    autoRender: schedulerCtx.autoRender,
    autoRenderTask: rendererCtx.autoRenderTask,
    camera: cameraCtx.camera,
    colorManagementEnabled: rendererCtx.colorManagementEnabled,
    colorSpace: rendererCtx.colorSpace,
    dpr: rendererCtx.dpr,
    invalidate: schedulerCtx.invalidate,
    mainStage: schedulerCtx.mainStage,
    renderer: rendererCtx.renderer,
    renderMode: schedulerCtx.renderMode,
    renderStage: schedulerCtx.renderStage,
    scheduler: schedulerCtx.scheduler,
    shadows: rendererCtx.shadows,
    shouldRender: schedulerCtx.shouldRender,
    size: canvasCtx.size,
    toneMapping: rendererCtx.toneMapping,
    get scene() {
      return sceneCtx.scene;
    },
    set scene(scene) {
      sceneCtx.scene = scene;
    }
  };
  return context;
};
const isObject = (ref) => {
  return typeof ref === "object" && ref !== null;
};
const useAttach = () => {
  const { invalidate } = useThrelte();
  let detachFn;
  const attach = writable();
  const parent = useParent();
  const parentObject3D = useParentObject3D();
  const currentRef = createParentContext();
  const object3D = createParentObject3DContext();
  watch([attach, currentRef, parent, parentObject3D], ([attach2, ref, parent2, parentObject3D2]) => {
    detachFn?.();
    detachFn = void 0;
    if (!ref) {
      invalidate();
      return;
    }
    if (attach2 !== void 0) {
      if (attach2) {
        if (typeof attach2 === "function") {
          detachFn = attach2({ ref, parent: parent2, parentObject3D: parentObject3D2 });
        } else if (isInstanceOf(attach2, "Object3D") && isInstanceOf(ref, "Object3D")) {
          detachFn = () => attach2?.remove(ref);
          attach2?.add(ref);
        } else if (typeof attach2 === "string") {
          const { target, key } = resolvePropertyPath(parent2, attach2);
          const valueBeforeAttach = target[key];
          detachFn = () => target[key] = valueBeforeAttach;
          target[key] = ref;
        }
      }
    } else {
      if (isInstanceOf(ref, "Object3D")) {
        detachFn = () => parentObject3D2?.remove(ref);
        parentObject3D2?.add(ref);
      } else if (isObject(parent2)) {
        if (isInstanceOf(ref, "Material")) {
          parent2["material"] = ref;
        } else if (isInstanceOf(ref, "BufferGeometry")) {
          parent2["geometry"] = ref;
        }
      }
    }
    invalidate();
  });
  const updateAttach = (a) => {
    attach.set(a);
  };
  const updateRef = (value) => {
    currentRef.set(value);
    if (isInstanceOf(value, "Object3D")) {
      object3D.set(value);
    }
  };
  onDestroy(() => {
    detachFn?.();
    invalidate();
  });
  return {
    updateRef,
    updateAttach
  };
};
const isPerspectiveOrOrthographicCamera = (value) => {
  return isInstanceOf(value, "PerspectiveCamera") || isInstanceOf(value, "OrthographicCamera");
};
const useCamera = () => {
  const { invalidate, size, camera } = useThrelte();
  const currentRef = writable();
  const manual = writable(true);
  const makeDefault = writable(false);
  watch([currentRef, makeDefault], ([ref, makeDefault2]) => {
    if (!ref || !makeDefault2)
      return;
    camera.set(ref);
    invalidate();
  });
  watch([currentRef, manual, size], ([ref, manual2, size2]) => {
    if (!ref || manual2)
      return;
    if (isInstanceOf(ref, "OrthographicCamera")) {
      ref.left = size2.width / -2;
      ref.right = size2.width / 2;
      ref.top = size2.height / 2;
      ref.bottom = size2.height / -2;
      ref.updateProjectionMatrix();
      ref.updateMatrixWorld();
      invalidate();
    } else if (isInstanceOf(ref, "PerspectiveCamera")) {
      ref.aspect = size2.width / size2.height;
      ref.updateProjectionMatrix();
      ref.updateMatrixWorld();
      invalidate();
    }
  });
  const updateRef = (ref) => {
    if (!isPerspectiveOrOrthographicCamera(ref))
      return;
    currentRef.set(ref);
  };
  const updateManual = (m) => {
    manual.set(m);
  };
  const updateMakeDefault = (d) => {
    makeDefault.set(d);
  };
  return {
    updateRef,
    updateManual,
    updateMakeDefault
  };
};
const useCreateEvent = (oncreate) => {
  let cleanupFunction;
  const updateRef = (newRef) => {
    return;
  };
  onDestroy(() => cleanupFunction?.());
  return {
    updateRef
  };
};
const contextName = Symbol("threlte-disposable-object-context");
const isDisposableObject = (object) => {
  return typeof object?.dispose === "function" && !isInstanceOf(object, "Scene");
};
const useDispose = (dispose) => {
  let previousRef = void 0;
  const currentRef = writable(void 0);
  const localDispose = writable(dispose);
  const { disposableObjectMounted, disposableObjectUnmounted, removeObjectFromDisposal } = useDisposal();
  const parentDispose = getContext(contextName);
  const mergedDispose = derived([localDispose, parentDispose ?? writable(true)], ([localDispose2, parentDispose2]) => localDispose2 ?? parentDispose2 ?? true);
  setContext(contextName, mergedDispose);
  watch([currentRef, mergedDispose], ([ref, mergedDispose2]) => {
    if (ref === previousRef) {
      if (!mergedDispose2) {
        if (previousRef)
          removeObjectFromDisposal(previousRef);
      } else {
        if (previousRef)
          disposableObjectMounted(previousRef);
      }
    } else {
      if (mergedDispose2) {
        if (previousRef)
          disposableObjectUnmounted(previousRef);
        if (ref)
          disposableObjectMounted(ref);
      }
    }
    previousRef = ref;
  });
  onDestroy(() => {
    if (!get(mergedDispose))
      return;
    const ref = get(currentRef);
    if (ref)
      disposableObjectUnmounted(ref);
  });
  const updateRef = (ref) => {
    if (!isDisposableObject(ref))
      return;
    currentRef.set(ref);
  };
  const updateDispose = (dispose2) => {
    localDispose.set(dispose2);
  };
  return {
    updateRef,
    updateDispose
  };
};
let currentIs;
const setIs = (is) => {
  currentIs = is;
};
const useIs = () => {
  const is = currentIs;
  currentIs = void 0;
  return is;
};
const usePlugins = (args) => {
  const pluginContextName = "threlte-plugin-context";
  const plugins = getContext(pluginContextName);
  if (!plugins)
    return;
  const pluginsProps = [];
  const pluginsArray = Object.values(plugins);
  if (pluginsArray.length) {
    const pluginArgs = args();
    for (let i = 0; i < pluginsArray.length; i++) {
      const plugin = pluginsArray[i];
      const p = plugin(pluginArgs);
      if (p && p.pluginProps) {
        pluginsProps.push(...p.pluginProps);
      }
    }
  }
  return {
    pluginsProps
  };
};
const ignoredProps = /* @__PURE__ */ new Set(["$$scope", "$$slots", "type", "args", "attach", "instance"]);
const updateProjectionMatrixKeys = /* @__PURE__ */ new Set([
  "fov",
  "aspect",
  "near",
  "far",
  "left",
  "right",
  "top",
  "bottom",
  "zoom"
]);
const memoizeProp = (value) => {
  if (typeof value === "string")
    return true;
  if (typeof value === "number")
    return true;
  if (typeof value === "boolean")
    return true;
  if (typeof value === "undefined")
    return true;
  if (value === null)
    return true;
  return false;
};
const createSetter = (target, key, value) => {
  if (!Array.isArray(value) && typeof value === "number" && typeof target[key]?.setScalar === "function" && // colors do have a setScalar function, but we don't want to use it, because
  // the hex notation (i.e. 0xff0000) is very popular and matches the number
  // type. So we exclude colors here.
  !target[key]?.isColor) {
    return (target2, key2, value2) => {
      target2[key2].setScalar(value2);
    };
  } else {
    if (typeof target[key]?.set === "function") {
      if (Array.isArray(value)) {
        return (target2, key2, value2) => {
          target2[key2].set(...value2);
        };
      } else {
        return (target2, key2, value2) => {
          target2[key2].set(value2);
        };
      }
    } else {
      return (target2, key2, value2) => {
        target2[key2] = value2;
      };
    }
  }
};
const useProps = () => {
  const { invalidate } = useThrelte();
  const memoizedProps = /* @__PURE__ */ new Map();
  const memoizedSetters = /* @__PURE__ */ new Map();
  const setProp = (instance, propertyPath, value, options) => {
    if (memoizeProp(value)) {
      const memoizedProp = memoizedProps.get(propertyPath);
      if (memoizedProp && memoizedProp.instance === instance && memoizedProp.value === value) {
        return;
      }
      memoizedProps.set(propertyPath, {
        instance,
        value
      });
    }
    const { key, target } = resolvePropertyPath(instance, propertyPath);
    if (value !== void 0 && value !== null) {
      const memoizedSetter = memoizedSetters.get(propertyPath);
      if (memoizedSetter) {
        memoizedSetter(target, key, value);
      } else {
        const setter = createSetter(target, key, value);
        memoizedSetters.set(propertyPath, setter);
        setter(target, key, value);
      }
    } else {
      createSetter(target, key, value)(target, key, value);
    }
    if (options.manualCamera)
      return;
    if (updateProjectionMatrixKeys.has(key) && (target.isPerspectiveCamera || target.isOrthographicCamera)) {
      target.updateProjectionMatrix();
    }
  };
  const updateProp = (instance, key, value, options) => {
    if (!ignoredProps.has(key) && !options.pluginsProps?.includes(key)) {
      setProp(instance, key, value, options);
    }
    invalidate();
  };
  return {
    updateProp
  };
};
const classRegex = /^\s*class\s+/;
const isClass = (input) => {
  if (typeof input !== "function") {
    return false;
  }
  return classRegex.test(input.toString());
};
const argsIsConstructorParameters = (args) => {
  return Array.isArray(args);
};
const determineRef = (is, args) => {
  if (isClass(is)) {
    if (argsIsConstructorParameters(args)) {
      return new is(...args);
    } else {
      return new is();
    }
  }
  return is;
};
function T($$payload, $$props) {
  push();
  let {
    is = useIs(),
    args,
    attach,
    manual = false,
    makeDefault = false,
    dispose,
    ref = void 0,
    oncreate,
    children,
    $$slots,
    $$events,
    ...props
  } = $$props;
  let internalRef = determineRef(is, args);
  useCreateEvent();
  usePlugins(() => ({
    get ref() {
      return internalRef;
    },
    get args() {
      return args;
    },
    get attach() {
      return attach;
    },
    get manual() {
      return manual;
    },
    get makeDefault() {
      return makeDefault;
    },
    get dispose() {
      return dispose;
    },
    get props() {
      return props;
    }
  }));
  useProps();
  Object.keys(props).forEach((key) => {
  });
  useAttach();
  useCamera();
  useDispose(dispose);
  children?.($$payload, { ref: internalRef });
  $$payload.out += `<!---->`;
  bind_props($$props, { ref });
  pop();
}
const catalogue = {};
new Proxy(function() {
}, {
  apply(_target, _thisArg, argArray) {
    return T(...argArray);
  },
  get(_target, is) {
    if (typeof is !== "string") {
      return T;
    }
    const module = catalogue[is] || THREE[is];
    if (module === void 0) {
      throw new Error(`No Three.js module found for ${is}. Did you forget to extend the catalogue?`);
    }
    setIs(module);
    return T;
  }
});
const toCurrentReadable = (store) => {
  return {
    subscribe: store.subscribe,
    get current() {
      return store.current;
    }
  };
};
let previousTotalLoaded = 0;
const finishedOnce = currentWritable(false);
const activeStore = currentWritable(false);
const itemStore = currentWritable(void 0);
const loadedStore = currentWritable(0);
const totalStore = currentWritable(0);
const errorsStore = currentWritable([]);
const progressStore = currentWritable(0);
const { onStart, onLoad, onError } = DefaultLoadingManager;
DefaultLoadingManager.onStart = (url, loaded, total) => {
  onStart?.(url, loaded, total);
  activeStore.set(true);
  itemStore.set(url);
  loadedStore.set(loaded);
  totalStore.set(total);
  const progress = (loaded - previousTotalLoaded) / (total - previousTotalLoaded);
  progressStore.set(progress);
  if (progress === 1)
    finishedOnce.set(true);
};
DefaultLoadingManager.onLoad = () => {
  onLoad?.();
  activeStore.set(false);
};
DefaultLoadingManager.onError = (url) => {
  onError?.(url);
  errorsStore.update((errors) => {
    return [...errors, url];
  });
};
DefaultLoadingManager.onProgress = (url, loaded, total) => {
  if (loaded === total) {
    previousTotalLoaded = total;
  }
  activeStore.set(true);
  itemStore.set(url);
  loadedStore.set(loaded);
  totalStore.set(total);
  const progress = (loaded - previousTotalLoaded) / (total - previousTotalLoaded) || 1;
  progressStore.set(progress);
  if (progress === 1)
    finishedOnce.set(true);
};
({
  active: toCurrentReadable(activeStore),
  item: toCurrentReadable(itemStore),
  loaded: toCurrentReadable(loadedStore),
  total: toCurrentReadable(totalStore),
  errors: toCurrentReadable(errorsStore),
  progress: toCurrentReadable(progressStore),
  finishedOnce: toCurrentReadable(finishedOnce)
});
new Vector3();
new Vector3();
new Vector3();
new Sphere();
new Matrix4();
new Ray();
new Vector3();
new Vector3();
new Vector3();
new Vector3();
new Vector2();
Number.parseInt(REVISION.replace("dev", ""));
new Matrix4();
new Matrix4();
new Mesh();
`
    #include <common>
    ${ShaderChunk.logdepthbuf_pars_vertex}
    ${ShaderChunk.fog_pars_vertex}

    attribute vec3 previous;
    attribute vec3 next;
    attribute float side;
    attribute float width;
    attribute float counters;

    uniform vec2 resolution;
    uniform float lineWidth;
    uniform vec3 color;
    uniform float opacity;
    uniform float sizeAttenuation;
    uniform float scaleDown;

    varying vec2 vUV;
    varying vec4 vColor;
    varying float vCounters;

    vec2 intoScreen(vec4 i) {
        return resolution * (0.5 * i.xy / i.w + 0.5);
    }

    void main() {
        float aspect = resolution.y / resolution.x;

        mat4 m = projectionMatrix * modelViewMatrix;

        vec4 currentClip = m * vec4( position, 1.0 );
        vec4 prevClip = m * vec4( previous, 1.0 );
        vec4 nextClip = m * vec4( next, 1.0 );

        vec4 currentNormed = currentClip / currentClip.w;
        vec4 prevNormed = prevClip / prevClip.w;
        vec4 nextNormed = nextClip / nextClip.w;

        vec2 currentScreen = intoScreen(currentNormed);
        vec2 prevScreen = intoScreen(prevNormed);
        vec2 nextScreen = intoScreen(nextNormed);

        float actualWidth = lineWidth * width;

        vec2 dir;
        if(nextScreen == currentScreen) {
            dir = normalize( currentScreen - prevScreen );
        } else if(prevScreen == currentScreen) {
            dir = normalize( nextScreen - currentScreen );
        } else {
            vec2 inDir = currentScreen - prevScreen;
            vec2 outDir = nextScreen - currentScreen;
            vec2 fullDir = nextScreen - prevScreen;

            if(length(fullDir) > 0.0) {
                dir = normalize(fullDir);
            } else if(length(inDir) > 0.0){
                dir = normalize(inDir);
            } else {
                dir = normalize(outDir);
            }
        }

        vec2 normal = vec2(-dir.y, dir.x);

        if(sizeAttenuation != 0.0) {
            normal /= currentClip.w;
            normal *= min(resolution.x, resolution.y);
        }

        if (scaleDown > 0.0) {
            float dist = length(nextNormed - prevNormed);
            normal *= smoothstep(0.0, scaleDown, dist);
        }

        vec2 offsetInScreen = actualWidth * normal * side * 0.5;

        vec2 withOffsetScreen = currentScreen + offsetInScreen;
        vec3 withOffsetNormed = vec3((2.0 * withOffsetScreen/resolution - 1.0), currentNormed.z);

        vCounters = counters;
        vColor = vec4( color, opacity );
        vUV = uv;

        gl_Position = currentClip.w * vec4(withOffsetNormed, 1.0);

        ${ShaderChunk.logdepthbuf_vertex}
        ${ShaderChunk.fog_vertex}
    }
`;
`
uniform vec3 glowColor;
uniform float falloffAmount;
uniform float glowSharpness;
uniform float glowInternalRadius;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
	// Normal
	vec3 normal = normalize(vNormal);
	if(!gl_FrontFacing)
			normal *= - 1.0;
	vec3 viewDirection = normalize(cameraPosition - vPosition);
	float fresnel = dot(viewDirection, normal);
	fresnel = pow(fresnel, glowInternalRadius + 0.1);
	float falloff = smoothstep(0., falloffAmount, fresnel);
	float fakeGlow = fresnel;
	fakeGlow += fresnel * glowSharpness;
	fakeGlow *= falloff;
	gl_FragColor = vec4(clamp(glowColor * fresnel, 0., 1.0), clamp(fakeGlow, 0., 1.0));

	${ShaderChunk.tonemapping_fragment}
	${ShaderChunk.colorspace_fragment}
}`;
`
uniform sampler2D pointTexture;
uniform float fade;
uniform float opacity;

varying vec3 vColor;
void main() {
	float pointOpacity = 1.0;
	if (fade == 1.0) {
		float d = distance(gl_PointCoord, vec2(0.5, 0.5));
		pointOpacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
	}
	gl_FragColor = vec4(vColor, pointOpacity * opacity);

	${ShaderChunk.tonemapping_fragment}
	${ShaderChunk.colorspace_fragment}
}`;
`#define ENVMAP_TYPE_CUBE_UV
precision highp isampler2D;
precision highp usampler2D;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying mat4 vModelMatrixInverse;

#ifdef USE_INSTANCING_COLOR
	varying vec3 vInstanceColor;
#endif

#ifdef ENVMAP_TYPE_CUBEM
	uniform samplerCube envMap;
#else
	uniform sampler2D envMap;
#endif

uniform float bounces;
${shaderStructs}
${shaderIntersectFunction}
uniform BVH bvh;
uniform float ior;
uniform bool correctMips;
uniform vec2 resolution;
uniform float fresnel;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrixInverse;
uniform mat4 viewMatrixInverse;
uniform float aberrationStrength;
uniform vec3 color;

float fresnelFunc(vec3 viewDirection, vec3 worldNormal) {
	return pow( 1.0 + dot( viewDirection, worldNormal), 10.0 );
}

vec3 totalInternalReflection(vec3 ro, vec3 rd, vec3 normal, float ior, mat4 modelMatrixInverse) {
	vec3 rayOrigin = ro;
	vec3 rayDirection = rd;
	rayDirection = refract(rayDirection, normal, 1.0 / ior);
	rayOrigin = vWorldPosition + rayDirection * 0.001;
	rayOrigin = (modelMatrixInverse * vec4(rayOrigin, 1.0)).xyz;
	rayDirection = normalize((modelMatrixInverse * vec4(rayDirection, 0.0)).xyz);
	for(float i = 0.0; i < bounces; i++) {
		uvec4 faceIndices = uvec4( 0u );
		vec3 faceNormal = vec3( 0.0, 0.0, 1.0 );
		vec3 barycoord = vec3( 0.0 );
		float side = 1.0;
		float dist = 0.0;
		bvhIntersectFirstHit( bvh, rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist );
		vec3 hitPos = rayOrigin + rayDirection * max(dist - 0.001, 0.0);
		vec3 tempDir = refract(rayDirection, faceNormal, ior);
		if (length(tempDir) != 0.0) {
			rayDirection = tempDir;
			break;
		}
		rayDirection = reflect(rayDirection, faceNormal);
		rayOrigin = hitPos + rayDirection * 0.01;
	}
	rayDirection = normalize((modelMatrix * vec4(rayDirection, 0.0)).xyz);
	return rayDirection;
}

#include <common>
#include <cube_uv_reflection_fragment>

#ifdef ENVMAP_TYPE_CUBEM
	vec4 textureGradient(samplerCube envMap, vec3 rayDirection, vec3 directionCamPerfect) {
		return textureGrad(envMap, rayDirection, dFdx(correctMips ? directionCamPerfect: rayDirection), dFdy(correctMips ? directionCamPerfect: rayDirection));
	}
#else
	vec4 textureGradient(sampler2D envMap, vec3 rayDirection, vec3 directionCamPerfect) {
		vec2 uvv = equirectUv( rayDirection );
		vec2 smoothUv = equirectUv( directionCamPerfect );
		return textureGrad(envMap, uvv, dFdx(correctMips ? smoothUv : uvv), dFdy(correctMips ? smoothUv : uvv));
	}
#endif

void main() {
	vec2 uv = gl_FragCoord.xy / resolution;
	vec3 directionCamPerfect = (projectionMatrixInverse * vec4(uv * 2.0 - 1.0, 0.0, 1.0)).xyz;
	directionCamPerfect = (viewMatrixInverse * vec4(directionCamPerfect, 0.0)).xyz;
	directionCamPerfect = normalize(directionCamPerfect);
	vec3 normal = vNormal;
	vec3 rayOrigin = cameraPosition;
	vec3 rayDirection = normalize(vWorldPosition - cameraPosition);
	vec3 finalColor;
	#ifdef CHROMATIC_ABERRATIONS
		vec3 rayDirectionG = totalInternalReflection(rayOrigin, rayDirection, normal, max(ior, 1.0), vModelMatrixInverse);
		#ifdef FAST_CHROMA
			vec3 rayDirectionR = normalize(rayDirectionG + 1.0 * vec3(aberrationStrength / 2.0));
			vec3 rayDirectionB = normalize(rayDirectionG - 1.0 * vec3(aberrationStrength / 2.0));
		#else
			vec3 rayDirectionR = totalInternalReflection(rayOrigin, rayDirection, normal, max(ior * (1.0 - aberrationStrength), 1.0), vModelMatrixInverse);
			vec3 rayDirectionB = totalInternalReflection(rayOrigin, rayDirection, normal, max(ior * (1.0 + aberrationStrength), 1.0), vModelMatrixInverse);
		#endif
		float finalColorR = textureGradient(envMap, rayDirectionR, directionCamPerfect).r;
		float finalColorG = textureGradient(envMap, rayDirectionG, directionCamPerfect).g;
		float finalColorB = textureGradient(envMap, rayDirectionB, directionCamPerfect).b;
		finalColor = vec3(finalColorR, finalColorG, finalColorB);
	#else
		rayDirection = totalInternalReflection(rayOrigin, rayDirection, normal, max(ior, 1.0), vModelMatrixInverse);
		finalColor = textureGradient(envMap, rayDirection, directionCamPerfect).rgb;
	#endif

	finalColor *= color;
	#ifdef USE_INSTANCING_COLOR
		finalColor *= vInstanceColor;
	#endif

	vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
	float nFresnel = fresnelFunc(viewDirection, normal) * fresnel;
	gl_FragColor = vec4(mix(finalColor, vec3(1.0), nFresnel), 1.0);
	${ShaderChunk.tonemapping_fragment}
	${ShaderChunk.colorspace_fragment}
}`;
new Box3();
new Color();
export {
  Canvas as C,
  tick as t
};

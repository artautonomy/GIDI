import type { Camera, ColorRepresentation, Vector3Tuple } from 'three';
import type { CSMParameters } from 'three/examples/jsm/csm/CSM.js';
import { CSM } from 'three/examples/jsm/csm/CSM.js';
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
type $$__sveltets_2_PropsWithChildren<Props, Slots> = Props & (Slots extends {
    default: any;
} ? Props extends Record<string, never> ? any : {
    children?: any;
} : {});
declare const Csm: $$__sveltets_2_IsomorphicComponent<$$__sveltets_2_PropsWithChildren<{
    /**
       * Whether or not CSM is enabled. If `enabled={false}`, a slot named
       * `"disabled"` will be rendered.
       */ enabled?: boolean;
    /**
       * The arguments to pass to the CSM constructor.
       */ args?: Partial<CSMParameters>;
    /**
       * The camera to use for CSM. Defaults to the camera set by `makeDefault`.
       */ camera?: Camera | undefined;
    /**
       * A configuration callback, which is triggered when CSM is activated. This
       * callback facilitates advanced configurations, such as enabling the fade
       * feature.
       */ configure?: ((csm: CSM) => void) | undefined;
    lightIntensity?: number | undefined;
    lightColor?: ColorRepresentation | undefined;
    lightDirection?: Vector3Tuple;
}, {
    default: {};
    disabled: {};
}>, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {};
    disabled: {};
}, {}, string>;
type Csm = InstanceType<typeof Csm>;
export default Csm;

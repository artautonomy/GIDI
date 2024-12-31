import { SvelteComponentTyped } from "svelte";
import type { Components } from '../type/types';
import type { Texts } from '../utils/texts';
declare const __propDef: {
    props: {
        /** customize the ColorPicker component parts. Can be used to display a Chrome variant or an Accessibility Notice */ components: Components;
        /** hue value */ h: number;
        /** saturation value */ s: number;
        /** vibrance value */ v: number;
        /** indicator whether the selected color is light or dark */ isDark: boolean;
        /** all translation tokens used in the library; can be partially overridden; see [full object type](https://github.com/Ennoriel/svelte-awesome-color-picker/blob/master/src/lib/utils/texts.ts) */ texts: Texts;
    };
    events: {
        input: CustomEvent<{
            s: number;
            v: number;
        }>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type PickerProps = typeof __propDef.props;
export type PickerEvents = typeof __propDef.events;
export type PickerSlots = typeof __propDef.slots;
/**
 * Picker wrapper containing the mouse and keyboard logic to select the color. _internal component_
 *
 * **Import**
 * N.A.
 *
 * **Use**
 * N.A.
 *
 * **Props**
 * @prop components: Components — customize the ColorPicker component parts. Can be used to display a Chrome variant or an Accessibility Notice
 * @prop h: number — hue value
 * @prop s: number — saturation value
 * @prop v: number — vibrance value
 * @prop isDark: boolean — indicator whether the selected color is light or dark
 * @prop texts: Texts — all translation tokens used in the library; can be partially overridden; see [full object type](https://github.com/Ennoriel/svelte-awesome-color-picker/blob/master/src/lib/utils/texts.ts)
 */
export default class Picker extends SvelteComponentTyped<PickerProps, PickerEvents, PickerSlots> {
}
export {};

import { SvelteComponentTyped } from "svelte";
import type { Texts } from '../../../utils/texts';
import type { RgbaColor, HsvaColor } from 'colord';
declare const __propDef: {
    props: {
        /** if set to false, disables the alpha channel */ isAlpha: boolean;
        /** rgb color */ rgb: RgbaColor;
        /** hsv color */ hsv: HsvaColor;
        /** hex color */ hex: string;
        /** configure which hex, rgb and hsv inputs will be visible and in which order. If overridden, it is necessary to provide at least one value */ textInputModes: Array<"hex" | "rgb" | "hsv">;
        /** all translation tokens used in the library; can be partially overridden; see [full object type](https://github.com/Ennoriel/svelte-awesome-color-picker/blob/master/src/lib/utils/texts.ts) */ texts: Texts;
    };
    events: {
        input: CustomEvent<{
            hsv?: HsvaColor;
            rgb?: RgbaColor;
            hex?: string;
        }>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type TextInputProps = typeof __propDef.props;
export type TextInputEvents = typeof __propDef.events;
export type TextInputSlots = typeof __propDef.slots;
/**
 * text inputs for the hex, rgb and hsv colors. This component cannot be imported
 * directly but can be overridden.
 *
 * **Import**
 * _N.A._
 *
 * **Use**
 * _N.A._
 *
 * **Props**
 * @prop isAlpha: boolean — if set to false, disables the alpha channel
 * @prop rgb: RgbaColor — rgb color
 * @prop hsv: HsvaColor — hsv color
 * @prop hex: string — hex color
 * @prop textInputModes: Array&lt;'hex' | 'rgb' | 'hsv'&gt; — configure which hex, rgb and hsv inputs will be visible and in which order. If overridden, it is necessary to provide at least one value
 * @prop texts: Texts — all translation tokens used in the library; can be partially overridden; see [full object type](https://github.com/Ennoriel/svelte-awesome-color-picker/blob/master/src/lib/utils/texts.ts)
 */
export default class TextInput extends SvelteComponentTyped<TextInputProps, TextInputEvents, TextInputSlots> {
}
export {};

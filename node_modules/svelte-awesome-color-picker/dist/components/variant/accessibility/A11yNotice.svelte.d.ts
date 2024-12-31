import { SvelteComponentTyped } from "svelte";
import { type A11yTextsPartial } from '../../../utils/texts';
import type { A11yColor } from '../../../type/types';
import type { Components } from '../../../type/types';
declare const __propDef: {
    props: {
        /** customize the ColorPicker component parts. Can be used to display a Chrome variant or an Accessibility Notice */ components: Components;
        /** hex color */ hex: string;
        /** define the accessibility examples in the color picker */ a11yColors: Array<A11yColor>;
        /** required WCAG contrast level */ a11yLevel: "AA" | "AAA";
        /** all a11y translation tokens used in the library; override with translations if necessary; see [full object type](https://github.com/Ennoriel/svelte-awesome-color-picker/blob/master/src/lib/utils/texts.ts) */ a11yTexts?: A11yTextsPartial | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type A11yNoticeProps = typeof __propDef.props;
export type A11yNoticeEvents = typeof __propDef.events;
export type A11yNoticeSlots = typeof __propDef.slots;
/**
 * Accessibility notice — this component is meant to be used with the A11yVariant object as a variant to display the accessibility notice.
 *
 * **Import**
 * ```js
 * import { A11yVariant } from 'svelte-awesome-color-picker';
 * ```
 *
 * **Use**
 * ```svelte
 * <ColorPicker bind:hex components={A11yVariant} />
 * ```
 *
 * **Props**
 * @prop components: Components — customize the ColorPicker component parts. Can be used to display a Chrome variant or an Accessibility Notice
 * @prop hex: string — hex color
 * @prop a11yColors: Array&lt;A11yColor&gt; — define the accessibility examples in the color picker
 * @prop a11yLevel: 'AA' | 'AAA' — required WCAG contrast level
 * @prop a11yTexts: A11yTextsPartial | undefined = undefined — all a11y translation tokens used in the library; override with translations if necessary; see [full object type](https://github.com/Ennoriel/svelte-awesome-color-picker/blob/master/src/lib/utils/texts.ts)
 */
export default class A11yNotice extends SvelteComponentTyped<A11yNoticeProps, A11yNoticeEvents, A11yNoticeSlots> {
}
export {};

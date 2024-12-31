import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /** placeholder, falls back to `Lorem Ipsum` */ placeholder?: string | undefined;
        /** size of the text */ size?: "normal" | "large" | undefined;
        /** required WCAG contrast level */ a11yLevel: "AA" | "AAA";
        /** placeholder text color */ textColor: string;
        /** placeholder background color */ bgColor: string;
        /** RGAA contrast between the text and its background. Between 1 and 21 */ contrast?: number;
        /** define the accessibility "contrast" text */ contrastText: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type A11ySingleNoticeProps = typeof __propDef.props;
export type A11ySingleNoticeEvents = typeof __propDef.events;
export type A11ySingleNoticeSlots = typeof __propDef.slots;
/**
 * accessibility notice for a single color — this component is meant to be used with the A11yVariant object as a variant to display the accessibility notice.
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
 * @prop placeholder: string | undefined = undefined — placeholder, falls back to `Lorem Ipsum`
 * @prop size: 'normal' | 'large' | undefined = undefined — size of the text
 * @prop a11yLevel: 'AA' | 'AAA' — required WCAG contrast level
 * @prop textColor: string — placeholder text color
 * @prop bgColor: string — placeholder background color
 * @prop contrast: number = 1 — RGAA contrast between the text and its background. Between 1 and 21
 * @prop contrastText: string — define the accessibility "contrast" text
 */
export default class A11ySingleNotice extends SvelteComponentTyped<A11ySingleNoticeProps, A11ySingleNoticeEvents, A11ySingleNoticeSlots> {
}
export {};

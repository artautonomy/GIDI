import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /** DOM element of the label wrapper */ labelElement: HTMLLabelElement;
        /** hex color */ hex: string | undefined;
        /** input label */ label: string;
        /** input name, useful in a native form */ name?: string | undefined;
        isOpen: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type InputProps = typeof __propDef.props;
export type InputEvents = typeof __propDef.events;
export type InputSlots = typeof __propDef.slots;
/**
 * button to open the color picker. Also provides a hidden input with the hex value selected by the user
 * to fallback to color picker to the default browser one if a problem happens. This component cannot be imported
 * directly but can be overridden.
 *
 * **Import**
 * _N.A._
 *
 * **Use**
 * _N.A._
 *
 * **Props**
 * @prop labelElement: HTMLLabelElement — DOM element of the label wrapper
 * @prop hex: string | undefined — hex color
 * @prop label: string — input label
 * @prop name: string | undefined = undefined — input name, useful in a native form
 * @prop isOpen: boolean — indicator of the popup state
 */
export default class Input extends SvelteComponentTyped<InputProps, InputEvents, InputSlots> {
}
export {};

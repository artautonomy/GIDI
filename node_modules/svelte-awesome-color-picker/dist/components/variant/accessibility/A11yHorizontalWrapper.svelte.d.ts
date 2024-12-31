import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /** DOM element of the Color Picker popup wrapper */ wrapper: HTMLElement;
        /** indicator of the popup state */ isOpen: boolean;
        /** if set to true, the wrapper should have a dialog role and be absolute. It should be relative otherwise */ isDialog: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type A11yHorizontalWrapperProps = typeof __propDef.props;
export type A11yHorizontalWrapperEvents = typeof __propDef.events;
export type A11yHorizontalWrapperSlots = typeof __propDef.slots;
/**
 * Accessibility horizontal wrapper — this component is meant to be used with the A11yVariant object as a variant to display the accessibility notice.
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
 * @prop wrapper: HTMLElement — DOM element of the Color Picker popup wrapper
 * @prop isOpen: boolean — indicator of the popup state
 * @prop isDialog: boolean — if set to true, the wrapper should have a dialog role and be absolute. It should be relative otherwise
 */
export default class A11yHorizontalWrapper extends SvelteComponentTyped<A11yHorizontalWrapperProps, A11yHorizontalWrapperEvents, A11yHorizontalWrapperSlots> {
}
export {};

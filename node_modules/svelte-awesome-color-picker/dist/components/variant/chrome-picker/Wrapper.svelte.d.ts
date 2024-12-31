import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /** DOM element of the wrapper element */ wrapper: HTMLElement;
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
export type WrapperProps = typeof __propDef.props;
export type WrapperEvents = typeof __propDef.events;
export type WrapperSlots = typeof __propDef.slots;
/**
 * Chrome variant wrapper — this component is meant to be used with the ChromeVariant object to display a Chrome like variant.
 *
 * **Import**
 * ```js
 * import { ChromeVariant } from 'svelte-awesome-color-picker';
 * ```
 *
 * **Use**
 * ```svelte
 * <ColorPicker bind:hex components={ChromeVariant} />
 * ```
 *
 * **Props**
 * @prop wrapper: HTMLElement — DOM element of the wrapper element
 * @prop isOpen: boolean — indicator of the popup state
 * @prop isDialog: boolean — if set to true, the wrapper should have a dialog role and be absolute. It should be relative otherwise
 */
export default class Wrapper extends SvelteComponentTyped<WrapperProps, WrapperEvents, WrapperSlots> {
}
export {};

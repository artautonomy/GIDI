import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /** indicator position in % */ pos: {
            x: number;
            y: number;
        };
        /** indicator whether the selected color is light or dark */ isDark: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type PickerIndicatorProps = typeof __propDef.props;
export type PickerIndicatorEvents = typeof __propDef.events;
export type PickerIndicatorSlots = typeof __propDef.slots;
export default class PickerIndicator extends SvelteComponentTyped<PickerIndicatorProps, PickerIndicatorEvents, PickerIndicatorSlots> {
}
export {};

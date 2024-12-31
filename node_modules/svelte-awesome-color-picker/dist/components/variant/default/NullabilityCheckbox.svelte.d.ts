import { SvelteComponentTyped } from "svelte";
import type { Texts } from '../../../utils/texts';
declare const __propDef: {
    props: {
        /** whether the color picker is undefined */ isUndefined: boolean;
        /** all translation tokens used in the library; can be partially overridden; see [full object type](https://github.com/Ennoriel/svelte-awesome-color-picker/blob/master/src/lib/utils/texts.ts) */ texts: Texts;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type NullabilityCheckboxProps = typeof __propDef.props;
export type NullabilityCheckboxEvents = typeof __propDef.events;
export type NullabilityCheckboxSlots = typeof __propDef.slots;
export default class NullabilityCheckbox extends SvelteComponentTyped<NullabilityCheckboxProps, NullabilityCheckboxEvents, NullabilityCheckboxSlots> {
}
export {};

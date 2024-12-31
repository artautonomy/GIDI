import { default as ColorPicker } from './components/ColorPicker.svelte';
import { default as ChromeWrapper } from './components/variant/chrome-picker/Wrapper.svelte';
import { default as A11yHorizontalWrapper } from './components/variant/accessibility/A11yHorizontalWrapper.svelte';
import { default as A11yNotice } from './components/variant/accessibility/A11yNotice.svelte';
import { default as A11ySingleNotice } from './components/variant/accessibility/A11ySingleNotice.svelte';
export default ColorPicker;
export type { HsvaColor, RgbaColor } from 'colord';
export declare const ChromeVariant: {
    wrapper: typeof ChromeWrapper;
};
export declare const A11yVariant: {
    wrapper: typeof A11yHorizontalWrapper;
    a11yNotice: typeof A11yNotice;
    a11ySingleNotice: typeof A11ySingleNotice;
};
export { mix } from './utils/colors';

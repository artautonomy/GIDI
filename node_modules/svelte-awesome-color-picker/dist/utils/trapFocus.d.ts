export declare const FOCUSABLE_ELEMENTS = "a[href], area[href], input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";
export declare const trapFocus: (node: HTMLElement) => {
    destroy(): void;
};
export type Trap = ReturnType<typeof trapFocus>;

export declare const defaultTexts: {
    label: {
        h: string;
        s: string;
        v: string;
        r: string;
        g: string;
        b: string;
        a: string;
        hex: string;
        withoutColor: string;
    };
    color: {
        rgb: string;
        hsv: string;
        hex: string;
    };
    changeTo: string;
};
export declare const defaultA11yTexts: {
    contrast: string;
    nbGradeSummary: (count: number) => string;
    guidelines: string;
};
export type Texts = typeof defaultTexts;
export type A11yTexts = typeof defaultA11yTexts;
export type DeepPartial<T> = T extends Function ? T : T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
export type TextsPartial = DeepPartial<Texts>;
export type A11yTextsPartial = DeepPartial<A11yTexts>;

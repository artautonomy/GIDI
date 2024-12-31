import type { A11yColor } from '../type/types';
/**
 * compute the resulting color of hexA over hexB. If hexB has transparency, computes it over a white background
 * @param hexA
 * @param hexB
 * @returns
 */
export declare function mix(hexA: string, hexB?: string): string;
export declare function getContrast(a11yColor: A11yColor, hex: string | undefined): {
    trueColors: {
        textColor: string;
        bgColor: string;
    };
    contrast: number;
    placeholder?: string;
    size?: "normal" | "large";
    textHex: string;
    bgHex?: string;
    reverse: true;
} | {
    trueColors: {
        textColor: string;
        bgColor: string;
    };
    contrast: number;
    placeholder?: string;
    size?: "normal" | "large";
    bgHex?: string;
    reverse?: false;
} | undefined;

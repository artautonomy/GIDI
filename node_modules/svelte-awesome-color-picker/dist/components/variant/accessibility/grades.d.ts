import type { A11yColorContract } from '../../../type/types';
export declare const grades: {
    normal: {
        AA: number;
        AAA: number;
    };
    large: {
        AA: number;
        AAA: number;
    };
};
export declare function isGradeAchieved(contrast: number, size: 'normal' | 'large' | undefined, grade: 'AA' | 'AAA'): boolean;
export declare function getNumberOfGradeFailed({ contrast, size }: A11yColorContract, a11yLevel: 'AA' | 'AAA'): number;

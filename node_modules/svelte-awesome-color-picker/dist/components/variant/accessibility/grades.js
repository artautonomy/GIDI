export const grades = {
    normal: {
        AA: 4.5,
        AAA: 7
    },
    large: {
        AA: 3,
        AAA: 4.5
    }
};
export function isGradeAchieved(contrast, size = 'normal', grade) {
    return contrast >= grades[size][grade];
}
export function getNumberOfGradeFailed({ contrast, size }, a11yLevel) {
    if (!contrast) {
        return 1;
    }
    const isAA = isGradeAchieved(contrast, size, 'AA');
    if (a11yLevel === 'AA') {
        return isAA ? 0 : 1;
    }
    else if (!isAA) {
        return 2;
    }
    const isAAA = isGradeAchieved(contrast, size, 'AAA');
    return isAAA ? 0 : 1;
}

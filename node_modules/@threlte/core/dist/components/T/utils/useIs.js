let currentIs;
export const setIs = (is) => {
    currentIs = is;
};
export const useIs = () => {
    const is = currentIs;
    currentIs = undefined;
    return is;
};

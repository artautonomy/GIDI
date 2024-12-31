import type { BaseProps } from '../types';
export declare const useAttach: <T extends unknown>() => {
    updateRef: (value: T) => void;
    updateAttach: (a: BaseProps<T>["attach"]) => void;
};

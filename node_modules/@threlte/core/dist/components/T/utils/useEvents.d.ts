import type { MaybeInstance } from '../types';
type Props = Record<string, (arg: unknown) => void>;
export declare const useEvents: <T>(props?: Props) => {
    updateRef: (ref: MaybeInstance<T>) => (() => void) | undefined;
};
export {};

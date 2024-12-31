import { type CurrentReadable } from '../lib/storeUtils';
export declare const useProgress: () => {
    active: CurrentReadable<boolean>;
    item: CurrentReadable<string | undefined>;
    loaded: CurrentReadable<number>;
    total: CurrentReadable<number>;
    errors: CurrentReadable<string[]>;
    progress: CurrentReadable<number>;
    finishedOnce: CurrentReadable<boolean>;
};

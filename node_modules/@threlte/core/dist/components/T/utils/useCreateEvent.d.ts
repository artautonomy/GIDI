import type { CreateEvent, MaybeInstance } from '../types';
export declare const useCreateEvent: <T>(oncreate?: CreateEvent<T>) => {
    updateRef: (newRef: MaybeInstance<T>) => void;
};

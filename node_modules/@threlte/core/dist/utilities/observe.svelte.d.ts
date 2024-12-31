import { type Readable } from 'svelte/store';
type Dependency = Readable<any> | any;
type Dependencies = [Dependency, ...Array<Dependency>];
type ExtractReadableType<T> = T extends Readable<infer U> ? U : T;
type CallbackArgs<D extends Dependencies> = {
    [K in keyof D]: ExtractReadableType<D[K]>;
};
type Callback<D extends Dependencies> = (deps: CallbackArgs<D>) => void | (() => void);
export declare const observe: (<Deps extends Dependencies>(dependencies: () => Deps, callback: Callback<Deps>) => void) & {
    pre: <Deps extends Dependencies>(dependencies: () => Deps, callback: Callback<Deps>) => void;
};
export {};

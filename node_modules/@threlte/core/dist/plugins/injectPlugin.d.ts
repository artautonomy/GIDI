import type { AnyProps, Plugin } from './types';
export declare function injectPlugin<Props extends AnyProps = AnyProps>(name: string, plugin: Plugin<Props>): void;

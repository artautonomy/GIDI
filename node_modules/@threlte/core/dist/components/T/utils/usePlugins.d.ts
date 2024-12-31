import type { Plugin } from '../../../plugins/types';
export declare const usePlugins: (args: () => Parameters<Plugin>[0]) => {
    pluginsProps: string[];
} | undefined;

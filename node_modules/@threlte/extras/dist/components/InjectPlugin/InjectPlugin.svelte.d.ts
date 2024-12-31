import { type Plugin } from '@threlte/core';
import type { Snippet } from 'svelte';
/**
 * This component is used to inject plugins. You provide an injector
 * function that injects a plugin.
 *
 * @example
 * ```svelte
 * <InjectPlugin>
 * {@render children?.()}
 * </InjectPlugin>
 * ```
 */
declare const InjectPlugin: import("svelte").Component<{
    name: string;
    plugin: Plugin;
    children?: Snippet;
}, {}, "">;
export default InjectPlugin;

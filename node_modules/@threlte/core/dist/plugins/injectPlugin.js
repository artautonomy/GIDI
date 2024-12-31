import { getContext, setContext } from 'svelte';
export function injectPlugin(name, plugin) {
    const contextName = 'threlte-plugin-context';
    if (!plugin)
        return;
    setContext(contextName, {
        ...getContext(contextName),
        [name]: plugin
    });
}

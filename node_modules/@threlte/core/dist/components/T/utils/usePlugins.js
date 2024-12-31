import { getContext } from 'svelte';
export const usePlugins = (args) => {
    const pluginContextName = 'threlte-plugin-context';
    const plugins = getContext(pluginContextName);
    if (!plugins)
        return;
    const pluginsProps = [];
    const pluginsArray = Object.values(plugins);
    if (pluginsArray.length) {
        const pluginArgs = args();
        // initalize plugins
        for (let i = 0; i < pluginsArray.length; i++) {
            const plugin = pluginsArray[i];
            // initialize plugin
            const p = plugin(pluginArgs);
            if (p && p.pluginProps) {
                pluginsProps.push(...p.pluginProps);
            }
        }
    }
    return {
        pluginsProps
    };
};

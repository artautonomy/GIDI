import { injectInteractivityPlugin } from './plugin.svelte';
import { setupInteractivity } from './setupInteractivity';
import { setInteractivityContext } from './context';
const interactivity = (options) => {
    const context = setInteractivityContext(options);
    injectInteractivityPlugin();
    setupInteractivity(context);
    return context;
};
// exports
export { useInteractivity } from './context';
export { interactivity };

import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.CANFC4pp.js","_app/immutable/chunks/disclose-version.CbQWKql7.js","_app/immutable/chunks/utils.F7Ud3tqr.js","_app/immutable/chunks/store.rOjKrHxV.js","_app/immutable/chunks/index.tACDdagU.js","_app/immutable/chunks/style.PwPRnE0L.js","_app/immutable/chunks/index-client.DDb0GLON.js"];
export const stylesheets = ["_app/immutable/assets/0.CLLg-RLl.css"];
export const fonts = [];

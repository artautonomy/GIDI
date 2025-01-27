import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.CQvGqksx.js","_app/immutable/chunks/disclose-version.CyJLuhDn.js","_app/immutable/chunks/utils.CQdqtoc_.js","_app/immutable/chunks/store.2xqInZ_v.js","_app/immutable/chunks/index.Ck1l4gi6.js","_app/immutable/chunks/index.LDKbWZ8V.js","_app/immutable/chunks/misc.B9QI8j-U.js","_app/immutable/chunks/index-client.DzFwc65J.js"];
export const stylesheets = ["_app/immutable/assets/0.B17Qf3hk.css"];
export const fonts = [];

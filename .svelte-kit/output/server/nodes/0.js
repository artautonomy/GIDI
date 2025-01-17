import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.ChPQ7AQn.js","_app/immutable/chunks/disclose-version.pfXmSEhd.js","_app/immutable/chunks/utils.D4X0fo_M.js","_app/immutable/chunks/store.DNqYxzzl.js","_app/immutable/chunks/index.4UdGpfs7.js","_app/immutable/chunks/style.5SLNh1tl.js","_app/immutable/chunks/misc.B9QI8j-U.js","_app/immutable/chunks/index-client.NmN1UXmv.js","_app/immutable/chunks/index.DWZTmDCG.js"];
export const stylesheets = ["_app/immutable/assets/0.B17Qf3hk.css"];
export const fonts = [];

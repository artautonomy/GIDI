import { z as pop, x as push, A as add_styles, C as stringify, D as store_get, E as unsubscribe_stores } from "../../chunks/index.js";
import { colord } from "colord";
import { a as attr, S as Settings } from "../../chunks/store.js";
import "clsx";
function MIDI_1($$payload, $$props) {
  push();
  pop();
}
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let { children } = $$props;
  MIDI_1();
  $$payload.out += `<!----> <threlte${add_styles({ display: "none" })} class="svelte-12pb0e4">`;
  children($$payload);
  $$payload.out += `<!----></threlte> <socials${attr("style", `--opacity: ${stringify(0)}; --invert: ${stringify(colord(store_get($$store_subs ??= {}, "$Settings", Settings).colours.background).isLight() ? 1 : 0)}`)} class="svelte-12pb0e4"><a href="https://github.com/artautonomy/GIDI" aria-label="github" class="svelte-12pb0e4"><img src="/socials/github.png" class="icons svelte-12pb0e4" alt="github"></a> <a href="https://www.paypal.com/paypalme/GIDIWebApp" aria-label="paypal" class="svelte-12pb0e4"><img src="/socials/paypal.png" class="icons svelte-12pb0e4" alt="paypal"></a> <a href="https://www.instagram.com/artautonomy" aria-label="instagram" class="svelte-12pb0e4"><img src="/socials/instagram.png" class="icons svelte-12pb0e4" alt="instagram"></a></socials>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};

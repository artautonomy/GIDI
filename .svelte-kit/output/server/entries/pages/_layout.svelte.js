import { z as pop, x as push, A as add_styles } from "../../chunks/index.js";
import "clsx";
function MIDI_1($$payload, $$props) {
  push();
  pop();
}
function _layout($$payload, $$props) {
  push();
  let { children } = $$props;
  MIDI_1();
  $$payload.out += `<!----> <threlte${add_styles({ display: "none" })} class="svelte-1tds5i1">`;
  children($$payload);
  $$payload.out += `<!----></threlte> <footer class="svelte-1tds5i1"><socials class="svelte-1tds5i1"><a href="https://github.com/artautonomy/GIDI" aria-label="github" class="svelte-1tds5i1"><img src="/socials/github.png" class="icons svelte-1tds5i1" alt="github"></a> <a href="https://www.youtube.com/channel/UCiPYshK5e29AYbO1dFYWbGQ" aria-label="youtube" class="svelte-1tds5i1"><img src="/socials/youtube.png" class="icons svelte-1tds5i1" alt="youtube"></a> <a href="https://www.instagram.com/artautonomy/" aria-label="instagram" class="svelte-1tds5i1"><img src="/socials/instagram.png" class="icons svelte-1tds5i1" alt="instagram"></a></socials></footer>`;
  pop();
}
export {
  _layout as default
};

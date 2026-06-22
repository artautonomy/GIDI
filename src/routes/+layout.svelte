<script lang="ts">
  import { onMount } from "svelte";
  import { colord } from "colord";
  import { Settings } from "$lib/store";
  import { Button, type Theme, ThemeUtils } from "svelte-tweakpane-ui";

  import MIDI from "$lib/MIDI Read.svelte";
  import github from "$lib/assets/socials/github.png";
  import paypal from "$lib/assets/socials/paypal.png";
  import instagram from "$lib/assets/socials/instagram.png";
  import "../app.css";

  let { children } = $props();

  let loaded = $state(false);

  const customizedTheme: Theme = {
    ...ThemeUtils.presets.iceberg,
    baseBackgroundColor: "hsla(230, 20%, 11%, 0.5)",
    labelForegroundColor: "hsla(230, 12%, 88%, 1.00)",
  };

  onMount(() => {
    loaded = true;
  });
</script>

<MIDI />

<threlte style:display={loaded ? "block" : "none"}>
  {@render children()}
</threlte>

<socials
  style="--opacity: {loaded ? 1 : 0}; --invert: {colord(
    $Settings.scene.colours.background,
  ).isLight()}
 --invert: {colord($Settings.scene.colours.background).isLight() ? 1 : 0}"
>
  <a href="https://github.com/artautonomy/GIDI" aria-label="github"
    ><img src={github} class="icons" alt="github" /></a
  >
  <a href="https://www.paypal.com/paypalme/GIDIWebApp" aria-label="paypal"
    ><img src={paypal} class="icons" alt="paypal" /></a
  >
  <a href="https://www.instagram.com/artautonomy" aria-label="instagram"
    ><img src={instagram} class="icons" alt="instagram" /></a
  >
</socials>

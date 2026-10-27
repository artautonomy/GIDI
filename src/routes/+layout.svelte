<script lang="ts">
  import { onMount } from "svelte";
  import { colord } from "colord";
  import { Settings } from "#lib/stores/settings.ts";

  import MIDIRead from "#lib/midi/MIDI Read.svelte";
  import MIDIImport from "#lib/midi/MIDI Import.svelte";
  import github from "#lib/assets/socials/github.png";
  import paypal from "#lib/assets/socials/paypal.png";
  import instagram from "#lib/assets/socials/instagram.png";
  import "../app.css";

  let { children } = $props();

  let loaded = $state(false);

  const bg = $derived($Settings.scene.colours.background);

  onMount(() => {
    loaded = true;
  });
</script>

<div class="app" style:background-color="rgb({bg.r}, {bg.g}, {bg.b})">
  <MIDIRead />
  <MIDIImport />

  <main style:display={loaded ? "flex" : "none"}>
    {@render children()}
  </main>

  <socials
    style="--opacity: {loaded ? 1 : 0}; --invert: {colord(
      $Settings.scene.colours.background,
    ).isLight()
      ? 1
      : 0};"
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
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    overflow: hidden;
  }

  main {
    flex: 1 1 0;
    min-height: 0; /* lets the flex child shrink so the footer stays visible */
    flex-direction: column; /* header (Back) above, stage below */
    position: relative;
  }

  socials {
    flex: 0 0 auto;
    z-index: 1001; /* above the MIDI import overlay (z-index 1000) */
  }
</style>

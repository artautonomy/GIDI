<script>
  import { onMount } from "svelte";
  import { colord } from "colord";
  import { Settings } from "$lib/store";
  import MIDI from "$lib/scenes/MIDI.svelte";

  let { children } = $props();

  let loaded = $state(false);

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
    $Settings.colours.background
  ).isLight()
    ? 1
    : 0}"
>
  <a href="https://github.com/artautonomy/GIDI" aria-label="github"
    ><img src="/socials/github.png" class="icons" alt="github" /></a
  >
  <a href="https://www.paypal.com/paypalme/GIDIWebApp" aria-label="paypal"
    ><img src="/socials/paypal.png" class="icons" alt="paypal" /></a
  >
  <a href="https://www.instagram.com/artautonomy" aria-label="instagram"
    ><img src="/socials/instagram.png" class="icons" alt="instagram" /></a
  >
</socials>

<style>
  threlte {
    display: none;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  img {
    -webkit-filter: invert(var(--invert));
    filter: invert(var(--invert));
  }

  socials {
    opacity: var(--opacity, 1);
    transition: opacity 2.4s 1s ease;
  }

  @media (min-width: 600px) {
    socials {
      position: absolute;
      right: 0;
      bottom: 0;
      height: 2.75vh;
      display: flex;
      width: 175px;
      float: right;
      align-items: center;
      flex-wrap: nowrap;
      justify-content: space-around;
      flex-direction: row;
    }

    a {
      height: 55%;
    }
  }
  @media (max-width: 600px) {
    socials {
      display: flex;
      position: absolute;
      right: 0;
      bottom: 0;
      height: 3.75vh;
      width: 100vw;
      float: right;
      align-items: center;
      flex-wrap: nowrap;
      justify-content: space-evenly;
      flex-direction: row;
    }
    a {
      height: 55%;
    }
  }
  .icons {
    height: 100%;
    width: auto;
  }
</style>

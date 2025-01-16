<script>
  import { onMount } from "svelte";
  import MIDI from "$lib/scenes/MIDI.svelte";

  let { children } = $props();

  let loaded = $state(false);

  onMount(() => {
    // Simulate a loading process or listen for an actual loaded event
    setTimeout(() => (loaded = true), 100);
  });
</script>

<MIDI />
<threlte style:display={!loaded ? "none" : "block"}>
  {@render children()}
</threlte>

<socials>
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
    width: 100vw; /* Full width of viewport */
    height: 100vh; /* Full height of viewport */
    overflow: hidden; /* Prevent scrollbars */
  }

  @media (max-width: 600px) {
    socials {
      display: flex;
      position: absolute;
      right: 0;
      bottom: 0;
      height: 5vh;
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
        justify-content:space-around;
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

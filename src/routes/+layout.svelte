<script>
  import { onMount } from "svelte";
  import MIDI from "./Read/MIDI.svelte";
  import instagram from "../lib/assets/socials/instagram.png?enhanced";
  import youtube from "../lib/assets/socials/youtube.png?enhanced";
  import github from "../lib/assets/socials/github.png?enhanced";
  import { Settings } from "./store";

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

<footer>
  <socials>
    <a href="https://github.com/artautonomy/GIDI" aria-label="github"
      ><enhanced:img src={github} class="icons" alt="github" /></a
    >
    <a
      href="https://www.youtube.com/channel/UCiPYshK5e29AYbO1dFYWbGQ"
      aria-label="youtube"
      ><enhanced:img src={youtube} class="icons" alt="youtube" /></a
    >

    <a href="https://www.instagram.com/artautonomy/" aria-label="instagram"
      ><enhanced:img src={instagram} class="icons" alt="instagram" /></a
    >
  </socials>
</footer>

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
      height: 100%;
      width: 100vw;
      float: right;
      align-items: center;
      flex-wrap: nowrap;
      justify-content: space-around;
      flex-direction: row;
    }
    footer {
      display: block;
      position: absolute;
      right: 0;
      bottom: 0;
      width: auto;
      height: 5vh;
    }
    a {
      height: 55%;
    }
  }
  @media (min-width: 600px) {
    socials {
      display: flex;
      height: 100%;
      width: 110px;
      float: right;
      align-items: center;
      flex-wrap: nowrap;
      justify-content: space-around;
      flex-direction: row;
    }
    footer {
      display: block;
      position: absolute;
      right: 0;
      bottom: 0;
      width: auto;
      height: 2.25vh;
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

<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "$lib/scenes/Style.svelte";
  import { fadeIn, fadeOut } from "$lib/stores/app";
  import { fade } from "svelte/transition";
  import Back from "$lib/ui/Back.svelte";
  import { onMount } from "svelte";

  let loaded = $state(false);

  const title = "Style";

  const summary =
    "Play your MIDI device to sample styles.\n\nTo confirm your style click 'Select'.";

  onMount(() => {
    loaded = true;
  });
</script>

<header class="top" in:fade|global={$fadeIn} out:fade|global={$fadeOut}>
  <Back destination={"../"}></Back>
</header>

{#if loaded}
  <div class="overlay" in:fade|global={$fadeIn} out:fade|global={$fadeOut}>
    <main>
      <section class="landing">
        <h1>{title}</h1>
        <p class="summary">{summary}</p>
      </section>
    </main>
  </div>
  <div class="stage" in:fade|global={$fadeIn} out:fade|global={$fadeOut}>
    <Canvas><Scene /></Canvas>
  </div>
{/if}

<style>
  .stage {
    position: relative;
    flex: 1 1 0;
    width: 100%;
    overflow: hidden;
  }

  .overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: env(safe-area-inset-top) 16px env(safe-area-inset-bottom);
    color: rgba(255, 255, 255, 0.95);
    font-family: "Oxanium", sans-serif;
    pointer-events: none;
  }

  main {
    align-self: start;
    justify-self: center;
    width: min(100%, 36rem);
    padding-top: 10vh;
    text-align: center;
  }

  .summary {
    max-width: 60ch;
    margin: 0.75rem auto 1.5rem;
    line-height: 1.5;
    opacity: 0.9;
    display: inline-block;
  }

  @media (max-width: 600px) {
    h2 {
      font-size: clamp(1.25rem, 1.2vw, 2rem);
    }

    p {
      font-size: clamp(0.8rem, 1.2vw, 2rem);
    }
  }
</style>

<script>
  import { Canvas } from "@threlte/core";
  import Scene from "#lib/scenes/Play.svelte";
  import { onMount } from "svelte";
  import { fadeIn, fadeOut } from "#lib/stores/app.ts";
  import { fade } from "svelte/transition";
  import { Settings } from "#lib/stores/settings.ts";

  let loaded = $state(false);

  const title = "Tip";

  const summary = "Click the style to toggle settings on and off, or press 'e'";

  onMount(() => {
    loaded = true;
  });
</script>

{#if loaded}
  {#if !$Settings.edit}
    <div class="overlay" in:fade|global={$fadeIn} out:fade|global={$fadeOut}>
      <main>
        <section class="landing">
          <h1>{title}</h1>

          <p class="summary">{summary}</p>
        </section>
      </main>
    </div>
  {/if}
  <div class="stage" in:fade|global={$fadeIn} out:fade|global={$fadeOut}>
    <Canvas>
      <Scene />
    </Canvas>
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
    max-width: 60be;
    margin: 0.75rem auto 1.5rem;
    line-height: 1.5;
    opacity: 0.9;
    display: inline-block;
  }

  @media (max-width: 600px) {
    p {
      font-size: clamp(0.8rem, 1.2vw, 2rem);
    }
  }
</style>

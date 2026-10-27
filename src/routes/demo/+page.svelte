<script>
  import { Canvas } from "@threlte/core";
  import Scene from "#lib/scenes/Demo.svelte";
  import { fade } from "svelte/transition";
  import { fadeIn, fadeOut } from "#lib/stores/app.ts";
  import { onMount } from "svelte";
  import Back from "#lib/ui/Back.svelte";

  let loaded = $state(false);

  onMount(() => {
    loaded = true;
  });
</script>

{#if loaded}
  <header class="top" in:fade|global={$fadeIn} out:fade|global={$fadeOut}>
    <Back destination={"../"} />
  </header>

  <div class="stage" in:fade|global={$fadeIn} out:fade|global={$fadeOut}>
    <Canvas><Scene /></Canvas>
  </div>
{/if}

<style>
  .top {
    flex: 0 0 auto;
  }

  .stage {
    flex: 1 1 0;
    position: relative;
    width: 100%;
  }
</style>

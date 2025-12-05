<script>
  import { Canvas } from "@threlte/core";
  import Scene from "$lib/scenes/Home.svelte";
  /*
  //if testing
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(() => {
    goto("../play");
  });
  */
</script>

<Canvas>
  <Scene />
</Canvas>

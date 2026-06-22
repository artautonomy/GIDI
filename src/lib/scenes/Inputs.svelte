<script lang="ts">
  import { T } from "@threlte/core";
  import { HTML, OrbitControls } from "@threlte/extras";
  import { Box, Flex } from "@threlte/flex";
  import { Tween } from "svelte/motion";
  import { fade } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { Device, Settings } from "../store";
  import Lighting from "./Lighting.svelte";
  import { goto } from "$app/navigation";

  const title = "MIDI inputs found";

  const summary = "Play a note to see an input's note on messages";

  let clearScene = $state(false);

  function setupStyle(deviceID: string, e: MouseEvent) {
    const target = e.currentTarget as HTMLButtonElement;

    target.style.backgroundColor = "rgb(22, 55, 11)";

    clearScene = true;

    $Device.selected = true;
    $Device.id = deviceID;

    introZoom.set(0, {
      delay: 250,
      duration: 750,
      easing: cubicInOut,
    });

    setTimeout(() => {
      setTimeout(() => {
        goto("../style");
      }, 750);
    }, 750);
  }

  const introZoom = new Tween(0);

  introZoom.set(35, {
    duration: 1000,
    easing: cubicInOut,
  });

  $Settings.camera.autoRotate.enabled = false;
</script>

<T.OrthographicCamera
  makeDefault
  position={[7.5, 10, 20]}
  near={0.001}
  far={5000}
  zoom={introZoom.current}
>
  <OrbitControls
    enableDamping
    rotateSpeed={2}
    enablePan={false}
    enableZoom={false}
    maxPolarAngle={Math.PI / 2.5}
    minPolarAngle={Math.PI / 2.5}
    autoRotate={$Settings.camera.autoRotate.enabled}
  ></OrbitControls>
</T.OrthographicCamera>

<Lighting />

<Flex
  width={window.innerWidth / 50}
  height={window.innerHeight / 40}
  flexDirection="Column"
>
  <Box flex={2} width="100%" height="100%">
    {#if !clearScene}
      <HTML center>
        <h1
          in:fade|global={{ duration: 1000, delay: 500 }}
          out:fade|global={{ duration: 200 }}
        >
          {title}
        </h1>
        <h2
          in:fade|global={{ duration: 1000, delay: 500 }}
          out:fade|global={{ duration: 200 }}
        >
          {summary}
        </h2>
      </HTML>
    {/if}
  </Box>
  <Box flex={12} width="100%" height="100%">
    <HTML style="pointer-events: auto;" center>
      {#each $Device.inputs as device}
        <button
          in:fade|global={{ duration: 1000, delay: 500 }}
          out:fade|global={{ duration: 200 }}
          onpointerenter={(e) =>
            (e.currentTarget.style.color = "rgb(185, 249, 169)")}
          onpointerleave={(e) => (e.currentTarget.style.color = "white")}
          onpointerdown={(e) => setupStyle(device.id, e)}
          style:background-Color={device.velocity > 0
            ? "rgb(22, 55, 11)"
            : "rgb(66,11,77)"}
          id="input">{device.name}</button
        >
      {/each}
    </HTML>
  </Box>
</Flex>

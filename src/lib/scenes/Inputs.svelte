<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { Color } from "three";
  import { HTML, OrbitControls } from "@threlte/extras";
  import { Box, Flex } from "@threlte/flex";
  import { Tween } from "svelte/motion";
  import { fade } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { Device, Settings } from "../store";
  import Lighting from "./Lighting.svelte";
  import { goto } from "$app/navigation";

  const { scene } = $state(useThrelte());

  scene.background = new Color(
    `rgb(${$Settings.scene.colours.background.r},${$Settings.scene.colours.background.g},${$Settings.scene.colours.background.b})`,
  );

  const title = "MIDI inputs found";

  const summary = "Play a note to see an input's note on messages";

  let clearScene = $state(false);

  let rotation = $state(0);

  useTask((delta) => {
    rotation += delta;
  });

  function setupStyle(deviceID: string) {
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
    autoRotateSpeed={$Settings.camera.autoRotate.speed}
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
    <HTML center>
      {#each $Device.inputs as device}
        <button
          in:fade|global={{ duration: 1000, delay: 500 }}
          out:fade|global={{ duration: 200 }}
          onpointerdown={() => setupStyle(device.id)}
          style:background-Color={device.velocity > 0
            ? "rgb(140, 237, 116)"
            : "rgb(90, 187, 66)"}
          id="input">{device.name}</button
        >
      {/each}
    </HTML>
  </Box>
</Flex>

<style>
  button {
    font-family: "Oxanium", sans-serif;
    width: 32vw;
    text-align: center;
    color: white;
  }
</style>

<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { Color } from "three";
  import {
    Billboard,
    HTML,
    InstancedMesh,
    interactivity,
    OrbitControls,
    Text,
    useCursor,
  } from "@threlte/extras";
  import { Box, Flex } from "@threlte/flex";
  import { Tween, Spring } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { Device, MIDI, Settings } from "../store";
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";

  import Input from "../instances/Input.svelte";
  import Lighting from "./Lighting.svelte";

  const { scene } = $state(useThrelte());

  scene.background = new Color(
    `rgb(${$Settings.scene.colours.background.r},${$Settings.scene.colours.background.g},${$Settings.scene.colours.background.b})`,
  );

  type MIDIMessage = {
    note: number;
    velocity: number;
    position: {
      x: number;
      y: number;
      z: number;
    };
    scale: {
      x: number;
      y: number;
      z: number;
    };
  };

  const title = "MIDI inputs found";

  const summary = "Play a note to see an input's note on messages";

  let clearScene = $state(false);

  let rotation = $state(0);

  useTask((delta) => {
    rotation += delta;
  });

  let midiMessages = $state<MIDIMessage[]>([]);

  let highlighted = $state($Settings.notes.colours.key);

  let selected = $state(false);

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });

  onDestroy(unsubscribe);

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

  const { onPointerEnter, onPointerLeave } = useCursor();
  const {
    hovering,
    onPointerEnter: onPointerEnterStyle,
    onPointerLeave: onPointerLeaveStyle,
  } = useCursor();
  interactivity();

  $effect(() => {
    if (!$hovering && !selected) {
      highlighted = $Settings.notes.colours.key;
    } else {
      highlighted = { r: 77, g: 144, b: 57 };
    }
  });
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
    enabled={$Settings.orbitControls}
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
        <h1>{title}</h1>
        <h2>{summary}</h2>
      </HTML>
    {/if}
  </Box>
  <Box flex={12} width="100%" height="100%">
    {#if !clearScene}
      <HTML center>
        {#each $Device.inputs as device, index}
          <button
            onpointerdown={() => setupStyle(device.id)}
            style={device.velocity > 0 ? "green" : "white"}
            >{device.name}</button
          >
        {/each}
      </HTML>
    {/if}
  </Box>
</Flex>

<style>
  h1,
  h2,
  button {
    font-family: "Oxanium", sans-serif;
    width: 32vw;
    text-align: center;
    opacity: 0;
    color: white;

    animation: 1s fadeIn 0.5s forwards;
  }

  button {
    display: block;
    background-color: rgb(90, 187, 66);
    font-size: 1em;
    padding: 20px;
    width: 15vw;
    height: auto;
    margin: 0.75vh;
    cursor: pointer;
    color: black;
    font-weight: bolder;
  }

  @media (max-width: 600px) {
    h1,
    h2,
    button {
      font-family: "Oxanium", sans-serif;
      width: 75vw;
      text-align: center;
      opacity: 0;
      color: white;

      animation: 1s fadeIn 0.5s forwards;
    }

    button {
      display: block;
      background-color: rgb(90, 187, 66);
      font-size: 1em;
      padding: 20px;
      width: 70vw;
      height: auto;
      margin: 0.75vh;
      cursor: pointer;
      color: black;
      font-weight: bolder;
    }
  }

  h1 {
    color: orange;
    margin-bottom: 3.33vh;
  }
  h2 {
    font-size: 1.1em;

    text-align: center;
  }

  @keyframes fadeIn {
    100% {
      opacity: 1;
    }
  }
</style>

<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { Color as ThreeColor, SRGBColorSpace } from "three";
  import {
    Align,
    Billboard,
    HTML,
    interactivity,
    OrbitControls,
    InstancedMesh,
    useCursor,
  } from "@threlte/extras";
  import { Box, Flex } from "@threlte/flex";
  import { fade } from "svelte/transition";
  import { Spring, Tween } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import Lighting from "./Lighting.svelte";
  import Piano from "../instances/Piano.svelte";
  import Firework from "../instances/Firework.svelte";
  import Cube from "../instances/Cube.svelte";
  import Mirror from "../instances/Mirror.svelte";
  import Swirl from "../instances/Swirl.svelte";
  import { onMount } from "svelte";
  import DemoMenu from "$lib/ui/Demo Menu.svelte";
  import { MIDI } from "../stores/midiDeviceStore";
  import { Settings } from "../stores/settings";

  type VisualNote = {
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

  const { scene } = $state(useThrelte());
  const { size } = useThrelte();

  interactivity();

  // Final camera zoom. The intro tween animates towards this value, and the
  // Flex height is sized for it, so the layout doesn't resize during the intro.
  const FINAL_ZOOM = 35;

  // The orthographic frustum matches the canvas size in pixels, so the visible
  // height in world units is canvasHeightPx / zoom.
  const flexHeight = $derived($size.height / FINAL_ZOOM);

  // Notes are supplied by the shared MIDI store.
  let notes = $state<VisualNote[]>([]);
  const introZoom = new Tween(0);

  const MIDIConnectedScenePosition = new Tween(-1.5, {
    delay: 500,
    duration: 1250,
    easing: cubicInOut,
  });

  let editing = $state(false);

  const styles = $Settings.notes.styles;

  let styleIndex = $state(0);

  const { onPointerEnter, onPointerLeave } = useCursor();

  // Sync the visualiser with notes published by the MIDI store.
  $effect(() => {
    notes = $MIDI;
  });

  function styleBack() {
    styleIndex > 0 ? styleIndex-- : (styleIndex = styles.length - 1);

    $Settings.sceneSelected = styles[styleIndex];

    if (styles[styleIndex] === "Piano") {
      $Settings.notes.attack = 15;
      $Settings.notes.release = 500;
    } else if (styles[styleIndex] === "Firework") {
      $Settings.notes.attack = 20;
      $Settings.notes.release = 3500;
    } else {
      $Settings.notes.attack = 15;
      $Settings.notes.release = 500;
    }
  }

  function styleNext() {
    styleIndex >= 0 && styleIndex < styles.length - 1
      ? styleIndex++
      : (styleIndex = 0);

    $Settings.sceneSelected = styles[styleIndex];

    if (styles[styleIndex] === "Piano") {
      $Settings.notes.attack = 5;
      $Settings.notes.release = 500;
    } else if (styles[styleIndex] === "Firework") {
      $Settings.notes.attack = 20;
      $Settings.notes.release = 3500;
    } else {
      $Settings.notes.attack = 5;
      $Settings.notes.release = 500;
    }
  }

  $effect(() => {
    if (!scene) return;

    const { r, g, b } = $Settings.scene.colours.background;
    scene.background = new ThreeColor().setRGB(
      r / 255,
      g / 255,
      b / 255,
      SRGBColorSpace,
    );
  });

  onMount(() => {
    introZoom.set(FINAL_ZOOM, {
      delay: 200,
      duration: 1000,
      easing: cubicInOut,
    });
  });
</script>

<Lighting />

<T.OrthographicCamera
  makeDefault
  position={[0, 10, 0]}
  near={0.0001}
  far={5000}
  zoom={introZoom.current}
>
  <OrbitControls
    enabled={!editing}
    enableDamping
    autoRotate={$Settings.camera.autoRotate.enabled}
    autoRotateSpeed={$Settings.camera.autoRotate.speed}
    rotateSpeed={2}
    enablePan={false}
    enableZoom={false}
    maxPolarAngle={Math.PI / 2.5}
    minPolarAngle={Math.PI / 2.5}
  />
</T.OrthographicCamera>

<Flex width={0} height={flexHeight} flexDirection="Column">
  <Box flex={3}>
    <Billboard>
      <HTML center>
        <div
          role="button"
          tabindex="0"
          onpointerenter={() => {
            editing = true;
          }}
          onpointerleave={() => {
            editing = false;
          }}
        >
          <DemoMenu />
        </div>
      </HTML>
    </Billboard>
  </Box>

  <Box flex={2} height="auto">
    <T.Group
      position.y={MIDIConnectedScenePosition.current}
      onpointerenter={onPointerEnter}
      onpointerleave={onPointerLeave}
    >
      <Align auto precise>
        <InstancedMesh>
          <T.BoxGeometry />
          <T.MeshStandardMaterial shadow roughness={0.4} metalness={0.7} />

          {#each notes as noteNumber}
            {#if styles[styleIndex] === "Piano"}
              <Piano
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$Settings.notes.attack}
                release={$Settings.notes.release}
                keyColour={$Settings.notes.colours.key}
                expressionColour={$Settings.notes.colours.expression}
              />
            {:else if styles[styleIndex] === "Mirror"}
              <Mirror
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$Settings.notes.attack}
                release={$Settings.notes.release}
                keyColour={$Settings.notes.colours.key}
                expressionColour={$Settings.notes.colours.expression}
              />
            {:else if styles[styleIndex] === "Cube"}
              <Cube
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$Settings.notes.attack}
                release={$Settings.notes.release}
                keyColour={$Settings.notes.colours.key}
                expressionColour={$Settings.notes.colours.expression}
              />
            {/if}
          {/each}
        </InstancedMesh>

        {#each notes as noteNumber}
          {#if styles[styleIndex] === "Swirl"}
            <Swirl
              position={noteNumber.position}
              scale={noteNumber.scale}
              velocity={noteNumber.velocity}
              attack={$Settings.notes.attack}
              release={$Settings.notes.release}
              keyColour={$Settings.notes.colours.key}
              expressionColour={$Settings.notes.colours.expression}
            />
          {:else if styles[styleIndex] === "Firework"}
            <Firework
              position={noteNumber.position}
              scale={noteNumber.scale}
              velocity={noteNumber.velocity}
              attack={$Settings.notes.attack}
              release={$Settings.notes.release}
              keyColour={$Settings.notes.colours.key}
              expressionColour={$Settings.notes.colours.expression}
            />
          {/if}
        {/each}
      </Align>
    </T.Group>
  </Box>

  <Box flex={1} height="auto">
    <HTML center>
      <div
        class="nav-bar"
        in:fade|global={{ duration: 1000, delay: 500 }}
        out:fade|global={{ duration: 200 }}
      >
        <button
          onpointerdown={(event: MouseEvent) => {
            event.stopPropagation();
            styleBack();
          }}
          aria-label="Back"
          class="icon-btn"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div class="styleDescription">
          <h2>{styles[styleIndex]}</h2>

          <span>
            {styles[styleIndex] === "Piano"
              ? "Recommended for keyboards and synthesizers.\nAutomapping enabled."
              : "Recommended for pads and samplers."}
          </span>
        </div>

        <button
          onpointerdown={(event: MouseEvent) => {
            event.stopPropagation();
            styleNext();
          }}
          aria-label="Forward"
          class="icon-btn"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </HTML>
  </Box>
</Flex>

<style>
  .styleDescription {
    width: 25vw;
  }

  @media (max-width: 600px) {
    .styleDescription {
      width: 65vw;
    }
  }
</style>

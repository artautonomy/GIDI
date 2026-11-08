<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { Box, Flex } from "@threlte/flex";

  import { Color as ThreeColor, SRGBColorSpace, Box3, Vector3 } from "three";

  import {
    Billboard,
    HTML,
    interactivity,
    OrbitControls,
    InstancedMesh,
  } from "@threlte/extras";

  import { Tween } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  import Lighting from "./Lighting.svelte";
  import Piano from "../instances/Piano.svelte";
  import Firework from "../instances/Firework.svelte";
  import Cube from "../instances/Cube.svelte";
  import Mirror from "../instances/Mirror.svelte";
  import Swirl from "../instances/Swirl.svelte";

  import MIDISweep from "$lib/midi/demoSweep.svelte";
  import DemoMenu from "$lib/ui/Demo Menu.svelte";

  import { Settings } from "../stores/settings";
  import { createNoteLayout } from "$lib/midi/noteLayout";

  const { scene, size } = useThrelte();

  interactivity();

  const pitches = Array.from({ length: 12 }, (_, i) => 60 + i);

  const introZoom = new Tween(0);

  const FINAL_ZOOM = 27.5;

  const flexHeight = $derived($size.height / FINAL_ZOOM);

  const styles = $derived($Settings.notes.styles);

  let styleIndex = $state(
    Math.max(0, $Settings.notes.styles.indexOf($Settings.sceneSelected)),
  );

  let clearScene = $state(false);
  let editing = $state(false);

  const style = $derived(styles[styleIndex] ?? "Piano");

  // Note layout is derived from the current visualisation style.
  const notes = $derived(createNoteLayout(pitches, style));

  // Velocity per pitch, driven by MIDISweep.
  let velocities = $state<Record<number, number>>({});

  function setVelocity(pitch: number, velocity: number) {
    velocities[pitch] = velocity;
  }

  // Update visualisation style and animation settings.
  function updateStyle(index: number) {
    if (styles.length === 0) return;

    styleIndex = (index + styles.length) % styles.length;

    $Settings.sceneSelected = styles[styleIndex];
  }

  // Manual navigation.
  function styleBack() {
    updateStyle(styleIndex - 1);
  }

  function styleNext() {
    updateStyle(styleIndex + 1);
  }

  // Automatic MIDI sweep navigation.
  function nextStyle() {
    updateStyle(styleIndex + 1);
  }

  // Keep styleIndex synchronised with changes made elsewhere,
  // including DemoMenu and the settings store.
  $effect(() => {
    const selected = $Settings.sceneSelected;
    const index = styles.indexOf(selected);

    if (index !== -1 && index !== styleIndex) {
      styleIndex = index;
    }
  });

  /**
   * Centre of the layout, calculated from note data rather
   * than rendered meshes.
   *
   * Instanced meshes cache their bounding box, so measuring
   * them directly can produce stale positioning.
   */
  const offset = $derived.by(() => {
    const box = new Box3();

    for (const n of notes) {
      const hx = n.scale.x / 2;
      const hy = n.scale.y / 2;
      const hz = n.scale.z / 2;

      box.expandByPoint(
        new Vector3(n.position.x - hx, n.position.y - hy, n.position.z - hz),
      );

      box.expandByPoint(
        new Vector3(n.position.x + hx, n.position.y + hy, n.position.z + hz),
      );
    }

    return box.isEmpty() ? new Vector3() : box.getCenter(new Vector3());
  });

  // Update scene background when settings change.
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

<!-- Automatic MIDI demonstration -->
<MIDISweep onNote={setVelocity} interval={350} />

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
  <!-- Demo menu -->
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

  <!-- Visualisation -->
  <Box flex={2} height="auto" width="auto">
    {#if !clearScene}
      <T.Group position={[-offset.x, -offset.y - 2, -offset.z]}>
        {#key style}
          <InstancedMesh>
            <T.BoxGeometry />
            <T.MeshStandardMaterial shadow roughness={0.4} metalness={0.7} />

            {#each notes as noteNumber (noteNumber.note)}
              {#if style === "Piano"}
                <Piano
                  position={noteNumber.position}
                  scale={noteNumber.scale}
                  velocity={velocities[noteNumber.note] ?? 0}
                  attack={$Settings.notes.attack}
                  release={$Settings.notes.release}
                  keyColour={$Settings.notes.colours.key}
                  expressionColour={$Settings.notes.colours.expression}
                />
              {:else if style === "Mirror"}
                <Mirror
                  position={noteNumber.position}
                  scale={noteNumber.scale}
                  velocity={velocities[noteNumber.note] ?? 0}
                  attack={$Settings.notes.attack}
                  release={$Settings.notes.release}
                  keyColour={$Settings.notes.colours.key}
                  expressionColour={$Settings.notes.colours.expression}
                />
              {:else if style === "Cube"}
                <Cube
                  position={noteNumber.position}
                  scale={noteNumber.scale}
                  velocity={velocities[noteNumber.note] ?? 0}
                  attack={$Settings.notes.attack}
                  release={$Settings.notes.release}
                  keyColour={$Settings.notes.colours.key}
                  expressionColour={$Settings.notes.colours.expression}
                />
              {/if}
            {/each}
          </InstancedMesh>
        {/key}

        {#each notes as noteNumber (noteNumber.note)}
          {#if style === "Swirl"}
            <Swirl
              position={noteNumber.position}
              scale={noteNumber.scale}
              velocity={velocities[noteNumber.note] ?? 0}
              attack={$Settings.notes.attack}
              release={$Settings.notes.release}
              keyColour={$Settings.notes.colours.key}
              expressionColour={$Settings.notes.colours.expression}
            />
          {:else if style === "Firework"}
            <Firework
              position={noteNumber.position}
              scale={noteNumber.scale}
              velocity={velocities[noteNumber.note] ?? 0}
              attack={$Settings.notes.attack}
              release={$Settings.notes.release}
              keyColour={$Settings.notes.colours.key}
              expressionColour={$Settings.notes.colours.expression}
            />
          {/if}
        {/each}
      </T.Group>
    {/if}
  </Box>

  <!-- Manual style navigation -->
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
          <h2>{style}</h2>

          <span>
            {style === "Piano"
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

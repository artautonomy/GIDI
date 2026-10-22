<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { Color as ThreeColor, SRGBColorSpace } from "three";
  import {
    Align,
    interactivity,
    OrbitControls,
    InstancedMesh,
    useCursor,
  } from "@threlte/extras";

  import { Tween } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { onMount } from "svelte";

  import Lighting from "./Lighting.svelte";
  import Piano from "../instances/Piano.svelte";
  import Firework from "../instances/Firework.svelte";
  import Cube from "../instances/Cube.svelte";
  import Mirror from "../instances/Mirror.svelte";
  import Swirl from "../instances/Swirl.svelte";

  import { Settings } from "../stores/settings";
  import {
    createNoteLayout,
    setNoteVelocity,
    type MIDIVisualNote,
  } from "$lib/midi/noteLayout";

  const { scene } = useThrelte();

  interactivity();

  const pitches = Array.from({ length: 12 }, (_, i) => 60 + i);

  let notes = $state<MIDIVisualNote[]>(createNoteLayout(pitches, "Piano"));

  const introZoom = new Tween(0);

  const styles = $derived($Settings.notes.styles);
  let styleIndex = $state(0);
  let clearScene = $state(false);

  const { onPointerEnter, onPointerLeave } = useCursor();

  /**
   * Run a fake MIDI sweep through one octave.
   * The callback updates the velocity of the matching
   * note in the currently selected visual layout.
   */
  function createFakeMIDISweep(
    updateNote: (pitch: number, velocity: number) => void,
    interval = 500,
    startNote = 60,
  ) {
    const sweepPitches = Array.from({ length: 12 }, (_, i) => startNote + i);

    let currentIndex = 0;

    // Start the first note immediately.
    updateNote(sweepPitches[currentIndex], 127);

    const timer = setInterval(() => {
      // Turn the current note off.
      updateNote(sweepPitches[currentIndex], 0);

      // Advance through the octave.
      currentIndex = (currentIndex + 1) % sweepPitches.length;

      // Turn the next note on.
      updateNote(sweepPitches[currentIndex], 127);
    }, interval);

    return {
      stop() {
        clearInterval(timer);
        updateNote(sweepPitches[currentIndex], 0);
      },
    };
  }

  // Rebuild the positions and scales when the style changes.
  $effect(() => {
    const selectedStyle = styles[styleIndex] ?? "Piano";

    notes = createNoteLayout(pitches, selectedStyle);
  });

  // Update the scene background when its settings change.
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
    introZoom.set(35, {
      delay: 200,
      duration: 1000,
      easing: cubicInOut,
    });

    const sweep = createFakeMIDISweep(
      (pitch, velocity) => {
        notes = setNoteVelocity(notes, pitch, velocity);
      },
      350,
      60,
    );

    // Change visualisation style every 5 seconds.
    const styleTimer = setInterval(() => {
      styleIndex = (styleIndex + 1) % styles.length;
    }, 350 * 12);

    return () => {
      sweep.stop();
      clearInterval(styleTimer);
    };
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

{#if !clearScene}
  <Align auto precise position={[0, -8, 0]} scale={0.75}>
    <InstancedMesh>
      <T.BoxGeometry />
      <T.MeshStandardMaterial shadow roughness={0.4} metalness={0.7} />

      {#each notes as noteNumber (noteNumber.note)}
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

    {#each notes as noteNumber (noteNumber.note)}
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
{/if}

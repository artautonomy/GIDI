<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { Color } from "three";
  import {
    Align,
    Billboard,
    InstancedMesh,
    interactivity,
    OrbitControls,
    Text,
    Text3DGeometry,
    useCursor,
  } from "@threlte/extras";
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { MIDI, Settings } from "../store";
  import { onDestroy } from "svelte";
  import Cube from "./Instance/Cube.svelte";
  import Mirror from "./Instance/Mirror.svelte";

  const { scene } = $state(useThrelte());

  const { r, g, b } = $Settings.colours.background;

  scene.background = new Color(`rgb(${r},${g},${b})`);

  let midiMessages = $state([{}]);

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });
  onDestroy(unsubscribe);

  function setupScene(choice: string) {
    $Settings.orbitControls = false;

    introZoom.set(0, {
      delay: 250,
      duration: 750,
      easing: cubicInOut,
    });

    setTimeout(() => {
      $Settings.attack = 50;

      cameraPosition = [5, 1, 3];

      introZoom.set(50, {
        duration: 750,
        easing: cubicInOut,
      });
      setTimeout(() => {
        $Settings.orbitControls = true;
      }, 750);
    }, 1050);
  }

  const { onPointerEnter, onPointerLeave } = useCursor();
  interactivity();

  let cameraPosition = $state([10, 10, 20]);
  const introZoom = tweened(0);

  introZoom.set(50, {
    duration: 1000,
    easing: cubicInOut,
  });

  $Settings.autoRotate = false;
</script>

<T.OrthographicCamera
  makeDefault
  position={cameraPosition}
  near={0.001}
  far={5000}
  zoom={$introZoom}
>
  <OrbitControls
    enableDamping
    autoRotateSpeed={$Settings.autoRotateSpeed}
    autoRotate={$Settings.autoRotate}
    enabled={$Settings.orbitControls}
    on:start={(camera) => {
      cameraPosition = camera.target.object.position;
      introZoom.set(camera.target.object.zoom, { duration: 0 });
    }}
  ></OrbitControls>
</T.OrthographicCamera>

<Align auto precise>
  <!-- Show sample of styles -->
  {#each midiMessages as note, index}
    <T.Group
      onpointerenter={onPointerEnter}
      onpointerleave={onPointerLeave}
      onclick={() => setupScene("Cube")}
    >
      <InstancedMesh>
        <T.BoxGeometry />
        <T.MeshStandardMaterial shadow />
        {#if $Settings.scene == "Cube"}
          <Cube
            x={index}
            velocity={note.velocity}
            attack={$Settings.attack}
            release={$Settings.release}
            keyColour={$Settings.colours.key}
            expressionColour={$Settings.colours.expression}
          />
        {:else}
          <Mirror
            x={index}
            velocity={note.velocity}
            attack={$Settings.attack}
            release={$Settings.release}
            keyColour={$Settings.colours.key}
            expressionColour={$Settings.colours.expression}
          />
        {/if}
      </InstancedMesh>
    </T.Group>
  {/each}
</Align>

<T.DirectionalLight intensity={1} position={[1, 0, 11]} />
<T.DirectionalLight intensity={1} position={[-5, 0, -11]} />
<T.AmbientLight intensity={0.3} position={[0, 1, 0]} />

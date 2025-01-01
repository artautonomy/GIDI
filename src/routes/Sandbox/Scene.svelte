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
    useCursor,
  } from "@threlte/extras";
  import { tweened } from "svelte/motion";
  import { cubicIn, cubicOut, cubicInOut } from "svelte/easing";
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

  const { hovering, onPointerEnter, onPointerLeave } = useCursor();

  interactivity();

  let cameraPosition = $state([10, 10, 20]);

  const introZoom = tweened(0);

  const hintText = tweened(1);

  let selected = $state($Settings.colours.key);

  hintText.set(0, {
    delay: 5000,
    duration: 2500,
    easing: cubicInOut,
  });

  $effect(() => {
    if ($Settings.edit) {
      selected = $Settings.colours.key;

      introZoom.set(25, {
        duration: 1000,
        easing: cubicOut,
      });
    } else {
      if ($hovering) {
        selected = { r: 77, g: 144, b: 57 };
      } else {
        selected = $Settings.colours.key;
      }
      introZoom.set(50, {
        delay: 250,
        duration: 1000,
        easing: cubicIn,
      });
    }
  });

  $Settings.orbitControls = true;
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
<Billboard position.y={-window.innerHeight / 175}>
  <T.Mesh scale={0.75} position.y={window.innerHeight / 750}>
    <T.ConeGeometry />
    <T.MeshBasicMaterial
      color={"orange"}
      transparent={true}
      opacity={$hintText}
    />
  </T.Mesh>
  <Text
    fillOpacity={$hintText}
    text={"Select to edit"}
    color={"orange"}
    fontSize={window.innerWidth / 3000}
    textAlign={"center"}
    anchorX={"center"}
    position.y={window.innerWidth / 1250}
  />
</Billboard>
<Align auto precise>
  <!-- Show sample of styles -->
  {#each midiMessages as note, index}
    <T.Group
      onpointerenter={onPointerEnter}
      onpointerleave={onPointerLeave}
      onclick={() => ($Settings.edit = true)}
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
            keyColour={selected}
            expressionColour={$Settings.colours.expression}
          />
        {:else}
          <Mirror
            x={index}
            velocity={note.velocity}
            attack={$Settings.attack}
            release={$Settings.release}
            keyColour={selected}
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

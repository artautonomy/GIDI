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
  import { Tween } from "svelte/motion";
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

  let tips = $state("Press and hold the mouse to rotate the scene");

  const introZoom = new Tween(0, {
    delay: 250,
    duration: 1000,
    easing: cubicIn,
  });

  const hintText = new Tween(1, {
    duration: 1000,
    easing: cubicInOut,
  });

  const hintArrow = new Tween(0, {
    duration: 1000,
    easing: cubicInOut,
  });

  introZoom.target = 50;

  let selected = $state($Settings.colours.key);

  $effect(() => {
    if ($Settings.edit) {
      hintText.target = 0;

      selected = $Settings.colours.key;

      introZoom.set(25, {
        duration: 1000,
        easing: cubicOut,
      });
    } else {
      if ($hovering) {
        selected = {
          r: 255 - $Settings.colours.key.r,
          g: 255 - $Settings.colours.key.g,
          b: 255 - $Settings.colours.key.b,
        };
      } else {
        selected = $Settings.colours.key;
      }
      introZoom.set(50, {
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
  zoom={introZoom.current}
>
  <OrbitControls
    enableDamping
    autoRotateSpeed={$Settings.autoRotateSpeed}
    autoRotate={$Settings.autoRotate}
    enabled={$Settings.orbitControls}
    on:start={(camera) => {
      cameraPosition = camera.target.object.position;
    }}
    onend={() => {
      hintArrow.target = 0.75;
      tips = "To open the menu click here";
    }}
  ></OrbitControls>
</T.OrthographicCamera>
<Billboard position.y={-window.innerHeight / 175}>
  <T.Mesh scale={hintArrow.current} position.y={window.innerHeight / 750}>
    <T.ConeGeometry />
    <T.MeshBasicMaterial
      color={"orange"}
      transparent={true}
      opacity={hintText.current}
    />
  </T.Mesh>
  <Text
    fillOpacity={hintText.current}
    text={tips}
    color={"orange"}
    fontSize={window.innerWidth / 5000}
    textAlign={"center"}
    anchorX={"center"}
    position.y={window.innerHeight / 1250}
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

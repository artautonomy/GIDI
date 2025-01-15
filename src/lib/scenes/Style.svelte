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
  import { cubicInOut } from "svelte/easing";
  import { MIDI, Settings } from "../store";
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";

  import Cube from "./instances/Cube.svelte";
  import Mirror from "./instances/Mirror.svelte";


  const { scene } = $state(useThrelte());

  scene.background = new Color(
    `rgb(${$Settings.colours.background.r},${$Settings.colours.background.g},${$Settings.colours.background.b})`
  );
  
  type MIDIMessage = { note: number; velocity: number }

  let midiMessages = $state<MIDIMessage[]>([]);

  const styles = ["Cube", "Mirror"];

  let styleIndex = $state(0);

  let highlighted = $state($Settings.colours.key);

  let selected = $state(false);

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });

  onDestroy(unsubscribe);

  function setupScene(choice: string) {
    $Settings.scene = choice;

    selected = true;

    highlighted = { r: 77, g: 144, b: 57 };

    introZoom.set(0, {
      delay: 250,
      duration: 750,
      easing: cubicInOut,
    });

    setTimeout(() => {
      setTimeout(() => {
        goto("../play");
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
      highlighted = $Settings.colours.key;
    } else {
      highlighted = { r: 77, g: 144, b: 57 };
    }
  });
  const introZoom = new Tween(0);

  introZoom.set(50, {
    duration: 1000,
    easing: cubicInOut,
  });

  $Settings.autoRotate = false;
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
    autoRotateSpeed={$Settings.autoRotateSpeed}
    autoRotate={$Settings.autoRotate}
    enabled={$Settings.orbitControls}
  ></OrbitControls>
</T.OrthographicCamera>
<Billboard position.y={7}>
  <Text
    text={"Style"}
    color={"orange"}
    font={$Settings.font}
    fontSize={window.innerWidth / 4000}
    textAlign={"center"}
    anchorX={"center"}
    position.y={window.innerWidth / 1250}
    outlineBlur={0.1}
  />
  <Text
    text={"Play notes to sample, click to confirm style"}
    color={"white"}
    font={$Settings.font}
    fontSize={window.innerWidth / 7000}
    textAlign={"center"}
    anchorX={"center"}
    outlineBlur={0.1}
  />
</Billboard> 
<Align y={false} auto precise>
<!-- Show sample of styles -->
{#each midiMessages as note, index}
  <T.Group
    position.y={-window.innerHeight / 200}
    onpointerenter={onPointerEnterStyle}
    onpointerleave={onPointerLeaveStyle}
    onclick={() => setupScene(styles[styleIndex])}
  >
    <InstancedMesh>
      <T.BoxGeometry />
      <T.MeshStandardMaterial shadow />

      {#if styles[styleIndex] == "Cube"}
        <Cube
          x={index - 2}
          velocity={note.velocity}
          attack={$Settings.attack}
          release={$Settings.release}
          keyColour={highlighted}
          expressionColour={$Settings.colours.expression}
        />
      {:else}
        <Mirror
          x={index - 2}
          velocity={note.velocity}
          attack={$Settings.attack}
          release={$Settings.release}
          keyColour={highlighted}
          expressionColour={$Settings.colours.expression}
        />
      {/if}
    </InstancedMesh>
    <Text
      font={$Settings.font}
      fontSize={0.4}
      outlineBlur={0.06}
      text={styles[styleIndex]}
      textAlign={"center"}
      anchorX={"center"}
      position.x={-0.5}
      position.y={2.95}
      position.z={3.9}
      color={"white"}
      onpointerenter={onPointerEnterStyle}
      onpointerleave={onPointerLeaveStyle}
      onclick={() => setupScene(styles[styleIndex])}
    />
  </T.Group>
{/each}
</Align>
<Billboard position.y={-window.innerHeight / 140}>
  <T.Mesh
    scale={0.75}
    position.x={3}
    rotation.z={-Math.PI / 2}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onclick={() => (styleIndex === 0 ? styleIndex++ : (styleIndex = 0))}
  >
    <T.ConeGeometry />
    <T.MeshBasicMaterial color={"orange"} shadow />
  </T.Mesh>
  <T.Mesh
    scale={0.75}
    position.x={-3}
    rotation.z={Math.PI / 2}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onclick={() => (styleIndex === 1 ? styleIndex-- : (styleIndex = 1))}
  >
    <T.ConeGeometry />
    <T.MeshBasicMaterial color={"orange"} shadow />
  </T.Mesh>
</Billboard>
<T.DirectionalLight intensity={1} position={[1, 0, 11]} />
<T.DirectionalLight intensity={1} position={[-5, 0, -11]} />
<T.AmbientLight intensity={0.3} position={[0, 1, 0]} />

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
  import Piano from "./instances/Piano.svelte";

  const { scene } = $state(useThrelte());

  scene.background = new Color(
    `rgb(${$Settings.colours.background.r},${$Settings.colours.background.g},${$Settings.colours.background.b})`
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

  let midiMessages = $state<MIDIMessage[]>([]);

  const styles = ["Piano", "Cube", "Mirror"];

  let styleIndex = $state(0);

  let highlighted = $state($Settings.colours.key);

  let selected = $state(false);

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });

  onDestroy(unsubscribe);

  function styleBack() {
    styleIndex > 0 ? styleIndex-- : (styleIndex = styles.length - 1);
    $Settings.styleReset = true;
    $Settings.scene = styles[styleIndex];
  }

  function styleNext() {
    styleIndex >= 0 && styleIndex < styles.length - 1
      ? styleIndex++
      : (styleIndex = 0);
    $Settings.styleReset = true;
    $Settings.scene = styles[styleIndex];
  }

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

<T.DirectionalLight
  castShadow
  intensity={$Settings.lighting.front}
  position={[0, 0, 5]}
/>
<T.DirectionalLight
  castShadow
  intensity={$Settings.lighting.front}
  position={[0, 0, -5]}
/>
<T.DirectionalLight
  castShadow
  intensity={$Settings.lighting.side}
  position={[5, 0, 0]}
/>
<T.DirectionalLight
  castShadow
  intensity={$Settings.lighting.side}
  position={[-5, 0, 0]}
/>
<T.AmbientLight intensity={$Settings.lighting.above} position={[0, 15, 0]} />

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
  <T.Group
    position.y={-window.innerHeight / 200}
    onpointerenter={onPointerEnterStyle}
    onpointerleave={onPointerLeaveStyle}
    onclick={() => setupScene(styles[styleIndex])}
  >
    <!-- Show sample of styles -->
    {#each midiMessages as noteNumber}
      <InstancedMesh>
        <T.BoxGeometry />
        <T.MeshStandardMaterial shadow />
        {#if styles[styleIndex] === "Cube"}
          <Cube
            position={noteNumber.position}
            scale={noteNumber.scale}
            velocity={noteNumber.velocity}
            attack={$Settings.attack}
            release={$Settings.release}
            keyColour={highlighted}
            expressionColour={$Settings.colours.expression}
          />
        {:else if styles[styleIndex] === "Piano"}
          <Piano
            position={noteNumber.position}
            scale={noteNumber.scale}
            velocity={noteNumber.velocity}
            attack={$hovering ? 250 : $Settings.attack}
            release={$hovering ? 250 : $Settings.release}
            keyColour={highlighted}
            expressionColour={$Settings.colours.expression}
          />
        {:else}
          <Mirror
            position={noteNumber.position}
            scale={noteNumber.scale}
            velocity={noteNumber.velocity}
            attack={$Settings.attack}
            release={$Settings.release}
            keyColour={highlighted}
            expressionColour={$Settings.colours.expression}
          />
        {/if}
      </InstancedMesh>
    {/each}
  </T.Group>
</Align>
<Billboard position.y={-window.innerHeight / 140}>
  <T.Mesh
    scale={0.75}
    position.x={7}
    position.z={10}
    rotation.z={-Math.PI / 2}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onclick={() => styleNext()}
  >
    <T.ConeGeometry />
    <T.MeshBasicMaterial color={"orange"} shadow />
  </T.Mesh>
  <Text
    font={$Settings.font}
    fontSize={0.45}
    outlineBlur={0.06}
    text={styles[styleIndex]}
    textAlign={"center"}
    anchorX={"center"}
    position.x={0}
    position.y={0.5}
    position.z={10}
    color={"white"}
    onpointerenter={onPointerEnterStyle}
    onpointerleave={onPointerLeaveStyle}
    onclick={() => setupScene(styles[styleIndex])}
  />
  <Text
    font={$Settings.font}
    fontSize={0.3}
    outlineBlur={0.06}
    text={styles[styleIndex] === "Piano"
      ? "Recommended for keyboards and synthesizers. Automapping enabled."
      : "Recommended for pads and samplers."}
    textAlign={"center"}
    anchorX={"center"}
    position.x={0}
    position.y={-0.25}
    position.z={10}
    color={"white"}
    onpointerenter={onPointerEnterStyle}
    onpointerleave={onPointerLeaveStyle}
    onclick={() => setupScene(styles[styleIndex])}
  />
  <T.Mesh
    scale={0.75}
    position.x={-7}
    position.z={10}
    rotation.z={Math.PI / 2}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onclick={() => styleBack()}
  >
    <T.ConeGeometry />
    <T.MeshBasicMaterial color={"orange"} shadow />
  </T.Mesh>
</Billboard>

<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { Color } from "three";
  import {
    Billboard,
    InstancedMesh,
    interactivity,
    OrbitControls,
    Text,
    useCursor,
  } from "@threlte/extras";
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { MIDI, Settings } from "../store";
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";

  import Cube from "../Sandbox/Instance/Cube.svelte";
  import Mirror from "../Sandbox/Instance/Mirror.svelte";

  const { scene } = $state(useThrelte());

  const { r, g, b } = $Settings.colours.background;

  scene.background = new Color(`rgb(${r},${g},${b})`);

  let midiMessages = $state([{}]);

  const styles = ["Cube", "Mirror"];

  let styleIndex = $state(0);

  let colour = $state($Settings.colours.key);

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });
  onDestroy(unsubscribe);

  function setupScene(choice: string) {
    colour = { r: 0, g: 100, b: 0 };

    $Settings.orbitControls = false;

    introZoom.set(0, {
      delay: 250,
      duration: 750,
      easing: cubicInOut,
    });

    setTimeout(() => {
      cameraPosition = [5, 1, 3];
      setTimeout(() => {
        $Settings.orbitControls = true;
        $Settings.scene = choice;
        goto("../Sandbox");
      }, 750);
    }, 750);
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
<Billboard position.y={7}>
  <Text
    text={"Style"}
    color={"orange"}
    fontSize={window.innerWidth / 3000}
    textAlign={"center"}
    anchorX={"center"}
    position.y={window.innerWidth / 1250}
  />
  <Text
    text={"Play notes to sample, click to confirm style"}
    color={"white"}
    fontSize={window.innerWidth / 6000}
    textAlign={"center"}
    anchorX={"center"}
  />
</Billboard>
<!-- Show sample of styles -->
{#each midiMessages.slice(0, 5) as note, index}
  <T.Group
    position.y={-window.innerHeight / 200}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
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
          keyColour={colour}
          expressionColour={$Settings.colours.expression}
        />
      {:else}
        <Mirror
          x={index - 2}
          velocity={note.velocity}
          attack={$Settings.attack}
          release={$Settings.release}
          keyColour={colour}
          expressionColour={$Settings.colours.expression}
        />
      {/if}
    </InstancedMesh>
    <Text
      fontSize={0.5}
      text={styles[styleIndex]}
      textAlign={"center"}
      anchorX={"center"}
      position.y={3}
      position.z={3.75}
      color={"white"}
      onpointerenter={onPointerEnter}
      onpointerleave={onPointerLeave}
      onclick={() => setupScene(styles[styleIndex])}
    />
  </T.Group>
{/each}
<Billboard position.y={-window.innerHeight / 140}>
  <T.Mesh
    scale={0.75}
    position.x={2}
    rotation.z={-Math.PI / 2}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onclick={() => (styleIndex === 0 ? styleIndex++ : (styleIndex = 0))}
  >
    <T.ConeGeometry />
    <T.MeshBasicMaterial color={"orange"} />
  </T.Mesh>
  <T.Mesh
    scale={0.75}
    position.x={-2}
    rotation.z={Math.PI / 2}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onclick={() => (styleIndex === 1 ? styleIndex-- : (styleIndex = 1))}
  >
    <T.ConeGeometry />
    <T.MeshBasicMaterial color={"orange"} />
  </T.Mesh>
</Billboard>
<T.DirectionalLight intensity={1} position={[1, 0, 11]} />
<T.DirectionalLight intensity={1} position={[-5, 0, -11]} />
<T.AmbientLight intensity={0.3} position={[0, 1, 0]} />

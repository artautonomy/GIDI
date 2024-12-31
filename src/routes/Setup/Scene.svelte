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
  import { spring } from "svelte/motion";
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

  let styles = $state(["Cube", "Mirror"]);

  let styleIndex = $state(0);

  let colour = $state($Settings.colours.key);

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });
  onDestroy(unsubscribe);

  function setupStylePage() {
    if (midiMessages.length > 0) {
      $Settings.orbitControls = false;
      introZoom.set(0, {
        duration: 750,
        easing: cubicInOut,
      });
      setTimeout(() => {
        $Settings.autoRotate = false;
        cameraPosition = [0, 1, 15];

        introZoom.set(25, {
          duration: 750,
          easing: cubicInOut,
        });

        setTimeout(() => {
          $Settings.orbitControls = true;
        }, 750);
      }, 800);
    }
  }

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
<Billboard position.y={7}>
  <Text
    text={"Select a style"}
    color={"orange"}
    fontSize={window.innerWidth / 3000}
    textAlign={"center"}
    anchorX={"center"}
    position.y={window.innerWidth / 1250}
  />
  <Text
    text={"Play notes to sample styles, when ready select one"}
    color={"white"}
    fontSize={window.innerWidth / 6000}
    textAlign={"center"}
    anchorX={"center"}
  />

  <Text
    fontSize={window.innerWidth / 2000}
    text={">>"}
    textAlign={"center"}
    anchorX={"center"}
    position.y={-window.innerWidth / 2000}
    color={"green"}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onclick={() => (styleIndex === 0 ? styleIndex++ : (styleIndex = 0))}
  />
</Billboard>
<!-- Show sample of styles -->
{#each midiMessages.slice(0, 5) as note, index}
  <T.Group
    position={[0, -window.innerHeight / 150, 0]}
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
      position.x={0}
      position.z={3.75}
      color={"white"}
      onpointerenter={onPointerEnter}
      onpointerleave={onPointerLeave}
      onclick={() => setupScene(styles[styleIndex])}
    />
  </T.Group>
{/each}

<T.DirectionalLight intensity={1} position={[1, 0, 11]} />
<T.DirectionalLight intensity={1} position={[-5, 0, -11]} />
<T.AmbientLight intensity={0.3} position={[0, 1, 0]} />

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
  import Cube from "./instances/Cube.svelte";
  import Mirror from "./instances/Mirror.svelte";

  const { scene } = $state(useThrelte());

  type MIDIMessage = { note: number; velocity: number }

  let midiMessages = $state<MIDIMessage[]>([]);

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });
  onDestroy(unsubscribe);

  const { hovering, onPointerEnter, onPointerLeave } = useCursor();

  interactivity();

  let menuOpened = $state(false);

  let selected = $state($Settings.colours.key);

  let tips = $state("Press and hold the mouse to rotate the scene");

  setTimeout(() => {
    if (tips == "Press and hold the mouse to rotate the scene") {
      tips = "To zoom in and out use the mousewheel";
    }
  }, 4000);

  const introZoom = new Tween(0, {
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

  function openMenu() {
    $Settings.edit = true;

    selected = $Settings.colours.key;

    introZoom.set(25, {
      duration: 1000,
      easing: cubicOut,
    });

    hintText.target = 0;

    setTimeout(() => {
      menuOpened = true;
    }, 2000);
  }
  $effect(() => {
    if (!$Settings.edit) {
      introZoom.set(50, {
        duration: 1000,
        easing: cubicIn,
      });
    }
  });

  $effect(() => {
    if (scene) {
      scene.background = new Color(
        `rgb(${$Settings.colours.background.r},${$Settings.colours.background.g},${$Settings.colours.background.b})`
      );
    }

    if ($hovering) {
      selected = {
        r: 255 - $Settings.colours.background.r,
        g: 255 - $Settings.colours.background.g,
        b: 255 - $Settings.colours.background.b,
      };
    } else {
      selected = $Settings.colours.key;
    }
  });

  $Settings.orbitControls = true;
  $Settings.autoRotate = false;
</script>

<T.OrthographicCamera
  makeDefault
  position={[10, 10, 20]}
  near={0.001}
  far={5000}
  zoom={introZoom.current}
>
  <OrbitControls
    enableDamping
    autoRotateSpeed={$Settings.autoRotateSpeed}
    autoRotate={$Settings.autoRotate}
    enabled={$Settings.orbitControls}
    onstart={(e) => {
      hintArrow.target = 0.75;
      tips = "To edit the scene click here";
    }}
  ></OrbitControls>
</T.OrthographicCamera>


<Align y={false} auto precise>
  <!-- Show sample of styles -->
  {#each midiMessages as note, index}
    <T.Group
      position.y={-window.innerHeight / 200}
      onpointerenter={onPointerEnter}
      onpointerleave={onPointerLeave}
      onclick={() => openMenu()}
    >
      <InstancedMesh>
        <T.BoxGeometry />
        <T.MeshStandardMaterial shadow />
        {#if $Settings.scene == "Cube"}
          <Cube
            x={index}
            velocity={note.velocity}
            attack={$hovering ? 250 : $Settings.attack}
            release={$hovering ? 250 : $Settings.release}
            keyColour={selected}
            expressionColour={$Settings.colours.expression}
          />
        {:else}
          <Mirror
            x={index}
            velocity={note.velocity}
            attack={$hovering ? 250 : $Settings.attack}
            release={$hovering ? 250 : $Settings.release}
            keyColour={selected}
            expressionColour={$Settings.colours.expression}
          />
        {/if}
      </InstancedMesh>
    </T.Group>
  {/each}
</Align>

{#if !menuOpened}
  <Billboard position.y={-window.innerHeight / 120}>
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
      font={$Settings.font}
      fontSize={window.innerWidth / 6250}
      textAlign={"center"}
      anchorX={"center"}
      position.y={window.innerHeight / 1250}
    />
  </Billboard>
{/if}

<T.DirectionalLight intensity={1} position={[1, 0, 11]} />
<T.DirectionalLight intensity={1} position={[-5, 0, -11]} />
<T.AmbientLight intensity={0.3} position={[0, 1, 0]} />

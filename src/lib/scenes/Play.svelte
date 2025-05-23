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
  import { Box, Flex } from "@threlte/flex";
  import { Tween } from "svelte/motion";
  import { cubicIn, cubicInOut } from "svelte/easing";
  import { Device, MIDI, Settings } from "../store";
  import { onDestroy } from "svelte";
  import Cube from "./instances/Cube.svelte";
  import Piano from "./instances/Piano.svelte";
  import Mirror from "./instances/Mirror.svelte";
  import Smoke from "./instances/Smoke.svelte";

  const { scene } = $state(useThrelte());

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

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });
  onDestroy(unsubscribe);

  const { hovering, onPointerEnter, onPointerLeave } = useCursor();

  interactivity();

  let zoom = 50;
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

  const noteScale = new Tween(
    1 - Math.log(midiMessages.length) / Math.log(window.innerWidth),
    {
      duration: 750,
      easing: cubicInOut,
    }
  );

  const hintText = new Tween(1, {
    duration: 500,
    easing: cubicInOut,
  });

  const hintArrow = new Tween(0, {
    duration: 500,
    easing: cubicInOut,
  });

  introZoom.target = zoom;

  function openMenu() {
    $Settings.edit = true;

    selected = $Settings.colours.key;

    noteScale.target =
      1 - Math.log(midiMessages.length) / Math.log(window.innerWidth) - 0.2;

    hintText.target = 0;

    setTimeout(() => {
      menuOpened = true;
    }, 2000);
  }

  function onKeyDown(e) {
    switch (e.key) {
      case "e":
        openMenu();
        break;
    }
  }

  $effect(() => {
    if (!$Settings.edit) {
      noteScale.target =
        1 - Math.log(midiMessages.length) / Math.log(window.innerWidth);
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

  //testing new styles
  //$Device.input.id = "input-0";
  //$Settings.scene = "Line";
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
    enableZoom={!$Settings.edit}
    autoRotateSpeed={$Settings.autoRotateSpeed}
    autoRotate={$Settings.autoRotate}
    enabled={$Settings.orbitControls}
    onstart={(e) => {
      hintArrow.target = 0.75;
      tips = "To edit the scene click here or press 'e'";
    }}
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

<Flex
  width={window.innerWidth / 40}
  height={window.innerHeight / 40}
  flexDirection="Column"
>
  <Box flex={2} width="100%" height="100%">
    <Align scale={noteScale.current} y={false} auto precise>
      <InstancedMesh>
        <T.BoxGeometry />
        <T.MeshStandardMaterial shadow />
        <T.Group
          position.y={-6}
          onpointerenter={onPointerEnter}
          onpointerleave={onPointerLeave}
          onclick={() => openMenu()}
        >
          {#each midiMessages as noteNumber}
            {#if $Settings.scene == "Cube"}
              <Cube
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$hovering ? 250 : $Settings.attack}
                release={$hovering ? 250 : $Settings.release}
                keyColour={selected}
                expressionColour={$Settings.colours.expression}
              />
            {:else if $Settings.scene == "Piano"}
              <Piano
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$hovering ? 250 : $Settings.attack}
                release={$hovering ? 250 : $Settings.release}
                keyColour={selected}
                expressionColour={$Settings.colours.expression}
              />
            {:else if $Settings.scene == "Mirror"}
              <Mirror
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$hovering ? 250 : $Settings.attack}
                release={$hovering ? 250 : $Settings.release}
                keyColour={selected}
                expressionColour={$Settings.colours.expression}
              />
            {:else}
              <Smoke
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$hovering ? 250 : $Settings.attack}
                release={$hovering ? 250 : $Settings.release}
                keyColour={selected}
                expressionColour={$Settings.colours.expression}
              />
            {/if}
          {/each}
        </T.Group>
      </InstancedMesh>
    </Align>
  </Box>
  <Billboard>
    <Box flex={1} width="100%" height="100%">
      {#if !menuOpened}
        <T.Mesh scale={hintArrow.current} position.y={3}>
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
          textAlign={"center"}
          anchorX={"center"}
          fontSize={window.innerHeight > 950 ? 0.45 : 0.3}
          position.y={2}
        />
      {/if}
    </Box>
  </Billboard>
</Flex>

<svelte:window on:keydown|preventDefault={onKeyDown} />

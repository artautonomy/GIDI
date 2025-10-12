<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { Color } from "three";
  import {
    Align,
    Billboard,
    Gizmo,
    InstancedMesh,
    interactivity,
    OrbitControls,
    Text,
    useCursor,
  } from "@threlte/extras";
  import { Box, Flex } from "@threlte/flex";
  import { Spring, Tween } from "svelte/motion";
  import { cubicIn, cubicInOut } from "svelte/easing";
  import { Device, MIDI, Settings } from "../store";
  import { onDestroy } from "svelte";
  import Lighting from "./Lighting.svelte";
  import Cube from "./instances/Cube.svelte";
  import Piano from "./instances/Piano.svelte";
  import Mirror from "./instances/Mirror.svelte";
  import Firework from "./instances/Firework.svelte";
  import Swirl from "./instances/Swirl.svelte";

  const { scene, camera } = $state(useThrelte());

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

  let selected = $state($Settings.notes.colours.key);

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

    selected = $Settings.notes.colours.key;

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

      case "r":
        recordCameraCoords();
        break;

      case "p":
        playRecord();
        break;
    }
  }

  $effect(() => {
    if (!$Settings.edit) {
      noteScale.target =
        1 - Math.log(midiMessages.length) / Math.log(window.innerWidth);
    }

    $inspect("recordCords:", recordCords);
  });

  $effect(() => {
    if (scene) {
      scene.background = new Color(
        `rgb(${$Settings.scene.colours.background.r},${$Settings.scene.colours.background.g},${$Settings.scene.colours.background.b})`
      );
    }

    if ($hovering) {
      selected = {
        r: 255 - $Settings.scene.colours.background.r,
        g: 255 - $Settings.scene.colours.background.g,
        b: 255 - $Settings.scene.colours.background.b,
      };
    } else {
      selected = $Settings.notes.colours.key;
    }
  });

  type Vec3 = [number, number, number];

  let cameraCord: Vec3 = $state([7.5, 10, 20]);

  let recordCords: Vec3[] = $state([]);

  let recordAnimationSpeed = 1000;

  const recordCordsTransition = new Tween(cameraCord, {
    duration: recordAnimationSpeed,
    easing: cubicInOut,
  });

  async function animateCamera() {
    for (const target of recordCords) {
      recordCordsTransition.set(target);
      await new Promise((r) => setTimeout(r, recordAnimationSpeed));
    }
  }

  function recordCameraCoords() {
    $Settings.record.enabled = !$Settings.record.enabled;

    if (!$Settings.record.enabled) {
      animateCamera();

      cameraCord = [0, 0, 0];
    }
  }

  function playRecord() {
    animateCamera();
  }

  function handleEnd() {
    if ($Settings.record.enabled) {
      console.log("Camera end coords:", camera.current.position);

      recordCords = [
        ...recordCords,
        [
          camera.current.position.clone().x,
          camera.current.position.clone().y,
          camera.current.position.clone().z,
        ],
      ];
    }
  }

  $Settings.orbitControls = true;
  $Settings.scene.autoRotate = false;

  //testing new styles
  //$Device.input.id = "input-0";
  //$Settings.scene = "Piano";
</script>

<Lighting />

<T.OrthographicCamera
  makeDefault
  position={recordCordsTransition.current}
  near={0.001}
  far={5000}
  zoom={introZoom.current}
>
  <OrbitControls
    enableDamping
    enableZoom={!$Settings.edit}
    autoRotateSpeed={$Settings.scene.autoRotateSpeed}
    autoRotate={$Settings.scene.autoRotate}
    enabled={$Settings.orbitControls}
    onstart={(e) => {
      hintArrow.target = 0.75;
      tips = "To edit the scene click here or press 'e'";
    }}
    onend={handleEnd}><Gizmo speed={0.75} /></OrbitControls
  >
</T.OrthographicCamera>

<Flex
  width={window.innerWidth / 40}
  height={window.innerHeight / 40}
  flexDirection="Column"
>
  <Box flex={2} width="100%" height="100%">
    <Align scale={noteScale.current} y={false} auto precise>
      <T.Group
        position.y={-6}
        onpointerenter={onPointerEnter}
        onpointerleave={onPointerLeave}
        onclick={() => openMenu()}
      >
        <InstancedMesh>
          <T.BoxGeometry />
          <T.MeshStandardMaterial shadow />

          {#each midiMessages as noteNumber}
            {#if $Settings.sceneSelected == "Cube"}
              <Cube
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$hovering ? 250 : $Settings.notes.attack}
                release={$hovering ? 250 : $Settings.notes.release}
                keyColour={selected}
                expressionColour={$Settings.notes.colours.expression}
              />
            {:else if $Settings.sceneSelected == "Piano"}
              <Piano
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$hovering ? 250 : $Settings.notes.attack}
                release={$hovering ? 250 : $Settings.notes.release}
                keyColour={selected}
                expressionColour={$Settings.notes.colours.expression}
              />
            {:else if $Settings.sceneSelected == "Mirror"}
              <Mirror
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$hovering ? 250 : $Settings.notes.attack}
                release={$hovering ? 250 : $Settings.notes.release}
                keyColour={selected}
                expressionColour={$Settings.notes.colours.expression}
              />
            {/if}
          {/each}
        </InstancedMesh>
        {#each midiMessages as noteNumber}
          {#if $Settings.sceneSelected == "Swirl"}
            <Swirl
              position={noteNumber.position}
              scale={noteNumber.scale}
              velocity={noteNumber.velocity}
              attack={$hovering ? 250 : $Settings.notes.attack}
              release={$hovering ? 250 : $Settings.notes.release}
              keyColour={selected}
              expressionColour={$Settings.notes.colours.expression}
            />
          {:else if $Settings.sceneSelected == "Firework"}
            <Firework
              position={noteNumber.position}
              scale={noteNumber.scale}
              velocity={noteNumber.velocity}
              attack={$hovering ? 250 : $Settings.notes.attack}
              release={$hovering ? 250 : $Settings.notes.release}
              keyColour={selected}
              expressionColour={$Settings.notes.colours.expression}
            />
          {/if}
        {/each}
      </T.Group>
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

<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { Color } from "three";
  import {
    Align,
    Billboard,
    interactivity,
    OrbitControls,
    InstancedMesh,
    Text,
  } from "@threlte/extras";
  import { spring, tweened } from "svelte/motion";
  import { cubicOut, cubicInOut } from "svelte/easing";
  import { MIDI, Settings } from "./store";
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import Mirror from "./Sandbox/Instance/Mirror.svelte";

  const { scene } = $state(useThrelte());

  const { r, g, b } = $Settings.colours.background;

  scene.background = new Color(`rgb(${r},${g},${b})`);

  interactivity();

  let cameraPosition = $state([5, 3, 4]);
  let mobileNotes: { note: number; velocity: number }[] = $state([]);

  const introZoom = tweened(0);
  const buttonScale = spring(6);

  introZoom.set(50, {
    delay: 200,
    duration: 1000,
    easing: cubicInOut,
  });

  let midiMessages = $state([{}]);

  // if PC
  if (window.innerWidth > window.innerHeight) {
    const unsubscribe = MIDI.subscribe((notes) => {
      midiMessages = notes;
    });

    onDestroy(unsubscribe);
  }
  //if Mobile
  else {
    let oldIndex: number;

    $Settings.attack = 2000;

    for (let i = 0; i < 5; i++) {
      mobileNotes = [...mobileNotes, { note: i, velocity: 0 }];
    }
    setInterval(() => {
      let index = Math.floor(Math.random() * 5);

      while (index == oldIndex) {
        index = Math.floor(Math.random() * 5);
      }

      mobileNotes[index].velocity = 127;

      setTimeout(() => {
        mobileNotes[index].velocity = 0;
      }, Math.floor(2000));

      oldIndex = index;
    }, Math.floor(1000));
  }

  function Setup() {
    setTimeout(() => {
      introZoom.set(0, {
        duration: 750,
        easing: cubicOut,
      });
      setTimeout(() => {
        goto("./Setup");
      }, 750);
    }, 750);
  }
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
    autoRotateSpeed={2}
    autoRotate={true}
    enabled={false}
    on:start={(camera) => {
      cameraPosition = camera.target.object.position;
      introZoom.set(camera.target.object.zoom, { duration: 0 });
    }}
  ></OrbitControls>
</T.OrthographicCamera>

<!-- if PC -->
{#if window.innerWidth > window.innerHeight}
  {midiMessages.length > 0 ? Setup() : null}
  <!-- Splash Screen-->
  <Billboard position.y={7}>
    <T.Mesh>
      <Text
        text={"Welcome to GIDI"}
        color={"orange"}
        fontSize={window.innerWidth / 3000}
        textAlign={"center"}
        anchorX={"center"}
        position.y={window.innerWidth / 1250}
      />
      <Text
        text={"GIDI is a free, open source web application for musicians using MIDI\n\nBy interpreting MIDI messages it can visualise performances on a web browser\n\n\n\nTo start using GIDI follow the steps below:"}
        fontSize={window.innerWidth / 6000}
        textAlign={"center"}
        smooth={1}
        anchorX={"center"}
      />
      <Text
        text={"1. Connect a MIDI instrument to your device\n\n2. Play a note\n\n3. If the box turns green you are connected"}
        fontSize={window.innerWidth / 5000}
        color={"orange"}
        textAlign={"left"}
        smooth={1}
        anchorX={"center"}
        position.y={-window.innerWidth / 500}
      />
    </T.Mesh>
  </Billboard>

  <T.Mesh
    position={[0, -window.innerHeight / 250, 0]}
    interactive
    onpointerenter={() => buttonScale.set(12)}
    onpointerleave={() => buttonScale.set(6)}
  >
    <Text
      text={midiMessages.length === 0
        ? "Connect A MIDI Device"
        : "MIDI Connected"}
      fontSize={0.5}
      textAlign={"center"}
      smooth={1}
      anchorX={"center"}
      anchorY={"middle"}
      position={[0, 0.8, 0]}
      rotation={[-1.553343, 0, 0]}
    />
    <Text
      text={midiMessages.length === 0 ? "No MIDI Device Found" : "Initialising"}
      fontSize={0.5}
      textAlign={"center"}
      smooth={1}
      anchorX={"center"}
      anchorY={"middle"}
      position={[0, 0, 1.02]}
    />

    <Text
      text={midiMessages.length === 0 ? "No MIDI Device Found" : "Initialising"}
      fontSize={0.5}
      textAlign={"center"}
      smooth={1}
      anchorX={"center"}
      anchorY={"middle"}
      position={[0, 0, -1.02]}
      rotation.y={3.14}
    />

    <T.MeshStandardMaterial
      shadow
      color="#FD3F00"
      toneMapped={false}
      metalness={1.0}
      roughness={0.1}
    />
    <T.BoxGeometry args={[$buttonScale, 1.5, 2]} />
    <T.MeshStandardMaterial
      color={midiMessages.length === 0 ? "darkred" : "green"}
    />
  </T.Mesh>

  <!-- if Mobile -->
{:else}
  <!-- Splash Screen-->
  <Billboard follow={true}>
    <T.Mesh position={[0, 5.5, 0]}>
      <Text
        text={"Welcome to GIDI"}
        color={"orange"}
        fontSize={window.innerWidth / 1000}
        textAlign={"center"}
        anchorX={"center"}
        position.y={window.innerHeight / 250}
      />
      <Text
        text={"GIDI is a free, open source web application for musicians using MIDI\n\nBy interpreting MIDI messages it can visualise performances on a web browser"}
        fontSize={window.innerWidth / 2000}
        textAlign={"center"}
        smooth={1}
        anchorX={"center"}
        position.y={window.innerHeight / 450}
      />

      <Text
        text={"To start using GIDI revisit this website on a computer"}
        fontSize={window.innerWidth / 1750}
        textAlign={"center"}
        color={"orange"}
        smooth={1}
        anchorX={"center"}
        position.y={-window.innerHeight / 5000}
      />
    </T.Mesh>
  </Billboard>
  <T.Group position={[0, -window.innerHeight / 200, 0]}>
    <Align>
      {#each mobileNotes as note, index}
        <InstancedMesh>
          <T.BoxGeometry />
          <T.MeshStandardMaterial shadow />
          <Mirror
            x={index}
            velocity={note.velocity}
            attack={$Settings.attack}
            release={$Settings.release}
            keyColour={$Settings.colours.key}
            expressionColour={$Settings.colours.expression}
            styleHover={false}
          />
        </InstancedMesh>
      {/each}
    </Align>
  </T.Group>
{/if}

<T.DirectionalLight intensity={1} position={[5, 0, 11]} />
<T.DirectionalLight intensity={1} position={[-5, 0, -11]} />
<T.AmbientLight intensity={0.3} position={[0, 50, 0]} />

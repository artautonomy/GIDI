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
  import { Spring, Tween } from "svelte/motion";
  import { cubicOut, cubicInOut } from "svelte/easing";
  import { MIDI, Settings } from "./store";
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import Mirror from "./play/Instance/Mirror.svelte";

  const { scene } = $state(useThrelte());

  scene.background = new Color(
    `rgb(${$Settings.colours.background.r},${$Settings.colours.background.g},${$Settings.colours.background.b})`
  );

  interactivity();

  let cameraPosition = $state([5, 3, 4]);
  let mobileNotes: { note: number; velocity: number }[] = $state([]);

  let mobile = $state(false);

  const introZoom = new Tween(0);
  const buttonScale = new Spring(6);

  const title = "Welcome to GIDI";

  const summary =
    "GIDI is a free, open source web application for musicians using MIDI devices\n\nBy reading MIDI messages it can visualise a performance on a web browser";

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
    mobile = true;
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
        goto("./style");
      }, 750);
    }, 2000);
  }
</script>

<T.OrthographicCamera
  makeDefault
  position={cameraPosition}
  near={0.001}
  far={5000}
  zoom={introZoom.current}
>
  <OrbitControls
    autoRotateSpeed={2}
    autoRotate={true}
    enabled={mobile}
    enableDamping
    enablePan={false}
    enableZoom={false}
  ></OrbitControls>
</T.OrthographicCamera>

<!-- if PC -->
{#if window.innerWidth > window.innerHeight}
  {midiMessages.length > 0 ? Setup() : null}
  <!-- Splash Screen-->
  <Billboard position.y={7}>
    <T.Mesh>
      <Text
        text={title}
        color={"orange"}
        font={$Settings.font}
        fontSize={window.innerWidth / 4000}
        textAlign={"center"}
        anchorX={"center"}
        position.y={window.innerWidth / 1250}
        outlineBlur={0.1}
      />
      <Text
        text={summary + "\n\n\n\nTo start using GIDI follow the steps below:"}
        font={$Settings.font}
        fontSize={window.innerWidth / 7000}
        textAlign={"center"}
        smooth={1}
        anchorX={"center"}
        outlineBlur={0.1}
      />
      <Text
        text={"1. Connect a MIDI instrument to your device\n\n2. Play a note\n\n3. If the box turns green you are connected"}
        font={$Settings.font}
        fontSize={window.innerWidth / 6250}
        color={"orange"}
        textAlign={"left"}
        smooth={1}
        anchorX={"center"}
        position.y={-window.innerWidth / 500}
        outlineBlur={0.1}
      />
    </T.Mesh>
  </Billboard>

  <T.Mesh
    position={[0, -window.innerWidth / 300, 0]}
    interactive
    onpointerenter={() => buttonScale.set(8)}
    onpointerleave={() => buttonScale.set(6)}
  >
    <Text
      text={midiMessages.length === 0
        ? "Connect A MIDI Device"
        : "MIDI Connected"}
      font={$Settings.font}
      fontSize={0.5}
      textAlign={"center"}
      smooth={1}
      anchorX={"center"}
      anchorY={"middle"}
      position={[0, 0.8, 0]}
      rotation={[-1.553343, 0, 0]}
      outlineBlur={0.06}
    />
    <Text
      text={midiMessages.length === 0 ? "No MIDI Device Found" : "Initialising"}
      font={$Settings.font}
      fontSize={0.5}
      textAlign={"center"}
      smooth={1}
      anchorX={"center"}
      anchorY={"middle"}
      position={[0, 0, 1.02]}
      outlineBlur={0.06}
    />

    <Text
      text={midiMessages.length === 0 ? "No MIDI Device Found" : "Initialising"}
      font={$Settings.font}
      fontSize={0.5}
      textAlign={"center"}
      smooth={1}
      anchorX={"center"}
      anchorY={"middle"}
      position={[0, 0, -1.02]}
      rotation.y={3.14}
      outlineBlur={0.06}
    />

    <T.MeshStandardMaterial
      shadow
      color="#FD3F00"
      toneMapped={false}
      metalness={1.0}
      roughness={0.1}
    />
    <T.BoxGeometry args={[buttonScale.current, 1.5, 2]} />
    <T.MeshStandardMaterial
      color={midiMessages.length === 0 ? "darkred" : "green"}
    />
  </T.Mesh>

  <!-- if Mobile -->
{:else}
  <!-- Splash Screen-->
  <Billboard>
    <T.Mesh position={[0, 5.5, 0]}>
      <Text
        text={title}
        color={"orange"}
        fontSize={window.innerWidth / 1000}
        textAlign={"center"}
        anchorX={"center"}
        position.y={window.innerHeight / 250}
      />
      <Text
        text={summary}
        fontSize={window.innerWidth / 2000}
        textAlign={"center"}
        smooth={1}
        anchorX={"center"}
        position.y={window.innerHeight / 450}
      />

      <Text
        text={"Revisit this site on a computer to begin"}
        fontSize={window.innerWidth / 1750}
        textAlign={"center"}
        color={"orange"}
        smooth={1}
        anchorX={"center"}
        position.y={window.innerHeight / 1800}
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

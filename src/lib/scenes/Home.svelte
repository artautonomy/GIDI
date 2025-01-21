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
    useCursor,
  } from "@threlte/extras";
  import { Spring, Tween } from "svelte/motion";
  import { cubicOut, cubicInOut } from "svelte/easing";
  import { MIDI, Settings } from "../store";
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import Cube from "./instances/Cube.svelte";
  import Mirror from "./instances/Mirror.svelte";

  const { scene } = $state(useThrelte());

  scene.background = new Color(
    `rgb(${$Settings.colours.background.r},${$Settings.colours.background.g},${$Settings.colours.background.b})`
  );

  interactivity();

  let mobileNotes: { note: number; velocity: number }[] = $state([]);

  let mobile = $state(false);
  let tips = $state("Swipe to rotate the scene");
  let cubeClicked = $state(false);

  const introZoom = new Tween(0);
  const buttonScale = new Spring(6);

  const hintText = new Tween(1, {
    duration: 1000,
    easing: cubicInOut,
  });

  const hintArrow = new Tween(0, {
    duration: 1000,
    easing: cubicInOut,
  });

  const navigationArrows = new Tween(0, {
    delay: 1000,
    duration: 1000,
    easing: cubicInOut,
  });

  const styles = ["Cube", "Mirror"];

  let styleIndex = $state(0);

  let notesIndex = $state(0);

  const notesColours = [
    { key: { r: 141, g: 154, b: 203 }, expression: { r: 254, g: 228, b: 129 } },
    { key: { r: 0, g: 83, b: 56 }, expression: { r: 255, g: 5, b: 86 } },
    { key: { r: 77, g: 12, b: 55 }, expression: { r: 255, g: 122, b: 255 } },
  ];

  const title = "Welcome to GIDI";

  const summary =
    "GIDI is a free, open source web application for musicians using MIDI devices\n\nBy reading MIDI messages it can visualise a performance on a web browser";

  const { onPointerEnter, onPointerLeave } = useCursor();

  let midiMessages = $state([{}]);

  // if PC read MIDI
  if (window.innerWidth > window.innerHeight) {
    introZoom.set(50, {
      delay: 200,
      duration: 1000,
      easing: cubicInOut,
    });

    const unsubscribe = MIDI.subscribe((notes) => {
      midiMessages = notes;
    });

    onDestroy(unsubscribe);
  }
  //if Mobile created sample MIDI
  else {
    introZoom.set(35, {
      delay: 200,
      duration: 1000,
      easing: cubicInOut,
    });

    mobile = true;

    let oldIndex: number;

    $Settings.attack = 75;
    $Settings.release = 1000;

    for (let i = 0; i < 5; i++) {
      mobileNotes.push({ note: i, velocity: 0 });
    }
    setTimeout(() => {
      setInterval(
        () => {
          let index = Math.floor(Math.random() * 5);

          while (index == oldIndex) {
            index = Math.floor(Math.random() * 5);
          }

          mobileNotes[index].velocity = (Math.random() + 1) * 63.5;

          setTimeout(
            () => {
              mobileNotes[index].velocity = 0;
            },
            Math.floor(Math.random() * 1000)
          );

          oldIndex = index;
        },
        Math.floor((Math.random() + 0.5) * 500)
      );
    }, 500);
  }

  function Setup() {
    setTimeout(() => {
      introZoom.set(0, {
        duration: 750,
        easing: cubicOut,
      });
      setTimeout(() => {
        goto("./style");
      }, 1000);
    }, 2000);
  }
</script>

<T.OrthographicCamera
  makeDefault
  position={[5, 3, 4]}
  near={0.001}
  far={5000}
  zoom={introZoom.current}
>
  <OrbitControls
    enabled={mobile}
    autoRotate={!mobile}
    enableDamping
    enablePan={false}
    enableZoom={false}
    rotateSpeed={2}
    maxPolarAngle={Math.PI / 1.7}
    minPolarAngle={Math.PI / 4}
    onstart={(e) => {
      hintArrow.target = 0.75;
      tips = "To shuffle colours tap here";
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
    <T.Mesh position={[0, 8, 0]}>
      <Text
        text={title}
        color={"orange"}
        font={$Settings.font}
        fontSize={window.innerWidth / 600}
        textAlign={"center"}
        anchorX={"center"}
        position.y={window.innerHeight / 350}
      />
      <Text
        text={summary}
        font={$Settings.font}
        fontSize={window.innerWidth / 1500}
        textAlign={"center"}
        smooth={1}
        anchorX={"center"}
        position.y={window.innerHeight / 750}
      />

      <Text
        text={"Try the demo below or revisit this site on a computer"}
        font={$Settings.font}
        fontSize={window.innerWidth / 1250}
        textAlign={"center"}
        color={"orange"}
        smooth={1}
        anchorX={"center"}
        position.y={-window.innerHeight / 1250}
      />
    </T.Mesh>
  </Billboard>
  <T.Group
    position={[0, -window.innerHeight / 200, 0]}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onclick={() => {
      hintText.target = 0;
      navigationArrows.target = 0.75;

      $Settings.colours.key = notesColours[notesIndex].key;
      $Settings.colours.expression = notesColours[notesIndex].expression;

      if (notesIndex >= notesColours.length - 1) {
        notesIndex = 0;
      } else {
        notesIndex++;
      }
    }}
  >
    <Align>
      {#each mobileNotes as note, index}
        <InstancedMesh>
          <T.BoxGeometry />
          <T.MeshStandardMaterial shadow />
          {#if styles[styleIndex] == "Cube"}
            <Cube
              x={index - 2}
              velocity={note.velocity}
              attack={$Settings.attack}
              release={$Settings.release}
              keyColour={$Settings.colours.key}
              expressionColour={$Settings.colours.expression}
            />
          {:else}
            <Mirror
              x={index - 2}
              velocity={note.velocity}
              attack={$Settings.attack}
              release={$Settings.release}
              keyColour={$Settings.colours.key}
              expressionColour={$Settings.colours.expression}
            />
          {/if}
        </InstancedMesh>
      {/each}
    </Align>
  </T.Group>
  {#if !cubeClicked}
    <Billboard position.y={-window.innerHeight / 100}>
      <T.Mesh scale={hintArrow.current} position.y={window.innerHeight / 550}>
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
        fontSize={window.innerWidth / 1250}
        textAlign={"center"}
        anchorX={"center"}
        position.y={window.innerHeight / 1250}
      />
    </Billboard>
  {/if}
  <Billboard position.y={-window.innerHeight / 100}>
    <T.Mesh
      receiveShadow
      scale={navigationArrows.current}
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
      scale={navigationArrows.current}
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
{/if}

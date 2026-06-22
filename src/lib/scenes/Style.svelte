<script lang="ts">
  import { T } from "@threlte/core";
  import { Color } from "three";
  import {
    Align,
    Billboard,
    HTML,
    InstancedMesh,
    interactivity,
    OrbitControls,
    Text,
    useCursor,
  } from "@threlte/extras";
  import { fade } from "svelte/transition";
  import { Tween, Spring } from "svelte/motion";
  import { cubicIn, cubicInOut } from "svelte/easing";
  import { MIDI, Settings } from "../store";
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { Box, Flex } from "@threlte/flex";
  import Lighting from "./Lighting.svelte";
  import Cube from "../instances/Cube.svelte";
  import Mirror from "../instances/Mirror.svelte";
  import Piano from "../instances/Piano.svelte";
  import Firework from "../instances/Firework.svelte";
  import Swirl from "../instances/Swirl.svelte";

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
  const title = "Style";

  const summary =
    "Play your MIDI device to sample styles.\n\nTo confirm your style click 'Select'.";

  const MIDIConnectedButtonScale = new Spring(
    window.innerWidth < 475
      ? window.innerWidth / 37.5
      : window.innerWidth / 150,
  );

  const MIDIConnectedButtonRotation = new Tween(0, {
    delay: 500,
    duration: 1250,
    easing: cubicInOut,
  });

  const MIDIConnectedButtonPosition = new Tween(-1, {
    delay: 750,
    duration: 750,
    easing: cubicIn,
  });

  let midiMessages = $state<MIDIMessage[]>([]);

  const styles = $Settings.notes.styles;

  let styleIndex = $state(0);

  let highlighted = $state($Settings.notes.colours.key);

  let selected = $state(false);

  let notePlayed = $state(false);

  let noteTriggered = false;

  let clearScene = $state(false);

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });

  onDestroy(unsubscribe);

  const noteScale = new Tween(
    1 - Math.log(midiMessages.length) / Math.log(window.innerWidth),
    {
      duration: 750,
      easing: cubicInOut,
    },
  );

  function styleBack() {
    styleIndex > 0 ? styleIndex-- : (styleIndex = styles.length - 1);
    $Settings.sceneSelected = styles[styleIndex];

    $Settings.styleReset = true;
  }

  function styleNext() {
    styleIndex >= 0 && styleIndex < styles.length - 1
      ? styleIndex++
      : (styleIndex = 0);
    $Settings.sceneSelected = styles[styleIndex];

    $Settings.styleReset = true;
  }

  function setupScene(choice: string, e: MouseEvent) {
    const target = e.currentTarget as HTMLButtonElement;

    target.style.backgroundColor = "rgb(22, 55, 11)";

    selected = true;

    clearScene = true;

    $Settings.sceneSelected = choice;

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

  const {
    hovering,
    onPointerEnter: onPointerEnterStyle,
    onPointerLeave: onPointerLeaveStyle,
  } = useCursor();
  interactivity();

  $effect(() => {
    if (!$hovering && !selected) {
      highlighted = $Settings.notes.colours.key;
    } else {
      highlighted = { r: 77, g: 144, b: 57 };
    }
  });
  const introZoom = new Tween(0);

  introZoom.set(35, {
    duration: 1000,
    easing: cubicInOut,
  });

  $effect(() => {
    if (midiMessages.length > 0 && !noteTriggered) {
      MIDIConnectedButtonPosition.target = window.innerHeight * -0.017;
      MIDIConnectedButtonRotation.target = 4.712389;

      noteTriggered = true;

      setTimeout(() => {
        notePlayed = true;
      }, 1600);
    } else {
      noteScale.target =
        1 - Math.log(midiMessages.length) / Math.log(window.innerWidth);
    }
  });

  $Settings.camera.autoRotate.enabled = false;
</script>

<Lighting />

<T.OrthographicCamera
  makeDefault
  position={[5, 15, 15]}
  near={0.001}
  far={5000}
  zoom={introZoom.current}
>
  <OrbitControls
    enableDamping
    enableZoom={false}
    autoRotate={$Settings.camera.autoRotate.enabled}
    autoRotateSpeed={$Settings.camera.autoRotate.speed}
    maxPolarAngle={Math.PI / 3}
    minPolarAngle={Math.PI / 3}
  ></OrbitControls>
</T.OrthographicCamera>

<Flex
  width={window.innerWidth / 50}
  height={window.innerHeight / 40}
  gap={window.innerHeight / 300}
  flexDirection="Column"
>
  <Box flex={1} width="100%" height="100%">
    {#if !clearScene}
      <HTML center>
        <h1
          in:fade|global={{ duration: 1000, delay: 500 }}
          out:fade|global={{ duration: 200 }}
        >
          {title}
        </h1>
        <h2
          in:fade|global={{ duration: 1000, delay: 500 }}
          out:fade|global={{ duration: 200 }}
        >
          {summary}
        </h2>
      </HTML>
    {/if}
  </Box>

  <Box flex={1} width="100%" height="100%">
    {#if notePlayed}
      <Align scale={noteScale.current} auto precise>
        <T.Group
          position.y={-2}
          onpointerenter={onPointerEnterStyle}
          onpointerleave={onPointerLeaveStyle}
        >
          {#key $Settings.styleReset}
            <InstancedMesh>
              <T.BoxGeometry />
              <T.MeshStandardMaterial shadow roughness={0.4} metalness={0.7} />
              {#each midiMessages as noteNumber}
                <!-- Show sample of styles -->
                {#if styles[styleIndex] === "Piano"}
                  <Piano
                    position={noteNumber.position}
                    scale={noteNumber.scale}
                    velocity={noteNumber.velocity}
                    attack={$Settings.notes.attack}
                    release={$Settings.notes.release}
                    keyColour={highlighted}
                    expressionColour={$Settings.notes.colours.expression}
                  />
                {:else if styles[styleIndex] === "Mirror"}
                  <Mirror
                    position={noteNumber.position}
                    scale={noteNumber.scale}
                    velocity={noteNumber.velocity}
                    attack={$Settings.notes.attack}
                    release={$Settings.notes.release}
                    keyColour={highlighted}
                    expressionColour={$Settings.notes.colours.expression}
                  />
                {:else if styles[styleIndex] === "Cube"}
                  <Cube
                    position={noteNumber.position}
                    scale={noteNumber.scale}
                    velocity={noteNumber.velocity}
                    attack={$hovering ? 250 : $Settings.notes.attack}
                    release={$hovering ? 250 : $Settings.notes.release}
                    keyColour={highlighted}
                    expressionColour={$Settings.notes.colours.expression}
                  />
                {/if}
              {/each}
            </InstancedMesh>

            {#each midiMessages as noteNumber}
              {#if styles[styleIndex] === "Swirl"}
                <Swirl
                  position={noteNumber.position}
                  scale={noteNumber.scale}
                  velocity={noteNumber.velocity}
                  attack={$Settings.notes.attack}
                  release={$Settings.notes.release}
                  keyColour={highlighted}
                  expressionColour={$Settings.notes.colours.expression}
                />
              {:else if styles[styleIndex] === "Firework"}
                <Firework
                  position={noteNumber.position}
                  scale={noteNumber.scale}
                  velocity={noteNumber.velocity}
                  attack={$Settings.notes.attack}
                  release={$Settings.notes.release}
                  keyColour={highlighted}
                  expressionColour={$Settings.notes.colours.expression}
                />
              {/if}
            {/each}
          {/key}
        </T.Group>
      </Align>
    {:else}
      <Billboard follow={true}>
        <T.Mesh
          position={[0, MIDIConnectedButtonPosition.current, 0]}
          rotation={[MIDIConnectedButtonRotation.current, 0, 0]}
        >
          <Text
            text={"Creating styles"}
            font={$Settings.font}
            fontSize={0.5}
            textAlign={"center"}
            smooth={1}
            anchorX={"center"}
            anchorY={"middle"}
            position={[0, 0.505, 0]}
            rotation={[-1.553343, 0, 0]}
            outlineBlur={0.06}
          />
          <Text
            text={midiMessages.length != 0
              ? "Initializing styles"
              : "Play a note"}
            font={$Settings.font}
            fontSize={0.5}
            textAlign={"center"}
            smooth={1}
            anchorX={"center"}
            anchorY={"middle"}
            position={[0, 0, 0.505]}
            outlineBlur={0.06}
          />

          <Text
            text={"Note read"}
            font={$Settings.font}
            fontSize={0.5}
            textAlign={"center"}
            smooth={1}
            anchorX={"center"}
            anchorY={"middle"}
            position={[0, 0, -0.505]}
            rotation={[0, 3.14, -3.14]}
            outlineBlur={0.06}
          />

          <Text
            text={"Note read"}
            font={$Settings.font}
            fontSize={0.5}
            textAlign={"center"}
            smooth={1}
            anchorX={"center"}
            anchorY={"middle"}
            position={[0, -0.505, 0]}
            rotation.x={1.553343}
            outlineBlur={0.06}
          />

          <T.BoxGeometry args={[MIDIConnectedButtonScale.current, 1, 1]} />
          <T.MeshStandardMaterial
            color={midiMessages.length != 0
              ? new Color("rgb(22, 55, 11)")
              : new Color("rgb(66,11,77)")}
            emissive={midiMessages.length != 0
              ? new Color("rgb(22, 55, 11)")
              : new Color("rgb(66,11,77)")}
            emissiveIntensity={0.6}
          />
        </T.Mesh>
      </Billboard>
    {/if}
  </Box>

  <Box flex={1} width="100%" height="100%">
    {#if notePlayed && !clearScene}
      <HTML center>
        <div
          class="nav-bar"
          in:fade|global={{ duration: 1000, delay: 500 }}
          out:fade|global={{ duration: 200, delay: 400 }}
        >
          <button
            onpointerdown={(event: MouseEvent) => {
              event.stopPropagation();
              styleBack();
            }}
            aria-label="Back"
            class="icon-btn"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg></button
          >
          <div class="styleDescription">
            <h2>{styles[styleIndex]}</h2>

            <span>
              {styles[styleIndex] === "Piano"
                ? "Recommended for keyboards and synthesizers.\nAutomapping enabled."
                : "Recommended for pads and samplers."}
            </span>

            <button
              onpointerenter={(e) =>
                (e.currentTarget.style.color = "rgb(185, 249, 169)")}
              onpointerleave={(e) => (e.currentTarget.style.color = "white")}
              onpointerdown={(e) => setupScene(styles[styleIndex], e)}
              aria-label="Setup Scene"
              class="icon-btn"
              id="select">Select</button
            >
          </div>
          <button
            onpointerdown={(event: MouseEvent) => {
              event.stopPropagation();
              styleNext();
            }}
            aria-label="Forward"
            class="icon-btn"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg></button
          >
        </div>
      </HTML>
    {/if}
  </Box>
</Flex>

<style>
  .icon-btn#select {
    font-size: 1em;
    padding: 20px;
    width: 20%;
    height: 20px;
    margin: 0.75vh;
    color: white;
    font-weight: bolder;
  }
</style>

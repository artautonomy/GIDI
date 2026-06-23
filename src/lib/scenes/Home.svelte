<script lang="ts">
  import { T } from "@threlte/core";
  import { Color as ThreeColor } from "three";
  import {
    Align,
    Billboard,
    HTML,
    interactivity,
    OrbitControls,
    InstancedMesh,
    Text,
    useCursor,
  } from "@threlte/extras";
  import { Box, Flex } from "@threlte/flex";
  import { fade } from "svelte/transition";
  import { Spring, Tween } from "svelte/motion";
  import { cubicOut, cubicInOut } from "svelte/easing";

  import {
    Color,
    Folder,
    Slider,
    ThemeUtils,
    type Theme,
    Pane,
  } from "svelte-tweakpane-ui";

  import { Device, Settings } from "../store";
  import { goto } from "$app/navigation";
  import Lighting from "./Lighting.svelte";
  import Piano from "../instances/Piano.svelte";
  import Firework from "../instances/Firework.svelte";
  import Cube from "../instances/Cube.svelte";
  import Mirror from "../instances/Mirror.svelte";
  import Swirl from "../instances/Swirl.svelte";
  import { onMount } from "svelte";

  const customizedTheme: Theme = {
    ...ThemeUtils.presets.jetblack,
    baseFontFamily: "'Oxanium', sans-serif",
    baseBackgroundColor: "hsla(289, 77%, 17%, 0.5)",
    baseShadowColor: "rgba(255, 165, 0,0.5)",
    labelForegroundColor: "rgba(255,255,255,1)",
    bladeValueWidth: "60%",
    grooveForegroundColor: "hsl(230, 80%, 55%)",
    inputBackgroundColor: "rgba(0, 0, 0, 0.5)",
    inputForegroundColor: "rgba(255, 255, 255, 1)",
    containerForegroundColor: "rgba(255, 255, 255, 1)",
    buttonBackgroundColor: "rgba(255, 255, 255, 1)",
  };

  interactivity();

  let padNotes: {
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
  }[] = [];

  let pianoNotes: {
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
  }[] = [];

  let mobileNotes: {
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
  }[] = $state([]);

  let firstContact = $state(false);

  let tips = $state("Swipe to rotate this demo scene");

  let page = $state("");

  let cubeClicked = $state(false);

  const introZoom = new Tween(0);

  const sceneScale = new Spring([1, 1, 1]);

  const MIDIConnectedButtonScale = new Spring(
    window.innerWidth < 475
      ? window.innerWidth / 37.5
      : window.innerWidth / 127.5,
  );

  const MIDIConnectedButtonRotation = new Tween(0, {
    delay: 800,
    duration: 2300,
    easing: cubicInOut,
  });

  const MIDIConnectedButtonPosition = new Tween(0, {
    delay: 1500,
    duration: 1500,
    easing: cubicInOut,
  });

  const MIDIConnectedScenePosition = new Tween(-1.5, {
    delay: 500,
    duration: 1250,
    easing: cubicInOut,
  });

  let editing = $state(false);

  const styles = $Settings.notes.styles;

  let styleIndex = $state(0);

  let notesIndex = $state(0);

  let noteCount = $state(12);

  let randomMIDINotesTimeout: ReturnType<typeof setTimeout>;

  let randomMIDINotesStopTimeout: ReturnType<typeof setTimeout>;

  let randomMIDINotesInterval: ReturnType<typeof setInterval>;

  const notesColours = [
    { key: { r: 222, g: 188, b: 55 }, expression: { r: 199, g: 78, b: 222 } },
    { key: { r: 88, g: 125, b: 88 }, expression: { r: 211, g: 77, b: 66 } },

    {
      key: {
        r: 255,
        g: 255,
        b: 255,
      },
      expression: {
        r: 145,
        g: 197,
        b: 77,
      },
    },
  ];

  let MIDIStatus = $state("Search MIDI devices");

  let allowMIDIAccess = $state(false);

  let clearScene = $state(false);

  const title = "GIDI - a visualiser for MIDI";

  const summary =
    "A free web application to play MIDI live. Use note on/off messages to create animations on a web browser, no account required.";
  const instruction =
    "To get started click 'Allow' on the MIDI permission window or try the demo below";

  const { onPointerEnter, onPointerLeave } = useCursor();

  let positionY = 0;
  let positionZ = 0;
  let scaleX = 1;
  let scaleY = 1;
  let scaleZ = 1;

  let whiteNote: {
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

  const keyboardNotes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  for (let i = 0; i < 7; i++) {
    padNotes.push({
      note: i,
      velocity: 0,
      position: { x: i, y: 0, z: -1 },
      scale: { x: 1, y: 1, z: 1 },
    });
  }
  for (let i = 0; i < 12; i++) {
    const noteName = keyboardNotes[i % 12];

    if (noteName.includes("#")) {
      positionY = 0.75;
      positionZ = -1.5;
      scaleX = 0.5;
      scaleY = 0.5;
      scaleZ = 2;
    } else {
      positionY = 0;
      positionZ = -1;
      scaleX = 1;
      scaleY = 1;
      scaleZ = 3;
    }

    pianoNotes.push({
      note: i,
      velocity: 0,
      position: { x: i, y: positionY, z: positionZ },
      scale: { x: scaleX, y: scaleY, z: scaleZ },
    });
  }
  let whiteKeys = pianoNotes.filter((key) => key.scale.x === 1);
  let blackKeys = pianoNotes.filter((key) => key.scale.x === 0.5);

  whiteKeys = whiteKeys.map((key, index) => {
    return {
      note: key.note,
      velocity: key.velocity,
      position: {
        x: index,
        y: key.position.y,
        z: key.position.z,
      },
      scale: { x: key.scale.x, y: key.scale.y, z: key.scale.z },
    };
  });

  blackKeys = blackKeys.map((key) => {
    //if first note white
    whiteNote = whiteKeys.find((element) => element.note === key.note - 1);

    return {
      note: key.note,
      velocity: key.velocity,
      position: {
        x: whiteNote.position.x + 0.5,
        y: key.position.y,
        z: key.position.z,
      },
      scale: { x: key.scale.x, y: key.scale.y, z: key.scale.z },
    };
  });

  pianoNotes = [...whiteKeys, ...blackKeys];

  pianoNotes = pianoNotes.toSorted((a, b) => a.note - b.note);

  mobileNotes = pianoNotes;

  randomMIDINotesTimeout = setTimeout((oldIndex: number) => {
    randomMIDINotesInterval = setInterval(
      () => {
        let index = Math.floor(Math.random() * noteCount);

        while (index == oldIndex) {
          index = Math.floor(Math.random() * noteCount);
        }

        mobileNotes[index].velocity = (Math.random() + 1) * 63.5;

        randomMIDINotesStopTimeout = setTimeout(
          () => {
            mobileNotes[index].velocity = 0;
          },
          Math.floor(Math.random() * 1000),
        );

        oldIndex = index;
      },
      Math.floor((Math.random() + 0.5) * 500),
    );
  }, 500);

  function Setup() {
    MIDIStatus = "MIDI Connected";

    allowMIDIAccess = true;

    clearTimeout(randomMIDINotesTimeout);

    clearTimeout(randomMIDINotesStopTimeout);

    clearTimeout(randomMIDINotesInterval);

    MIDIConnectedButtonScale.target = 5;

    MIDIConnectedButtonPosition.target = -window.innerHeight / 150;

    MIDIConnectedButtonRotation.target = 4.712389;

    MIDIConnectedScenePosition.target = -window.innerHeight / 50;

    if ($Device.inputs.length > 1) {
      page = "inputs";
    } else {
      page = "style";
    }

    setTimeout(() => {
      clearScene = true;

      introZoom.set(0, {
        duration: 750,
        easing: cubicOut,
      });
      setTimeout(() => {
        //if multiple inputs redirect to inputs page
        if ((page = "inputs")) {
          goto(`./inputs`);
        }
        //if 1 input go to style page
        else {
          $Device.selected = true;
          $Device.id = $Device.inputs[0].id;
          goto(`./style`);
        }
      }, 1000);
    }, 4000);
  }

  function styleBack() {
    styleIndex > 0 ? styleIndex-- : (styleIndex = styles.length - 1);

    if (styles[styleIndex] === "Piano") {
      mobileNotes = pianoNotes;
      noteCount = 12;
      $Settings.notes.attack = 15;
      $Settings.notes.release = 500;
    } else if (styles[styleIndex] === "Firework") {
      $Settings.notes.attack = 20;
      $Settings.notes.release = 3500;
      mobileNotes = padNotes;
    } else {
      $Settings.notes.attack = 15;
      $Settings.notes.release = 500;
      mobileNotes = padNotes;
      noteCount = 7;
    }

    clearTimeout(randomMIDINotesTimeout);

    clearTimeout(randomMIDINotesStopTimeout);

    clearTimeout(randomMIDINotesInterval);

    randomMIDINotesTimeout = setTimeout((oldIndex: number) => {
      randomMIDINotesInterval = setInterval(
        () => {
          let index = Math.floor(Math.random() * noteCount);

          while (index == oldIndex) {
            index = Math.floor(Math.random() * noteCount);
          }

          mobileNotes[index].velocity = (Math.random() + 1) * 63.5;

          randomMIDINotesStopTimeout = setTimeout(
            () => {
              mobileNotes[index].velocity = 0;
            },
            Math.floor(Math.random() * 1000),
          );

          oldIndex = index;
        },
        Math.floor((Math.random() + 0.5) * 500),
      );
    }, 500);
  }

  function styleNext() {
    styleIndex >= 0 && styleIndex < styles.length - 1
      ? styleIndex++
      : (styleIndex = 0);

    if (styles[styleIndex] === "Piano") {
      mobileNotes = pianoNotes;
      noteCount = 12;
      $Settings.notes.attack = 5;
      $Settings.notes.release = 500;
    } else if (styles[styleIndex] === "Firework") {
      $Settings.notes.attack = 20;
      $Settings.notes.release = 3500;
      mobileNotes = padNotes;
    } else {
      $Settings.notes.attack = 5;
      $Settings.notes.release = 500;
      mobileNotes = padNotes;
      noteCount = 7;
    }

    clearTimeout(randomMIDINotesTimeout);

    clearTimeout(randomMIDINotesStopTimeout);

    clearTimeout(randomMIDINotesInterval);

    randomMIDINotesTimeout = setTimeout((oldIndex: number) => {
      randomMIDINotesInterval = setInterval(
        () => {
          let index = Math.floor(Math.random() * noteCount);

          while (index == oldIndex) {
            index = Math.floor(Math.random() * noteCount);
          }

          mobileNotes[index].velocity = (Math.random() + 1) * 63.5;

          randomMIDINotesStopTimeout = setTimeout(
            () => {
              mobileNotes[index].velocity = 0;
            },
            Math.floor(Math.random() * 1000),
          );

          oldIndex = index;
        },
        Math.floor((Math.random() + 0.5) * 500),
      );
    }, 500);
  }

  function sceneClicked() {
    cubeClicked = true;
    sceneScale.target = [1.1, 1.1, 1.1];

    setInterval(function () {
      sceneScale.target = [1, 1, 1];
    }, 200);

    if (notesIndex >= notesColours.length - 1) {
      notesIndex = 0;
    } else {
      notesIndex++;
    }
  }

  $effect(() => {
    if ($Device.connected && !firstContact) {
      firstContact = true;

      Setup();
    }
  });

  onMount(() => {
    allowMIDIAccess = localStorage.getItem("content") === "Allow";

    introZoom.set(35, {
      delay: 200,
      duration: 1000,
      easing: cubicInOut,
    });
  });
</script>

<Lighting />

<T.OrthographicCamera
  makeDefault
  position={[0, 10, 0]}
  near={0.0001}
  far={5000}
  zoom={introZoom.current}
>
  <OrbitControls
    enabled={!editing}
    enableDamping
    rotateSpeed={2}
    enablePan={false}
    enableZoom={false}
    maxPolarAngle={Math.PI / 2.5}
    minPolarAngle={Math.PI / 2.5}
    onstart={() => {
      tips = "To shuffle settings tap the scene";
    }}
  ></OrbitControls>
</T.OrthographicCamera>

<Flex
  width={window.innerWidth / 50}
  height={window.innerHeight / 40}
  flexDirection="Column"
>
  <Box flex={2} width="100%" height="100%">
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
        {#if cubeClicked}
          <div
            role="button"
            tabindex="0"
            in:fade|global={{ duration: 1000, delay: 500 }}
            out:fade|global={{ duration: 200 }}
            onpointerenter={() => {
              editing = true;
            }}
            onpointerleave={() => {
              editing = false;
            }}
          >
            <Pane theme={customizedTheme} position="inline">
              <Folder title="Colours">
                <Color
                  bind:value={$Settings.notes.colours.key}
                  label="Key Colour"
                />
                <Color
                  bind:value={$Settings.notes.colours.expression}
                  label="Key Expression Colour"
                />
              </Folder>
              <Folder title="Note Weight" expanded={false}>
                <Slider
                  label="Note rise time"
                  bind:value={$Settings.notes.attack}
                  min={0}
                  max={4000}
                  step={0.1}
                  wide
                />
                <Slider
                  label="Note fall time"
                  bind:value={$Settings.notes.release}
                  min={0}
                  max={4000}
                  step={0.1}
                  wide
                />
              </Folder>
              <Folder title="Lighting" expanded={false}>
                <Slider
                  label="Above Lighting"
                  bind:value={$Settings.scene.lighting.above}
                  min={0}
                  max={2}
                  step={0.1}
                  wide
                />

                <Slider
                  label="Front Lighting"
                  bind:value={$Settings.scene.lighting.front}
                  min={0}
                  max={2}
                  step={0.1}
                  wide
                />

                <Slider
                  label="Side Lighting"
                  bind:value={$Settings.scene.lighting.side}
                  min={0}
                  max={2}
                  step={0.1}
                  wide
                />
              </Folder>
            </Pane>
          </div>
        {/if}
      </HTML>
    {/if}
  </Box>
  <Billboard>
    <Box flex={1} width="100%" height="100%">
      {#if allowMIDIAccess}
        <T.Mesh
          position={[0, MIDIConnectedButtonPosition.current, 0]}
          rotation={[MIDIConnectedButtonRotation.current, 0, 0]}
          onpointerenter={onPointerEnter}
          onpointerleave={onPointerLeave}
          onclick={() => {
            $Device.enableSearch = true;
            MIDIStatus = "Searching MIDI devices ...";
          }}
        >
          <Text
            text={"Please wait"}
            font={$Settings.font}
            fontSize={0.4}
            textAlign={"center"}
            smooth={1}
            anchorX={"center"}
            anchorY={"middle"}
            position={[0, 0.2605, 0]}
            rotation={[-1.553343, 0, 0]}
            outlineBlur={0.06}
          />
          <Text
            text={MIDIStatus}
            font={$Settings.font}
            fontSize={0.4}
            textAlign={"center"}
            smooth={1}
            anchorX={"center"}
            anchorY={"middle"}
            position={[0, 0, 0.505]}
            outlineBlur={0.06}
          />

          <Text
            text={"MIDI Connected"}
            font={$Settings.font}
            fontSize={0.4}
            textAlign={"center"}
            smooth={1}
            anchorX={"center"}
            anchorY={"middle"}
            position={[0, 0, -0.505]}
            rotation={[0, 3.14, -3.14]}
            outlineBlur={0.06}
          />

          <Text
            text={`Loading ${page}`}
            font={$Settings.font}
            fontSize={0.4}
            textAlign={"center"}
            smooth={1}
            anchorX={"center"}
            anchorY={"middle"}
            position={[0, -0.2605, 0]}
            rotation.x={1.553343}
            outlineBlur={0.06}
          />

          <T.BoxGeometry args={[MIDIConnectedButtonScale.current, 0.5, 1]} />
          <T.MeshStandardMaterial
            color={$Device.connected
              ? new ThreeColor("rgb(22, 55, 11)")
              : new ThreeColor("rgb(66,11,77)")}
            emissive={$Device.connected
              ? new ThreeColor("rgb(22, 55, 11)")
              : new ThreeColor("rgb(66,11,77)")}
            emissiveIntensity={0.4}
          />
        </T.Mesh>
      {/if}
    </Box>
  </Billboard>
  <Box flex={2} width="100%" height="100%">
    {#if !clearScene}
      <T.Group
        position.y={MIDIConnectedScenePosition.current}
        onpointerenter={onPointerEnter}
        onpointerleave={onPointerLeave}
        scale={sceneScale.current}
        onclick={() => {
          sceneClicked();
        }}
      >
        <Align auto precise>
          <InstancedMesh>
            <T.BoxGeometry />
            <T.MeshStandardMaterial shadow roughness={0.4} metalness={0.7} />
            {#each mobileNotes as noteNumber}
              {#if styles[styleIndex] == "Piano"}
                <Piano
                  position={noteNumber.position}
                  scale={noteNumber.scale}
                  velocity={noteNumber.velocity}
                  attack={$Settings.notes.attack}
                  release={$Settings.notes.release}
                  keyColour={$Settings.notes.colours.key}
                  expressionColour={$Settings.notes.colours.expression}
                />
              {:else if styles[styleIndex] === "Mirror"}
                <Mirror
                  position={noteNumber.position}
                  scale={noteNumber.scale}
                  velocity={noteNumber.velocity}
                  attack={$Settings.notes.attack}
                  release={$Settings.notes.release}
                  keyColour={$Settings.notes.colours.key}
                  expressionColour={$Settings.notes.colours.expression}
                />
              {:else if styles[styleIndex] === "Cube"}
                <Cube
                  position={noteNumber.position}
                  scale={noteNumber.scale}
                  velocity={noteNumber.velocity}
                  attack={$Settings.notes.attack}
                  release={$Settings.notes.release}
                  keyColour={$Settings.notes.colours.key}
                  expressionColour={$Settings.notes.colours.expression}
                />
              {/if}
            {/each}
          </InstancedMesh>

          {#each mobileNotes as noteNumber}
            {#if styles[styleIndex] === "Swirl"}
              <Swirl
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$Settings.notes.attack}
                release={$Settings.notes.release}
                keyColour={$Settings.notes.colours.key}
                expressionColour={$Settings.notes.colours.expression}
              />
            {:else if styles[styleIndex] === "Firework"}
              <Firework
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$Settings.notes.attack}
                release={$Settings.notes.release}
                keyColour={$Settings.notes.colours.key}
                expressionColour={$Settings.notes.colours.expression}
              />
            {/if}
          {/each}
        </Align>
      </T.Group>
    {/if}
  </Box>

  <Box flex={1} width="100%" height="100%">
    {#if !clearScene}
      {#if cubeClicked}
        <HTML center>
          <div
            class="nav-bar"
            in:fade|global={{ duration: 1000, delay: 500 }}
            out:fade|global={{ duration: 200 }}
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
      {:else}
        <HTML center>
          <div
            class="hint"
            in:fade|global={{ duration: 1000, delay: 500 }}
            out:fade|global={{ duration: 200 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 15L12 9L18 15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span id="tips">Tap the scene to edit</span>
          </div>
        </HTML>
      {/if}
    {/if}
  </Box>
</Flex>

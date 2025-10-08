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
  import { Box, Flex } from "@threlte/flex";
  import { Spring, Tween } from "svelte/motion";
  import { cubicOut, cubicInOut } from "svelte/easing";
  import { Device, Settings } from "../store";
  import { goto } from "$app/navigation";
  import Lighting from "./Lighting.svelte";
  import Piano from "./instances/Piano.svelte";
  import Firework from "./instances/Firework.svelte";
  import Cube from "./instances/Cube.svelte";
  import Mirror from "./instances/Mirror.svelte";
  import Swirl from "./instances/Swirl.svelte";

  interactivity();

  //let deviceOrientation = $state(screen.orientation.type);

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

  let tips = $state("Swipe to rotate this demo scene");

  let cubeClicked = $state(false);

  let connectedTriggered = false;

  const introZoom = new Tween(0);

  const MIDIConnectedButtonScale = new Spring(
    window.innerWidth < 475
      ? window.innerWidth / 37.5
      : window.innerWidth / 127.5
  );

  const MIDIConnectedButtonRotation = new Tween(0, {
    delay: 800,
    duration: 2500,
    easing: cubicInOut,
  });

  const MIDIConnectedButtonPosition = new Tween(1, {
    delay: 1500,
    duration: 1500,
    easing: cubicInOut,
  });

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

  const styles = $Settings.styles;

  let styleIndex = $state(0);

  let notesIndex = $state(0);

  let noteCount = $state(12);

  let randomMIDINotesTimeout: ReturnType<typeof setTimeout>;

  let randomMIDINotesStopTimeout: ReturnType<typeof setTimeout>;

  let randomMIDINotesInterval: ReturnType<typeof setInterval>;

  const notesColours = [
    { key: { r: 0, g: 70, b: 65 }, expression: { r: 211, g: 77, b: 66 } },
    { key: { r: 222, g: 178, b: 226 }, expression: { r: 254, g: 228, b: 129 } },

    {
      key: {
        r: 225,
        g: 226,
        b: 245,
      },
      expression: {
        r: 145,
        g: 197,
        b: 77,
      },
    },
  ];

  const title = "GIDI - a visualiser for MIDI";

  const summary =
    "A free, web application intended for live performances. By interpreting MIDI note on/off messages GIDI then renders and animates a scene on a web browser.";

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

  introZoom.set(35, {
    delay: 200,
    duration: 1000,
    easing: cubicInOut,
  });

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
          Math.floor(Math.random() * 1000)
        );

        oldIndex = index;
      },
      Math.floor((Math.random() + 0.5) * 500)
    );
  }, 500);

  function Setup() {
    MIDIConnectedButtonPosition.target = -window.innerHeight / 150;
    MIDIConnectedButtonRotation.target = 4.712389;
    1;
    setTimeout(() => {
      introZoom.set(0, {
        duration: 750,
        easing: cubicOut,
      });
      setTimeout(() => {
        //if multiple inputs redirect to inputs page
        if ($Device.inputs.length > 1) {
          goto("./inputs");
        }
        //if 1 input go to style page
        else {
          $Device.input.id = $Device.inputs[0].id;
          goto("./style");
        }
      }, 1000);
    }, 4000);
  }

  function styleBack() {
    styleIndex > 0 ? styleIndex-- : (styleIndex = styles.length - 1);

    if (styles[styleIndex] === "Piano") {
      mobileNotes = pianoNotes;
      noteCount = 12;
      $Settings.attack = 15;
      $Settings.release = 500;
    } else if (styles[styleIndex] === "Firework") {
      $Settings.attack = 20;
      $Settings.release = 3500;
      mobileNotes = padNotes;
    } else {
      $Settings.attack = 15;
      $Settings.release = 500;
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
            Math.floor(Math.random() * 1000)
          );

          oldIndex = index;
        },
        Math.floor((Math.random() + 0.5) * 500)
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
      $Settings.attack = 5;
      $Settings.release = 500;
    } else if (styles[styleIndex] === "Firework") {
      $Settings.attack = 20;
      $Settings.release = 3500;
      mobileNotes = padNotes;
    } else {
      $Settings.attack = 5;
      $Settings.release = 500;
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
            Math.floor(Math.random() * 1000)
          );

          oldIndex = index;
        },
        Math.floor((Math.random() + 0.5) * 500)
      );
    }, 500);
  }

  $effect(() => {
    if ($Device.connected && !connectedTriggered) {
      Setup();

      connectedTriggered = true;
    }
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
    enableDamping
    enablePan={false}
    enableZoom={false}
    maxPolarAngle={Math.PI / 2.5}
    minPolarAngle={Math.PI / 2.5}
    onstart={(e) => {
      hintArrow.target = 0.75;
      tips = "To shuffle colours tap here";
    }}
  ></OrbitControls>
</T.OrthographicCamera>

<Flex
  width={window.innerWidth / 50}
  height={window.innerHeight / 40}
  flexDirection="Column"
>
  <Billboard>
    <Box flex={4} width="100%" height="100%">
      {#snippet children({ width })}
        <Text
          text={title}
          color={"orange"}
          font={$Settings.font}
          fontSize={width > 20 ? 0.8 : 0.75}
          textAlign={"center"}
          anchorX={"center"}
          position.y={2.5}
          position.z="7"
        />
        <Text
          text={summary}
          maxWidth={width > 20 ? 21 : 10}
          font={$Settings.font}
          fontSize={width > 20 ? 0.5 : 0.45}
          textAlign={"center"}
          smooth={1}
          anchorX={"center"}
          position.y={1}
          position.z="7"
          outlineBlur={0.06}
        />
      {/snippet}
    </Box>
  </Billboard>
  <Billboard>
    {#if $Device.accessRights !== "Deny"}
      <Box flex={1} width="100%" height="100%">
        <T.Mesh
          position={[0, MIDIConnectedButtonPosition.current, 0]}
          rotation={[MIDIConnectedButtonRotation.current, 0, 0]}
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
            text={$Device.accessRights === ""
              ? "Press 'Allow' when prompted to allow MIDI access"
              : $Device.connected
                ? "MIDI Connected"
                : "Connect a MIDI device"}
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
            text={"Initialising"}
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
            text={"Please wait"}
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
          <T.MeshPhongMaterial
            color={$Device.connected ? new Color("rgb(22, 90, 11)") : "darkred"}
          />
        </T.Mesh>
      </Box>
    {/if}
  </Billboard>
  <Box flex={9} width="100%" height="100%">
    {#if !$Device.connected}
      <T.Group
        position.y={-1.5}
        onpointerenter={onPointerEnter}
        onpointerleave={onPointerLeave}
        onclick={(event) => {
          event.stopPropagation();
          cubeClicked = true;
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
                  attack={$Settings.attack}
                  release={$Settings.release}
                  keyColour={$Settings.colours.key}
                  expressionColour={$Settings.colours.expression}
                />
              {:else if styles[styleIndex] === "Mirror"}
                <Mirror
                  position={noteNumber.position}
                  scale={noteNumber.scale}
                  velocity={noteNumber.velocity}
                  attack={$Settings.attack}
                  release={$Settings.release}
                  keyColour={$Settings.colours.key}
                  expressionColour={$Settings.colours.expression}
                />
              {:else if styles[styleIndex] === "Cube"}
                <Cube
                  position={noteNumber.position}
                  scale={noteNumber.scale}
                  velocity={noteNumber.velocity}
                  attack={$Settings.attack}
                  release={$Settings.release}
                  keyColour={$Settings.colours.key}
                  expressionColour={$Settings.colours.expression}
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
                attack={$Settings.attack}
                release={$Settings.release}
                keyColour={$Settings.colours.key}
                expressionColour={$Settings.colours.expression}
              />
            {:else if styles[styleIndex] === "Firework"}
              <Firework
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$Settings.attack}
                release={$Settings.release}
                keyColour={$Settings.colours.key}
                expressionColour={$Settings.colours.expression}
              />
            {/if}
          {/each}
        </Align>
      </T.Group>
    {/if}
  </Box>

  <Billboard>
    <Box flex={3} width="100%" height="100%">
      {#snippet children({ width })}
        {#if !$Device.connected}
          {#if cubeClicked}
            <T.Mesh
              receiveShadow
              scale={navigationArrows.current}
              position.x={width / 2}
              rotation.z={-Math.PI / 2}
              onpointerenter={onPointerEnter}
              onpointerleave={onPointerLeave}
              onclick={(event) => {
                event.stopPropagation();
                styleNext();
              }}
            >
              <T.BoxGeometry args={[2.75, 2.75, 1]} />
              <T.MeshBasicMaterial transparent opacity={0} />
              <T.Mesh>
                <T.ConeGeometry />
                <T.MeshBasicMaterial color={"orange"} shadow />
              </T.Mesh>
            </T.Mesh>
            <T.Mesh scale={navigationArrows.current}>
              <Text
                font={$Settings.font}
                fontSize={width > 20 ? 1 : 0.6}
                outlineBlur={0.06}
                text={styles[styleIndex]}
                textAlign={"center"}
                anchorX={"center"}
                position.x={0}
                position.y={0.5}
                position.z={10}
                color={"white"}
              />

              <Text
                font={$Settings.font}
                fontSize={width > 20 ? 0.55 : 0.4}
                maxWidth={width * 2.5}
                outlineBlur={0.06}
                text={styles[styleIndex] === "Piano"
                  ? "Recommended for keyboards and synthesizers.\nAutomapping enabled."
                  : "Recommended for pads and samplers."}
                textAlign={"center"}
                anchorX={"center"}
                position.x={0}
                position.y={width > 20 ? -1 : -0.5}
                position.z={10}
                color={"white"}
              />
              <T.MeshBasicMaterial
                color={"orange"}
                transparent={true}
                opacity={hintText.current}
              />
            </T.Mesh>
            <T.Mesh
              scale={navigationArrows.current}
              position.x={-width / 2}
              rotation.z={Math.PI / 2}
              onpointerenter={onPointerEnter}
              onpointerleave={onPointerLeave}
              onclick={(event) => {
                event.stopPropagation();
                styleBack();
              }}
            >
              <T.BoxGeometry args={[2.75, 2.75, 1]} />
              <T.MeshBasicMaterial transparent opacity={0} />
              <T.Mesh>
                <T.ConeGeometry />
                <T.MeshBasicMaterial color={"orange"} shadow />
              </T.Mesh>
            </T.Mesh>
          {:else}
            <T.Mesh scale={hintArrow.current} position.y={1} position.z={7}>
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
              fontSize={width > 20 ? 0.5 : 0.45}
              textAlign={"center"}
              anchorX={"center"}
              position.y={0}
              position.z={7}
            />
          {/if}
        {/if}
      {/snippet}
    </Box>
  </Billboard>
</Flex>

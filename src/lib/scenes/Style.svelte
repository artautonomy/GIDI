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
  import { Tween, Spring } from "svelte/motion";
  import { cubicIn, cubicInOut } from "svelte/easing";
  import { MIDI, Settings } from "../store";
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { Box, Flex } from "@threlte/flex";
  import Cube from "./instances/Cube.svelte";
  import Mirror from "./instances/Mirror.svelte";
  import Piano from "./instances/Piano.svelte";

  const { scene } = $state(useThrelte());

  scene.background = new Color(
    `rgb(${$Settings.colours.background.r},${$Settings.colours.background.g},${$Settings.colours.background.b})`
  );

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
    "Play your MIDI device to sample styles\n\nTo confirm your style select it";

  const MIDIConnectedButtonScale = new Spring(7);

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

  const styles = ["Piano", "Cube", "Mirror"];

  let styleIndex = $state(0);

  let highlighted = $state($Settings.colours.key);

  let selected = $state(false);

  let notePlayed = $state(false);

  let noteTriggered = false;

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });

  onDestroy(unsubscribe);

  const noteScale = new Tween(
    1 - Math.log(midiMessages.length) / Math.log(window.innerWidth),
    {
      duration: 1000,
      easing: cubicInOut,
    }
  );

  function styleBack() {
    styleIndex > 0 ? styleIndex-- : (styleIndex = styles.length - 1);
    $Settings.scene = styles[styleIndex];

    $Settings.styleReset = true;
  }

  function styleNext() {
    styleIndex >= 0 && styleIndex < styles.length - 1
      ? styleIndex++
      : (styleIndex = 0);
    $Settings.scene = styles[styleIndex];

    $Settings.styleReset = true;
  }

  function setupScene(choice: string) {
    $Settings.scene = choice;

    selected = true;

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

  const { onPointerEnter, onPointerLeave } = useCursor();
  const {
    hovering,
    onPointerEnter: onPointerEnterStyle,
    onPointerLeave: onPointerLeaveStyle,
  } = useCursor();
  interactivity();

  $effect(() => {
    if (!$hovering && !selected) {
      highlighted = $Settings.colours.key;
    } else {
      highlighted = { r: 77, g: 144, b: 57 };
    }
  });
  const introZoom = new Tween(0);

  introZoom.set(35, {
    duration: 1000,
    easing: cubicInOut,
  });

  $Settings.autoRotate = false;

  $effect(() => {
    if (midiMessages.length > 0 && !noteTriggered) {
      MIDIConnectedButtonPosition.target = window.innerHeight * -0.015;
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
</script>

<T.OrthographicCamera
  makeDefault
  position={[5, 15, 15]}
  near={0.001}
  far={5000}
  zoom={introZoom.current}
>
  <OrbitControls
    enableDamping
    autoRotateSpeed={$Settings.autoRotateSpeed}
    autoRotate={$Settings.autoRotate}
    enabled={$Settings.orbitControls}
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
  gap={window.innerHeight / 300}
  flexDirection="Column"
  alignItems="Stretch"
  justifyContent="Center"
>
  <Billboard>
    <Box flex={1} width="100%" height="100%">
      {#snippet children({ width, height })}
        {console.log(width)}
        <T.Mesh>
          <T.PlaneGeometry args={[width, height]} />
          <T.MeshBasicMaterial color="red" transparent opacity={0.5} />
        </T.Mesh>

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

  <Box flex={1} width="100%" height="100%">
    {#snippet children({ width, height })}
      <T.Mesh>
        <T.PlaneGeometry args={[width, height]} />
        <T.MeshBasicMaterial color="red" transparent opacity={0.5} />
      </T.Mesh>

      {#if notePlayed}
        <Align scale={noteScale.current} auto precise>
          <T.Group
            position.y={-2}
            onpointerenter={onPointerEnterStyle}
            onpointerleave={onPointerLeaveStyle}
            onclick={() => setupScene(styles[styleIndex])}
          >
            <InstancedMesh>
              <T.BoxGeometry />
              <T.MeshStandardMaterial shadow />
              {#each midiMessages as noteNumber}
                <!-- Show sample of styles -->
                {#if styles[styleIndex] === "Piano"}
                  <Piano
                    position={noteNumber.position}
                    scale={noteNumber.scale}
                    velocity={noteNumber.velocity}
                    attack={$Settings.attack}
                    release={$Settings.release}
                    keyColour={highlighted}
                    expressionColour={$Settings.colours.expression}
                  />
                {:else if styles[styleIndex] === "Cube"}
                  <Cube
                    position={noteNumber.position}
                    scale={noteNumber.scale}
                    velocity={noteNumber.velocity}
                    attack={$hovering ? 250 : $Settings.attack}
                    release={$hovering ? 250 : $Settings.release}
                    keyColour={highlighted}
                    expressionColour={$Settings.colours.expression}
                  />
                {:else}
                  <Mirror
                    position={noteNumber.position}
                    scale={noteNumber.scale}
                    velocity={noteNumber.velocity}
                    attack={$Settings.attack}
                    release={$Settings.release}
                    keyColour={highlighted}
                    expressionColour={$Settings.colours.expression}
                  />
                {/if}
              {/each}
            </InstancedMesh>
          </T.Group>
        </Align>
      {:else}
        <Billboard follow={true}>
          <T.Mesh
            position={[0, MIDIConnectedButtonPosition.current, 0]}
            rotation={[MIDIConnectedButtonRotation.current, 0, 0]}
            interactive
            onpointerenter={() => MIDIConnectedButtonScale.set(5.5)}
            onpointerleave={() => MIDIConnectedButtonScale.set(7)}
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
            <T.MeshBasicMaterial
              color={midiMessages.length != 0
                ? new Color("rgb(22, 90, 11)")
                : "darkred"}
            />
          </T.Mesh>
        </Billboard>
      {/if}
    {/snippet}
  </Box>
  <Billboard>
    <Box flex={1} width="100%" height="100%">
      {#snippet children({ width, height })}
        <T.Mesh>
          <T.PlaneGeometry args={[width, height]} />
          <T.MeshBasicMaterial color="red" transparent opacity={0.5} />
        </T.Mesh>
        {#if notePlayed}
          <T.Mesh
            scale={0.75}
            position.x={window.innerWidth > 900 ? 10 : 4.5}
            position.z={10}
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
          <Text
            font={$Settings.font}
            fontSize={window.innerHeight > 1200 ? 0.7 : 0.375}
            outlineBlur={0.06}
            text={styles[styleIndex]}
            textAlign={"center"}
            anchorX={"center"}
            position.x={0}
            position.y={0.5}
            position.z={10}
            color={"white"}
            onpointerenter={onPointerEnterStyle}
            onpointerleave={onPointerLeaveStyle}
            onclick={() => setupScene(styles[styleIndex])}
          />
          <Text
            font={$Settings.font}
            fontSize={window.innerHeight > 1200 ? 0.45 : 0.33}
            maxWidth={window.innerHeight > 1200 ? 100 : 9}
            outlineBlur={0.06}
            text={styles[styleIndex] === "Piano"
              ? "Recommended for keyboards and synthesizers. Automapping enabled."
              : "Recommended for pads and samplers."}
            textAlign={"center"}
            anchorX={"center"}
            position.x={0}
            position.y={-0.33}
            position.z={10}
            color={"white"}
            onpointerenter={onPointerEnterStyle}
            onpointerleave={onPointerLeaveStyle}
            onclick={() => setupScene(styles[styleIndex])}
          />
          <T.Mesh
            scale={0.75}
            position.x={window.innerWidth > 900 ? -10 : -4.5}
            position.z={10}
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
        {/if}
      {/snippet}
    </Box>
  </Billboard>
</Flex>

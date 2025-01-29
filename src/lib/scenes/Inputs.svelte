<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
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
  import { cubicInOut } from "svelte/easing";
  import { Device, MIDI, Settings } from "../store";
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";

  import Input from "./instances/Input.svelte";

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

  let rotation = $state(0);

  useTask((delta) => {
    rotation += delta;
  });

  let midiMessages = $state<MIDIMessage[]>([]);

  let highlighted = $state($Settings.colours.key);

  let selected = $state(false);

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });

  onDestroy(unsubscribe);

  function setupStyle() {
    introZoom.set(0, {
      delay: 250,
      duration: 750,
      easing: cubicInOut,
    });

    setTimeout(() => {
      setTimeout(() => {
        goto("../style");
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

<Billboard>
  <T.Mesh position={[0, window.innerHeight > 1200 ? 10 : 3.5, 0]}>
    <Text
      text={"Inputs"}
      color={"orange"}
      font={$Settings.font}
      fontSize={window.innerHeight > 1200 ? 1 : 0.7}
      textAlign={"center"}
      anchorX={"center"}
      position.y={window.innerHeight > 1200 ? 5.25 : 6}
      outlineBlur={0.1}
    />
    <Text
      text={"Multiple MIDI inputs found. If you are unsure on the MIDI input you require play a note to see"}
      color={"white"}
      font={$Settings.font}
      fontSize={window.innerHeight > 1200 ? 0.6 : 0.4}
      maxWidth={window.innerHeight > 1200 ? 100 : 9}
      textAlign={"center"}
      anchorX={"center"}
      outlineBlur={0.1}
      position.y={window.innerHeight > 1200 ? 3 : 4}
    />
  </T.Mesh>
</Billboard>

{#each $Device.inputs as device, index}
  <T.Group
    onpointerenter={onPointerEnterStyle}
    onpointerleave={onPointerLeaveStyle}
    onclick={() => setupStyle()}
  >
    <Billboard follow={true}>
      <InstancedMesh>
        <T.BoxGeometry args={[10, 0.75, 1]} />
        <T.MeshStandardMaterial shadow />

        <Input
          position={{ x: 0, y: index, z: 0 }}
          keyColour={{ r: 80, g: 50, b: 111 }}
          expressionColour={{ r: 77, g: 144, b: 57 }}
          device={device.id}
          velocity={device.velocity}
        />

        <Text
          text={device.name}
          font={$Settings.font}
          fontSize={0.5}
          textAlign={"center"}
          smooth={1}
          anchorX={"center"}
          anchorY={"middle"}
          position={[0, index, 0.505]}
          outlineBlur={0.06}
        />
      </InstancedMesh>
    </Billboard>
  </T.Group>
{/each}

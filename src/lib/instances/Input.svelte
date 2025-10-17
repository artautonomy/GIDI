<script lang="ts">
  import { Instance } from "@threlte/extras";
  import { Tween } from "svelte/motion";
  import { Device } from "$lib/store";
  import { cubicIn, cubicOut, cubicInOut } from "svelte/easing";

  interface Props {
    position: {
      x: number;
      y: number;
      z: number;
    };
    keyColour: {
      r: number;
      g: number;
      b: number;
    };
    expressionColour: {
      r: number;
      g: number;
      b: number;
    };
    device: string;
    velocity: number;
  }

  let { position, keyColour, expressionColour, device, velocity }: Props =
    $props();

  const r = new Tween(keyColour.r, {
    duration: 50,
    easing: cubicInOut,
  });
  const g = new Tween(keyColour.g, {
    duration: 50,
    easing: cubicInOut,
  });
  const b = new Tween(keyColour.b, {
    duration: 50,
    easing: cubicInOut,
  });

  $effect(() => {
    if (velocity > 0) {
      r.target = expressionColour.r;
      g.target = expressionColour.g;
      b.target = expressionColour.b;
    } else {
      r.set(keyColour.r, { duration: 1500 });
      g.set(keyColour.g, { duration: 1500 });
      b.set(keyColour.b, { duration: 1500 });
    }
  });
</script>

<Instance
  receiveShadow
  position.x={position.x}
  position.y={position.y}
  position.z={position.z}
  scale.y={0.75}
  color={`rgb(${Math.floor(r.current)},${Math.floor(g.current)},${Math.floor(b.current)})`}
  onpointerenter={() => {
    r.set(expressionColour.r, { duration: 250 });
    g.set(expressionColour.g, { duration: 250 });
    b.set(expressionColour.b, { duration: 250 });
  }}
  onpointerleave={() => {
    r.set(keyColour.r, { duration: 250 });
    g.set(keyColour.g, { duration: 250 });
    b.set(keyColour.b, { duration: 250 });
  }}
  onclick={() => {
    $Device.input.id = device;
  }}
/>

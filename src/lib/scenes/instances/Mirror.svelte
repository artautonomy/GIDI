<script lang="ts">
  import { Instance } from "@threlte/extras";
  import { cubicOut } from "svelte/easing";
  import { Tween } from "svelte/motion";

  interface Props {
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
    velocity: number;
    attack: number;
    release: number;
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
  }

  let {
    position,
    scale,
    velocity,
    attack,
    release,
    keyColour,
    expressionColour,
  }: Props = $props();

  const bottomY = new Tween(1);
  const topY = new Tween(7.5);
  const scaleY = new Tween(1);
  const r = new Tween(keyColour.r);
  const g = new Tween(keyColour.g);
  const b = new Tween(keyColour.b);

  $effect(() => {
    if (velocity > 0) {
      bottomY.set(position.y + velocity / 63, {
        duration: attack,
        easing: cubicOut,
      });

      topY.set(5 - velocity / 63, {
        duration: attack,
        easing: cubicOut,
      });

      scaleY.set(1 + (velocity / 63) * 2, {
        duration: attack,
        easing: cubicOut,
      });

      r.set(expressionColour.r, { duration: attack });
      g.set(expressionColour.g, { duration: attack });
      b.set(expressionColour.b, { duration: attack });
    } else {
      bottomY.set(position.y, {
        duration: release,
        easing: cubicOut,
      });
      topY.set(5, {
        duration: release,
        easing: cubicOut,
      });
      scaleY.set(1, {
        duration: release,
        easing: cubicOut,
      });

      r.set(keyColour.r, { duration: release });
      g.set(keyColour.g, { duration: release });
      b.set(keyColour.b, { duration: release });
    }
  });
</script>

<Instance
  receiveShadow
  position.x={position.x}
  position.y={topY.current}
  position.z={position.z}
  scale.y={scaleY.current}
  color={`rgb(${Math.floor(r.current)},${Math.floor(g.current)},${Math.floor(b.current)})`}
/>

<Instance
  receiveShadow
  position.x={position.x}
  position.y={bottomY.current}
  position.z={position.z}
  scale.y={scaleY.current}
  color={`rgb(${Math.floor(r.current)},${Math.floor(g.current)},${Math.floor(b.current)})`}
/>

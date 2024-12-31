<script lang="ts">
  import { run } from "svelte/legacy";

  import { Instance } from "@threlte/extras";
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import { derived } from "svelte/store";

  interface Props {
    x: number;
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
    styleHover: boolean;
  }

  let { x, velocity, attack, release, keyColour, expressionColour }: Props =
    $props();

  const bottomY = tweened(1);
  const topY = tweened(6);
  const scale = tweened(1);
  const r = tweened(keyColour.r);
  const g = tweened(keyColour.g);
  const b = tweened(keyColour.b);

  run(() => {
    if (velocity > 0) {
      bottomY.set(3, {
        duration: attack,
        easing: cubicOut,
      });

      topY.set(8, {
        duration: attack,
        easing: cubicOut,
      });

      scale.set(5, {
        duration: attack,
        easing: cubicOut,
      });

      r.set(expressionColour.r, { duration: attack });
      g.set(expressionColour.g, { duration: attack });
      b.set(expressionColour.b, { duration: attack });
    } else {
      bottomY.set(1, {
        duration: release,
        easing: cubicOut,
      });
      topY.set(10, {
        duration: release,
        easing: cubicOut,
      });
      scale.set(1, {
        duration: release,
        easing: cubicOut,
      });

      r.set(keyColour.r, { duration: release });
      g.set(keyColour.g, { duration: release });
      b.set(keyColour.b, { duration: release });
    }
  });

  const color = derived([r, g, b], ([r, g, b]) => {
    return `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
  });
</script>

<Instance
  position.x={x}
  position.y={$topY}
  position.z={0}
  scale.y={$scale}
  color={$color}
/>

<Instance
  position.x={x}
  position.y={$bottomY}
  position.z={0}
  scale.y={$scale}
  color={$color}
/>

<script lang="ts">
  import { run } from "svelte/legacy";

  import { Instance } from "@threlte/extras";
  import { cubicOut } from "svelte/easing";
  import { Tween } from "svelte/motion";
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

  const bottomY = new Tween(1);
  const topY = new Tween(6);
  const scale = new Tween(1);
  const r = new Tween(keyColour.r);
  const g = new Tween(keyColour.g);
  const b = new Tween(keyColour.b);

  $effect(() => {
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
</script>

<Instance
  position.x={x}
  position.y={topY.current}
  position.z={0}
  scale.y={scale.current}
  color={`rgb(${Math.floor(r.current)},${Math.floor(g.current)},${Math.floor(b.current)})`}
/>

<Instance
  position.x={x}
  position.y={bottomY.current}
  position.z={0}
  scale.y={scale.current}
  color={`rgb(${Math.floor(r.current)},${Math.floor(g.current)},${Math.floor(b.current)})`}
/>

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

  const y = new Tween(1);
  const scale = new Tween(1);
  const r = new Tween(keyColour.r);
  const g = new Tween(keyColour.g);
  const b = new Tween(keyColour.b);

  $effect(() => {
    if (velocity > 0) {
      y.set(3, {
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
      y.set(1, {
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
  position.y={y.current}
  position.z={0}
  scale.y={scale.current}
  color={`rgb(${Math.floor(r.current)},${Math.floor(g.current)},${Math.floor(b.current)})`}
/>

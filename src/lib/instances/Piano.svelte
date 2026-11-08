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

  function restColour() {
    if (scale.x === 0.5) {
      const v = keyColour.r + keyColour.g + keyColour.b > 200 ? 0 : 255;
      return { r: v, g: v, b: v };
    }
    return { r: keyColour.r, g: keyColour.g, b: keyColour.b };
  }

  const initial = restColour();
  const positionY = new Tween(position.y);
  const scaleY = new Tween(scale.y);
  const r = new Tween(initial.r);
  const g = new Tween(initial.g);
  const b = new Tween(initial.b);

  $effect(() => {
    if (velocity > 0) {
      positionY.set(position.y + velocity / 63, {
        duration: attack,
        easing: cubicOut,
      });

      scaleY.set(scale.y + (velocity / 63) * 2, {
        duration: attack,
        easing: cubicOut,
      });

      r.set(expressionColour.r, { duration: attack });
      g.set(expressionColour.g, { duration: attack });
      b.set(expressionColour.b, { duration: attack });
    } else {
      const rest = restColour();

      positionY.set(position.y, {
        duration: release,
        easing: cubicOut,
      });
      scaleY.set(scale.y, {
        duration: release,
        easing: cubicOut,
      });

      r.set(rest.r, { duration: release });
      g.set(rest.g, { duration: release });
      b.set(rest.b, { duration: release });
    }
  });
</script>

<!-- Add backboard-->
{#if scale.x === 1}
  <Instance
    receiveShadow
    position.x={position.x}
    position.y={0.25}
    position.z={-3}
    scale.x={1}
    scale.y={1.5}
    scale.z={1}
    color={`rgb(${Math.floor(expressionColour.r)},${Math.floor(expressionColour.g)},${Math.floor(expressionColour.b)})`}
  />
{/if}

<Instance
  receiveShadow
  position.x={position.x}
  position.y={positionY.current}
  position.z={position.z}
  scale.x={scale.x}
  scale.y={scaleY.current}
  scale.z={scale.z}
  color={`rgb(${Math.floor(r.current)},${Math.floor(g.current)},${Math.floor(b.current)})`}
/>

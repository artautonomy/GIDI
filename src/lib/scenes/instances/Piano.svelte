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

  const positionY = new Tween(1);
  const scaleY = new Tween(1);
  let r = $state();
  let g = $state();
  let b = $state();

  if (scale.x === 0.5) {
    if (keyColour.r + keyColour.g + keyColour.b > 200) {
      r = new Tween(0);
      g = new Tween(0);
      b = new Tween(0);
    } else {
      r = new Tween(255);
      g = new Tween(255);
      b = new Tween(255);
    }
  } else {
    r = new Tween(keyColour.r);
    g = new Tween(keyColour.g);
    b = new Tween(keyColour.b);
  }

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
      positionY.set(position.y, {
        duration: release,
        easing: cubicOut,
      });
      scaleY.set(scale.y, {
        duration: release,
        easing: cubicOut,
      });

      r.set(
        scale.x === 0.5
          ? keyColour.r + keyColour.g + keyColour.b > 200
            ? 0
            : 255
          : keyColour.r,
        { duration: release }
      );
      g.set(
        scale.x === 0.5
          ? keyColour.r + keyColour.g + keyColour.b > 200
            ? 0
            : 255
          : keyColour.g,
        { duration: release }
      );
      b.set(
        scale.x === 0.5
          ? keyColour.r + keyColour.g + keyColour.b > 200
            ? 0
            : 255
          : keyColour.b,
        { duration: release }
      );
    }
  });
</script>

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

<script lang="ts">
  import { T } from "@threlte/core";
  import { Tween } from "svelte/motion";
  import { cubicIn, cubicOut } from "svelte/easing";

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
    velocity,
    attack,
    release,
    keyColour,
    expressionColour,
  }: Props = $props();

  const r = new Tween(keyColour.r);
  const g = new Tween(keyColour.g);
  const b = new Tween(keyColour.b);

  const randEnhance = 50 + Math.random() * 50;

  const randP = Math.random() * 20 + 2;

  const randQ = randP / 20;

  let distort = new Tween(randEnhance);

  const radius = new Tween(0.3, { easing: cubicOut });

  $effect(() => {
    if (velocity > 0) {
      r.set(expressionColour.r, { duration: attack });
      g.set(expressionColour.g, { duration: attack });
      b.set(expressionColour.b, { duration: attack });

      radius.set(0.75, { duration: attack, easing: cubicIn });
    } else {
      r.set(keyColour.r, { duration: release });
      g.set(keyColour.g, { duration: release });
      b.set(keyColour.b, { duration: release });

      distort = new Tween(1);

      distort.set(randEnhance, {
        delay: 1,
        duration: release + 500,
      });

      radius.set(0.5, { duration: release, easing: cubicOut });
    }
  });
</script>

<T.Mesh position.x={position.x * 2}>
  <T.TorusKnotGeometry
    args={[
      radius.current,
      0.025,
      distort.current,
      distort.current,
      randP,
      randQ,
    ]}
  />

  <T.MeshStandardMaterial
    color={`rgb(${Math.floor(r.current)},${Math.floor(g.current)},${Math.floor(b.current)})`}
    shadow
  />
</T.Mesh>

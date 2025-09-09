<script lang="ts">
  import { T } from "@threlte/core";
  import { Tween } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { seededRandom } from "three/src/math/MathUtils.js";

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

  const randP = Math.random() * 5 + 2;

  const randQ = randP / 10;

  const enhance = new Tween(randEnhance);

  const radius = new Tween(0.3, { easing: cubicInOut });

  $effect(() => {
    if (velocity > 0) {
      r.set(expressionColour.r, { duration: attack });
      g.set(expressionColour.g, { duration: attack });
      b.set(expressionColour.b, { duration: attack });

      enhance.set(1, { duration: attack });

      radius.set(0.8, { duration: attack });
    } else {
      r.set(keyColour.r, { duration: release });
      g.set(keyColour.g, { duration: release });
      b.set(keyColour.b, { duration: release });

      enhance.set(randEnhance, { duration: release });

      radius.set(0.5, { duration: 1 });
    }
  });
</script>

<T.Mesh position.x={position.x * 2}>
  <T.TorusKnotGeometry
    args={[
      radius.current,
      0.025,
      enhance.current,
      enhance.current,
      randP,
      randQ,
    ]}
  />

  <T.MeshStandardMaterial
    color={`rgb(${Math.floor(r.current)},${Math.floor(g.current)},${Math.floor(b.current)})`}
    shadow
  />
</T.Mesh>

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

  const randEnhance = 10 + Math.random() * 15;

  const randP = Math.random() * 5 + 2;

  const randQ = randP % Math.PI;

  let distort = new Tween(randEnhance);

  const X = new Tween(position.y, { easing: cubicOut });

  const Z = new Tween(position.z, { easing: cubicOut });

  const radius = new Tween(0.25, { easing: cubicOut });

  $effect(() => {
    if (velocity > 0) {
      r.set(expressionColour.r, { duration: attack });
      g.set(expressionColour.g, { duration: attack });
      b.set(expressionColour.b, { duration: attack });

      distort.set(randEnhance * 10, {
        duration: attack + 25 * 10,
        easing: cubicIn,
      });

      radius.set(0.675, { duration: attack, easing: cubicIn });

      X.set(position.x * 2, {
        delay: attack / 2,
        duration: attack / 2,
        easing: cubicOut,
      });

      Z.set(2.5, { duration: attack / 2, easing: cubicOut });
    } else {
      r.set(keyColour.r, { duration: release });
      g.set(keyColour.g, { duration: release });
      b.set(keyColour.b, { duration: release });

      distort = new Tween(randEnhance);

      distort.set(randEnhance, {
        duration: release * 5,
        easing: cubicOut,
      });

      radius.set(0.25, { duration: release, easing: cubicOut });
      X.set(position.x, {
        duration: release,
        easing: cubicIn,
      });

      Z.set(position.z, { duration: release, easing: cubicIn });
    }
  });
</script>

<T.Mesh
  position.x={X.current}
  position.y={position.y}
  position.z={Z.current}
  rotation.z={Math.PI / (position.x + 1)}
>
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
    roughness={0.4}
    metalness={0.7}
  />
</T.Mesh>
<T.Mesh position.x={position.x} position.y={position.y + 0.25}>
  <T.SphereGeometry args={[0.33]} />
  <T.MeshBasicMaterial opacity={0} transparent />
</T.Mesh>

<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { MeshLineGeometry, MeshLineMaterial } from "@threlte/extras";
  import { CatmullRomCurve3, Color, Vector3 } from "three";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

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

  let dashOffset = new Tween(-0.1, {
    duration: attack,
    easing: cubicOut,
  });

  const randCurve = Math.random() - 0.5;

  const randCurve2 = Math.random() - 0.5;

  const randCurve3 = Math.random() - 0.5;

  const curve = new CatmullRomCurve3([
    new Vector3(position.x, 0, 0),
    new Vector3(position.x, 1, 0),
    new Vector3(position.x + -randCurve2, 3, randCurve),
    new Vector3(position.x + randCurve2 * 1.5, 4, randCurve * 2),
    new Vector3(position.x + randCurve2 * 1.5, 5, position.z - randCurve * 2),
    new Vector3(position.x + randCurve3 * 2, 7, position.z + randCurve2 * 3),
    new Vector3(position.x + randCurve3 * 2, 9, position.z - randCurve2 * 4),
  ]);

  const points = curve.getPoints(75);

  let color = $state(new Color());

  let key = new Color(
    `rgb(${Math.floor(keyColour.r)},${Math.floor(keyColour.g)},${Math.floor(keyColour.b)})`
  );

  let expression = new Color(
    `rgb(${Math.floor(expressionColour.r)},${Math.floor(expressionColour.g)},${Math.floor(expressionColour.b)})`
  );

  $effect(() => {
    key = new Color(
      `rgb(${Math.floor(keyColour.r)},${Math.floor(keyColour.g)},${Math.floor(keyColour.b)})`
    );

    expression = new Color(
      `rgb(${Math.floor(expressionColour.r)},${Math.floor(expressionColour.g)},${Math.floor(expressionColour.b)})`
    );

    if (velocity > 0) {
      useTask((delta) => {
        dashOffset.set(-Math.log(delta * (4 - attack / 4000) * 500), {
          duration: attack + 250,
        });

        color.lerpColors(
          key,
          expression,
          Math.sin(dashOffset.current * 3) / 2 + 0.5
        );
      });
    } else {
      dashOffset.set(-0.1, {
        duration: release,
      });

      color = new Color(key);
    }
  });
</script>

<T.Mesh position.x={position.x}>
  <MeshLineGeometry {points} shape={"none"} />
  <MeshLineMaterial
    width={0.05}
    {color}
    dashArray={1}
    dashRatio={0.9}
    dashOffset={dashOffset.current}
    transparent
    scaleDown={0.8}
  />
</T.Mesh>
<T.Mesh position.x={position.x * 2}>
  <T.SphereGeometry args={[0.25]} />
  <!-- adjust size -->
  <T.MeshBasicMaterial opacity={0} transparent />
</T.Mesh>

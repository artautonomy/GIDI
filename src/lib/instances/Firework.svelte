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

  let offset = $state(0);

  const randCurve = Math.random() - 0.5;

  const randCurve2 = Math.random() - 0.5;

  const curve = new CatmullRomCurve3([
    new Vector3(position.x, 0, 0),
    new Vector3(position.x, 1, 0),
    new Vector3(position.x, 2, 0),
    new Vector3(position.x + randCurve * 1, 2, randCurve * 2),
    new Vector3(position.x + randCurve * 1.2, 3, randCurve * 2),
    new Vector3(position.x + -randCurve2, 4, randCurve2),
    new Vector3(position.x + -randCurve2, 5, randCurve2),
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
  });

  $effect(() => {
    if (velocity > 0) {
      useTask((delta) => {
        offset -= delta * ((4000 - attack) / 2000 + 0.25);

        dashOffset.set(offset);
      });

      color.lerpColors(expression, key, Math.sin(offset * 2) / 2 + 0.5);
    } else {
      dashOffset.set(-0.1, {
        duration: release + 200,
      });

      offset = -0.1;

      color = new Color(key);
    }
  });
</script>

<T.Mesh position.x={position.x / 4} position.y={position.y}>
  <MeshLineGeometry {points} shape={"none"} />
  <MeshLineMaterial
    width={0.05}
    {color}
    dashArray={1}
    dashRatio={0.9}
    dashOffset={dashOffset.current}
    scaleDown={0.8}
    transparent
  />
</T.Mesh>
<T.Mesh position.x={position.x * 1.25} position.y={position.y - 0.25}>
  <T.SphereGeometry args={[0.25]} />
  <T.MeshBasicMaterial opacity={0} transparent />
</T.Mesh>

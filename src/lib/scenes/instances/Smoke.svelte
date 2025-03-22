<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { MeshLineGeometry, MeshLineMaterial } from "@threlte/extras";
  import { CatmullRomCurve3, Color, Vector3 } from "three";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { Instance } from "@threlte/extras";

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

  let widthFadeOut = new Tween(0.025, {
    duration: release,
    easing: cubicOut,
  });

  const randCurve = Math.random() - 0.5;

  const randCurve2 = Math.random() - 0.5;

  const curve = new CatmullRomCurve3([
    new Vector3(position.x, 0, position.z),
    new Vector3(position.x, 1, position.z),
    new Vector3(position.x + -randCurve2, 3, position.z - randCurve),
    new Vector3(position.x + randCurve2 * 2, 4, position.z + randCurve * 2),
    new Vector3(position.x + randCurve2 * 2, 5, position.z - randCurve * 2),
  ]);

  const points = curve.getPoints(50);

  let color = $state(new Color());

  let key = new Color(
    `rgb(${Math.floor(keyColour.r)},${Math.floor(keyColour.g)},${Math.floor(keyColour.b)})`
  );

  let expression = new Color(
    `rgb(${Math.floor(expressionColour.r)},${Math.floor(expressionColour.g)},${Math.floor(expressionColour.b)})`
  );

  let dashOffset = $state(0);

  $effect(() => {
    key = new Color(
      `rgb(${Math.floor(keyColour.r)},${Math.floor(keyColour.g)},${Math.floor(keyColour.b)})`
    );

    expression = new Color(
      `rgb(${Math.floor(expressionColour.r)},${Math.floor(expressionColour.g)},${Math.floor(expressionColour.b)})`
    );

    if (velocity > 0) {
      widthFadeOut.target = 0.075;
      useTask((delta) => {
        dashOffset -= delta * (750 / (attack + 350));

        color.lerpColors(key, expression, Math.sin(dashOffset * 3) / 2 + 0.5);
      });
    } else {
      widthFadeOut.set(0, {
        duration: release / 2,
        easing: cubicOut,
      });

      color = new Color(key);
    }
  });
</script>

<T.Mesh>
  <Instance
    receiveShadow
    position.x={position.x}
    position.y={0}
    position.z={position.z}
    scale.x={0.25}
    scale.y={0.5}
    scale.z={0.25}
    {color}
  />
  <MeshLineGeometry {points} shape={"taper"} />
  <MeshLineMaterial
    width={widthFadeOut.current}
    {color}
    dashArray={1}
    dashRatio={0.2}
    {dashOffset}
    transparent
    scaleDown={1}
  />
</T.Mesh>

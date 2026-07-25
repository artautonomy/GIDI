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

  let key = new Color(keyColour.r / 255, keyColour.g / 255, keyColour.b / 255);

  let expression = new Color(
    expressionColour.r / 255,
    expressionColour.g / 255,
    expressionColour.b / 255,
  );

  $effect(() => {
    key = new Color(keyColour.r / 255, keyColour.g / 255, keyColour.b / 255);

    expression = new Color(
      expressionColour.r / 255,
      expressionColour.g / 255,
      expressionColour.b / 255,
    );
  });
  let color = $state(new Color());

  const from = new Color();
  const to = new Color();
  const current = new Color();

  $effect(() => {
    if (velocity > 0) {
      from.copy(key);
      to.copy(expression);

      useTask((delta) => {
        offset -= delta * ((4000 - attack) / 1000 + 0.25);

        dashOffset.set(offset);

        current.lerpColors(from, to, offset + 1.5);

        color = current.clone();
      });
    } else {
      dashOffset.set(-0.1, {
        duration: release + 150,
      });

      offset = -0.1;

      color = key.clone();
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
  <T.Mesh position.x={position.x} position.y={position.y + 0.2}>
    <T.SphereGeometry args={[0.33]} />
    <T.MeshBasicMaterial opacity={0} transparent />
  </T.Mesh>
</T.Mesh>

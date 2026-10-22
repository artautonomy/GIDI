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

  let offset = $state(-0.1);

  // Keep the random shape stable for this component instance.
  const randCurve = Math.random() - 1;
  const randCurve2 = Math.random() + 1;

  // Rebuild the curve when the supplied position changes.
  let points = $derived.by(() => {
    const x = position.x;
    const y = position.y;
    const z = position.z;

    const curve = new CatmullRomCurve3([
      new Vector3(x, y, z),
      new Vector3(x, y + 1, z),
      new Vector3(x, y + 2, z),
      new Vector3(x + randCurve, y + 2, z + randCurve * 2),
      new Vector3(x + randCurve * 1.2, y + 3, z + randCurve * 2),
      new Vector3(x - randCurve2, y + 4, z + randCurve2),
      new Vector3(x - randCurve2, y + 5, z + randCurve2),
    ]);

    return curve.getPoints(75);
  });

  let key = $derived(
    new Color(keyColour.r / 255, keyColour.g / 255, keyColour.b / 255),
  );

  let expression = $derived(
    new Color(
      expressionColour.r / 255,
      expressionColour.g / 255,
      expressionColour.b / 255,
    ),
  );

  let color = $state(new Color());

  const from = new Color();
  const to = new Color();
  const current = new Color();

  // Animate the line while the MIDI note is active.
  $effect(() => {
    if (velocity > 0) {
      from.copy(key);
      to.copy(expression);

      dashOffset.set(offset, {
        duration: attack,
        easing: cubicOut,
      });
    } else {
      dashOffset.set(-0.1, {
        duration: release + 150,
      });
      offset = 0;
      color = key.clone();
    }
  });

  useTask((delta) => {
    if (velocity <= 0) return;

    offset -= delta * ((4000 - attack) / 1000 + 0.25);

    dashOffset.set(offset);

    current.lerpColors(from, to, offset + 1.5);
    color = current.clone();
  });
</script>

<T.Mesh position={[0, 0, 0]}>
  <MeshLineGeometry {points} shape="none" />
  <MeshLineMaterial
    width={0.075}
    {color}
    dashArray={2}
    dashRatio={0.5}
    dashOffset={dashOffset.current}
    scaleDown={1}
    transparent
  />
</T.Mesh>

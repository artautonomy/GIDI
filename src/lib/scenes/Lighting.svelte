<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { Color } from "three";
  import { Settings } from "../store";

  const { scene } = $state(useThrelte());

  scene.background = new Color(
    `rgb(${$Settings.colours.background.r},${$Settings.colours.background.g},${$Settings.colours.background.b})`
  );
</script>

<T.DirectionalLight
  castShadow
  intensity={$Settings.lighting.front}
  position={[0, 0, 5]}
/>
<T.DirectionalLight
  castShadow
  intensity={$Settings.lighting.front}
  position={[0, 0, -5]}
/>
<T.DirectionalLight
  castShadow
  intensity={$Settings.lighting.side}
  position={[5, 0, 0]}
/>
<T.DirectionalLight
  castShadow
  intensity={$Settings.lighting.side}
  position={[-5, 0, 0]}
/>
<T.AmbientLight intensity={$Settings.lighting.above} position={[0, 15, 0]} />

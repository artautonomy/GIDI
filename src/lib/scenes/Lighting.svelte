<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { Color } from "three";
  import { Settings } from "../store";

  const { scene } = $state(useThrelte());

  scene.background = new Color(
    `rgb(${$Settings.scene.colours.background.r},${$Settings.scene.colours.background.g},${$Settings.scene.colours.background.b})`
  );
</script>

<T.DirectionalLight
  castShadow
  intensity={$Settings.scene.lighting.front}
  position={[0, 0, 5]}
/>
<T.DirectionalLight
  castShadow
  intensity={$Settings.scene.lighting.front}
  position={[0, 0, -5]}
/>
<T.DirectionalLight
  castShadow
  intensity={$Settings.scene.lighting.side}
  position={[5, 0, 0]}
/>
<T.DirectionalLight
  castShadow
  intensity={$Settings.scene.lighting.side}
  position={[-5, 0, 0]}
/>
<T.AmbientLight
  intensity={$Settings.scene.lighting.above}
  position={[0, 15, 0]}
/>

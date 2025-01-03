<script>
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
  import { MIDI, Settings } from "../store";
  import { Tween } from "svelte/motion";
  import { cubicIn, cubicOut, cubicInOut } from "svelte/easing";
  import ColorPicker from "svelte-awesome-color-picker";
  import { colord } from "colord";

  const menuOpacity = new Tween(0);

  let rgb = $state({
    r: $Settings.colours.key.r,
    g: $Settings.colours.key.g,
    b: $Settings.colours.key.b,
    a: 1,
  });

  let hsv = $state(
    colord(
      `rgb(${$Settings.colours.expression.r}, ${$Settings.colours.expression.g}, ${$Settings.colours.expression.b})`
    ).toHsv()
  );

  let hex = $state(
    colord(
      `rgb(${$Settings.colours.background.r}, ${$Settings.colours.background.g}, ${$Settings.colours.background.b})`
    ).toHex()
  );

  let menuColour = $state(
    colord(
      `rgb(${$Settings.colours.key.r}, ${$Settings.colours.key.g}, ${$Settings.colours.key.b})`
    )
      .invert()
      .desaturate(0.5)
      .darken(0.1)
  );

  $effect(() => {
    if ($Settings.edit) {
      menuOpacity.set(1, {
        delay: 250,
        duration: 750,
        easing: cubicInOut,
      });
    } else {
      menuOpacity.set(0, {
        duration: 750,
        easing: cubicInOut,
      });
    }
  });
</script>

<Canvas>
  <Scene />
</Canvas>

<menu
  style="opacity:{menuOpacity.current}; --keyColour:{menuColour.toHex()}; --menuTextColour: {menuColour.isLight()
    ? 'black'
    : 'white'}"
>
  <button
    onclick={() => {
      $Settings.edit = false;

      setTimeout(() => {
        menuColour = colord(
          `rgb(${$Settings.colours.key.r}, ${$Settings.colours.key.g}, ${$Settings.colours.key.b})`
        )
          .invert()
          .desaturate(0.5)
          .darken(0.1);
      }, 2000);
    }}>Close</button
  >
  <h1>Settings</h1>

  <setting>
    <label for="mirror">Styles</label>
    <select name="styles" id="styles" bind:value={$Settings.scene}>
      <option value="Cube">Cube</option>
      <option value="Mirror">Mirror</option>
    </select>
  </setting>

  <setting>
    <label for="Colours">Colours</label>
    <label for="Key Colour">Key Colour</label>
    <ColorPicker
      --cp-bg-color={`rgba(${$Settings.colours.background.r},${$Settings.colours.background.g},${$Settings.colours.background.b},1)`}
      --picker-height="150px"
      --picker-width="150px"
      --slider-width="15px"
      --picker-indicator-size="10px"
      bind:rgb
      label=""
      isAlpha={false}
      textInputModes={["rgb"]}
      sliderDirection="vertical"
      on:input={(event) => {
        $Settings.colours.key = event.detail.rgb;
      }}
    />
    <label for="Expression Colour">Expression Colour</label>
    <ColorPicker
      --cp-bg-color={`rgba(${$Settings.colours.background.r},${$Settings.colours.background.g},${$Settings.colours.background.b},1)`}
      --picker-height="150px"
      --picker-width="150px"
      --slider-width="15px"
      --picker-indicator-size="10px"
      bind:hsv
      label=""
      isAlpha={false}
      textInputModes={["hsv"]}
      sliderDirection="vertical"
      on:input={(event) => {
        $Settings.colours.expression = event.detail.rgb;
      }}
    />
    <label for="Background Colour">Background Colour</label>

    <ColorPicker
      --cp-bg-color={`rgba(${$Settings.colours.background.r},${$Settings.colours.background.g},${$Settings.colours.background.b},1)`}
      --picker-height="150px"
      --picker-width="150px"
      --slider-width="15px"
      --picker-indicator-size="10px"
      bind:hex
      label=""
      isAlpha={false}
      textInputModes={["rgb"]}
      sliderDirection="vertical"
      on:input={(event) => {
        $Settings.colours.background = event.detail.rgb;
      }}
    />
  </setting>
  <setting>
    <label for="remapKeys">Remap Keys</label>
    <button id="remapKeys" onclick={() => MIDI.set([])}>Reset</button>

    <label for="autoRotate">Autorotate</label>
    <input
      id="autoRotate"
      type="checkbox"
      onchange={() => ($Settings.autoRotate = !$Settings.autoRotate)}
    />
    <label for="rotateSpeed">Rotate Speed</label>
    <input
      type="range"
      min="1"
      max="3"
      step="0.1"
      id="rotateSpeed"
      bind:value={$Settings.autoRotateSpeed}
    />
    <label for="attack">Attack</label>
    <input
      type="range"
      min="0"
      max="2500"
      id="attack"
      bind:value={$Settings.attack}
    />
    <label for="release">Release</label>
    <input
      type="range"
      min="0"
      max="2500"
      id="release"
      bind:value={$Settings.release}
    />
  </setting>
</menu>

<style>
  setting {
    display: block;
  }
  h1 {
    color: var(--menuTextColour);
  }
  label {
    display: block;
    color: var(--menuTextColour);
  }

  menu {
    position: absolute;
    background-color: var(--keyColour);
    top: 0;
    height: 75vh;
    width: 20vw;
  }
</style>

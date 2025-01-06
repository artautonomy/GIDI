<script>
  import { Canvas } from "@threlte/core";
  import Scene from "$lib/scenes/Play.svelte";
  import { Settings } from "$lib/store";
  import { Tween } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
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
      `rgb(${$Settings.colours.background.r}, ${$Settings.colours.background.g}, ${$Settings.colours.background.b})`
    )
      .invert()
      .desaturate(0.3)
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
  <setting>
    <h1>Scene</h1>

    <label for="mirror">Style</label>
    <select name="styles" id="styles" bind:value={$Settings.scene}>
      <option value="Cube">Cube</option>
      <option value="Mirror">Mirror</option>
    </select>

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
  </setting>

  <setting>
    <h1>Colours</h1>
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
        $Settings.colours.key =
          event.detail.rgb === undefined
            ? { r: 255, g: 255, b: 255 }
            : event.detail.rgb;
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
        $Settings.colours.expression =
          event.detail.rgb === undefined
            ? { r: 255, g: 255, b: 255 }
            : event.detail.rgb;
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
        $Settings.colours.background =
          event.detail.rgb === undefined
            ? { r: 255, g: 255, b: 255 }
            : event.detail.rgb;
      }}
    />
  </setting>
  <setting
    ><h1>Notes</h1>
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
    <label for="remapKeys">Remap Keys</label>
    <button
      id="remapKeys"
      onclick={() => {
        $Settings.reset = true;
      }}>Remap</button
    ></setting
  >
  <button
    id="save"
    onclick={() => {
      $Settings.edit = false;

      setTimeout(() => {
        menuColour = colord(
          `rgb(${$Settings.colours.background.r}, ${$Settings.colours.background.g}, ${$Settings.colours.background.b})`
        )
          .invert()
          .desaturate(0.3)
          .darken(0.1);
      }, 2000);
    }}>Close</button
  >
</menu>

<style>
  @font-face {
    font-family: "Oxanium";
    src: url("/fonts/Oxanium-Bold.ttf");
  }
  button {
    font-family: "Oxanium";
    background-color: var(--menuTextColour);
    color: var(--keyColour);
    display: block;
    width: 25%;
    height: 10%;
    margin: 2.5% 37.5%;
    cursor: pointer;
  }
  button#save {
    width: 50%;
    height: 5%;
    position: absolute;
    bottom: 0;
    margin: 0 25% 2%;
  }
  button:hover {
    font-weight: bold;
    background-color: rgb(135, 238, 149);
    color: black;
  }

  menu {
    font-family: "Oxanium";
    position: absolute;
    background-color: var(--keyColour);
    top: 0;
    height: 75vh;
    width: 20vw;
    margin: 0;
    padding: 0;
  }
  setting {
    display: block;
    text-align: center;
  }
  h1 {
    color: var(--menuTextColour);
    text-align: center;
    font-size: 1.5em;
    text-decoration: underline;
  }

  label {
    display: block;
    font-size: 0.9em;
    color: var(--menuTextColour);
    margin-top: 5%;
    margin-bottom: 0.25%;
  }

  select {
    font-family: "Oxanium";
    border-style: solid;
    color: var(--menuTextColour);
    border-width: 1px;
    background: rgba(0, 0, 0, 0);
    width: 75%;
    outline: 0;
    box-shadow: 0.5px 1px 2px var(--menuTextColour);
    border-color: var(--menuTextColour);
    height: 20px;
    margin-bottom: 1vh;
  }
  select * {
    color: #000;
  }

  input[type="range"] {
    appearance: none !important;
    -webkit-appearance: none !important;
    border-style: solid;
    color: var(--menuTextColour);
    border-width: 1px;
    background: rgba(0, 0, 0, 0);
    height: 10px;
    width: 75%;
    outline: 0;
    box-shadow: 0.5px 1px 2px var(--menuTextColour);
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    background: var(--menuTextColour);
    height: 10px;
    width: 10px;
  }

  input[type="checkbox"] {
    appearance: none !important;
    -webkit-appearance: none !important;
    cursor: pointer;
    height: 15px;
    width: 15px;
    border-style: solid;
    border-width: 1px;
    border-color: var(--menuTextColour);
    box-shadow: 0.5px 1px 2px var(--menuTextColour);
  }
  input[type="checkbox"]:checked {
    background-color: var(--menuTextColour);
    border-color: green;
    border-width: 2px;
  }
</style>

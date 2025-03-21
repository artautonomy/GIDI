<script>
  import { Canvas } from "@threlte/core";
  import Scene from "$lib/scenes/Play.svelte";
  import { Settings } from "$lib/store";
  import { Tween } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import ColorPicker from "svelte-awesome-color-picker";
  import { colord } from "colord";
  import { onMount } from "svelte";
  import { slide, fade } from "svelte/transition";

  let setting = $state("notes");

  let getMenuHeight = $state();

  let screenHeight = 0;

  onMount(() => {
    if (typeof window !== "undefined") {
      screenHeight = window.innerHeight;
    }
  });

  const sceneHeight = new Tween(screenHeight);

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

  function styleChange() {
    $Settings.styleReset = true;
  }
  $effect(() => {
    if ($Settings.edit) {
      sceneHeight.set(screenHeight - getMenuHeight.clientHeight, {
        duration: 750,
        easing: cubicInOut,
      });
    } else {
      sceneHeight.set(screenHeight, {
        duration: 750,
        easing: cubicInOut,
      });
    }
  });
</script>

<scene style="--sceneHeight:{sceneHeight.current + 'px'}">
  <Canvas>
    <Scene />
  </Canvas>
</scene>

{#if $Settings.edit}
  <settings
    bind:this={getMenuHeight}
    style="--menuTextColour: white;"
    in:slide={{ easing: cubicInOut, duration: 750 }}
    out:slide={{ easing: cubicInOut, duration: 750 }}
  >
    <settingOptions>
      <button
        class="setting"
        onclick={() => (setting = "notes")}
        style="background-color:{setting === 'notes'
          ? '#397a4b'
          : '--menuTextColor'};color:{setting === 'notes'
          ? 'white'
          : '--menuTextColor'}">Notes</button
      >
      <button
        class="setting"
        onclick={() => (setting = "scene")}
        style="background-color:{setting === 'scene'
          ? '#397a4b'
          : '--menuTextColor'};color:{setting === 'scene'
          ? 'white'
          : '--menuTextColor'}">Scene</button
      >
    </settingOptions>

    {#if setting === "notes"}
      <h1>Colours</h1>
      <label for="note">Note</label>
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
      <label for="expression">Expression</label>
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
      <h1>ADSR</h1>
      <label for="attack">Attack</label>
      <input
        type="range"
        min="0"
        max="4000"
        step="0.1"
        id="attack"
        bind:value={$Settings.attack}
      />
      <label for="release">Release</label>
      <input
        type="range"
        min="0"
        max="4000"
        step="0.1"
        id="release"
        bind:value={$Settings.release}
      />
      <button
        id="remap"
        onclick={() => {
          $Settings.remap = true;
        }}>Remap</button
      >
    {:else if setting === "scene"}
      <h1>Style</h1>
      <select
        name="styles"
        id="styles"
        bind:value={$Settings.scene}
        onchange={styleChange}
      >
        <option value={$Settings.styles[0]}>{$Settings.styles[0]}</option>
        <option value={$Settings.styles[1]}>{$Settings.styles[1]}</option>
        <option value={$Settings.styles[2]}>{$Settings.styles[2]}</option>
        <option value={$Settings.styles[3]}>{$Settings.styles[3]}</option>
      </select>
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
      <h1>Light Intensity</h1>
      <label for="frontLighting">Front Light</label>
      <input
        type="range"
        min="0"
        max="5.1"
        step="0.1"
        id="frontLighting"
        bind:value={$Settings.lighting.front}
      />
      <label for="backLighting">Side Light</label>
      <input
        type="range"
        min="0"
        max="5.1"
        step="0.1"
        id="backLighting"
        bind:value={$Settings.lighting.side}
      />
      <label for="aboveLighting">Above Light</label>
      <input
        type="range"
        min="0"
        max="5.1"
        step="0.1"
        id="aboveLighting"
        bind:value={$Settings.lighting.above}
      />

      <h1>Autorotate</h1>

      <input
        id="autoRotate"
        type="checkbox"
        onchange={() => ($Settings.autoRotate = !$Settings.autoRotate)}
        checked={$Settings.autoRotate}
      />
      <label for="rotateSpeed">Speed</label>
      <input
        type="range"
        min="0.5"
        max="10"
        step="0.1"
        id="rotateSpeed"
        bind:value={$Settings.autoRotateSpeed}
      />
    {/if}

    <button
      id="close"
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
  </settings>
{/if}

<style>
  @font-face {
    font-family: "Oxanium";
    src: url("/fonts/Oxanium-Bold.ttf");
  }
  button {
    font-family: "Oxanium";
    background-color: var(--menuTextColour);
    color: black;
    display: block;
    width: 25%;
    margin: 2.5% 37.5%;
    cursor: pointer;
    border-style: none;
  }
  button#close {
    background-color: #397a4b;
    color: white;
    width: 75%;
    margin: 5% 12.5% 2%;
  }
  button#remap {
    width: 60%;
    margin: 10% 20%;
  }

  button:hover {
    font-weight: bold;
    background-color: rgb(135, 238, 149);
    color: black;
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
    text-shadow: 1px 1px 1px BLACK;
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
    height: 17.5px;
    width: 17.5px;
    border-style: solid;
    border-width: 1px;
    border-color: var(--menuTextColour);
    box-shadow: 0.5px 1px 2px var(--menuTextColour);
  }
  input[type="checkbox"]:checked {
    background-color: var(--menuTextColour);
    border-color: #397a4b;
    border-width: 2px;
  }

  settingOptions {
    display: flex;
    justify-content: center;
  }
  .setting {
    width: 50%;
    height: 100%;
    margin: 2.5%;
  }

  @media (max-width: 600px) {
    settings {
      font-family: "Oxanium";
      display: block;
      position: absolute;
      text-align: center;
      background-image: linear-gradient(
        -45deg,
        #000000,
        #1b1a34,
        #e99541,
        #397a4b,
        #ffffff
      );
      background-size: 600% 600%;
      animation: gradientAnimation 85s infinite;
      bottom: 0;
      width: 100vw;
      margin: 0;
      padding: 0;
      z-index: 1;
      transform-origin: top;
    }

    h1 {
      color: var(--menuTextColour);
      font-size: 1.25em;
      margin-top: 5%;
      text-decoration: underline;
      text-shadow: 1px 1px 1px BLACK;
    }
    label {
      display: block;
      font-size: 0.9em;
      color: var(--menuTextColour);
      margin-top: 0.5px;
      margin-bottom: 0.5px;
      text-shadow: 1px 1px 1px BLACK;
    }

    button {
      height: 7.5%;
    }

    scene {
      display: block;
      position: absolute;
      top: 0;
      width: 100vw;
      height: var(--sceneHeight);
    }

    settingOptions {
      height: 10%;
    }
  }

  @media (min-width: 600px) {
    settings {
      font-family: "Oxanium";
      display: block;
      position: absolute;
      text-align: center;
      background-image: linear-gradient(
        -45deg,
        #000000,
        #1b1a34,
        #e99541,
        #397a4b,
        #ffffff
      );
      background-size: 600% 600%;
      animation: gradientAnimation 85s infinite;
      top: 0;
      height: 66vh;
      width: 20vw;
      margin: 0;
      padding: 0;
      transform-origin: top;
    }

    h1 {
      color: var(--menuTextColour);
      font-size: 1.3em;
      margin-top: 7.5%;
      text-decoration: underline;
      text-shadow: 1px 1px 1px BLACK;
    }
    label {
      display: block;
      font-size: 0.9em;
      color: var(--menuTextColour);
      margin-top: 20px;
      margin-bottom: 10px;
      text-shadow: 1px 1px 1px BLACK;
    }
    button {
      height: 5%;
    }

    scene {
      display: block;
      position: absolute;
      top: 0;
      width: 100vw;
      height: 100vh;
    }

    settingOptions {
      height: 5%;
    }
  }
  @keyframes gradientAnimation {
    0% {
      background-position: 100% 90%;
    }
    50% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 90%;
    }
  }
</style>

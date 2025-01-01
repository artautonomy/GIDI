<script>
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
  import { MIDI, Settings } from "../store";
  import { tweened } from "svelte/motion";
  import { cubicIn, cubicOut, cubicInOut } from "svelte/easing";

  const menuOpacity = tweened(0);

  $effect(() => {
    if ($Settings.edit) {
      menuOpacity.set(1, {
        delay: 500,
        duration: 1000,
        easing: cubicInOut,
      });
    } else {
      menuOpacity.set(0, {
        duration: 1000,
        easing: cubicInOut,
      });
    }
  });
</script>

<Canvas>
  <Scene />
</Canvas>

<!--
export let Settings = writable({

  edit: false,
  scene : 'Cube',
  orbitControls: false,
  autoRotate: true,
  autoRotateSpeed: 1,
  attack: 40,
  release: 500,
  colours: {
      background: {

          r: 27,
          g: 11,
          b: 40
      },
      key: {

          r: 122,
          g: 5,
          b: 122
      },
      expression: {

          r: 1,
          g: 23,
          b: 211
      }

  }
  
})
-->

<menu style="opacity:{$menuOpacity}">
  <button
    onclick={() => {
      $Settings.edit = false;
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
    <!--
      <ColorPicker
        --cp-bg-color="rgba(255,255,255,0.2)"
        --cp-input-color="rgba(255,255,255,0.4)"
        --picker-height="150px"
        --picker-width="150px"
        --slider-width="15px"
        --picker-indicator-size="10px"
        bind:rgb
        label="Key Colour"
        isAlpha={false}
        textInputModes={["rgb"]}
        sliderDirection="vertical"
        on:input={(event) => {
          settings.keyColour = event.detail.rgb;
        }}
      />
      
      <ColorPicker
        --picker-height="150px"
        --picker-width="150px"
        --slider-width="15px"
        --picker-indicator-size="10px"
        bind:hsv
        label="Expression Colour"
        isAlpha={false}
        textInputModes={["rgb"]}
        sliderDirection="vertical"
        on:input={(event) => {
          settings.expressionColour = event.detail.rgb;
        }}
      />
      <ColorPicker
        --picker-height="150px"
        --picker-width="150px"
        --slider-width="15px"
        --picker-indicator-size="10px"
        bind:hex
        label="Background Colour"
        isAlpha={false}
        textInputModes={["rgb"]}
        sliderDirection="vertical"
        on:input={(event) => {
          settings.sceneColour = event.detail.rgb;
        }}


        
      />-->
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
  label {
    display: block;
  }
  menu {
    position: absolute;
    background-color: blueviolet;
    top: 0;
    height: 75vh;
    width: 20vw;
  }
</style>

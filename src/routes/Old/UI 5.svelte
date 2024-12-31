<script>
  import { createEventDispatcher } from "svelte";
  import { Canvas } from "@threlte/core";
  //import { colord } from "colord";
  import Scene from "../Scene.svelte";
  //import ColorPicker from "svelte-awesome-color-picker";

  /** @type {{keys?: any}} */
  let { keys = [] } = $props();

  let setup = false;

  let menu = $state("none");

  let settingsClick = $state(false);

  const dispatch = createEventDispatcher();

  function remap() {
    dispatch("remap");

    setup = true;
  }

  function enableMenu() {
    menu = "block";
  }

  let settings = $state({
    orbitControls: true,
    setup: false,
    style: {
      selected: "none",
      highlight: "none",
      highlighted: false,
    },
    attack: 100,
    release: 750,
    rotate: true,
    rotateSpeed: 4,
    keyColour: {
      r: 166,
      g: 154,
      b: 1,
    },
    expressionColour: {
      r: 53,
      g: 111,
      b: 33,
    },
    sceneColour: {
      r: 5,
      g: 2,
      b: 44,
    },
  });

  let rgb = $state({
    r: settings.keyColour.r,
    g: settings.keyColour.g,
    b: settings.keyColour.b,
    a: 1,
  });
  /*
  let hsv = $state(
    colord(
      `rgb(${settings.expressionColour.r}, ${settings.expressionColour.g}, ${settings.expressionColour.b})`
    ).toHsv()
  );

  let hex = $state(
    colord(
      `rgb(${settings.sceneColour.r}, ${settings.sceneColour.g}, ${settings.sceneColour.b})`
    ).toHex()
  );**/
</script>

<threlte style="--canvasSize: {settingsClick ? '60vh' : '96.5vh'}">
  <Canvas>
    <Scene notes={keys} {settings} on:deviceConnected={enableMenu} />
  </Canvas>
</threlte>

{#if settingsClick}
  <ui>
    <h1>Settings</h1>

    <setting>
      <label for="mirror">Styles</label>
      <select name="styles" id="styles" bind:value={settings.style.selected}>
        <option value="pad">Pad</option>
        <option value="mirror">Mirror</option>
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
      <button id="remapKeys" onclick={remap}>Reset</button>

      <label for="autoRotate">Autorotate</label>
      <input
        id="autoRotate"
        type="checkbox"
        onchange={() => (settings.rotate = !settings.rotate)}
      />
      <label for="rotateSpeed">Rotate Speed</label>
      <input
        type="range"
        min="1"
        max="3"
        step="0.1"
        id="rotateSpeed"
        bind:value={settings.rotateSpeed}
      />
      <label for="attack">Attack</label>
      <input
        type="range"
        min="0"
        max="2500"
        id="attack"
        bind:value={settings.attack}
      />
      <label for="release">Release</label>
      <input
        type="range"
        min="0"
        max="2500"
        id="release"
        bind:value={settings.release}
      />
    </setting>
  </ui>
{/if}

<footer>
  <button
    id="settingsButton"
    style="--enableMenu: {menu}"
    onclick={() => {
      settingsClick = !settingsClick;
    }}>Settings</button
  >
  <socials>
    <a href="https://github.com/artautonomy/GIDI"
      ><img src="static\socials\\github.png" class="icons" alt="github" /></a
    >
    <a href="https://www.youtube.com/channel/UCiPYshK5e29AYbO1dFYWbGQ"
      ><img src="/static/socials/youtube.png" class="icons" alt="youtube" /></a
    >
    <a href="https://www.instagram.com/artautonomy/"
      ><img
        src="/static/socials/instagram.png"
        class="icons"
        alt="instagram"
      /></a
    >
  </socials>
</footer>

<style>
  threlte {
    display: inline-block;
    width: 100vw;
    height: var(--canvasSize);
    margin: 0;
  }
  footer {
    font-family: "Ubuntu Sans Mono", monospace;
    font-optical-sizing: auto;
    font-weight: 100;
    font-style: normal;
    font-size: 0.9em;
    background-color: rgba(255, 255, 255, 0.2);
    display: block;
    width: 100vw;
    height: 3.5vh;
    position: absolute;
    bottom: 0;
  }
  ui {
    font-family: "Ubuntu Sans Mono", monospace;
    font-optical-sizing: auto;
    font-weight: 100;
    font-style: normal;
    font-size: 0.75em;
    display: block;
    position: absolute;
    bottom: 0vh;
    height: 40vh;
    text-align: center;
    width: 100vw;
    background-color: rgba(46, 0, 0, 0.911);
    color: white;
  }
  h1 {
    font-size: 1.75em;
  }
  a {
    height: 50%;
  }
  #settingsButton {
    display: var(--enableMenu);
    float: left;
    width: 10vw;
    height: 100%;
  }

  label {
    display: block;
    margin: 1.25vh 0 0.5vh;
  }

  setting {
    display: block;
  }
  socials {
    display: flex;
    height: 100%;
    width: 20%;
    float: right;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: nowrap;
  }
  .icons {
    height: 100%;
    width: auto;
    margin: 0 7.5px;
  }

  #remapKeys {
    width: 100px;
    height: 22.5px;
  }
</style>

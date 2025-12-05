<script>
  import { Canvas } from "@threlte/core";
  import Scene from "$lib/scenes/Play.svelte";
  import { Map, Settings } from "$lib/store";
  import { Tween } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import ColorPicker from "svelte-awesome-color-picker";
  import { colord } from "colord";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { faceDirection } from "three/src/nodes/TSL.js";

  let setting = $state("notes");

  let getMenuHeight = $state();

  let screenHeight = 0;

  let recordControlHover = $state({
    record: false,
    stop: false,
    play: false,
    reset: false,
  });

  onMount(() => {
    if (typeof window !== "undefined") {
      screenHeight = window.innerHeight;
    }
  });

  const sceneHeight = new Tween(screenHeight);

  let rgb = $state({
    r: $Settings.notes.colours.key.r,
    g: $Settings.notes.colours.key.g,
    b: $Settings.notes.colours.key.b,
    a: 1,
  });

  let hsv = $state(
    colord(
      `rgb(${$Settings.notes.colours.expression.r}, ${$Settings.notes.colours.expression.g}, ${$Settings.notes.colours.expression.b})`
    ).toHsv()
  );

  let hex = $state(
    colord(
      `rgb(${$Settings.scene.colours.background.r}, ${$Settings.scene.colours.background.g}, ${$Settings.scene.colours.background.b})`
    ).toHex()
  );

  let menuColour = $state(
    colord(
      `rgb(${$Settings.scene.colours.background.r}, ${$Settings.scene.colours.background.g}, ${$Settings.scene.colours.background.b})`
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
      <button
        class="setting"
        onclick={() => (setting = "camera")}
        style="background-color:{setting === 'record'
          ? '#397a4b'
          : '--menuTextColor'};color:{setting === 'record'
          ? 'white'
          : '--menuTextColor'}">Camera</button
      >
      <button
        class="setting"
        onclick={() => (setting = "Mapping")}
        style="background-color:{setting === 'record'
          ? '#397a4b'
          : '--menuTextColor'};color:{setting === 'record'
          ? 'white'
          : '--menuTextColor'}">Mapping</button
      >
    </settingOptions>

    {#if setting === "notes"}
      <h1>Style</h1>
      <select
        name="styles"
        id="styles"
        bind:value={$Settings.sceneSelected}
        onchange={styleChange}
      >
        {#each $Settings.notes.styles as style}
          <option value={style}>{style}</option>
        {/each}
      </select>
      <h1>Colours</h1>
      <label for="note">Note</label>
      <ColorPicker
        --cp-bg-color={`rgba(${$Settings.scene.colours.background.r},${$Settings.scene.colours.background.g},${$Settings.scene.colours.background.b},1)`}
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
          $Settings.notes.colours.key =
            event.detail.rgb === undefined
              ? { r: 255, g: 255, b: 255 }
              : event.detail.rgb;
        }}
      />
      <label for="expression">Expression</label>
      <ColorPicker
        --cp-bg-color={`rgba(${$Settings.scene.colours.background.r},${$Settings.scene.colours.background.g},${$Settings.scene.colours.background.b},1)`}
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
          $Settings.notes.colours.expression =
            event.detail.rgb === undefined
              ? { r: 255, g: 255, b: 255 }
              : event.detail.rgb;
        }}
      />
      <h1>Dampening</h1>
      <label for="attack">Rise</label>
      <input
        type="range"
        min="0"
        max="4000"
        step="0.1"
        id="attack"
        bind:value={$Settings.notes.attack}
      />
      <label for="release">Fall</label>
      <input
        type="range"
        min="0"
        max="4000"
        step="0.1"
        id="release"
        bind:value={$Settings.notes.release}
      />
      <button
        class="small"
        onclick={() => {
          $Settings.notes.remap = true;
        }}>Remap</button
      >
    {:else if setting === "scene"}
      <label for="Background Colour">Background Colour</label>

      <ColorPicker
        --cp-bg-color={`rgba(${$Settings.scene.colours.background.r},${$Settings.scene.colours.background.g},${$Settings.scene.colours.background.b},1)`}
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
          $Settings.scene.colours.background =
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
        bind:value={$Settings.scene.lighting.front}
      />
      <label for="backLighting">Side Light</label>
      <input
        type="range"
        min="0"
        max="5.1"
        step="0.1"
        id="backLighting"
        bind:value={$Settings.scene.lighting.side}
      />
      <label for="aboveLighting">Above Light</label>
      <input
        type="range"
        min="0"
        max="5.1"
        step="0.1"
        id="aboveLighting"
        bind:value={$Settings.scene.lighting.above}
      />

      <h1>Gizmo</h1>

      <input
        id="gizmo"
        type="checkbox"
        onchange={() => ($Settings.scene.gizmo = !$Settings.scene.gizmo)}
        checked={$Settings.scene.gizmo}
      />
    {:else if setting === "camera"}
      <h1>Autorotate</h1>

      <input
        id="autoRotate"
        type="checkbox"
        onchange={() =>
          ($Settings.camera.autoRotate.enabled =
            !$Settings.camera.autoRotate.enabled)}
        checked={$Settings.camera.autoRotate.enabled}
      />
      <label for="rotateSpeed">Speed</label>
      <input
        type="range"
        min="0.5"
        max="10"
        step="0.1"
        id="rotateSpeed"
        bind:value={$Settings.camera.autoRotate.speed}
      />

      <h1>Sequence Record</h1>

      <label for="playbackMethodLabel">Playback Method</label>
      <select
        name="triggers"
        id="triggers"
        bind:value={$Settings.camera.sequence.selected}
        onchange={() => {
          $Settings.camera.sequence.playing = true;
        }}
      >
        {#each $Settings.camera.sequence.triggers as trigger}
          <option value={trigger}>{trigger}</option>
        {/each}
      </select>

      <controls>
        {#if !$Settings.camera.sequence.recording}
          <button
            class="recordHiddenButton"
            aria-label="record"
            onclick={() => {
              $Settings.camera.sequence.recording = true;
              $Settings.camera.sequence.playing = false;
            }}
            onmouseenter={() => {
              recordControlHover.record = true;
            }}
            onmouseleave={() => {
              recordControlHover.record = false;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              class="recordControls"
              aria-hidden="true"
            >
              <circle
                id="record"
                cx="32"
                cy="32"
                r="20"
                fill={recordControlHover.record ? "#ff6262" : "white"}
              />
            </svg>
          </button>
        {:else}
          <button
            class="recordHiddenButton"
            aria-label="stop"
            onclick={() => {
              $Settings.camera.sequence.recording = false;
              $Settings.camera.sequence.playing = true;
            }}
            onmouseenter={() => {
              recordControlHover.stop = true;
            }}
            onmouseleave={() => {
              recordControlHover.stop = false;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="recordControls"
              viewBox="0 0 64 64"
              aria-hidden="true"
            >
              <rect
                id="stopRecord"
                x="16"
                y="16"
                width="35"
                height="35"
                fill={recordControlHover.stop ? "green" : "white"}
              />
            </svg>
          </button>
        {/if}

        {#if $Settings.camera.sequence.selected == "Time interval"}
          {#if !$Settings.camera.sequence.playing}
            <button
              class="recordHiddenButton"
              aria-label="play"
              onclick={() => {
                $Settings.camera.sequence.playing = true;
              }}
              onmouseenter={() => {
                recordControlHover.play = true;
              }}
              onmouseleave={() => {
                recordControlHover.play = false;
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="recordControls"
                viewBox="0 0 64 64"
              >
                <polygon
                  aria-hidden="true"
                  id="play"
                  points="24,16 24,48 48,32"
                  fill={$Settings.camera.sequence.playing ||
                  recordControlHover.play
                    ? "green"
                    : "white"}
                />
              </svg>
            </button>
          {:else}
            <button
              class="recordHiddenButton"
              aria-label="pause"
              onclick={() => {
                $Settings.camera.sequence.playing = false;
              }}
              onmouseenter={() => {
                recordControlHover.play = true;
              }}
              onmouseleave={() => {
                recordControlHover.play = false;
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="recordControls"
                viewBox="0 0 64 64"
              >
                <!-- Left bar -->
                <rect
                  aria-hidden="true"
                  id="pause-left"
                  x="20"
                  y="16"
                  width="8"
                  height="32"
                  rx="1"
                  fill={!$Settings.camera.sequence.playing ||
                  recordControlHover.play
                    ? "green"
                    : "white"}
                />
                <!-- Right bar -->
                <rect
                  aria-hidden="true"
                  id="pause-right"
                  x="36"
                  y="16"
                  width="8"
                  height="32"
                  rx="1"
                  fill={!$Settings.camera.sequence.playing ||
                  recordControlHover.play
                    ? "green"
                    : "white"}
                />
              </svg>
            </button>
          {/if}
        {/if}
        <button
          type="button"
          class="recordHiddenButton"
          aria-label="reset"
          onclick={() => {
            $Settings.camera.sequence.playing = false;
            $Settings.camera.sequence.reset = true;
          }}
          onmouseenter={() => {
            recordControlHover.reset = true;
          }}
          onmouseleave={() => {
            recordControlHover.reset = false;
          }}
        >
          <svg
            aria-hidden="true"
            class="recordControls"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              id="reset"
              cx="32"
              cy="32"
              r="20"
              fill={$Settings.camera.sequence.reset || recordControlHover.reset
                ? "#ff2727"
                : "white"}
            />
            <line
              x1="22"
              y1="22"
              x2="42"
              y2="42"
              stroke="black"
              stroke-width="4"
              stroke-linecap="round"
            />
            <line
              x1="42"
              y1="22"
              x2="22"
              y2="42"
              stroke="black"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </controls>

      <label for="transitionSpeedLabel">Transition Speed</label>
      <input
        type="range"
        min="0"
        max="4000"
        step="1"
        id="transitionSpeed"
        bind:value={$Settings.camera.sequence.speed}
      />
    {:else if setting === "Mapping"}
      {#if $Map.inputs.length < 1}
        <label for="noChannelsSelected"
          >Play a control slider/knob to map to GIDI</label
        >
      {:else}
        {#each $Map.inputs as channel}
          <label for="channelLabel-{channel.id}">Status ({channel.id})</label>

          <select
            name="channelSetting-{channel.id}"
            id="channels"
            bind:value={channel.setting}
          >
            <option value="attack">Attack</option>
            <option value="release">Release</option>
            <option value="autorotate">Autorotate</option>
            <option value="frontLight">Front Light</option>
            <option value="sideLight">Side Light</option>
            <option value="aboveLight">Above Light</option>
            <option value="sequenceStepSpeed">Sequence Step Speed</option>
          </select>
          <input
            type="range"
            min="0"
            max="127"
            step="0.1"
            id="channelSlider-{channel.id}"
            bind:value={channel.value}
          />
        {/each}
      {/if}
    {/if}

    <button
      id="close"
      onclick={() => {
        $Settings.edit = false;

        setTimeout(() => {
          menuColour = colord(
            `rgb(${$Settings.scene.colours.background.r}, ${$Settings.scene.colours.background.g}, ${$Settings.scene.colours.background.b})`
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

  button.small {
    background-color: #397a4b;
    color: white;
    width: 50%;
    margin: 10% 25% 2%;
  }

  button.setting:hover {
    font-weight: bold;
    background-color: rgb(135, 238, 149);
    color: black;
  }
  button.small:hover {
    font-weight: bold;
    background-color: rgb(135, 238, 149);
    color: black;
  }
  button#close:hover {
    font-weight: bold;
    background-color: rgb(135, 238, 149);
    color: black;
  }

  button#close {
    position: absolute;
    bottom: 0;
    background-color: #397a4b;
    color: white;
    width: 75%;
    margin: 5% 12.5% 2%;
  }

  button.recordHiddenButton {
    display: inline-block;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    margin: 0;
    width: 12.5%;
  }

  .recordControls {
    width: 50%;
    height: auto;
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
    box-shadow: 0.25px 0.25px 1.75px var(--menuTextColour);
  }
  input[type="checkbox"]:checked {
    background-color: var(--menuTextColour);
    border-color: #397a4b;
    border-width: 2px;
  }
  settings {
    font-family: "Oxanium";

    background-image: linear-gradient(
      -45deg,
      #5e4663,
      #2e2d49,
      #b6895c,
      #558163
    );
  }

  settingOptions {
    display: flex;
    justify-content: center;
  }

  controls {
    display: block;
    padding-top: 5%;
  }
  .setting {
    width: 50%;
    height: 100%;
    margin: 2.5%;
  }

  @media (max-width: 600px) {
    settings {
      display: block;
      position: absolute;
      text-align: center;

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
      margin-top: 2.5%;
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
      padding-bottom: 2.5%;
    }
  }

  @media (min-width: 600px) {
    settings {
      display: block;
      position: absolute;
      text-align: center;

      background-size: 600% 600%;
      animation: gradientAnimation 85s infinite;
      top: 0;
      height: 66vh;
      width: 27.5vw;
      margin: 0;
      padding: 0;
      transform-origin: top;
    }

    h1 {
      margin-top: 5%;

      color: var(--menuTextColour);
      font-size: 1.3em;
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
      padding-bottom: 5%;
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

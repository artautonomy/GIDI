<script lang="ts">
  import {
    Button,
    Checkbox,
    Color,
    Element,
    Folder,
    List,
    type ListOptions,
    Separator,
    Slider,
    Text,
    ThemeUtils,
    type Theme,
    Pane,
  } from "svelte-tweakpane-ui";
  import { Map, Settings } from "./store";

  const customizedTheme: Theme = {
    ...ThemeUtils.presets.jetblack,
    baseFontFamily: "'Oxanium', sans-serif",
    baseBackgroundColor: "hsla(289, 77%, 17%, 0.5)",
    baseShadowColor: "rgba(255, 165, 0,0.5)",
    labelForegroundColor: "rgba(255,255,255,1)",
    bladeValueWidth: "60%",
    grooveForegroundColor: "rgba(0,0,0,0)",
    inputBackgroundColor: "rgba(0, 0, 0, 0.5)",
    inputForegroundColor: "rgba(255, 255, 255, 1)",
    containerForegroundColor: "rgba(255, 255, 255, 1)",
    buttonBackgroundColor: "rgba(255, 255, 255, 1)",
    containerVerticalPadding: "10px",
  };

  const sceneStyles: ListOptions<number> = Object.fromEntries(
    $Settings.notes.styles.map((style, index) => [style, index]),
  );

  const playbackMethod: ListOptions<number> = Object.fromEntries(
    $Settings.camera.sequence.triggers.map((style, index) => [style, index]),
  );

  const mappingOptions: ListOptions<number> = {
    Rise: 1,
    Fall: 2,
    Autorotate: 3,
    "Front Light": 4,
    "Side Light": 5,
    "Above Light": 6,
    "Sequence Step Speed": 7,
  };

  let styleSelection: number = $state(5);
  let playbackSelection: number = $state(0);

  let recordControlHover = $state({
    record: false,
    stop: false,
    play: false,
    reset: false,
  });

  $effect(() => {
    switch (styleSelection) {
      case 0:
        $Settings.sceneSelected = "Piano";

        break;

      case 1:
        $Settings.sceneSelected = "Firework";
        break;

      case 2:
        $Settings.sceneSelected = "Mirror";
        break;

      case 3:
        $Settings.sceneSelected = "Swirl";
        break;

      case 4:
        $Settings.sceneSelected = "Cube";
        break;
    }

    switch (playbackSelection) {
      case 0:
        $Settings.camera.sequence.selected = "Note down";

        break;

      case 1:
        $Settings.camera.sequence.selected = "Time interval";
        break;
    }
  });
</script>

<Pane title="Settings" theme={customizedTheme} position="fixed" width={400}>
  <List label="Styles" options={sceneStyles} bind:value={styleSelection}></List>
  <Folder title="Colours">
    <Color bind:value={$Settings.notes.colours.key} label="Key Colour" />
    <Color
      bind:value={$Settings.notes.colours.expression}
      label="Key Expression Colour"
    />
    <Color
      bind:value={$Settings.scene.colours.background}
      label="Background Colour"
    />
  </Folder>

  <Folder title="Note Weight" expanded={true}>
    <Slider
      label="Note rise time"
      bind:value={$Settings.notes.attack}
      min={0}
      max={4000}
      step={0.1}
      wide
    />
    <Slider
      label="Note fall time"
      bind:value={$Settings.notes.release}
      min={0}
      max={4000}
      step={0.1}
      wide
    />
  </Folder>
  <Folder title="Lighting" expanded={true}>
    <Slider
      label="Above Lighting"
      bind:value={$Settings.scene.lighting.above}
      min={0}
      max={2}
      step={0.1}
      wide
    />

    <Slider
      label="Front Lighting"
      bind:value={$Settings.scene.lighting.front}
      min={0}
      max={2}
      step={0.1}
      wide
    />

    <Slider
      label="Side Lighting"
      bind:value={$Settings.scene.lighting.side}
      min={0}
      max={2}
      step={0.1}
      wide
    />
  </Folder>
  <Folder title="Camera">
    <Checkbox bind:value={$Settings.scene.gizmo} label="Gizmo" />

    <Checkbox
      bind:value={$Settings.camera.autoRotate.enabled}
      label="Autorotate"
    />
    <Slider
      label="Autorotate Speed"
      bind:value={$Settings.camera.autoRotate.speed}
      min={0.5}
      max={10}
      step={0.1}
      wide
    /></Folder
  >
  <Folder title="Camera Sequences">
    <Element>
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
                    ? "black"
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
                    ? "black"
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
                ? "black"
                : "white"}
            />
            <line
              x1="22"
              y1="22"
              x2="42"
              y2="42"
              stroke={$Settings.camera.sequence.reset ||
              recordControlHover.reset
                ? "white"
                : "black"}
              stroke-width="4"
              stroke-linecap="round"
            />
            <line
              x1="42"
              y1="22"
              x2="22"
              y2="42"
              stroke={$Settings.camera.sequence.reset ||
              recordControlHover.reset
                ? "white"
                : "black"}
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </controls>
    </Element>
    <List
      label="Playback Method"
      options={playbackMethod}
      bind:value={playbackSelection}
    ></List>
    <Slider
      label="Sequence Speed"
      bind:value={$Settings.camera.sequence.speed}
      format={(v) => (v / 1000).toString() + " Seconds"}
      min={0}
      max={4000}
      step={100}
    />
  </Folder>
  <Folder title="MIDI Mapping">
    <Button on:click={() => ($Settings.notes.remap = true)} title="Remap" />
    <Separator />
    {#each $Map.inputs as channel}
      <label for="channelLabel-{channel.id}">Status ({channel.id})</label>

      <List
        label="channelSetting-{channel.id}"
        options={mappingOptions}
        bind:value={channel.setting}
      ></List>

      <Slider
        label="MIDI Channel Value"
        bind:value={channel.value}
        min={0}
        max={127}
        step={0.1}
        wide
      />
    {/each}
  </Folder>
</Pane>

<style>
  controls {
    display: block;
    padding-top: 5%;
    text-align: center;
  }
  .recordHiddenButton {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .recordControls {
    width: 27.5px;
    height: 27.5px;
    display: block;
  }
</style>

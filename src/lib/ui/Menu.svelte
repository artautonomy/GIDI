<script lang="ts">
  import { untrack, onDestroy } from "svelte";
  import * as ToneMidi from "@tonejs/midi";
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
    TabGroup,
    TabPage,
    Text,
    ThemeUtils,
    type Theme,
    Pane,
  } from "svelte-tweakpane-ui";
  import { Settings } from "../stores/settings";
  import { MIDIChannels } from "../stores/midiDeviceStore";
  import { midiFileData, midiFileName } from "../stores/midiFileStore";
  import { MIDIPlayback } from "../midi/midiPlayback";

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

  const styles = $Settings.notes.styles;
  const triggers = $Settings.camera.sequence.triggers;

  const sceneStyles: ListOptions<number> = Object.fromEntries(
    styles.map((style, index) => [style, index]),
  );

  const playbackMethod: ListOptions<number> = Object.fromEntries(
    triggers.map((trigger, index) => [trigger, index]),
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

  type PlaybackEvent = {
    time: number;
    type: "on" | "off";
    pitch: number;
    velocity: number;
    noteId: number;
  };

  let playbackEvents: PlaybackEvent[] = [];
  let playbackDuration = $state(0);
  let playbackPosition = $state(0);
  let playbackState = $state<"stopped" | "playing" | "paused">("stopped");
  let playerError = $state("");
  let activeNotes = new Map<number, Map<number, number>>();
  let playbackStartedAt = 0;
  let playbackOffset = 0;
  let nextEventIndex = 0;
  let playbackTimer: ReturnType<typeof setInterval> | undefined;
  let lastLoadedData: ArrayBuffer | null = null;
  let loadedFileName = $state("");
  let isDraggingMIDI = $state(false);
  let midiFileInput: HTMLInputElement;

  function importMIDIFile(file: File | undefined) {
    if (!file) return;

    if (!/\.midi?$/i.test(file.name)) {
      playerError = "Please choose a .mid or .midi file.";
      return;
    }

    playerError = "";
    clearPlaybackTimer();
    playbackState = "stopped";

    void file
      .arrayBuffer()
      .then((data) => {
        // A fresh ArrayBuffer reference causes the MIDI player and scene to reload.
        midiFileName.set(file.name);
        midiFileData.set(data);
      })
      .catch((error) => {
        console.error("Unable to import MIDI file:", error);
        playerError = "Unable to read this MIDI file.";
      });
  }

  function handleMIDIFileInput(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    importMIDIFile(input.files?.[0]);
    // Allow selecting the same file again to reload it.
    input.value = "";
  }

  function handleMIDIDrop(event: DragEvent) {
    event.preventDefault();
    isDraggingMIDI = false;
    importMIDIFile(event.dataTransfer?.files?.[0]);
  }

  function clearPlaybackTimer() {
    if (playbackTimer !== undefined) {
      clearInterval(playbackTimer);
      playbackTimer = undefined;
    }
  }

  function publishPlaybackState() {
    const activeVelocities: Record<number, number> = {};
    for (const [pitch, notes] of activeNotes) {
      activeVelocities[pitch] = Math.max(0, ...notes.values());
    }
    MIDIPlayback.update((current) => ({
      ...current,
      pitches: playbackEvents.length
        ? [...new Set(playbackEvents.map((event) => event.pitch))].sort(
            (a, b) => a - b,
          )
        : [],
      activeVelocities,
    }));
  }

  function clearActiveNotes() {
    activeNotes.clear();
    publishPlaybackState();
  }

  function loadMIDI(data: ArrayBuffer | null, name = "") {
    clearPlaybackTimer();
    playbackState = "stopped";
    playbackPosition = 0;
    playbackOffset = 0;
    playbackDuration = 0;
    playbackEvents = [];
    activeNotes.clear();
    playerError = "";
    loadedFileName = name;

    if (!data) {
      MIDIPlayback.set({ pitches: [], activeVelocities: {} });
      return;
    }

    try {
      // Namespace import handles the CommonJS/ESM package shape used by Vite.
      const Midi = (ToneMidi as any).Midi ?? (ToneMidi as any).default?.Midi;
      if (!Midi) throw new Error("Could not load the MIDI parser.");

      const midi = new Midi(data.slice(0));
      let id = 0;
      const events: PlaybackEvent[] = [];

      for (const track of midi.tracks) {
        for (const note of track.notes) {
          const noteId = id++;
          const pitch = Number(note.midi);
          const velocity = Math.max(
            1,
            Math.min(127, Math.round((note.velocity ?? 1) * 127)),
          );
          const start = Math.max(0, Number(note.time) || 0);
          const end = start + Math.max(0, Number(note.duration) || 0);
          events.push({ time: start, type: "on", pitch, velocity, noteId });
          events.push({ time: end, type: "off", pitch, velocity: 0, noteId });
        }
      }

      events.sort((a, b) => a.time - b.time || (a.type === "off" ? -1 : 1));
      playbackEvents = events;
      playbackDuration = events.reduce(
        (maximum, event) => Math.max(maximum, event.time),
        0,
      );
      MIDIPlayback.set({
        pitches: [...new Set(events.map((event) => event.pitch))].sort(
          (a, b) => a - b,
        ),
        activeVelocities: {},
      });
      if (events.length === 0)
        playerError = "This MIDI file contains no notes.";
    } catch (error) {
      console.error("Unable to read MIDI file:", error);
      playerError =
        error instanceof Error
          ? error.message
          : "Unable to read this MIDI file.";
      playbackEvents = [];
      MIDIPlayback.set({ pitches: [], activeVelocities: {} });
    }
  }

  function applyEventsUntil(timeSeconds: number) {
    // Rebuild active note state from the start so seeking and restarting stay accurate.
    activeNotes.clear();
    nextEventIndex = 0;
    for (const event of playbackEvents) {
      if (event.time > timeSeconds) break;
      let pitchNotes = activeNotes.get(event.pitch);
      if (event.type === "on") {
        if (!pitchNotes) {
          pitchNotes = new Map<number, number>();
          activeNotes.set(event.pitch, pitchNotes);
        }
        pitchNotes.set(event.noteId, event.velocity);
      } else {
        pitchNotes?.delete(event.noteId);
        if (pitchNotes?.size === 0) activeNotes.delete(event.pitch);
      }
      nextEventIndex++;
    }
    publishPlaybackState();
  }

  function tickPlayback() {
    const elapsed =
      playbackOffset + (performance.now() - playbackStartedAt) / 1000;
    playbackPosition = Math.min(elapsed, playbackDuration);

    // Process each event exactly once as playback crosses its timestamp.
    while (
      nextEventIndex < playbackEvents.length &&
      playbackEvents[nextEventIndex].time <= playbackPosition
    ) {
      const event = playbackEvents[nextEventIndex++];
      let pitchNotes = activeNotes.get(event.pitch);
      if (event.type === "on") {
        if (!pitchNotes) {
          pitchNotes = new Map<number, number>();
          activeNotes.set(event.pitch, pitchNotes);
        }
        pitchNotes.set(event.noteId, event.velocity);
      } else {
        pitchNotes?.delete(event.noteId);
        if (pitchNotes?.size === 0) activeNotes.delete(event.pitch);
      }
    }
    publishPlaybackState();

    if (playbackPosition >= playbackDuration) {
      clearPlaybackTimer();
      playbackState = "stopped";
      playbackPosition = 0;
      playbackOffset = 0;
      activeNotes.clear();
      publishPlaybackState();
    }
  }

  function playMIDI() {
    if (playbackEvents.length === 0) return;
    if (playbackState === "playing") return;
    if (playbackPosition >= playbackDuration) playbackPosition = 0;
    playbackOffset = playbackPosition;
    applyEventsUntil(playbackOffset);
    playbackStartedAt = performance.now();
    playbackState = "playing";
    clearPlaybackTimer();
    playbackTimer = setInterval(tickPlayback, 10);
  }

  function pauseMIDI() {
    if (playbackState !== "playing") return;
    playbackPosition = Math.min(
      playbackOffset + (performance.now() - playbackStartedAt) / 1000,
      playbackDuration,
    );
    playbackOffset = playbackPosition;
    clearPlaybackTimer();
    playbackState = "paused";
    applyEventsUntil(playbackPosition);
  }

  function stopMIDI() {
    clearPlaybackTimer();
    playbackState = "stopped";
    playbackPosition = 0;
    playbackOffset = 0;
    activeNotes.clear();
    publishPlaybackState();
  }

  function seekMIDI(value: number) {
    const nextPosition = Math.max(0, Math.min(playbackDuration, value));
    playbackPosition = nextPosition;
    playbackOffset = nextPosition;
    if (playbackState === "playing") {
      playbackStartedAt = performance.now();
    }
    applyEventsUntil(nextPosition);
  }

  function formatTime(seconds: number) {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
  }

  const unsubscribeMIDIFile = midiFileData.subscribe((data) => {
    if (data !== lastLoadedData) {
      lastLoadedData = data;
      loadMIDI(data, $midiFileName ?? "");
    }
  });

  const unsubscribeMIDIFileName = midiFileName.subscribe((name) => {
    loadedFileName = name ?? "";
  });

  onDestroy(() => {
    clearPlaybackTimer();
    unsubscribeMIDIFile();
    unsubscribeMIDIFileName();
    MIDIPlayback.set({ pitches: [], activeVelocities: {} });
  });

  // Start from what the store currently holds (fall back to the first option)
  let styleSelection: number = $state(
    Math.max(0, styles.indexOf($Settings.sceneSelected)),
  );
  let playbackSelection: number = $state(
    Math.max(0, triggers.indexOf($Settings.camera.sequence.selected)),
  );

  let recordControlHover = $state({
    record: false,
    stop: false,
    play: false,
    reset: false,
  });

  // List -> store
  $effect(() => {
    const style = styles[styleSelection];

    untrack(() => {
      if (style && $Settings.sceneSelected !== style) {
        $Settings.sceneSelected = style;
      }
    });
  });

  $effect(() => {
    const trigger = triggers[playbackSelection];

    untrack(() => {
      if (trigger && $Settings.camera.sequence.selected !== trigger) {
        $Settings.camera.sequence.selected = trigger;
      }
    });
  });

  // Store -> List (keeps the list correct if the style is changed elsewhere)
  $effect(() => {
    const index = styles.indexOf($Settings.sceneSelected);

    untrack(() => {
      if (index >= 0 && index !== styleSelection) styleSelection = index;
    });
  });

  $effect(() => {
    const index = triggers.indexOf($Settings.camera.sequence.selected);

    untrack(() => {
      if (index >= 0 && index !== playbackSelection) playbackSelection = index;
    });
  });
</script>

<Pane
  title="Settings"
  theme={customizedTheme}
  position="fixed"
  width={window.innerWidth < 400 ? window.innerWidth : 400}
>
  <TabGroup theme={customizedTheme}>
    <TabPage title="Scene">
      <List label="Styles" options={sceneStyles} bind:value={styleSelection}
      ></List>
      <Folder title="Colors" expanded={true}>
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
    </TabPage>
    <TabPage title="Camera">
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
          <span class="summary"
            >Create camera sequences, these can then be played back with the
            trigger either being for a MIDI on message, or a specific time
            interval<br /><br />Keyboard shortcuts are 'R' to record a camera
            sequence and the space bar to play</span
          >
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
                  fill={$Settings.camera.sequence.reset ||
                  recordControlHover.reset
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
    </TabPage>
    <TabPage title="MIDI Configuration">
      <Element>
        <div class="midiPlayer">
          <div
            class:dragging={isDraggingMIDI}
            class="midiDropZone"
            role="button"
            tabindex="0"
            aria-label="Import a MIDI file by dropping it here or selecting a file"
            ondragenter={(event) => {
              event.preventDefault();
              isDraggingMIDI = true;
            }}
            ondragover={(event) => event.preventDefault()}
            ondragleave={(event) => {
              const current = event.currentTarget as HTMLElement;
              const related = event.relatedTarget as Node | null;
              if (!related || !current.contains(related))
                isDraggingMIDI = false;
            }}
            ondrop={handleMIDIDrop}
            onkeydown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                midiFileInput?.click();
              }
            }}
            onclick={() => midiFileInput?.click()}
          >
            <span class="dropIcon">⇧</span>
            <span class="dropTitle"
              >{isDraggingMIDI
                ? "Drop MIDI file to import"
                : "Drop a MIDI file here"}</span
            >
            <span class="dropSubtitle">or click to browse · .mid / .midi</span>
          </div>
          <input
            bind:this={midiFileInput}
            class="midiFileInput"
            type="file"
            accept=".mid,.midi,audio/midi,audio/x-midi"
            aria-label="Choose MIDI file"
            onchange={handleMIDIFileInput}
          />
          <div class="midiFileName">
            {loadedFileName ||
              (playbackEvents.length ? "Imported MIDI" : "No MIDI file loaded")}
          </div>
          <div class="playerControls">
            <button
              type="button"
              onclick={playMIDI}
              disabled={!playbackEvents.length || playbackState === "playing"}
              aria-label="Play MIDI">▶</button
            >
            <button
              type="button"
              onclick={pauseMIDI}
              disabled={playbackState !== "playing"}
              aria-label="Pause MIDI">Ⅱ</button
            >
            <button
              type="button"
              onclick={stopMIDI}
              disabled={!playbackEvents.length}
              aria-label="Stop MIDI">■</button
            >
          </div>
          <div class="playerTime">
            <span>{formatTime(playbackPosition)}</span>
            <span>{formatTime(playbackDuration)}</span>
          </div>
          <input
            class="playerSeek"
            type="range"
            min="0"
            max={Math.max(playbackDuration, 0.01)}
            step="0.01"
            value={playbackPosition}
            disabled={!playbackEvents.length}
            aria-label="Seek MIDI playback"
            oninput={(event) => seekMIDI(Number(event.currentTarget.value))}
          />
          {#if playerError}
            <p class="playerError">{playerError}</p>
          {/if}
        </div>
      </Element>
      <Folder title="MIDI Mapping">
        <Element>
          <span class="summary"
            >You can map MIDI status message to your instrument e.g. your
            instrument's volume slider to the scene's 'Above Lighting'.
            Available sliders/knobs will appear below when you interact with
            them</span
          ></Element
        >

        <Separator />
        {#each $MIDIChannels.inputs as channel}
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
      <Folder title="Clear MIDI Mapping">
        <Element>
          <span class="summary"
            >If you want to remove the style's notes and all mapping above</span
          ></Element
        >
        <Button
          on:click={() => ($Settings.notes.remap = true)}
          title="Clear MIDI Mapping"
        />
      </Folder>
    </TabPage>
  </TabGroup>
</Pane>

<style>
  .summary {
    font-size: 11px;
    font-weight: bold;
    color: rgba(255, 165, 0, 0.8);
  }

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

  .midiPlayer {
    padding: 6px 2px;
    color: white;
    font-family: "Oxanium", sans-serif;
  }

  .midiDropZone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: 88px;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px dashed rgba(215, 138, 255, 0.65);
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.25);
    text-align: center;
    cursor: pointer;
    transition:
      background 120ms ease,
      border-color 120ms ease;
  }

  .midiDropZone:hover,
  .midiDropZone.dragging {
    border-color: #d78aff;
    background: rgba(215, 138, 255, 0.16);
  }

  .midiDropZone:focus-visible {
    outline: 2px solid #d78aff;
    outline-offset: 2px;
  }

  .dropIcon {
    font-size: 22px;
    line-height: 1;
  }

  .dropTitle {
    font-size: 12px;
  }

  .dropSubtitle {
    color: rgba(255, 255, 255, 0.65);
    font-size: 10px;
  }

  .midiFileInput {
    display: none;
  }

  .midiFileName {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 8px;
    font-size: 12px;
  }

  .playerControls {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .playerControls button {
    width: 36px;
    height: 30px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.45);
    color: white;
    cursor: pointer;
  }

  .playerControls button:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .playerTime {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 11px;
  }

  .playerSeek {
    width: 100%;
    margin: 4px 0;
    accent-color: #d78aff;
  }

  .playerError {
    margin: 6px 0 0;
    color: #ff8f8f;
    font-size: 11px;
  }
</style>

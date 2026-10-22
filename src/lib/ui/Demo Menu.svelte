<script lang="ts">
  import {
    Checkbox,
    Color,
    Folder,
    Element,
    List,
    type ListOptions,
    Slider,
    ThemeUtils,
    type Theme,
    Pane,
  } from "svelte-tweakpane-ui";

  import { onDestroy, onMount } from "svelte";
  import * as ToneMidi from "@tonejs/midi";

  import { Settings } from "../stores/settings";
  import { MIDIPlayback } from "../midi/midiPlayback";

  const Midi = (ToneMidi as any).Midi ?? (ToneMidi as any).default?.Midi;

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

  let styleSelection = $state(0);
  let playbackSelection = $state(0);

  type MidiEvent = {
    time: number;
    note: number;
    velocity: number;
    type: "on" | "off";
    id: number;
  };

  let midiFileName = $state("Loading demo.mid...");
  let midiLoaded = $state(false);
  let midiPlaying = $state(false);
  let midiError = $state("");
  let midiProgress = $state(0);

  let midiEvents: MidiEvent[] = [];
  let midiEventIndex = 0;
  let midiElapsed = 0;
  let midiStartedAt = 0;
  let midiDuration = 0;

  let midiTimer: ReturnType<typeof setInterval> | undefined;

  // Track overlapping notes of the same pitch separately.
  const activeNotes = new Map<number, Map<number, number>>();

  function clearMidiTimer() {
    if (midiTimer !== undefined) {
      clearInterval(midiTimer);
      midiTimer = undefined;
    }
  }

  function publishActiveVelocities() {
    const activeVelocities: Record<number, number> = {};

    for (const [pitch, velocities] of activeNotes) {
      if (velocities.size > 0) {
        activeVelocities[pitch] = Math.max(...velocities.values());
      }
    }

    MIDIPlayback.update((current) => ({
      ...current,
      activeVelocities,
    }));
  }

  function clearActiveNotes() {
    activeNotes.clear();
    publishActiveVelocities();
  }

  function processMidiEvent(event: MidiEvent) {
    if (event.type === "on") {
      let velocities = activeNotes.get(event.note);

      if (!velocities) {
        velocities = new Map<number, number>();
        activeNotes.set(event.note, velocities);
      }

      velocities.set(event.id, event.velocity);
    } else {
      const velocities = activeNotes.get(event.note);

      velocities?.delete(event.id);

      if (velocities?.size === 0) {
        activeNotes.delete(event.note);
      }
    }

    publishActiveVelocities();
  }

  async function parseMIDIFile(file: File) {
    clearMidiTimer();
    midiPlaying = false;
    clearActiveNotes();

    midiLoaded = false;
    midiError = "";
    midiFileName = file.name;
    midiProgress = 0;
    midiElapsed = 0;
    midiEventIndex = 0;
    midiDuration = 0;
    midiEvents = [];

    try {
      if (!Midi) {
        throw new Error("@tonejs/midi did not expose its Midi constructor.");
      }

      const midi = new Midi(await file.arrayBuffer());

      const notes = midi.tracks
        .flatMap((track: any) => track.notes)
        .sort((a: any, b: any) => a.time - b.time);

      if (notes.length === 0) {
        throw new Error("This MIDI file contains no playable notes.");
      }

      const pitches = [
        ...new Set(notes.map((note: any) => note.midi)),
      ] as number[];

      midiEvents = [];

      notes.forEach((note: any, index: number) => {
        midiEvents.push({
          time: note.time * 1000,
          note: note.midi,
          velocity: Math.round(note.velocity * 127),
          type: "on",
          id: index,
        });

        midiEvents.push({
          time: (note.time + note.duration) * 1000,
          note: note.midi,
          velocity: 0,
          type: "off",
          id: index,
        });
      });

      // Process note-offs before note-ons at identical timestamps.
      midiEvents.sort((a, b) => {
        const difference = a.time - b.time;

        if (difference !== 0) return difference;
        if (a.type === b.type) return a.id - b.id;

        return a.type === "off" ? -1 : 1;
      });

      midiDuration = midi.duration * 1000;

      if (midiEvents.length === 0 || midiDuration <= 0) {
        throw new Error("This MIDI file contains no playable duration.");
      }

      // Tell MIDI Import which pitches to lay out visually.
      MIDIPlayback.set({
        pitches,
        activeVelocities: {},
      });

      midiLoaded = true;

      playMIDI();
    } catch (error) {
      console.error("[Demo Menu] MIDI import failed", error);

      midiLoaded = false;
      midiError =
        error instanceof Error
          ? error.message
          : "Unable to read this MIDI file.";
    }
  }

  // Automatically load /static/demo.mid when this component mounts.
  async function loadDemoMIDI() {
    try {
      const response = await fetch("/demo.mid");

      if (!response.ok) {
        throw new Error(
          `Could not load /demo.mid (HTTP ${response.status}). Check that the file is in your project's static folder.`,
        );
      }

      const blob = await response.blob();

      const demoFile = new File([blob], "demo.mid", {
        type: "audio/midi",
      });

      await parseMIDIFile(demoFile);
    } catch (error) {
      console.error("[Demo Menu] Demo MIDI load failed", error);

      midiLoaded = false;
      midiFileName = "Demo MIDI failed to load";
      midiError =
        error instanceof Error ? error.message : "Failed to load demo.mid";
    }
  }

  function playMIDI() {
    if (!midiLoaded || midiEvents.length === 0 || midiPlaying) {
      return;
    }

    // Restart from the beginning after reaching the end.
    if (midiElapsed >= midiDuration) {
      midiElapsed = 0;
      midiEventIndex = 0;
      midiProgress = 0;
      clearActiveNotes();
    }

    midiStartedAt = performance.now() - midiElapsed;
    midiPlaying = true;

    midiTimer = setInterval(() => {
      midiElapsed = performance.now() - midiStartedAt;

      while (
        midiEventIndex < midiEvents.length &&
        midiEvents[midiEventIndex].time <= midiElapsed
      ) {
        processMidiEvent(midiEvents[midiEventIndex]);
        midiEventIndex++;
      }

      midiProgress =
        midiDuration > 0
          ? Math.min(100, (midiElapsed / midiDuration) * 100)
          : 100;

      if (midiEventIndex >= midiEvents.length) {
        clearMidiTimer();

        midiPlaying = false;
        midiElapsed = midiDuration;
        midiProgress = 100;

        clearActiveNotes();

        playMIDI();
      }
    }, 5);
  }

  onMount(() => {
    void loadDemoMIDI();
  });

  onDestroy(() => {
    clearMidiTimer();
    clearActiveNotes();
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

<Pane
  theme={customizedTheme}
  position="inline"
  width={window.innerWidth < 400 ? window.innerWidth : 400}
>
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

  <Folder title="Camera">
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
    />
  </Folder>
</Pane>

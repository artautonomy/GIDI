<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { Color, SRGBColorSpace } from "three";
  import {
    Align,
    Gizmo,
    HTML,
    InstancedMesh,
    interactivity,
    OrbitControls,
    Text,
    useCursor,
  } from "@threlte/extras";

  import { Box, Flex } from "@threlte/flex";
  import { fade } from "svelte/transition";
  import { Tween } from "svelte/motion";
  import { cubicIn, cubicInOut } from "svelte/easing";
  import { MIDI } from "../stores/midiDeviceStore";
  import { Settings } from "../stores/settings";
  import { midiFileData } from "../stores/midiFileStore";
  import { createNoteLayout } from "../midi/noteLayout";
  import * as ToneMidi from "@tonejs/midi";
  import { onDestroy } from "svelte";
  import Menu from "../ui/Menu.svelte";
  import Lighting from "./Lighting.svelte";
  import Cube from "../instances/Cube.svelte";
  import Piano from "../instances/Piano.svelte";
  import Mirror from "../instances/Mirror.svelte";
  import Firework from "../instances/Firework.svelte";
  import Swirl from "../instances/Swirl.svelte";

  const { scene, camera } = $state(useThrelte());
  const { size } = useThrelte();

  type Vec3 = [number, number, number];

  type MIDIMessage = {
    note: number;
    velocity: number;
    position: {
      x: number;
      y: number;
      z: number;
    };
    scale: {
      x: number;
      y: number;
      z: number;
    };
  };

  // Final camera zoom. The intro tween animates towards this value, and the
  // Flex size is calculated for it, so the layout doesn't resize during the intro.
  const FINAL_ZOOM = 50;

  // The orthographic frustum matches the canvas size in pixels, so the visible
  // size in world units is canvasSizePx / zoom.
  const flexWidth = $derived($size.width / FINAL_ZOOM);
  const flexHeight = $derived($size.height / FINAL_ZOOM);

  let midiMessages = $state<MIDIMessage[]>([]);

  let importedPitches = $state<number[]>([]);

  const activeImportedNotes = new Map<number, Map<number, number>>();

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });

  // Imported MIDI playback timers are cleared whenever another file is loaded
  // or this scene is destroyed.
  let playbackTimeouts: ReturnType<typeof setTimeout>[] = [];

  function stopImportedMidi() {
    for (const timer of playbackTimeouts) {
      clearTimeout(timer);
    }

    playbackTimeouts = [];
    activeImportedNotes.clear();
  }

  function publishImportedLayout() {
    if (importedPitches.length === 0) return;

    const layout = createNoteLayout(
      importedPitches,
      $Settings.sceneSelected,
    ).map((note) => ({
      ...note,
      velocity: Math.max(
        0,
        ...(activeImportedNotes.get(note.note)?.values() ?? []),
      ),
    }));

    MIDI.set(layout);
  }
  function startImportedMidi(data: ArrayBuffer) {
    stopImportedMidi();

    try {
      // Namespace import supports the CommonJS/ESM packaging used by Vite.
      const Midi = (ToneMidi as any).Midi ?? (ToneMidi as any).default?.Midi;
      if (!Midi) {
        console.error("Could not load the MIDI parser from @tonejs/midi.");
        return;
      }

      const midi = new Midi(data.slice(0));
      const fileNotes = midi.tracks.flatMap((track: any) => track.notes);

      if (fileNotes.length === 0) {
        console.warn("The imported MIDI file contains no notes.");
        MIDI.set([]);
        return;
      }
      importedPitches = [];
      importedPitches = [
        ...new Set<number>(fileNotes.map((note: any) => note.midi)),
      ].sort((a, b) => a - b);

      publishImportedLayout();

      type PlaybackEvent = {
        time: number;
        type: "on" | "off";
        pitch: number;
        velocity: number;
        noteId: number;
      };

      const events: PlaybackEvent[] = [];
      let noteId = 0;

      for (const note of fileNotes) {
        const id = noteId++;
        const pitch = note.midi as number;
        const velocity = Math.max(
          1,
          Math.min(127, Math.round((note.velocity ?? 1) * 127)),
        );
        const start = Math.max(0, note.time as number);
        const end = start + Math.max(0, note.duration as number);

        events.push({ time: start, type: "on", pitch, velocity, noteId: id });
        events.push({ time: end, type: "off", pitch, velocity: 0, noteId: id });
      }

      // At identical timestamps, release old notes before starting new ones.
      events.sort((a, b) => a.time - b.time || (a.type === "off" ? -1 : 1));

      const activeNotes = new Map<number, Map<number, number>>();
      const playbackStartedAt = performance.now();

      for (const event of events) {
        const timer = setTimeout(
          () => {
            let activeForPitch = activeImportedNotes.get(event.pitch);

            if (event.type === "on") {
              if (!activeForPitch) {
                activeForPitch = new Map<number, number>();
                activeImportedNotes.set(event.pitch, activeForPitch);
              }

              activeForPitch.set(event.noteId, event.velocity);
            } else {
              activeForPitch?.delete(event.noteId);

              if (activeForPitch?.size === 0) {
                activeImportedNotes.delete(event.pitch);
              }
            }

            publishImportedLayout();
          },
          Math.max(
            0,
            event.time * 1000 - (performance.now() - playbackStartedAt),
          ),
        );

        playbackTimeouts.push(timer);
      }
    } catch (error) {
      console.error("Unable to play the imported MIDI file:", error);
    }
  }

  // The subscription fires immediately if a file was imported before this
  // scene mounted, and again whenever the importer stores a new file.
  const unsubscribeImportedMidi = midiFileData.subscribe((data) => {
    if (data) {
      startImportedMidi(data);
    }
  });

  onDestroy(() => {
    unsubscribe();
    unsubscribeImportedMidi();
    stopImportedMidi();
  });

  const { hovering, onPointerEnter, onPointerLeave } = useCursor();

  interactivity();

  let menuOpened = $state(false);

  let selected = $state($Settings.notes.colours.key);

  let cameraCord: Vec3 = $state([5, 10, 15]);

  let recordCords: Vec3[] = $state([]);

  let recordCordsTransition = new Tween(cameraCord, {
    duration: $Settings.camera.sequence.speed,
    easing: cubicInOut,
  });

  let coordIndex = 0;

  const introZoom = new Tween(0, {
    duration: 1000,
    easing: cubicIn,
  });

  const fadeIn = new Tween(0, {
    duration: 1000,
    easing: cubicIn,
  });

  fadeIn.target = 85;
  introZoom.target = FINAL_ZOOM;

  function openMenu() {
    selected = $Settings.notes.colours.key;

    menuOpened = !menuOpened;

    $Settings.edit = true;
  }

  function onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "e":
        openMenu();
        break;

      case "r":
        toggleRecordingCoords();
        break;

      case " ":
        animateCamera();
        break;

      case "x":
        $Settings.camera.sequence.reset = true;
        break;
    }
  }

  $effect(() => {
    if ($Settings.camera.sequence.reset) {
      //tips = "Recording reset";

      recordCords = [];

      recordCordsTransition.target = cameraCord;

      setTimeout(() => {
        $Settings.camera.sequence.reset = false;
      }, 1000);
    }
  });

  $effect(() => {
    if ($Settings.camera.sequence.playing) {
      animateCamera();
    }
  });

  $effect(() => {
    if (!scene) return;

    const { r, g, b } = $Settings.scene.colours.background;
    scene.background = new Color().setRGB(
      r / 255,
      g / 255,
      b / 255,
      SRGBColorSpace,
    );

    if ($hovering) {
      selected = {
        r: 255 - $Settings.scene.colours.background.r,
        g: 255 - $Settings.scene.colours.background.g,
        b: 255 - $Settings.scene.colours.background.b,
      };
    } else {
      selected = $Settings.notes.colours.key;
    }
  });

  $effect(() => {
    const style = $Settings.sceneSelected;

    const pitches = importedPitches;

    if (pitches.length > 0) {
      // Depend on the selected style so the layout rebuilds when it changes.
      void style;
      publishImportedLayout();
    }
  });

  async function animateCamera() {
    //if sequence recorded
    if (recordCords.length > 0) {
      //note down
      if ($Settings.camera.sequence.selected == "Note down") {
        //if note playing
        if (midiMessages.filter((note) => note.velocity > 0).length > 0) {
          recordCordsTransition.set(recordCords[coordIndex], {
            duration: $Settings.camera.sequence.speed,
          });

          if (coordIndex >= recordCords.length - 1) {
            coordIndex = 0;
          } else {
            coordIndex++;
          }
        }
      }
      //time
      else {
        while (
          $Settings.camera.sequence.selected == "Time interval" &&
          $Settings.camera.sequence.playing
        ) {
          await recordCordsTransition.set(recordCords[coordIndex], {
            duration: $Settings.camera.sequence.speed,
          });

          if (coordIndex >= recordCords.length - 1) {
            coordIndex = 0;
          } else {
            coordIndex++;
          }
        }
      }
    }
  }

  function toggleRecordingCoords() {
    $Settings.camera.sequence.recording = !$Settings.camera.sequence.recording;

    if ($Settings.camera.sequence.selected == "Note down") {
      $Settings.camera.sequence.playing = true;
    }
  }

  function recordEndCoords() {
    if ($Settings.camera.sequence.recording) {
      //tips = "Step " + (recordCords.length + 1) + " captured";

      recordCords = [
        ...recordCords,
        [
          camera.current.position.clone().x,
          camera.current.position.clone().y,
          camera.current.position.clone().z,
        ],
      ];
    }
  }
</script>

<Lighting />

<T.OrthographicCamera
  makeDefault
  position={recordCordsTransition.current}
  near={0.001}
  far={5000}
  zoom={introZoom.current}
>
  <OrbitControls
    enableDamping
    autoRotate={$Settings.camera.autoRotate.enabled}
    autoRotateSpeed={$Settings.camera.autoRotate.speed}
    onend={recordEndCoords}
  >
    {#if $Settings.scene.gizmo}
      <Gizmo speed={0.75} size={fadeIn.current} />
    {/if}
  </OrbitControls>
</T.OrthographicCamera>

{#if menuOpened}
  <Menu />
{/if}

<Flex width={flexWidth} height={flexHeight} flexDirection="Column">
  <Box flex={2} width="100%" height="100%">
    <Align y={false} auto>
      <T.Group
        position.y={-2.5}
        onpointerenter={onPointerEnter}
        onpointerleave={onPointerLeave}
        onclick={(e: Event) => {
          e.stopPropagation();
          openMenu();
        }}
      >
        <InstancedMesh>
          <T.BoxGeometry />
          <T.MeshStandardMaterial shadow roughness={0.4} metalness={0.7} />

          {#each midiMessages as noteNumber}
            {#if $Settings.sceneSelected == "Cube"}
              <Cube
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$hovering ? 250 : $Settings.notes.attack}
                release={$hovering ? 250 : $Settings.notes.release}
                keyColour={selected}
                expressionColour={$Settings.notes.colours.expression}
              />
            {:else if $Settings.sceneSelected == "Piano"}
              <Piano
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$hovering ? 250 : $Settings.notes.attack}
                release={$hovering ? 250 : $Settings.notes.release}
                keyColour={selected}
                expressionColour={$Settings.notes.colours.expression}
              />
            {:else if $Settings.sceneSelected == "Mirror"}
              <Mirror
                position={noteNumber.position}
                scale={noteNumber.scale}
                velocity={noteNumber.velocity}
                attack={$hovering ? 250 : $Settings.notes.attack}
                release={$hovering ? 250 : $Settings.notes.release}
                keyColour={selected}
                expressionColour={$Settings.notes.colours.expression}
              />
            {/if}
          {/each}
        </InstancedMesh>

        {#each midiMessages as noteNumber}
          {#if $Settings.sceneSelected === "Swirl"}
            <Swirl
              position={noteNumber.position}
              scale={noteNumber.scale}
              velocity={noteNumber.velocity}
              attack={$Settings.notes.attack}
              release={$Settings.notes.release}
              keyColour={selected}
              expressionColour={$Settings.notes.colours.expression}
            />
          {:else if $Settings.sceneSelected == "Firework"}
            <Firework
              position={noteNumber.position}
              scale={noteNumber.scale}
              velocity={noteNumber.velocity}
              attack={$hovering ? 250 : $Settings.notes.attack}
              release={$hovering ? 250 : $Settings.notes.release}
              keyColour={selected}
              expressionColour={$Settings.notes.colours.expression}
            />
          {/if}
        {/each}
      </T.Group>
    </Align>
  </Box>
</Flex>

<svelte:window on:keydown|preventDefault={onKeyDown} />

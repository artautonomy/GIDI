<script lang="ts">
  import { derived } from "svelte/store";
  import { Settings } from "$lib/stores/settings";
  import { MIDI } from "$lib/stores/midiDeviceStore";
  import { MIDIPlayback } from "./midiPlayback";
  import { createNoteLayout, type MIDIVisualNote } from "./noteLayout";

  // `$Settings.sceneSelected` would subscribe to the WHOLE Settings store and
  // re-run this effect on every Settings mutation. A derived store only emits
  // when the scene name itself changes.
  const sceneSelected = derived(
    Settings,
    ($settings) => $settings.sceneSelected,
  );

  let visualLayout: MIDIVisualNote[] = [];

  let previousPitchKey = "";
  let previousScene = "";

  // True only while this component owns the MIDI store (a file is playing).
  let publishing = false;

  $effect(() => {
    const { pitches, activeVelocities } = $MIDIPlayback;
    const scene = $sceneSelected;

    // Nothing is playing back: leave the MIDI store to the live input
    // (MIDI Read). Previously this branch still called MIDI.set([]), which
    // wiped live notes on every unrelated Settings change.
    if (pitches.length === 0) {
      if (publishing) {
        publishing = false;
        visualLayout = [];
        previousPitchKey = "";
        previousScene = "";
        MIDI.set([]);
      }
      return;
    }

    publishing = true;

    const pitchKey = [...new Set(pitches)].sort((a, b) => a - b).join(",");

    // Don't rebuild geometry every time a note velocity changes.
    if (pitchKey !== previousPitchKey || scene !== previousScene) {
      previousPitchKey = pitchKey;
      previousScene = scene;

      visualLayout = createNoteLayout(pitches, scene);
    }

    visualLayout = visualLayout.map((note) => {
      const velocity = activeVelocities[note.note] ?? 0;
      return note.velocity === velocity ? note : { ...note, velocity };
    });

    MIDI.set(visualLayout);
  });
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import Ui from "./UI.svelte";

  let midiAccess;
  let inputs = [];
  let notes: { note: number; velocity: number }[] = $state([]);

  function clearNotes() {
    notes = [];
  }

  const handleMIDIMessage = (message) => {
    const note = message.data[1];
    const velocity = message.data[2];
    // Check if the note already exists in the notes array
    const noteExists = notes.some((key) => key.note === note);

    if (!noteExists) {
      // If note does not exist, add it to the notes array
      notes = [...notes, { note, velocity }];
    } else {
      // If note exists, update the velocity
      notes = notes.map((key) => {
        if (key.note === note) {
          return { note, velocity };
        }
        return key;
      });
    }
  };

  onMount(async () => {
    if (navigator.requestMIDIAccess) {
      try {
        midiAccess = await navigator.requestMIDIAccess();
        inputs = Array.from(midiAccess.inputs.values());
        inputs.forEach((input) => (input.onmidimessage = handleMIDIMessage));
      } catch (err) {
        console.error("Failed to get MIDI access", err);
      }
    } else {
      console.error("Web MIDI API not supported in this browser.");
    }
  });
</script>

<Ui keys={notes} on:remap={clearNotes} />

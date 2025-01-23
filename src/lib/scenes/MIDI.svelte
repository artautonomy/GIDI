<script lang="ts">
  import { onMount } from "svelte";
  import { MIDI, Settings } from "$lib/store";
  let notes: {
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
  }[] = $state([]);

  let midiAccess;
  let inputs = [];

  $effect(() => {
    if ($Settings.reset) {
      notes = [];
      MIDI.set(notes);
      $Settings.reset = false;
    }
  });
  const handleMIDIMessage = (message: MIDIMessageEvent) => {
    if (message.data) {
      const note = message.data[1];
      const velocity = message.data[2];
      // Check if the note already exists in the notes array
      const noteExists = notes.some((key) => key.note === note);

      if (!noteExists) {
        if ($Settings.scene !== "Piano") {
          // If note does not exist, add it to the notes array
          notes = [
            ...notes,
            {
              note,
              velocity,
              position: { x: notes.length, y: 0, z: 0 },
              scale: { x: 1, y: 1, z: 1 },
            },
          ];
        } else {
          let positionX = 0;
          let positionY = 0;
          let positionZ = 0;
          let scaleX = 1;
          let scaleY = 1;
          let scaleZ = 1;

          let lastMessage = note;

          const keyboardNotes = [
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B",
          ];

          const noteName = keyboardNotes[note % 12];

          if (noteName.includes("#")) {
            positionX = 1.5;
            positionY = 1;
          }

          notes = [
            ...notes,
            {
              note: note,
              velocity: 0,
              position: { x: notes.length, y: positionY, z: 0 },
              scale: { x: scaleX, y: scaleY, z: scaleZ },
            },
          ];

          notes = notes.toSorted((a, b) => a.note - b.note);

          notes.forEach((message) => {
            //if note is more a semitone
            if (message.note - lastMessage > 1) {
              for (let i = lastMessage; i < message.note; i++) {
                if (!notes.some((message) => message.note === i)) {
                  //map notes missed
                  notes = [
                    ...notes,
                    {
                      note: i,
                      velocity: 0,
                      position: {
                        x: notes.length + positionX,
                        y: positionY,
                        z: 0,
                      },
                      scale: { x: scaleX, y: scaleY, z: scaleZ },
                    },
                  ];
                }
              }
            }

            lastMessage = message.note;
          });
          notes = notes.toSorted((a, b) => a.note - b.note);
        }
      } else {
        // If note exists, update the velocity
        notes = notes.map((key) => {
          if (key.note === note) {
            return {
              note,
              velocity,
              position: {
                x: key.position.x,
                y: key.position.y,
                z: key.position.z,
              },
              scale: { x: key.scale.x, y: key.scale.y, z: key.scale.z },
            };
          }
          return key;
        });
      }

      MIDI.set(notes);
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

<!-- <Ui keys={notes} on:remap={clearNotes} /> -->

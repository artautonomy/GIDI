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
      console.log(keyboardNotes[note % 12]);
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

          //if first note
          if (notes.length < 1) {
            const noteName = keyboardNotes[note % 12];

            const noteFound = notes.some((item) => item.note === note);

            if (!noteFound) {
              if (noteName.includes("#")) {
                positionX = 0.5;
                positionY = 1;
                scaleX = 0.5;
              } else {
                positionX = 0;
                positionY = 0;
                scaleX = 1;
              }
              //map notes missed
              notes = [
                ...notes,
                {
                  note: note,
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
          } else {
            const offset = notes[0].note < note ? notes[0].note : note;

            const endNoteIndex =
              notes[notes.length - 1].note > note
                ? notes[notes.length - 1].note - offset
                : note - offset;

            const octave = 0;

            notes = [];

            for (let index = 0; index <= endNoteIndex; index++) {
              //console.log(note, noteFound, index + offset);
              const noteName = keyboardNotes[(index + offset) % 12];

              if (noteName.includes("#")) {
                positionY = 0.75;
                positionZ = -0.5;
                scaleX = 0.5;
                scaleY = 0.5;
                scaleZ = 2;
              } else {
                positionY = 0;
                positionZ = 0;
                scaleX = 1;
                scaleY = 1;
                scaleZ = 3;
              }

              //map notes missed
              notes = [
                ...notes,
                {
                  note: index + offset,
                  velocity: 0,
                  position: {
                    x: index + positionX,
                    y: positionY,
                    z: positionZ,
                  },
                  scale: { x: scaleX, y: scaleY, z: scaleZ },
                },
              ];
            }
          }

          let whiteKeys = notes.filter((key) => key.scale.x === 1);
          let blackKeys = notes.filter((key) => key.scale.x === 0.5);

          whiteKeys = whiteKeys.map((key, index) => {
            return {
              note: key.note,
              velocity: key.velocity,
              position: {
                x: index,
                y: key.position.y,
                z: key.position.z,
              },
              scale: { x: key.scale.x, y: key.scale.y, z: key.scale.z },
            };
          });

          blackKeys = blackKeys.map((key, index) => {
            const noteName = keyboardNotes[key.note % 12];
            let offset = 0;
            if (noteName === "F#" || noteName === "G#" || noteName === "A#") {
              offset = 1.5;
            } else {
              offset = 0.5;
            }

            return {
              note: key.note,
              velocity: key.velocity,
              position: {
                x: index + offset,
                y: key.position.y,
                z: key.position.z,
              },
              scale: { x: key.scale.x, y: key.scale.y, z: key.scale.z },
            };
          });

          notes = [...whiteKeys, ...blackKeys];

          notes = notes.toSorted((a, b) => a.note - b.note);

          console.log(notes);
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

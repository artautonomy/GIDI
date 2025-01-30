<script lang="ts">
  import { onMount } from "svelte";
  import { MIDI, Device, Settings } from "$lib/store";

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

  let pianoNotes: {
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

  let padNotes: {
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

  let midiAccess: WebMidi.MIDIAccess | null = null;
  let inputs: WebMidi.MIDIInput[] = [];

  $effect(() => {
    if ($Settings.remap) {
      pianoNotes = [];
      padNotes = [];
      notes = [];
      MIDI.set(notes);
      $Settings.remap = false;
    }

    if ($Settings.styleReset) {
      if ($Settings.scene !== "Piano") {
        if (padNotes.length < 1) {
          padNotes = [
            ...padNotes,
            {
              note: notes[0].note,
              velocity: notes[0].velocity,
              position: { x: padNotes.length, y: 0, z: 0 },
              scale: { x: 1, y: 1, z: 1 },
            },
          ];
        }
        notes = padNotes;
      } else {
        notes = pianoNotes;
      }

      MIDI.set(notes);

      $Settings.styleReset = false;
    }
  });

  const handleMIDIMessage = (message: MIDIMessageEvent, device: string) => {
    //if MIDI data
    if (message.data) {
      //Selecting devices
      if ($Device.input.id.length < 1) {
        const velocity = message.data[2];

        //update velocity for Inputs page
        $Device.inputs = $Device.inputs.map((key) => {
          if (key.id === device) {
            return {
              id: key.id,
              name: key.name,
              velocity: velocity,
            };
          }
          return key;
        });
      }
      //Device selected
      else {
        if (device === $Device.input.id) {
          const note = message.data[1];
          const velocity = message.data[2];
          let noteExists;

          if ($Settings.scene !== "Piano") {
            noteExists = padNotes.some((key) => key.note === note);
          } else {
            noteExists = pianoNotes.some((key) => key.note === note);
          }

          // Check if the note already exists in the notes array
          if (!noteExists) {
            if ($Settings.scene !== "Piano") {
              // If note does not exist, add it to the notes array
              padNotes = [
                ...padNotes,
                {
                  note,
                  velocity,
                  position: { x: padNotes.length, y: 0, z: 0 },
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
              if (pianoNotes.length < 1) {
                const noteName = keyboardNotes[note % 12];

                const noteFound = pianoNotes.some((item) => item.note === note);

                if (!noteFound) {
                  if (noteName.includes("#")) {
                    positionY = 0.75;
                    positionZ = -0.5;
                    scaleX = 0.5;
                    scaleY = 0.5;
                    scaleZ = 2;
                  } else {
                    positionY = 0;
                    positionZ = -1;
                    scaleX = 1;
                    scaleY = 1;
                    scaleZ = 3;
                  }
                  //map pianoNotes missed
                  pianoNotes = [
                    ...pianoNotes,
                    {
                      note: note,
                      velocity: 0,
                      position: {
                        x: pianoNotes.length,
                        y: positionY,
                        z: -1,
                      },
                      scale: { x: scaleX, y: scaleY, z: scaleZ },
                    },
                  ];
                }
              } else {
                const offset =
                  pianoNotes[0].note < note ? pianoNotes[0].note : note;

                const endNoteIndex =
                  pianoNotes[pianoNotes.length - 1].note > note
                    ? pianoNotes[pianoNotes.length - 1].note - offset
                    : note - offset;

                pianoNotes = [];

                const firstNoteName = keyboardNotes[offset % 12];

                let whiteNote:
                  | {
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
                    }
                  | undefined;

                let offsetWhiteKeys = 0;

                let offsetBlackKey = 0;

                for (let index = 0; index <= endNoteIndex; index++) {
                  //console.log(note, noteFound, index + offset);
                  const noteName = keyboardNotes[(index + offset) % 12];

                  if (noteName.includes("#")) {
                    positionY = 0.75;
                    positionZ = -1.5;
                    scaleX = 0.5;
                    scaleY = 0.5;
                    scaleZ = 2;
                  } else {
                    positionY = 0;
                    positionZ = -1;
                    scaleX = 1;
                    scaleY = 1;
                    scaleZ = 3;
                  }

                  //map pianoNotes missed
                  pianoNotes = [
                    ...pianoNotes,
                    {
                      note: index + offset,
                      velocity: 0,
                      position: {
                        x: index,
                        y: positionY,
                        z: positionZ,
                      },
                      scale: { x: scaleX, y: scaleY, z: scaleZ },
                    },
                  ];
                }

                if (firstNoteName.includes("#")) {
                  offsetWhiteKeys = 1;
                }

                let whiteKeys = pianoNotes.filter((key) => key.scale.x === 1);
                let blackKeys = pianoNotes.filter((key) => key.scale.x === 0.5);

                whiteKeys = whiteKeys.map((key, index) => {
                  return {
                    device,
                    note: key.note,
                    velocity: key.velocity,
                    position: {
                      x: index + offsetWhiteKeys,
                      y: key.position.y,
                      z: key.position.z,
                    },
                    scale: { x: key.scale.x, y: key.scale.y, z: key.scale.z },
                  };
                });

                blackKeys = blackKeys.map((key, index) => {
                  //if first note white
                  if (!firstNoteName.includes("#")) {
                    whiteNote = whiteKeys.find(
                      (element) => element.note === key.note - 1
                    );

                    offsetBlackKey = whiteNote.position.x + 0.5;
                  } else {
                    if (index === 0) {
                      offsetBlackKey = 0.5;
                    } else {
                      whiteNote = whiteKeys.find(
                        (element) => element.note === key.note - 1
                      );

                      offsetBlackKey = whiteNote.position.x + 0.5;
                    }
                  }

                  return {
                    device,
                    note: key.note,
                    velocity: key.velocity,
                    position: {
                      x: offsetBlackKey,
                      y: key.position.y,
                      z: key.position.z,
                    },
                    scale: { x: key.scale.x, y: key.scale.y, z: key.scale.z },
                  };
                });

                pianoNotes = [...whiteKeys, ...blackKeys];

                pianoNotes = pianoNotes.toSorted((a, b) => a.note - b.note);
              }
            }
          } else {
            if ($Settings.scene !== "Piano") {
              padNotes = padNotes.map((key) => {
                if (key.note === note) {
                  return {
                    device,
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
            } else {
              // If note exists, update the velocity
              pianoNotes = pianoNotes.map((key) => {
                if (key.note === note) {
                  return {
                    device,
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
          }

          if ($Settings.scene !== "Piano") {
            notes = padNotes;
          } else {
            notes = pianoNotes;
          }

          MIDI.set(notes);
        }
      }
    }
  };

  function setupMIDIInputs() {
    inputs = Array.from(midiAccess.inputs.values());

    //temp fix, typescript initialising needs to be improved
    $Device.inputs.pop();

    inputs.forEach((input: WebMidi.MIDIInput) => {
      const isDeviceAdded = $Device.inputs.some((item) => item.id === input.id);

      if (!isDeviceAdded) {
        $Device.inputs.push({ id: input.id, name: input.name, velocity: 0 });
      }

      input.onmidimessage = (event) => handleMIDIMessage(event, input.id);
    });

    if (inputs.length > 0) {
      $Device.connected = true;
    } else {
      $Device.connected = false;
    }
  }

  onMount(async () => {
    if (!navigator.requestMIDIAccess) {
      console.error("Web MIDI API not supported in this browser.");
      return;
    }

    try {
      midiAccess = await navigator.requestMIDIAccess({ sysex: true });

      setupMIDIInputs();

      midiAccess.onstatechange = (event: WebMidi.MIDIConnectionEvent) => {
        setupMIDIInputs();
      };
    } catch (err) {
      console.error("Failed to get MIDI access", err);
    }
  });
</script>

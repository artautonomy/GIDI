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

  let inputs: WebMidi.MIDIInput[] = [];

  let noteExists;

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

  $effect(() => {
    if ($Settings.notes.remap) {
      pianoNotes = [];
      padNotes = [];
      notes = [];
      MIDI.set(notes);
      $Settings.notes.remap = false;
    }

    if ($Settings.styleReset) {
      if ($Settings.sceneSelected == "Piano") {
        notes = pianoNotes;
      } else {
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
      }

      MIDI.set(notes);

      $Settings.styleReset = false;
    }
  });

  const handleMIDIMessage = (message: MIDIMessageEvent, device: string) => {
    const status = message.data[0];
    const note = message.data[1];
    let velocity = message.data[2];

    //if MIDI data and no program change, pitch bend recognised
    if (
      note !== null &&
      velocity !== null &&
      (status === 128 || status === 144)
    ) {
      //if note off
      if (status === 128) {
        velocity = 0;
      }

      //Device selected
      if ($Device.selected && $Device.id == device) {
        if ($Settings.sceneSelected !== "Piano") {
          noteExists = padNotes.some((key) => key.note === note);
        } else {
          noteExists = pianoNotes.some((key) => key.note === note);
        }

        // Check if the note already exists in the notes array
        if (!noteExists) {
          if ($Settings.sceneSelected !== "Piano") {
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

              for (let index = 0; index <= endNoteIndex; index++) {
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
        }
        // If note exists, update the velocity
        else {
          if ($Settings.sceneSelected == "Piano") {
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
          } else {
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
          }
        }

        if ($Settings.sceneSelected == "Piano") {
          notes = pianoNotes;
        } else {
          notes = padNotes;
        }

        MIDI.set(notes);
      }
      //Selecting devices
      else {
        //update velocity for Inputs page
        $Device.inputs = $Device.inputs.map((input) => {
          if (input.id === device) {
            return {
              id: input.id,
              name: input.name,
              velocity: velocity,
            };
          }
          return input;
        });
      }
    }
  };

  function setupMIDIInputs(midiAccess: WebMidi.MIDIAccess | null) {
    inputs = Array.from(midiAccess.inputs.values());

    if (inputs.length > 0) {
      $Device.connected = true;
    } else {
      $Device.connected = false;
    }

    inputs.forEach((input: WebMidi.MIDIInput) => {
      const isDeviceAdded = $Device.inputs.some((item) => item.id === input.id);

      if (!isDeviceAdded) {
        $Device.inputs.push({ id: input.id, name: input.name, velocity: 0 });
      }

      input.onmidimessage = (event) => handleMIDIMessage(event, input.id);
    });
  }

  onMount(async () => {
    if (!navigator.requestMIDIAccess) {
      console.error("Web MIDI API not supported in this browser.");
      return;
    }

    try {
      const midiAccess = await navigator.requestMIDIAccess();

      setTimeout(() => {
        setupMIDIInputs(midiAccess);
      }, 1750);

      midiAccess.onstatechange = (event: WebMidi.MIDIConnectionEvent) => {
        setupMIDIInputs(midiAccess);
      };

      $Device.accessRights = "Allow";
    } catch (err) {
      console.error("Failed to get MIDI access", err);
      $Device.accessRights = "Deny";
    }
  });
</script>

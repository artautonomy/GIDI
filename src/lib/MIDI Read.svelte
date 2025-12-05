<script lang="ts">
  import { onMount } from "svelte";
  import { Map, MIDI, Device, Settings, storeMIDIPermission } from "$lib/store";

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
      if ($Settings.sceneSelected === "Piano") {
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

  function handleMIDIStatus(status: number, note: number) {
    switch (status) {
      //note off channels
      case 128:
        return note;
      case 129:
        return 62;
      case 130:
        return 63;
      case 131:
        return 64;
      case 132:
        return 65;
      case 133:
        return 66;
      case 134:
        return 67;
      case 135:
        return 68;
      case 136:
        return 69;
      case 137:
        return 70;
      case 138:
        return 71;
      case 139:
        return 72;
      case 140:
        return 73;
      case 141:
        return 74;
      case 142:
        return 75;
      case 143:
        return 76;

      //note on channels
      case 144:
        return note;
      case 145:
        return 62;
      case 146:
        return 63;
      case 147:
        return 64;
      case 148:
        return 65;
      case 149:
        return 66;
      case 150:
        return 67;
      case 151:
        return 68;
      case 152:
        return 69;
      case 153:
        return 70;
      case 154:
        return 71;
      case 155:
        return 72;
      case 156:
        return 73;
      case 157:
        return 74;
      case 158:
        return 75;
      case 159:
        return 76;

      default:
        return note;
    }
  }

  const handleMIDIMessage = (message: MIDIMessageEvent, device: string) => {
    const status = message.data[0];
    let note = message.data[1];
    const velocity = message.data[2];

    //if usable MIDI data
    if (
      note !== null &&
      velocity !== null &&
      note !== undefined &&
      velocity !== undefined
    ) {
      //if only note one and off
      if (status >= 128 && status <= 159) {
        note = handleMIDIStatus(status, note);

        //Device selected

        //testing new styles
        $Device.selected = true;
        //if ($Device.selected && $Device.id == device) {

        if ($Device.selected) {
          //piano
          if ($Settings.sceneSelected === "Piano") {
            noteExists = pianoNotes.some((key) => key.note === note);

            if (noteExists) {
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

            notes = pianoNotes;
          }
          //pads
          else {
            noteExists = padNotes.some((key) => key.note === note);

            if (noteExists) {
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
            }

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
      //if program changes
      else {
        const channelExists = $Map.inputs.some((key) => key.id === status);

        if (channelExists) {
          $Map.inputs = $Map.inputs.map((key) =>
            key.id === status ? { ...key, value: velocity } : key
          );

          const getChannel = $Map.inputs.find((key) => key.id === status);

          switch (getChannel?.setting) {
            case "rise":
              $Settings.notes.attack = velocity * 31.496063;
              break;

            case "fall":
              $Settings.notes.release = velocity * 31.496063;
              break;

            case "autorotate":
              $Settings.camera.autoRotate.enabled =
                velocity == 127 ? true : false;
              break;

            case "frontLight":
              $Settings.scene.lighting.front = velocity * 0.0401574803;
              break;

            case "sideLight":
              $Settings.scene.lighting.side = velocity * 0.0401574803;
              break;

            case "aboveLight":
              $Settings.scene.lighting.above = velocity * 0.0401574803;
              break;

            case "sequenceStepSpeed":
              $Settings.camera.sequence.speed = velocity * 31.496063;
              break;
          }
        } else {
          // If channel does not exist, add it to the channel array
          $Map.inputs = [
            ...$Map.inputs,
            {
              setting: null,
              id: status,
              value: velocity,
            },
          ];
        }
      }
    }
  };

  function setupMIDIInputs(midiAccess: WebMidi.MIDIAccess) {
    inputs = Array.from(midiAccess.inputs.values());

    if (inputs.length > 0) {
      setTimeout(() => {
        $Device.connected = true;
      }, 350);
    }

    inputs.forEach((input: WebMidi.MIDIInput) => {
      const isDeviceAdded = $Device.inputs.some((item) => item.id === input.id);

      if (!isDeviceAdded) {
        $Device.inputs.push({ id: input.id, name: input.name, velocity: 0 });
      }

      input.onmidimessage = (event) => handleMIDIMessage(event, input.id);
    });
  }
  let init = async () => {
    try {
      let midiAccess: WebMidi.MIDIAccess | null = null;

      midiAccess = await navigator.requestMIDIAccess();

      storeMIDIPermission("Allow");

      setupMIDIInputs(midiAccess);

      midiAccess.onstatechange = () => setupMIDIInputs(midiAccess);
    } catch (err) {
      storeMIDIPermission("Deny");

      console.error("Failed to get MIDI", err);
    }
  };

  onMount(() => {
    init();
  });

  $effect(() => {
    if ($Device.enableSearch) {
      init();

      $Device.enableSearch = false;
    }
  });
</script>

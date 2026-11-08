<script lang="ts">
  import { onMount, onDestroy, untrack } from "svelte";

  import { Settings } from "$lib/stores/settings";
  import {
    MIDI,
    Device,
    MIDIChannels,
    storeMIDIPermission,
  } from "$lib/stores/midiDeviceStore";
  import {
    createNoteLayout,
    setNoteVelocity,
    type MIDIVisualNote,
  } from "./noteLayout";

  // The notes currently shown, laid out for the selected style.
  let notes: MIDIVisualNote[] = $state([]);

  // The style `notes` was laid out for. If this ever differs from the selected
  // style, `notes` is stale and must be rebuilt before it is published.
  let notesScene = "";

  // Style-independent record of what has been played. Every style is built
  // from this, so switching styles shows the same notes in the new layout
  // instead of an empty list.
  let playedPitches: number[] = [];
  let activeVelocities: Record<number, number> = {};

  let inputs: MIDIInput[] = [];
  let midiAccess: MIDIAccess | undefined;

  function handleMIDIStatus(status: number, note: number) {
    switch (status) {
      // Note-off channels
      case 128:
      case 144:
        return note;
      case 129:
      case 145:
        return 62;
      case 130:
      case 146:
        return 63;
      case 131:
      case 147:
        return 64;
      case 132:
      case 148:
        return 65;
      case 133:
      case 149:
        return 66;
      case 134:
      case 150:
        return 67;
      case 135:
      case 151:
        return 68;
      case 136:
      case 152:
        return 69;
      case 137:
      case 153:
        return 70;
      case 138:
      case 154:
        return 71;
      case 139:
      case 155:
        return 72;
      case 140:
      case 156:
        return 73;
      case 141:
      case 157:
        return 74;
      case 142:
      case 158:
        return 75;
      case 143:
      case 159:
        return 76;
      default:
        return note;
    }
  }

  // Lay out everything played so far for the given style, keeping the
  // velocities of any notes that are currently held.
  function buildNotes(scene: string): MIDIVisualNote[] {
    notesScene = scene;

    return createNoteLayout(playedPitches, scene).map((note) => ({
      ...note,
      velocity: activeVelocities[note.note] ?? 0,
    }));
  }

  function updateLiveNote(pitch: number, velocity: number) {
    const scene = $Settings.sceneSelected;
    const known = playedPitches.includes(pitch);
    const existing = notes.some((note) => note.note === pitch);

    // Don't create new keys for note-off events.
    if (!known && !existing && velocity === 0) return;

    if (velocity > 0) {
      activeVelocities[pitch] = velocity;
    } else {
      delete activeVelocities[pitch];
    }

    if (!known) {
      playedPitches = [...playedPitches, pitch];
    }

    if (!existing || notesScene !== scene) {
      // New note, or the style changed since `notes` was built: re-layout
      // (Piano fills in the keys between the extremes). This also applies the
      // new velocity, because activeVelocities was updated above.
      notes = buildNotes(scene);
    } else {
      notes = setNoteVelocity(notes, pitch, velocity);
    }

    MIDI.set(notes);
  }

  function handleMIDIMessage(message: MIDIMessageEvent, device: string) {
    const status = message.data[0];
    let note = message.data[1];
    const velocity = message.data[2];

    if (status === undefined || note === undefined || velocity === undefined) {
      return;
    }

    // Note on and note off messages.
    if (status >= 128 && status <= 159) {
      note = handleMIDIStatus(status, note);

      // A note-on message with velocity zero is also note-off.
      const isNoteOn = status >= 144 && velocity > 0;
      updateLiveNote(note, isNoteOn ? velocity : 0);

      return;
    }

    // Controller/program-style messages mapped to settings.
    const channelExists = $MIDIChannels.inputs.some((key) => key.id === status);

    if (channelExists) {
      $MIDIChannels.inputs = $MIDIChannels.inputs.map((key) =>
        key.id === status ? { ...key, value: velocity } : key,
      );

      const channel = $MIDIChannels.inputs.find((key) => key.id === status);

      switch (channel?.setting) {
        case 1:
          $Settings.notes.attack = velocity * 31.496063;
          break;
        case 2:
          $Settings.notes.release = velocity * 31.496063;
          break;
        case 3:
          $Settings.camera.autoRotate.enabled = velocity === 127;
          break;
        case 4:
          $Settings.scene.lighting.front = velocity * 0.015748031;
          break;
        case 5:
          $Settings.scene.lighting.side = velocity * 0.015748031;
          break;
        case 6:
          $Settings.scene.lighting.above = velocity * 0.015748031;
          break;
        case 7:
          $Settings.camera.sequence.speed = velocity * 31.496063;
          break;
      }
    } else {
      $MIDIChannels.inputs = [
        ...$MIDIChannels.inputs,
        { setting: null, id: status, value: velocity },
      ];
    }
  }

  function setupMIDIInputs(access: MIDIAccess) {
    inputs = Array.from(access.inputs.values());

    if (inputs.length > 0) {
      setTimeout(() => {
        $Device.connected = true;
      }, 350);
    } else {
      $Device.connected = false;
    }

    //process all MIDI messages
    for (const input of inputs) {
      input.onmidimessage = (event) => handleMIDIMessage(event, input.id);
    }
  }

  async function init() {
    try {
      if (!midiAccess) {
        midiAccess = await navigator.requestMIDIAccess();
        midiAccess.onstatechange = () => {
          if (midiAccess) setupMIDIInputs(midiAccess);
        };
      }

      storeMIDIPermission("Allow");
      setupMIDIInputs(midiAccess);
    } catch (err) {
      storeMIDIPermission("Deny");
      console.error("Failed to get MIDI", err);
    }
  }

  $effect(() => {
    if ($Settings.notes.remap) {
      playedPitches = [];
      activeVelocities = {};
      notes = [];
      notesScene = "";
      $MIDIChannels.inputs = [];
      MIDI.set([]);

      $Settings.notes.remap = false;
    }
  });

  // Style changed: rebuild the same played notes in the new style's layout.
  // This depends on the selected style itself rather than only on the
  // `styleReset` flag, so the layout can't be left behind if the flag is set
  // and consumed before the style actually changes.
  $effect(() => {
    const scene = $Settings.sceneSelected;

    untrack(() => {
      // Nothing played live yet (e.g. an imported file is driving the scene).
      if (playedPitches.length === 0) return;

      notes = buildNotes(scene);
      MIDI.set(notes);
    });
  });

  // Keep clearing the flag so other code that sets it still works.
  $effect(() => {
    if ($Settings.styleReset) {
      if (playedPitches.length > 0) {
        notes = buildNotes($Settings.sceneSelected);
        MIDI.set(notes);
      }

      $Settings.styleReset = false;
    }
  });

  onMount(() => {
    init();
  });

  onDestroy(() => {
    if (midiAccess) {
      midiAccess.onstatechange = null;
    }

    for (const input of inputs) {
      input.onmidimessage = null;
    }
  });
</script>

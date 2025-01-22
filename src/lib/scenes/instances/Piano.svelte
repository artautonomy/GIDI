<script lang="ts">
  import { Instance } from "@threlte/extras";
  import { cubicOut } from "svelte/easing";
  import { Tween } from "svelte/motion";
  import { MIDI } from "$lib/store";
  import { onDestroy } from "svelte";

  interface Props {
    x: number;
    noteNumber: number;
    velocity: number;
    attack: number;
    release: number;
    keyColour: {
      r: number;
      g: number;
      b: number;
    };
    expressionColour: {
      r: number;
      g: number;
      b: number;
    };
  }

  let {
    x,
    noteNumber,
    velocity,
    attack,
    release,
    keyColour,
    expressionColour,
  }: Props = $props();

  type MIDIMessage = { note: number; velocity: number };

  let midiMessages = $state<MIDIMessage[]>([]);

  const unsubscribe = MIDI.subscribe((notes) => {
    midiMessages = notes;
  });
  onDestroy(unsubscribe);

  const y = new Tween(1);
  const scale = new Tween(1);
  const r = new Tween(keyColour.r);
  const g = new Tween(keyColour.g);
  const b = new Tween(keyColour.b);

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

  const getSharpNotes = (notes) => {
    return notes.filter((item) => {
      const noteName = keyboardNotes[item.note % 12];
      return noteName.includes("#");
    });
  };

  const getNonSharpNotes = (notes) => {
    return notes.filter((item) => {
      const noteName = keyboardNotes[item.note % 12];
      return !noteName.includes("#");
    });
  };

  const nonSharpNotes = getNonSharpNotes(midiMessages);
  const SharpNotes = getSharpNotes(midiMessages);
  console.log(nonSharpNotes);

  let xPosition = $state(
    nonSharpNotes.findIndex((note) => note.note == noteNumber)
  );

  let yPosition = $state(1);
  let zPosition = $state(0);

  const noteName = keyboardNotes[noteNumber % 12];

  if (noteName.includes("#")) {
    xPosition = SharpNotes.findIndex((note) => note.note == noteNumber) + 0.5;

    yPosition = 1.5;

    zPosition = -1;
  }

  $effect(() => {
    if (velocity > 0) {
      y.set(yPosition + velocity / 63, {
        duration: attack,
        easing: cubicOut,
      });

      scale.set(1 + (velocity / 63) * 2, {
        duration: attack,
        easing: cubicOut,
      });

      r.set(expressionColour.r, { duration: attack });
      g.set(expressionColour.g, { duration: attack });
      b.set(expressionColour.b, { duration: attack });
    } else {
      y.set(yPosition, {
        duration: release,
        easing: cubicOut,
      });
      scale.set(1, {
        duration: release,
        easing: cubicOut,
      });

      r.set(keyColour.r, { duration: release });
      g.set(keyColour.g, { duration: release });
      b.set(keyColour.b, { duration: release });
    }
  });
</script>

<Instance
  receiveShadow
  position.x={xPosition}
  position.y={y.current}
  position.z={zPosition}
  scale.z={3}
  scale.y={scale.current}
  color={`rgb(${Math.floor(r.current)},${Math.floor(g.current)},${Math.floor(b.current)})`}
/>

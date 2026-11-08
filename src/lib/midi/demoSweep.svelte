<script lang="ts">
  /**
   * Headless component (renders nothing) that plays a fake MIDI sweep up a
   * run of consecutive pitches, one note at a time, and loops forever.
   *
   *   <MIDISweep onNote={(pitch, velocity) => ...} />
   *
   * It only reports note events; the parent decides what to do with them.
   * `interval`, `startNote` and `count` are read once when the component
   * mounts. Stops and releases the held note when it is destroyed.
   */
  import { onMount } from "svelte";

  interface Props {
    /** Called for every note on (velocity 127) and note off (velocity 0). */
    onNote: (pitch: number, velocity: number) => void;
    /** Called each time the sweep wraps back to the first note. */
    onCycle?: () => void;
    /** Milliseconds each note is held. */
    interval?: number;
    /** First MIDI pitch of the sweep. */
    startNote?: number;
    /** Number of consecutive pitches in the sweep. */
    count?: number;
  }

  let {
    onNote,
    onCycle,
    interval = 350,
    startNote = 60,
    count = 12,
  }: Props = $props();

  onMount(() => {
    let index = 0;

    // Start the first note immediately.
    onNote(startNote, 127);

    const timer = setInterval(() => {
      // Turn the current note off.
      onNote(startNote + index, 0);

      // Advance through the run.
      index = (index + 1) % count;

      if (index === 0) onCycle?.();

      // Turn the next note on.
      onNote(startNote + index, 127);
    }, interval);

    return () => {
      clearInterval(timer);
      onNote(startNote + index, 0);
    };
  });
</script>

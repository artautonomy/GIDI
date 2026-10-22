
export interface MIDIVisualNote {
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

const BLACK_KEY_PITCH_CLASSES = new Set([1, 3, 6, 8, 10]);

function isBlackKey(note: number): boolean {
  return BLACK_KEY_PITCH_CLASSES.has(note % 12);
}

export function createNoteLayout(
  pitches: number[],
  scene: string,
): MIDIVisualNote[] {
  // Remove duplicate pitches.
  const uniquePitches = [...new Set(pitches)]
    .filter((pitch) => Number.isInteger(pitch) && pitch >= 0 && pitch <= 127);




  if (uniquePitches.length === 0) {
    return [];
  }


  // Piano needs every key between the lowest and highest pitches.
  if (scene === "Piano") {
    const lowest = Math.min(...uniquePitches);
    const highest = Math.max(...uniquePitches);

    const allPitches = Array.from(
      { length: highest - lowest + 1 },
      (_, index) => lowest + index,
    );


    const whitePitches = allPitches.filter(
      (pitch) => !isBlackKey(pitch),
    );

    return allPitches.map((pitch): MIDIVisualNote => {
      if (isBlackKey(pitch)) {
        const whiteKeysBefore = whitePitches.filter(
          (whitePitch) => whitePitch < pitch,
        ).length;

        return {
          note: pitch,
          velocity: 0,
          position: {
            x: Math.max(0, whiteKeysBefore - 1) + 0.5,
            y: 0.75,
            z: -1.5,
          },
          scale: {
            x: 0.5,
            y: 0.5,
            z: 2,
          },
        };
      }

      const whiteIndex = whitePitches.indexOf(pitch);

      return {
        note: pitch,
        velocity: 0,
        position: {
          x: whiteIndex,
          y: 0,
          z: -1,
        },
        scale: {
          x: 1,
          y: 1,
          z: 3,
        },
      };
    });
  }


  // Other styles use one visual object per unique pitch.
  return uniquePitches.map((pitch, index) => ({

    note: pitch,
    velocity: 0,
    position: {
      x: index,
      y: 0,
      z: 0,
    },
    scale: {
      x: 1,
      y: 1,
      z: 1,
    },
  }));
}

export function setNoteVelocity(
  notes: MIDIVisualNote[],
  pitch: number,
  velocity: number,
): MIDIVisualNote[] {
  return notes.map((note) =>
    note.note === pitch
      ? { ...note, velocity }
      : note,
  );
}

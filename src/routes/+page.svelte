<script lang="ts">
  import { fade } from "svelte/transition";
  import { Device } from "#lib/stores/midiDeviceStore.ts";
  import { Settings } from "#lib/stores/settings.ts";
  import { goto } from "$app/navigation";
  import { Canvas } from "@threlte/core";
  import Scene from "#lib/scenes/Home.svelte";
  import { onMount } from "svelte";
  import { fadeIn, fadeOut } from "#lib/stores/app.ts";
  import midiAllow from "#lib/assets/setup/midiAllow.jpg";

  const bg = $derived($Settings.scene.colours.background);
  const inv = $derived({ r: 255 - bg.r, g: 255 - bg.g, b: 255 - bg.b });

  const isLight = $derived(
    (0.2126 * inv.r + 0.7152 * inv.g + 0.0722 * inv.b) / 255 > 0.5,
  );

  // two arrow colours that always contrast with the inverted background
  const fgA = $derived(isLight ? "hsl(225 70% 22%)" : "hsl(45 90% 75%)");
  const fgB = $derived(isLight ? "hsl(345 75% 38%)" : "hsl(190 85% 70%)");

  let loaded = $state(false);

  let displayMIDIInstructions = $state(false);

  const title = "GIDI - a visualiser for MIDI";

  const summary =
    "A free web application to import or play MIDI live. GIDI reads MIDI note on/off messages to create animations on a web browser, no account required.";

  function handleMenuChoice(option: string) {
    $Settings.menuSelected = option;
    switch (option) {
      case "Play MIDI":
        if ($Device.connected) {
          setTimeout(() => {
            goto("./inputs");
          }, $fadeOut.duration);
        } else {
          displayMIDIInstructions = true;
        }
        break;

      case "Import MIDI":
        setTimeout(() => {
          goto("./import");
        }, $fadeOut.duration);

        break;

      case "Demo":
        setTimeout(() => {
          goto("./demo");
        }, $fadeOut.duration);
        break;
    }
  }

  onMount(() => {
    loaded = true;
  });
</script>

{#if loaded}
  <div class="stage" in:fade|global={$fadeIn} out:fade|global={$fadeOut}>
    <div class="canvas">
      <Canvas><Scene /></Canvas>
    </div>

    <div class="overlay">
      <main>
        <section class="landing">
          <h1>{title}</h1>
          <p class="summary">{summary}</p>

          <div class="menu">
            <button
              class="menu-button"
              onclick={() => handleMenuChoice("Play MIDI")}
            >
              <span class="button-icon">▶</span>
              <span>Play MIDI</span>
              <span class="midiStatus"
                >{$Device.connected
                  ? "(Device found)"
                  : "(No device found)"}</span
              >
            </button>

            <button
              class="menu-button"
              onclick={() => handleMenuChoice("Import MIDI")}
            >
              <span class="button-icon">↥</span>
              <span>Import MIDI</span>
            </button>

            <button
              class="menu-button"
              onclick={() => handleMenuChoice("Demo")}
            >
              <span class="button-icon">✦</span>
              <span>Demo</span>
            </button>
          </div>
        </section>
      </main>
    </div>

    {#if displayMIDIInstructions}
      <div class="guide" role="dialog" aria-labelledby="guide-title">
        <header>
          <h2 id="guide-title">Connect a MIDI instrument</h2>

          <button
            class="close"
            aria-label="Close"
            onclick={() => {
              displayMIDIInstructions = false;
            }}
            style:--bg="rgb({inv.r}, {inv.g}, {inv.b})"
            style:--fg-a={fgA}
            style:--fg-b={fgB}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <p>
          You will need to allow MIDI on your browser, a popup will appear on
          first loading GIDI by the search bar (or by clicking the setting icon
          by the URL):
        </p>

        <img
          alt="Instruction on how to allow MIDI on your browser"
          src={midiAllow}
          class="midiAllowImage"
        />

        <span class="note"
          >Do not be alarmed by the permission message, GIDI only reads MIDI
          messages. GIDI is open source, so if in doubt check for yourself <a
            href="https://github.com/artautonomy/GIDI">here</a
          >.</span
        >

        <p>
          Next connect your MIDI instrument using a USB cable to your device.
        </p>
      </div>
    {/if}
  </div>
{/if}

<style>
  button {
    cursor: pointer;
  }

  .stage {
    position: relative;
    flex: 1 1 0;
    width: 100%;
    overflow: hidden;
  }

  /* Absolute fill gives the Canvas a definite size to measure. */
  .canvas {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: grid;
    grid-template-rows: auto 1fr auto;
    box-sizing: border-box;
    min-height: 0;
    padding: 0 16px;
    color: rgba(255, 255, 255, 0.95);
    font-family: "Oxanium", sans-serif;
    pointer-events: none;
  }

  /* ... but anything interactive catches its own events. */
  .menu {
    pointer-events: auto;
  }

  main {
    align-self: start;
    justify-self: center;
    width: min(100%, 36rem);
    padding-top: clamp(16px, 8vh, 96px);
    text-align: center;
  }

  h2 {
    color: orange;
    margin: 0;
    font-size: clamp(1.7rem, 1.5vw, 2rem);
    font-weight: 600;
    letter-spacing: 0.5px;
    text-align: center;
    width: auto;
  }

  .summary {
    max-width: 60ch;
    margin: 0.75rem auto 1.5rem;
    line-height: 1.5;
    opacity: 0.9;
    display: inline-block;
  }

  .menu {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: min(100%, 22rem);
    margin-inline: auto;
  }

  .menu-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    width: 100%;
    padding: 5px;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(35, 15, 45, 0.75);
    border: 1px solid rgba(190, 100, 255, 0.25);
    border-radius: 10px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
    cursor: pointer;
    backdrop-filter: blur(12px);
    transition:
      background 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .menu-button:hover {
    background: rgba(100, 35, 125, 0.65);
    border-color: rgba(210, 130, 255, 0.8);
    box-shadow: 0 0 18px rgba(175, 70, 255, 0.15);
    transform: translateY(-2px);
  }

  .menu-button:active {
    transform: translateY(0);
  }

  .menu-button:focus-visible {
    outline: 2px solid #d98aff;
    outline-offset: 3px;
  }

  .button-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d98aff;
    font-size: 18px;
  }

  .midiStatus {
    font-size: 10px;
  }

  /* --- MIDI guide: centred inside the stage --- */
  .guide {
    position: absolute;
    z-index: 2;
    top: clamp(16px, 8%, 80px);
    left: 50%;
    transform: translateX(-50%);

    box-sizing: border-box;
    width: min(calc(100% - 32px), 34rem);
    max-height: calc(100% - 32px);
    overflow: auto;
    padding: 16px;

    background-image: linear-gradient(
      -45deg,
      #000000,
      #1b1a34,
      #a55301,
      #125124,
      #ffffff
    );
    background-size: 600% 600%;
    animation: gradientAnimation 85s infinite;
  }

  .guide header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    text-align: center;
  }

  .midiAllowImage {
    display: block;
    width: min(50%, 14rem);
    height: auto;
    margin: 12px auto;
  }

  .note {
    font-size: 11px;
    display: block;
    text-align: center;
  }

  @media (max-width: 600px) {
    h2 {
      font-size: clamp(1rem, 1vw, 2rem);
    }

    p {
      font-size: clamp(0.8rem, 1.2vw, 2rem);
    }

    .guide {
      background-image: none;
      background-color: rgba(0, 0, 0, 0.85);
      animation: none;
    }

    .midiAllowImage {
      width: 80%;
    }
  }

  @keyframes gradientAnimation {
    0% {
      background-position: 100% 90%;
    }
    50% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 90%;
    }
  }

  .close {
    display: grid;
    place-items: center;
    width: 72px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 10px;
    cursor: pointer;

    background-color: var(--bg);
    transition: background-color 0.3s ease;
  }

  .close svg {
    width: 22px;
    height: 22px;
    stroke: var(--fg-a);
    transition: transform 0.2s ease;
    animation: arrow-colour 2s ease-in-out infinite alternate;
  }

  .close:hover svg {
    transform: rotate(90deg);
  }

  .close:active {
    transform: scale(0.96);
  }

  .close:focus-visible {
    outline: 2px solid hsl(210 90% 60%);
    outline-offset: 3px;
  }

  @keyframes arrow-colour {
    from {
      stroke: var(--fg-a);
    }
    to {
      stroke: var(--fg-b);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .menu-button,
    .close {
      transition: none;
    }

    .menu-button:hover {
      transform: none;
    }

    .close svg,
    .guide {
      animation: none;
    }
  }
</style>

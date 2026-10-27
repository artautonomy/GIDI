<script lang="ts">
  import { Device } from "#lib/stores/midiDeviceStore.ts";
  import { fadeIn, fadeOut } from "#lib/stores/app.ts";
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { onDestroy } from "svelte";
  import Back from "#lib/ui/Back.svelte";

  const title = "MIDI inputs found";

  const summary = "Play a note to see an input's note on messages";

  let chosenId = $state<string | null>(null);
  let leaveTimer: ReturnType<typeof setTimeout> | undefined;

  function setupStyle(deviceID: string) {
    if (chosenId) return;

    chosenId = deviceID;

    $Device.selected = true;
    $Device.id = deviceID;

    leaveTimer = setTimeout(() => {
      goto("../style");
    }, 1500);
  }

  onDestroy(() => clearTimeout(leaveTimer));
</script>

<header class="top" in:fade|global={$fadeIn} out:fade|global={$fadeOut}>
  <Back destination={"../"}></Back>
</header>

<!-- The stage fills the space between the Back header and the footer and
     scrolls on its own if the device list is long. -->
<div class="stage">
  <main>
    <section
      class="landing"
      in:fade|global={$fadeIn}
      out:fade|global={$fadeOut}
    >
      <h1>{title}</h1>
      <p class="summary">{summary}</p>

      <div class="menu">
        {#each $Device.inputs as device (device.id)}
          <button
            in:fade|global={{ duration: 1000, delay: 500 }}
            out:fade|global={{ duration: 200 }}
            onclick={() => setupStyle(device.id)}
            class="menu-button"
            class:active={device.velocity > 0}
            class:chosen={chosenId === device.id}
          >
            <span>{device.name}</span>
          </button>
        {/each}
      </div>
    </section>
  </main>
</div>

<style>
  .top {
    flex: 0 0 auto;
  }

  .stage {
    position: relative;
    flex: 1 1 0;
    min-height: 0;
    width: 100%;
    box-sizing: border-box;
    padding: clamp(8px, 4vh, 48px) 16px 16px;
    overflow-x: hidden;
    overflow-y: auto;
    color: rgba(255, 255, 255, 0.95);
    font-family: "Oxanium", sans-serif;
  }

  main {
    width: min(100%, 36rem);
    margin-inline: auto;
    text-align: center;
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
    color: white;
    background: rgb(66, 11, 77);
    border: 1px solid rgba(190, 100, 255, 0.25);
    border-radius: 10px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition:
      background-color 180ms ease,
      color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .menu-button:hover {
    color: rgb(185, 249, 169);
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

  /* A note is currently being played on this input. */
  .menu-button.active,
  .menu-button.chosen {
    background: rgb(22, 55, 11);
  }

  @media (prefers-reduced-motion: reduce) {
    .menu-button {
      transition: none;
    }

    .menu-button:hover {
      transform: none;
    }
  }

  @media (max-width: 600px) {
    p {
      font-size: clamp(0.8rem, 1.2vw, 2rem);
    }
  }
</style>

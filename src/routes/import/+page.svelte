<script lang="ts">
  import { goto } from "$app/navigation";
  import { Settings } from "$lib/stores/settings";
  import { midiFileData, midiFileName } from "$lib/stores/midiFileStore";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { fadeIn, fadeOut } from "$lib/stores/app";
  import Back from "$lib/ui/Back.svelte";

  let {
    disabled = false,
  }: {
    disabled?: boolean;
  } = $props();

  let dragging = $state(false);
  let importing = $state(false);
  let error = $state("");
  let fileName = $state("");
  let fileInput: HTMLInputElement;
  let loaded = $state(false);

  let background = $derived(
    `rgb(${$Settings.scene.colours.background.r}, ${$Settings.scene.colours.background.g}, ${$Settings.scene.colours.background.b})`,
  );

  function isMIDIFile(file: File) {
    return /\.(mid|midi)$/i.test(file.name);
  }

  function openFilePicker() {
    if (!disabled && !importing) {
      fileInput?.click();
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }

    if (!disabled && !importing) {
      dragging = true;
    }
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const container = event.currentTarget as HTMLElement;
    const related = event.relatedTarget;

    if (related instanceof Node && container.contains(related)) {
      return;
    }

    dragging = false;
  }

  async function importFile(file: File) {
    error = "";

    if (disabled || importing) return;

    if (!isMIDIFile(file)) {
      error = "Please select a .mid or .midi file.";
      return;
    }

    importing = true;

    try {
      const data = await file.arrayBuffer();

      midiFileData.set(data);
      midiFileName.set(file.name);
      fileName = file.name;

      window.setTimeout(() => {
        goto("../play");
      }, 1000);
    } catch (err) {
      error =
        err instanceof Error ? err.message : "Unable to import this MIDI file.";

      importing = false;
    }
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    dragging = false;

    if (disabled || importing) return;

    const file = event.dataTransfer?.files[0];

    if (file) {
      await importFile(file);
    }
  }

  async function handleFileChange(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      await importFile(file);
    }

    input.value = "";
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  }

  onMount(() => {
    loaded = true;
  });
</script>

{#if loaded}
  <div
    class="midi-import-overlay"
    class:dragging
    class:disabled
    role="presentation"
    style:background-color={background}
    in:fade|global={$fadeIn}
    out:fade|global={$fadeOut}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    <header class="top">
      <Back destination={"../"}></Back>
    </header>

    <div class="content">
      <div class="import-panel">
        <div
          class="drop-zone"
          role="button"
          tabindex={disabled || importing ? -1 : 0}
          aria-label="Import a MIDI file by dropping it anywhere on the screen or browsing"
          aria-disabled={disabled || importing}
          onclick={openFilePicker}
          onkeydown={handleKeydown}
        >
          <div class="icon-wrap">
            {#if importing}
              <span class="spinner"></span>
            {:else}
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            {/if}
          </div>

          <strong>
            {dragging
              ? "Drop your MIDI file"
              : importing
                ? "Importing MIDI..."
                : "Import MIDI"}
          </strong>

          <span class="description">
            {#if importing}
              Please wait while your file is being read.
            {:else}
              Drag and drop your MIDI file anywhere on screen
            {/if}
          </span>

          {#if !importing}
            <span class="browse">
              or <span class="browse-link">browse files</span>
            </span>
          {/if}

          <span class="file-type"> MIDI FILES · .MID / .MIDI </span>
        </div>

        <input
          bind:this={fileInput}
          type="file"
          accept=".mid,.midi,audio/midi,audio/x-midi"
          hidden
          onchange={handleFileChange}
          disabled={disabled || importing}
        />

        {#if fileName}
          <div class="file-info">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              aria-hidden="true"
            >
              <path
                d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
              />
              <path d="M13 2v7h7" />
            </svg>

            <span class="filename">{fileName}</span>
          </div>
        {/if}

        {#if error}
          <p class="error" role="alert">{error}</p>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .midi-import-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;

    /* Column: Back header on top, content centred in the remaining space. */
    display: flex;
    flex-direction: column;

    box-sizing: border-box;
    min-width: 0;
    min-height: 0;

    /* Reserve room for the footer (socials), which sits above the overlay.
       Overlay background still runs underneath it so there's no gap. */
    padding-bottom: 3.75vh;

    overflow: clip;
    color: white;
    font-family: "Oxanium", sans-serif;

    /* The overlay receives drag events across the viewport. */
    pointer-events: auto;
  }

  .top {
    flex: 0 0 auto;
  }

  .content {
    flex: 1 1 0;
    min-height: 0;
    min-width: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    padding: 0 16px 16px;
  }

  .import-panel {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    min-width: 0;
    max-height: 100%;
    overflow: auto;
  }

  .drop-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding: 28px 20px;

    border: 1px dashed rgba(210, 150, 255, 0.45);
    text-align: center;
    cursor: pointer;
    overflow-wrap: anywhere;

    transition:
      border-color 180ms ease,
      background 180ms ease,
      box-shadow 180ms ease;
  }

  .midi-import-overlay.dragging .drop-zone {
    border-color: #d98aff;
    background: rgba(100, 35, 125, 0.4);
    box-shadow: 0 0 24px rgba(175, 70, 255, 0.14);
  }

  .midi-import-overlay.disabled .drop-zone {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .drop-zone:focus-visible {
    outline: 2px solid #d98aff;
    outline-offset: 2px;
  }

  .icon-wrap {
    display: grid;
    place-items: center;
    flex-shrink: 0;

    width: 54px;
    height: 54px;

    color: #d98aff;
    border: 1px solid rgba(217, 138, 255, 0.25);
    border-radius: 12px;
    background: rgba(160, 70, 220, 0.12);
  }

  .drop-zone strong {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .description,
  .browse {
    color: rgba(255, 255, 255, 0.65);
    font-size: 12px;
  }

  .browse-link {
    color: #d98aff;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .file-type {
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.4);
    font-size: 9px;
    letter-spacing: 1.5px;
  }

  .file-info {
    display: flex;
    align-items: center;
    gap: 10px;

    box-sizing: border-box;
    min-width: 0;
    margin-top: 12px;
    padding: 10px 12px;

    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
    color: #d98aff;
  }

  .file-info svg {
    flex-shrink: 0;
  }

  .filename {
    min-width: 0;
    color: rgba(255, 255, 255, 0.85);
    font-size: 11px;
    overflow-wrap: anywhere;
  }

  .error {
    margin: 10px 0 0;
    color: #ff8585;
    font-size: 11px;
    overflow-wrap: anywhere;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(217, 138, 255, 0.2);
    border-top-color: #d98aff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>

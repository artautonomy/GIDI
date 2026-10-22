<script lang="ts">
  let dragging = $state(false);
  let fileName = $state("");
  let error = $state("");
  let fileInput: HTMLInputElement;

  // Fired when a valid file is imported.
  let onImport: (file: File, data: ArrayBuffer) => void = () => {};

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragging = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    dragging = false;
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragging = false;

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

    // Allows selecting the same file again.
    input.value = "";
  }

  async function importFile(file: File) {
    error = "";

    // Example: accept MIDI files only.
    if (
      !file.name.toLowerCase().endsWith(".mid") &&
      !file.name.toLowerCase().endsWith(".midi")
    ) {
      error = "Please select a .mid or .midi file.";
      return;
    }

    try {
      const data = await file.arrayBuffer();

      fileName = file.name;

      // Send the file data to the parent component.
      onImport(file, data);
    } catch {
      error = "Unable to read this file.";
    }
  }
</script>

<div
  class:dragging
  class="drop-zone"
  role="button"
  tabindex="0"
  aria-label="Import a MIDI file"
  onclick={() => fileInput.click()}
  onkeydown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInput.click();
    }
  }}
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
>
  <div class="content">
    <span class="icon">♫</span>

    <strong>Import a MIDI file</strong>

    <span>Drag and drop a .mid file here</span>
    <span>or click to browse</span>

    {#if fileName}
      <p class="success">Selected: {fileName}</p>
    {/if}

    {#if error}
      <p class="error">{error}</p>
    {/if}
  </div>
</div>

<input
  bind:this={fileInput}
  type="file"
  accept=".mid,.midi,audio/midi,audio/x-midi"
  hidden
  onchange={handleFileChange}
/>

<style>
  .drop-zone {
    border: 2px dashed #666;
    border-radius: 12px;
    padding: 32px 20px;
    cursor: pointer;
    text-align: center;
    transition:
      background 0.2s,
      border-color 0.2s;
  }

  .drop-zone:hover,
  .drop-zone.dragging {
    border-color: #8b5cf6;
    background: rgb(139 92 246 / 10%);
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .icon {
    font-size: 36px;
  }

  .success {
    color: #16a34a;
    overflow-wrap: anywhere;
  }

  .error {
    color: #dc2626;
  }
</style>

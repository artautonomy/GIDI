<script lang="ts">
  import { goto } from "$app/navigation";
  import { Settings } from "$lib/stores/settings";

  interface Props {
    destination: string;
  }
  let { destination }: Props = $props();

  function handleClick(destination: string) {
    $Settings.menuSelected = "";
    goto(destination);
  }

  const bg = $derived($Settings.scene.colours.background);
  const inv = $derived({ r: 255 - bg.r, g: 255 - bg.g, b: 255 - bg.b });

  const isLight = $derived(
    (0.2126 * inv.r + 0.7152 * inv.g + 0.0722 * inv.b) / 255 > 0.5,
  );

  // two arrow colours that always contrast with the inverted background
  const fgA = $derived(isLight ? "hsl(225 70% 22%)" : "hsl(45 90% 75%)");
  const fgB = $derived(isLight ? "hsl(345 75% 38%)" : "hsl(190 85% 70%)");
</script>

<button
  class="back"
  aria-label="Back"
  onclick={() => handleClick(destination)}
  style:--bg="rgb({inv.r}
  {inv.g}
  {inv.b})"
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
    <path d="M15 5l-7 7 7 7" />
  </svg>
</button>

<style>
  .back {
    position: relative; /* was absolute: now takes up space in the layout */
    margin: 12px; /* replaces top/left: 12px */
    display: grid;
    place-items: center;
    width: 72px;
    height: 32.5px;
    padding: 0;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    z-index: 2;

    background-color: var(--bg);
    transition: background-color 0.3s ease;
  }

  .back svg {
    width: 22px;
    height: 22px;
    stroke: var(--fg-a);
    transition: transform 0.2s ease;
    animation: arrow-colour 2s ease-in-out infinite alternate;
  }

  .back:hover svg {
    transform: translateX(-3px);
  }

  .back:active {
    transform: scale(0.96);
  }

  .back:focus-visible {
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
    .back svg {
      animation: none;
    }
  }
</style>

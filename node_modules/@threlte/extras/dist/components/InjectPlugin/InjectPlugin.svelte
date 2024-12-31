<!--
@component This component is used to inject plugins. You provide an injector
function that injects a plugin.

@example
```svelte
<InjectPlugin>
  {@render children?.()}
</InjectPlugin>
```
-->

<script lang="ts">import { injectPlugin } from '@threlte/core';
let { name, plugin, children } = $props();
injectPlugin(name, plugin);
</script>

{@render children?.()}

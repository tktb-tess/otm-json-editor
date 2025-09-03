<script lang="ts">
  import { pageConfig } from '../modules/storage.svelte';
  import MoonIcon from './moon-icon.svelte';
  import SunIcon from './sun-icon.svelte';

  $effect(() => {
    const html = document.documentElement;
    html.dataset.colorScheme = $pageConfig.colorScheme;
  });
</script>

<button
  type="button"
  class="btn-1"
  onclick={() => {
    switch ($pageConfig.colorScheme) {
      case 'light': {
        $pageConfig.colorScheme = 'dark';
        return;
      }
      case 'dark': {
        $pageConfig.colorScheme = 'light';
        return;
      }
    }
  }}
>
  {#if $pageConfig.colorScheme === 'light'}
    <MoonIcon class="inline-block fill-current size-4" />
  {:else}
    <SunIcon class="inline-block fill-current size-4" />
  {/if}
</button>

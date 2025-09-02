<script lang="ts">
  import { onMount } from 'svelte';
  import { pageConfig } from './storage.svelte';
  import { storageKeys } from './decl';

  let time = $state(new Date());

  onMount(() => {
    const id = setInterval(() => {
      time = new Date();
    }, 1000);

    return () => clearInterval(id);
  });

  $effect(() => {
    localStorage.setItem(storageKeys.pageConfig, JSON.stringify(pageConfig));
  });

  $effect(() => {
    const html = document.documentElement;

    switch (pageConfig.colorScheme) {
      case 'light': {
        html.dataset.colorScheme = 'light';
        break;
      }
      case 'dark': {
        html.dataset.colorScheme = 'dark';
        break;
      }
    }
  });
</script>

<svelte:head>
  <title>{import.meta.env.VITE_APP_NAME}</title>
</svelte:head>
<div class="flex justify-center gap-4">
  <button
    class="btn-1"
    type="button"
    onclick={() => {
      if (pageConfig.colorScheme === 'light') pageConfig.colorScheme = 'dark';
      else pageConfig.colorScheme = 'light';
    }}
  >
    Toggle color scheme
  </button>
  
</div>

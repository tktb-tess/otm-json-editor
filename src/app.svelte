<script lang="ts">
  import { onMount } from 'svelte';

  let now = $state(new Date());

  onMount(() => {
    setInterval(() => {
      now = new Date();
    }, 1000);
  });
</script>

<svelte:head>
  <title>{import.meta.env.VITE_APP_NAME}</title>
</svelte:head>

<p>{now.toLocaleString('ja-JP')}</p>

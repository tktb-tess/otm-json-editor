<script lang="ts">
  import { tz } from '@date-fns/tz';
  import { onMount } from 'svelte';
  const tzTokyo = tz('Asia/Tokyo');
  let date = $state(Date.now());
  const tzdate = $derived(tzTokyo(date));

  onMount(() => {
    const id = setInterval(() => {
      date = Date.now();
    }, 1000);
    return () => clearInterval(id);
  });
</script>

<svelte:head>
  <title>{import.meta.env.VITE_APP_NAME}</title>
</svelte:head>
<div class="min-h-screen grid place-content-center">
  <p class="text-4xl font-extralight">{tzdate.toLocaleString('ja-JP')}</p>
</div>

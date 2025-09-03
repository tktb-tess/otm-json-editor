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
<header>
  <h1 class="text-center font-extralight text-5xl lg:text-6xl">
    {import.meta.env.VITE_APP_NAME}
  </h1>
</header>
<main class="flex flex-col gap-2 *:max-w-full">
  
</main>
<footer></footer>

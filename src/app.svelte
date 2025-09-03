<script lang="ts">
  import { tz } from '@date-fns/tz';
  import { onMount } from 'svelte';
  import UploadFile from './lib/components/upload-file.svelte';
  import ToggleColorSchemeBtn from './lib/components/toggle-color-scheme-btn.svelte';
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
<header class="flex flex-col">
  <nav class="flex justify-end items-center h-12 gap-2 w-[98%]">
    <ToggleColorSchemeBtn />
  </nav>
  <h1 class="text-center font-extralight text-4xl lg:text-5xl xl:text-6xl my-5">
    {import.meta.env.VITE_APP_NAME}
  </h1>
</header>
<main class="flex flex-col gap-2 *:max-w-full">
  <UploadFile />
</main>

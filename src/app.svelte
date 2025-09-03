<script lang="ts">
  import UploadFile from './lib/components/upload-file.svelte';
  import ToggleColorSchemeBtn from './lib/components/toggle-color-scheme-btn.svelte';
  import { tz } from '@date-fns/tz'
  import { onMount } from 'svelte';
  let tokyoTz = tz('Asia/Tokyo');
  let now = $state(Date.now());
  const date = $derived(tokyoTz(now));

  onMount(() => {
    const id = setInterval(() => {
      now = Date.now();
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
<main class="flex flex-col gap-2 *:max-w-full p-2 w-full max-w-320 mx-auto">
  <UploadFile />
  <p class="text-center">{date.toLocaleString('ja-JP')}</p>
</main>

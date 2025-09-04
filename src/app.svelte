<script lang="ts">
  import UploadFile from './lib/components/edit-file-form.svelte';
  import ToggleColorSchemeBtn from './lib/components/toggle-color-scheme-btn.svelte';
  import Clock from './lib/components/clock.svelte';
  
</script>

<svelte:head>
  <title>{import.meta.env.VITE_APP_NAME}</title>
</svelte:head>
<header class="flex flex-col">
  <nav class="flex justify-end items-center h-12 gap-2 w-[98%]">
    <Clock />
    <ToggleColorSchemeBtn />
  </nav>
  <h1 class="text-center font-extralight text-4xl lg:text-5xl xl:text-6xl my-5">
    {import.meta.env.VITE_APP_NAME}
  </h1>
</header>
<main class="flex flex-col gap-2 *:max-w-full p-2 w-full max-w-256 mx-auto">
  <UploadFile />
</main>

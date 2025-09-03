<script lang="ts">
  import { otmjsonSchema, type OTMJSON } from '../modules/otmjson';
  import z from 'zod';
  import OtmjsonEdit from './otmjson-edit.svelte';
  let inputRef = $state<HTMLInputElement | null>(null);
  type FileResult =
    | {
        status: 'empty';
      }
    | {
        status: 'loaded';
        file: OTMJSON;
      }
    | {
        status: 'error';
        error: Error;
      };
  let fileResult: FileResult = $state({ status: 'empty' });

  $effect(() => {
    if (fileResult.status === 'error') {
      if (fileResult.error instanceof z.ZodError) {
        const e = fileResult.error as z.ZodError<OTMJSON>;
        const { name, issues } = e;
        const prettified = z.prettifyError(e);
        console.error(name, prettified, ...issues);
      }
    }
  });
</script>

<input
  type="file"
  accept="application/json"
  id="otmjson-upload"
  class="hidden"
  bind:this={inputRef}
  oncancel={() => {}}
  onchange={async ({ currentTarget }) => {
    try {
      const file = currentTarget.files?.item(0);
      if (!file) {
        return;
      }

      if (file.type !== 'application/json') {
        fileResult = {
          status: 'error',
          error: Error('invalid MIME type'),
        };
        return;
      }

      const otmjson: OTMJSON = await file
        .text()
        .then((text) => otmjsonSchema.parse(JSON.parse(text)));
      fileResult = {
        status: 'loaded',
        file: otmjson,
      };
    } catch (e) {
      if (e instanceof Error) {
        fileResult = {
          status: 'error',
          error: e,
        };
        return;
      } else {
        fileResult = {
          status: 'error',
          error: Error(`unidentified error: ${e}`),
        };
        return;
      }
    }
  }}
/>

<button
  type="button"
  class="btn-1 self-center"
  onclick={() => {
    if (inputRef) {
      inputRef.click();
    }
  }}
>
  Upload
</button>
{#if fileResult.status === 'empty'}
  <p class="text-center">
    編集したいOTM-JSONファイルをアップロードしてください。
  </p>
{:else if fileResult.status === 'loaded'}
  <OtmjsonEdit input={fileResult.file} />
{:else}
  {@const { error } = fileResult}
  <div class="text-center">
    <p class="text-red-700 dark:text-yellow-200">
      ファイルの読み込み中にエラーが発生しました。
    </p>
    <p>
      {error.name}:
      {#if error instanceof z.ZodError}
        {@const pretty = z.prettifyError(error)}
        {pretty}
      {:else}
        {error.message}
      {/if}
    </p>
  </div>
{/if}

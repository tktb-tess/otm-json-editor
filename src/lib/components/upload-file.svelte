<script lang="ts">
  import {
    otmjsonv2Schema,
    type OTMJSONv2,
    parseAndValidate,
  } from '../modules/otmjson';
  import z from 'zod';
  import OtmjsonEdit from './otmjson-edit.svelte';
  import { storageKeys } from '../modules/decl';

  let inputRef = $state<HTMLInputElement | null>(null);

  type FileResult =
    | {
        status: 'empty';
      }
    | {
        status: 'loaded';
        data: {
          otmjson: OTMJSONv2;
          fileName: string;
        };
      }
    | {
        status: 'error';
        error: Error;
      };
  const init = (): FileResult => {
    const default_: FileResult = { status: 'empty' };

    const fromStorage = localStorage.getItem(storageKeys.otmjsonData);

    if (!fromStorage) return default_;

    const result = parseAndValidate(fromStorage, otmjsonv2Schema);

    switch (result.status) {
      case 'succeed': {
        const { data } = result;
        return {
          status: 'loaded',
          data: {
            otmjson: data,
            fileName: 'stored.json',
          },
        };
      }
      case 'miscError': {
        console.error(
          result.error.name,
          '\n',
          result.error.message,
          '\n',
          result.error.cause
        );
        return default_;
      }
      case 'zodError': {
        const e = result.zodError;
        console.error(e.name, '\n', z.prettifyError(e), '\n', ...e.issues);
        return default_;
      }
    }
  };
  
  let fileResult: FileResult = $state(init());

  $effect(() => {
    if (fileResult.status === 'error') {
      if (fileResult.error instanceof z.ZodError) {
        const { name, issues } = fileResult.error;
        const prettified = z.prettifyError(fileResult.error);
        console.error(name, '\n', prettified, '\n', ...issues);
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

      if (!file) return;

      if (file.type !== 'application/json') {
        fileResult = {
          status: 'error',
          error: Error('invalid MIME type', { cause: file.type }),
        };
        return;
      }

      const result = await file
        .text()
        .then((text) => parseAndValidate(text, otmjsonv2Schema));

      switch (result.status) {
        case 'succeed': {
          fileResult = {
            status: 'loaded',
            data: {
              fileName: file.name,
              otmjson: result.data,
            },
          };
          return;
        }
        case 'zodError': {
          fileResult = {
            status: 'error',
            error: result.zodError,
          };
          return;
        }
        case 'miscError': {
          fileResult = {
            status: 'error',
            error: result.error,
          };
          return;
        }
      }
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
  <p class="text-center">現在Version2のみ対応です。</p>
{:else if fileResult.status === 'loaded'}
  <OtmjsonEdit input={fileResult.data} />
{:else}
  {@const { error } = fileResult}
  <div class="text-center">
    <p class="text-red-700 dark:text-yellow-200">
      ファイルの読み込み中にエラーが発生しました。
    </p>
    {#if error instanceof z.ZodError}
      {@const pretty = z.prettifyError(error)}
      <pre>{error.name}: {pretty}</pre>
    {:else}
      <pre>{error.name}: {error.message}</pre>
    {/if}
  </div>
{/if}

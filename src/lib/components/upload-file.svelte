<script lang="ts">
  import { otmjsonSchema, type OTMJSON } from '../modules/otmjson';
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
</script>

<input
  type="file"
  accept=".json,application/json"
  id="otmjson-upload"
  class="hidden"
  bind:this={inputRef}
  onchange={async ({ currentTarget }) => {
    try {
      const file = currentTarget.files?.item(0);
      if (!file) {
        fileResult = {
          status: 'empty',
        };
        return;
      }
      const otmjson: OTMJSON = await file
        .text()
        .then((text) => otmjsonSchema.parse(JSON.parse(text)));
      fileResult = {
        status: 'loaded',
        file: otmjson
      }
      return;
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
  Upload OTM-JSON
</button>

<p>{fileResult.status}</p>
{#if fileResult.status === 'loaded'}
  {@const otmjson = fileResult.file}
  <p>version: {otmjson.version}</p>
  {#each otmjson.words as word}
    <p>{word.entry.form}</p>
  {/each}
{/if}

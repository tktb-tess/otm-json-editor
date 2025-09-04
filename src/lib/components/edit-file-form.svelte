<script lang="ts">
  import {
    otmjsonv2Schema,
    otmjsonv2WithFileNameSchema,
    parseAndValidate,
    type OTMJSONv2WithFileName,
  } from '../modules/otmjson';
  import z from 'zod';
  import { storageKeys } from '../modules/decl';

  let inputRef = $state<HTMLInputElement | null>(null);

  type FileResult =
    | {
        status: 'empty';
      }
    | {
        status: 'loaded';
        data: OTMJSONv2WithFileName;
      }
    | {
        status: 'error';
        error: Error;
      };
  const init = (): FileResult => {
    const default_: FileResult = { status: 'empty' };

    const fromStorage = localStorage.getItem(storageKeys.otmjsonData);

    if (!fromStorage) return default_;

    const result = parseAndValidate(fromStorage, otmjsonv2WithFileNameSchema);

    switch (result.status) {
      case 'succeed': {
        const { data } = result;

        data.otmjson.words.sort(({ entry: a }, { entry: b }) => a.id - b.id);
        return {
          status: 'loaded',
          data,
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

  const handleDownload = () => {
    if (fileResult.status !== 'loaded') return;
    const { otmjson, fileName } = fileResult.data;
    const blob = new Blob([JSON.stringify(otmjson)], {
      type: 'application/json',
    });
    const burl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = burl;
    a.download = `${fileName}-${Date.now()}-edited.json`;
    a.click();
    URL.revokeObjectURL(burl);
  };

  const handleSave = () => {
    if (fileResult.status !== 'loaded') return;

    localStorage.setItem(
      storageKeys.otmjsonData,
      JSON.stringify(fileResult.data)
    );
    alert('データを一時保存しました');
  };

  const handleDelete = () => {
    if (fileResult.status !== 'loaded') return;
    localStorage.removeItem(storageKeys.otmjsonData);
    alert('データを削除しました');
  };

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

<div class="flex justify-center gap-2">
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
  <button
    type="button"
    class="btn-1 self-center"
    onclick={() => {
      fileResult = {
        status: 'empty',
      };
    }}
  >
    Clear
  </button>
</div>

{#if fileResult.status === 'empty'}
  <p class="text-center">
    編集したいOTM-JSONファイルをアップロードしてください。
  </p>
  <p class="text-center">現在Version2のみ対応です。</p>
{:else if fileResult.status === 'error'}
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
{:else}
  <h2 class="text-center text-2xl my-5">{fileResult.data.fileName}</h2>

  <div class="flex gap-2 justify-center">
    <button type="button" class="self-center btn-1" onclick={handleDownload}>
      Download
    </button>
    <button type="button" class="self-center btn-1" onclick={handleSave}>
      一時保存
    </button>
    <button type="button" class="self-center btn-1" onclick={handleDelete}>
      一時保存データ削除
    </button>
  </div>

  {#each fileResult.data.otmjson.words as word, i (word.entry.id)}
    {@const id = word.entry.id}
    <details class="">
      <summary class="text-2xl user-select-none">{word.entry.form}</summary>
      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <h3 class="text-xl">単語</h3>
          <input
            id="entry-form-{id}"
            type="text"
            bind:value={word.entry.form}
          />
        </div>
        <div class="flex flex-col">
          <h3 class="text-xl">発音</h3>
          <input
            id="pronunciation-{id}"
            type="text"
            class="font-ipa"
            bind:value={
              () => {
                const v = word.contents.find(
                  ({ title }) => title === 'Pronunciation'
                )?.text;
                return v ?? '';
              },
              (v) => {
                const co = word.contents.find(
                  ({ title }) => title === 'Pronunciation'
                );
                if (co) {
                  co.text = v;
                }
              }
            }
          />
        </div>
        <h3 class="text-xl">訳</h3>
        <div class="flex flex-col gap-2">
          {#each word.translations as translation}
            <div class="flex gap-2 *:min-w-0">
              <span>品詞</span>
              <input
                type="text"
                id="parts-{id}-{translation.title}"
                bind:value={translation.title}
              />
              <span>訳語</span>
              <input
                type="text"
                id="translation-{id}-{translation.forms.join(',')}"
                bind:value={
                  () => translation.forms.join(','),
                  (v) => {
                    translation.forms = v.split(',');
                  }
                }
              />
            </div>
          {/each}
        </div>
        <div class="flex flex-col"></div>
        <div class="flex flex-col"></div>
        <div class="flex flex-col"></div>
        <div class="flex flex-col"></div>
        <div class="flex flex-col"></div>
      </div>
    </details>
  {/each}
{/if}

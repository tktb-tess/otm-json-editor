<script lang="ts">
  import type { OTMJSONv2 } from '../modules/otmjson';
  import { storageKeys } from '../modules/decl';
  type Props = {
    input: {
      otmjson: OTMJSONv2;
      fileName: string;
    };
  };
  const { input }: Props = $props();
  const edited: OTMJSONv2 = $state(input.otmjson);
  const fileName = $derived(input.fileName.replaceAll('.json', ''));

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(edited)], {
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
    localStorage.setItem(storageKeys.otmjsonData, JSON.stringify(edited));
    alert('データを一時保存しました');
  };

  const handleDelete = () => {
    localStorage.removeItem(storageKeys.otmjsonData);
    alert('データを削除しました');
  };

  $effect(() => {
    console.log(
      $state.snapshot(edited).words,
      $state.snapshot(edited).examples,
      $state.snapshot(edited).zpdicOnline
    );
  });
</script>

<h2 class="text-center text-2xl my-5">{fileName}</h2>

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

{#each edited.words as _, i}
  <textarea class="h-10" bind:value={edited.words[i].entry.form}></textarea>
{/each}

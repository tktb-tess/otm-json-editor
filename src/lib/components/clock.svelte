<script>
  import { tz } from '@date-fns/tz';
  import { onMount } from 'svelte';
  let now = $state(Date.now());
  const tzTokyo = tz('Asia/Tokyo');
  const date = $derived(tzTokyo(now));

  onMount(() => {
    const id = setInterval(() => {
      now = Date.now();
    }, 1000);

    return () => clearInterval(id);
  });
</script>

<p>{date.toLocaleString('ja-JP')}</p>

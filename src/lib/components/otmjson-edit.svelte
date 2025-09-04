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

  
</script>



<script lang="ts">
    import type { OTMJSON } from "../modules/otmjson";
    type Props = {
        input: OTMJSON,
    };
    const { input }: Props = $props();
    const edited: OTMJSON = $state(input);
</script>

<p>OTM-JSON Version: {edited.version ?? 1}</p>
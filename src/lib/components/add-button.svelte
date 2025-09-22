<script lang="ts">
	import { goto } from '$app/navigation';

	type Props = {
		url: string;
	};

	let { url }: Props = $props();
</script>

<div class="flex w-full justify-end">
	<button class="btn preset-filled-primary-500" onclick={() => goto(url)}> Ajouter + </button>
</div>

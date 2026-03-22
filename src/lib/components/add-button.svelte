<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';

	type Props = {
		url: Pathname;
	};

	let { url }: Props = $props();
</script>

<div class="flex w-full justify-end">
	<button class="btn preset-filled-primary-500" onclick={() => goto(resolve(url))}>
		Ajouter +
	</button>
</div>

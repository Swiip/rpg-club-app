<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = { children: Snippet };
	const { children }: Props = $props();
</script>

<div class="mx-auto flex w-4/5 flex-col items-center gap-8 pb-20 md:w-3xl">
	{@render children()}
</div>

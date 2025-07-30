<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = { children: Snippet };
	const { children }: Props = $props();
</script>

<section
	class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block w-full divide-y overflow-hidden rounded-xl border"
>
	{@render children()}
</section>

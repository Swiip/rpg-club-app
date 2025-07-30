<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		as: 'header' | 'footer' | 'illustration' | 'article';
		className?: string;
	};

	const { children, as, className }: Props = $props();
</script>

<svelte:element this={as} class={`flex ${className}`}>
	{@render children()}
</svelte:element>

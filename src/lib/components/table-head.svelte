<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		sort?: 'asc' | 'desc';
		onClick?: () => void;
	};

	const { children, sort, onClick }: Props = $props();
</script>

<th>
	{#if onClick === undefined}
		{@render children()}
		{#if sort === 'asc'}<ChevronUp />{/if}
		{#if sort === 'desc'}<ChevronDown />{/if}
	{:else}
		<button onclick={onClick} class="flex flex-row">
			{@render children()}
			{#if sort === 'asc'}<ChevronUp />{/if}
			{#if sort === 'desc'}<ChevronDown />{/if}
		</button>
	{/if}
</th>

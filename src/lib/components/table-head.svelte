<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		sort?: 'asc' | 'desc';
		onClick?: () => void;
		vertical?: boolean;
	};

	const { children, sort, onClick, vertical = false }: Props = $props();
</script>

<th class={clsx('align-bottom', vertical && 'vertical align-top')}>
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

<style>
	.vertical {
		writing-mode: sideways-lr;
	}
</style>

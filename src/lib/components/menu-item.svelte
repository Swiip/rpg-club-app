<script lang="ts">
	import { Tooltip } from '@skeletonlabs/skeleton-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		tooltip: string;
		link: string;
	};

	const { children, tooltip, link }: Props = $props();

	let openState = $state(false);
</script>

<Tooltip
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	positioning={{ placement: 'top' }}
	triggerBase="underline"
	contentBase="card preset-filled p-4"
	openDelay={200}
	arrow
>
	{#snippet trigger()}
		<a class="btn-icon" href={link}>
			{@render children()}
		</a>
	{/snippet}
	{#snippet content()}{tooltip}{/snippet}
</Tooltip>

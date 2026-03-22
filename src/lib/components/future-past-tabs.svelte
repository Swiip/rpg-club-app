<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	type TabNames = 'future' | 'past';

	let isFuture = $derived(page.url.searchParams.get('past') === null);

	const handleChange = (type: TabNames) => {
		goto(resolve(location.pathname + (type === 'future' ? '' : '?past=true')));
	};
</script>

<Tabs value={isFuture ? 'future' : 'past'} onValueChange={(e) => handleChange(e.value as TabNames)}>
	{#snippet list()}
		<Tabs.Control value="future">À venir</Tabs.Control>
		<Tabs.Control value="past">Passé</Tabs.Control>
	{/snippet}
</Tabs>

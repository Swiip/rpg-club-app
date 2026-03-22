<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	type TabNames = 'rpg' | 'bg';

	let isRpg = $derived(page.url.searchParams.get('bg') === null);

	const handleChange = (type: TabNames) => {
		const path = location.pathname + (type === 'rpg' ? '' : '?bg=true');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		goto(resolve(path as any));
	};
</script>

<Tabs value={isRpg ? 'rpg' : 'bg'} onValueChange={(e) => handleChange(e.value as TabNames)}>
	{#snippet list()}
		<Tabs.Control value="rpg">Jeu de rôle</Tabs.Control>
		<Tabs.Control value="bg">Jeu de société</Tabs.Control>
	{/snippet}
</Tabs>

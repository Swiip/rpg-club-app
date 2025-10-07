<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	type TabNames = 'rpg' | 'bg';

	let isRpg = $derived(page.url.searchParams.get('bg') === null);

	const handleChange = (type: TabNames) => {
		goto(location.pathname + (type === 'rpg' ? '' : '?bg=true'));
	};
</script>

<Tabs value={isRpg ? 'rpg' : 'bg'} onValueChange={(e) => handleChange(e.value as TabNames)}>
	{#snippet list()}
		<Tabs.Control value="rpg">Jeu de rôle</Tabs.Control>
		<Tabs.Control value="bg">Jeu de société</Tabs.Control>
	{/snippet}
</Tabs>

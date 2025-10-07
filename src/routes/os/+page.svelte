<script lang="ts">
	import AddButton from '$lib/components/add-button.svelte';
	import Container from '$lib/components/container.svelte';
	import FuturePastTabs from '$lib/components/future-past-tabs.svelte';
	import OsCard from '$lib/components/os-card.svelte';

	let { data } = $props();
	let { members, oses, supabase } = $derived(data);
</script>

<Container>
	<FuturePastTabs />

	<AddButton url="/os/new/edit" />

	{#if oses && oses.length > 0}
		{#each oses as os (os.id)}
			<OsCard {members} {os} {supabase} />
		{/each}
	{:else}
		Aucun OS planifié pour le moment
	{/if}
</Container>

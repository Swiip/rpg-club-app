<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '$lib/components/container.svelte';
	import FuturePastTabs from '$lib/components/future-past-tabs.svelte';
	import OsCard from '$lib/components/os-card.svelte';

	let { data } = $props();
	let { members, oses, supabase } = $derived(data);
</script>

<Container>
	<FuturePastTabs />

	<div class="flex w-full justify-end">
		<button class="btn preset-filled-primary-500" onclick={() => goto(`/os/new/edit`)}>
			Ajouter +
		</button>
	</div>

	{#if oses && oses.length > 0}
		{#each oses as os (os.id)}
			<OsCard {members} {os} {supabase} />
		{/each}
	{:else}
		Aucun OS planifié pour le moment
	{/if}
</Container>

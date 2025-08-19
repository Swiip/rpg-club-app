<script lang="ts">
	import { goto } from '$app/navigation';
	import CampaignCard from '$lib/components/campaign-card.svelte';
	import Container from '$lib/components/container.svelte';
	import { computeRegistrations } from '$lib/logic/registrations.js';

	let { data } = $props();
	let { members, campaigns, events, supabase } = $derived(data);

	const registrations = $derived(computeRegistrations(campaigns));
</script>

<Container>
	<div class="flex w-full justify-end">
		<button class="btn preset-filled-primary-500" onclick={() => goto(`/campaigns/new/edit`)}>
			Ajouter +
		</button>
	</div>

	{#each campaigns as campaign (campaign.id)}
		<CampaignCard
			{members}
			{events}
			{campaign}
			registration={registrations[campaign.id]}
			{supabase}
			{campaigns}
		/>
	{/each}
</Container>

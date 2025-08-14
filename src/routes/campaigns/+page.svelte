<script lang="ts">
	import { goto } from '$app/navigation';
	import CampaignCard from '$lib/components/campaign-card.svelte';
	import { computeRegistrations } from '$lib/logic/registrations.js';

	let { data } = $props();
	let { members, campaigns, events, supabase } = $derived(data);

	const registrations = $derived(computeRegistrations(campaigns));
</script>

<div class="mx-auto flex w-4/5 flex-col items-center gap-8 pb-20 md:w-3xl">
	<div class="flex w-full justify-end">
		<button class="btn preset-filled-primary-500" onclick={() => goto(`/campaigns/new/edit`)}>
			Ajouter +
		</button>
	</div>

	{#if campaigns && campaigns.length > 0}
		{#each campaigns as campaign (campaign.id)}
			<CampaignCard
				{members}
				{events}
				{campaign}
				registration={registrations[campaign.id]}
				{supabase}
			/>
		{/each}
	{/if}
</div>

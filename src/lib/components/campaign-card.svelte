<script lang="ts">
	import type { RegistrionModel } from '$lib/logic/registrations';
	import { goto } from '$app/navigation';
	import CardContainer from './card/card-container.svelte';
	import CardImage from './card/card-image.svelte';
	import CardSection from './card/card-section.svelte';
	import CardMoreButton from './card/card-more-button.svelte';
	import CardText from './card/card-text.svelte';
	import RegistrationsTable from './forms/registrations-table.svelte';
	import SessionsTable from './forms/sessions-table.svelte';
	import type { Member } from '$lib/supabase/members';
	import type { CampaignWithJoins } from '$lib/supabase/campaigns';
	import type { SupabaseClient } from '$lib/supabase/types';
	import AntagonismTable from './antagonism-table.svelte';

	type Props = {
		members: Member[];
		campaign: CampaignWithJoins;
		registration: RegistrionModel;
		supabase: SupabaseClient;
		campaigns: CampaignWithJoins[];
	};

	let { members, campaign, registration, supabase, campaigns }: Props = $props();
	let showDetails = $state(false);

	const handleClick = (campaign: CampaignWithJoins) => () => goto(`/campaigns/${campaign.id}/edit`);
</script>

<CardContainer>
	<CardImage
		{supabase}
		bucket="game-banners"
		url={campaign.game.illustration}
		alt={campaign.game.name}
		title={campaign.title}
		onEdit={handleClick(campaign)}
	/>

	<CardSection as="article" className="p-4 items-center justify-between">
		<span class="opacity-60">MJ: {campaign.gm.handle}</span>
	</CardSection>

	{#if showDetails}
		<CardText text={campaign.description || 'Pas de description'} />
	{/if}

	<CardSection as="article" className="p-4 items-start flex-col gap-4">
		{#if showDetails}
			<RegistrationsTable targetId={campaign.id} registrations={campaign.registration} {members} />
		{:else}
			{#if registration.confirmed}
				<p>PJs confirmés : {registration.confirmed}</p>
			{/if}
			{#if registration.pending}
				<p>PJs en attente : {registration.pending}</p>
			{/if}
			{#if !registration.confirmed && !registration.pending}
				<p>Encore aucune inscription</p>
			{/if}
		{/if}
	</CardSection>

	{#if showDetails}
		<CardSection as="article" className="p-4 items-start flex-col gap-4">
			<SessionsTable campaignId={campaign.id} sessions={campaign.session} />
		</CardSection>
	{/if}

	{#if showDetails}
		<CardSection as="article" className="p-4 items-start flex-col gap-4">
			<AntagonismTable {campaign} {campaigns} />
		</CardSection>
	{/if}

	<CardMoreButton more={!showDetails} onClick={() => (showDetails = !showDetails)} />
</CardContainer>

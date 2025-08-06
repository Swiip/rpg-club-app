<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Member, Os } from '$lib/types';
	import type { RegistrionModel } from '$lib/logic/registrations';
	import { goto } from '$app/navigation';
	import CardContainer from './card/card-container.svelte';
	import CardImage from './card/card-image.svelte';
	import CardSection from './card/card-section.svelte';
	import CardMoreButton from './card/card-more-button.svelte';
	import CardText from './card/card-text.svelte';
	import RegistrationsTable from './registration/registrations-table.svelte';

	type Props = {
		members: Member[];
		os: Os;
		registration: RegistrionModel;
		supabase: SupabaseClient;
	};

	const { members, os, registration, supabase }: Props = $props();
	let showDetails = $state(false);

	const handleClick = (os: Os | undefined) => () => {
		goto(`/os/${os?.id ? os.id : 'new'}/edit`);
	};
</script>

<CardContainer>
	<CardImage
		{supabase}
		bucket="game-banners"
		url={os.game.illustration}
		alt={os.game.name}
		title={os.title}
		onClick={handleClick(os)}
	/>

	<CardSection as="article" className="p-4 items-center justify-between">
		<span class="opacity-60">MJ: {os.gm.handle}</span>
		<small class="opacity-60">
			{new Date(os.event.date).toLocaleString(navigator.language, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				weekday: 'long'
			})}
		</small>
	</CardSection>

	{#if showDetails}
		<CardText text={os.description || 'Pas de description'} />
	{/if}

	<CardSection as="article" className="p-4 items-start flex-col gap-4">
		{#if showDetails}
			<RegistrationsTable targetId={os.id} registrations={os.registration} {members} />
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

	<CardMoreButton more={!showDetails} onClick={() => (showDetails = !showDetails)} />
</CardContainer>

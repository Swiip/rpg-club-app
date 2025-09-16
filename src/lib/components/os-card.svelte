<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { RegistrionModel } from '$lib/logic/registrations';
	import { goto } from '$app/navigation';
	import CardContainer from './card/card-container.svelte';
	import CardImage from './card/card-image.svelte';
	import CardSection from './card/card-section.svelte';
	import CardMoreButton from './card/card-more-button.svelte';
	import CardText from './card/card-text.svelte';
	import RegistrationsTable from './forms/registrations-table.svelte';
	import type { OsWithJoins } from '$lib/supabase/os';
	import type { Member } from '$lib/supabase/members';
	import { formatDate } from '$lib/logic/dates';
	import { enhance } from '$app/forms';

	type Props = {
		members: Member[];
		os: OsWithJoins;
		registration: RegistrionModel;
		supabase: SupabaseClient;
	};

	const { members, os, registration, supabase }: Props = $props();
	let showDetails = $state(false);
	let handleDelete = $derived(os.registration.length === 0 ? () => {} : null);

	const handleEdit = (os: OsWithJoins) => (event: Event) => {
		event.preventDefault();
		goto(`/os/${os.id}/edit`);
	};
</script>

<CardContainer>
	<form method="POST" action="?/delete" use:enhance>
		<input type="hidden" name="osId" value={os.id} />
		<CardImage
			{supabase}
			bucket="game-banners"
			url={os.game.illustration}
			alt={os.game.name}
			title={os.title}
			onEdit={handleEdit(os)}
			onDelete={handleDelete}
		/>
	</form>

	<CardSection as="article" className="p-4 items-center justify-between">
		<span class="opacity-60">MJ: {os.gm?.handle}</span>
		<small class="opacity-60">{formatDate(os.event?.date)} </small>
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

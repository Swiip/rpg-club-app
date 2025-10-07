<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Event } from '../logic/calendar';
	import CardSection from './card/card-section.svelte';
	import CardContainer from './card/card-container.svelte';
	import CardMoreButton from './card/card-more-button.svelte';
	import CardImage from './card/card-image.svelte';
	import Warnings from './warnings.svelte';
	import { getWarningFlags } from '$lib/logic/warnings';
	import Pen from '@lucide/svelte/icons/pen';
	import { goto } from '$app/navigation';
	import CalendarTable from './tables/calendar-table.svelte';

	type Props = {
		event: Event;
		supabase: SupabaseClient;
	};

	const { event, supabase }: Props = $props();
	let showDetails = $state(false);
	let warningFlags = $derived(getWarningFlags(event.warnings));

	const handleEdit = () => {
		goto(`/calendar/${event.id}/edit`);
	};
</script>

<CardContainer>
	<CardSection as="header" className="p-4 items-center justify-between">
		<small class="opacity-60">{event.location}</small>
		<small class="flex items-center gap-4 opacity-60">
			{new Date(event.date).toLocaleString(navigator.language, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				weekday: 'long'
			})}

			<button class="btn-icon preset-tonal-primary" onclick={handleEdit}>
				<Pen size={16} />
			</button>
		</small>
	</CardSection>

	{#if warningFlags.hasWarnings}
		<CardSection as="article" className="flex-col p-4 gap-4">
			<p>Potentiel problèmes détectés :</p>
			<Warnings warnings={event.warnings} />
		</CardSection>
	{/if}

	{#each event.tables as table (`${table.type}${table.id}`)}
		{#if showDetails}
			{#if table.type === 'os' || table.type === 'campaign'}
				<CardImage
					{supabase}
					bucket="game-banners"
					url={table.game.illustration}
					alt={table.game.name}
					title={`${table.type === 'os' ? 'OS' : 'Campagne'}: ${table.title}`}
				/>
			{/if}
			<CardSection as="article" className="flex-col p-4 gap-2">
				<CalendarTable {table} />
			</CardSection>
		{:else}
			<CardSection as="article" className="p-4">
				{#if table.type === 'os' || table.type === 'campaign'}
					<p>{table.type === 'os' ? 'OS' : 'Campagne'} : {table.title}</p>
				{:else}
					<p>Jeu de société</p>
				{/if}
			</CardSection>
		{/if}
	{/each}

	{#if event.tables.length > 0}
		<CardMoreButton more={!showDetails} onClick={() => (showDetails = !showDetails)} />
	{:else}
		<CardSection as="article" className="p-4 items-center justify-between">
			<p>Aucune table n'a été créée pour cet événement.</p>
		</CardSection>
	{/if}
</CardContainer>

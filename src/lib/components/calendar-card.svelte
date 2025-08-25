<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Event } from '../logic/calendar';
	import CardSection from './card/card-section.svelte';
	import CardContainer from './card/card-container.svelte';
	import CardMoreButton from './card/card-more-button.svelte';
	import CardImage from './card/card-image.svelte';

	type Props = {
		event: Event;
		supabase: SupabaseClient;
	};

	const { event, supabase }: Props = $props();
	let showDetails = $state(false);
</script>

<CardContainer>
	<CardSection as="header" className="p-4 items-center justify-between">
		<small class="opacity-60">{event.location}</small>
		<small class="opacity-60">
			{new Date(event.date).toLocaleString(navigator.language, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				weekday: 'long'
			})}
		</small>
	</CardSection>

	{#if event.duplicates.length > 0}
		<CardSection as="article" className="flex-col p-4 gap-4 text-error-700-300">
			<p>Attention, Doublons ! {event.duplicates.map(({ handle }) => handle).join(', ')}</p>
		</CardSection>
	{/if}

	{#each event.tables as table (`${table.type}${table.id}`)}
		{#if showDetails}
			<CardImage
				{supabase}
				bucket="game-banners"
				url={table.game.illustration}
				alt={table.game.name}
				title={`${table.type === 'os' ? 'OS' : 'Campagne'}: ${table.title}`}
			/>
			<CardSection as="article" className="flex-col p-4 gap-4">
				<p>Jeu: {table.game.name}</p>
				<p>MJ: {table.gm.handle}</p>
				<p>
					PJs: {table.registration.map((registration) => registration.member.handle).join(', ')}
				</p>
			</CardSection>
		{:else}
			<CardSection as="article" className="p-4">
				<p>{table.type === 'os' ? 'OS' : 'Campagne'}: {table.title}</p>
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

<script lang="ts">
	import { goto } from '$app/navigation';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import CardContainer from './card/card-container.svelte';
	import CardImage from './card/card-image.svelte';
	import CardMoreButton from './card/card-more-button.svelte';
	import CardSection from './card/card-section.svelte';
	import CardText from './card/card-text.svelte';
	import type { SupabaseClient } from '$lib/supabase/types';
	import type { Game } from '$lib/supabase/games';

	type Props = {
		game: Game;
		supabase: SupabaseClient;
	};

	const { game, supabase }: Props = $props();
	let showDetails = $state(false);

	const handleClick = (game: Game | undefined) => () => {
		goto(`/games/${game?.id ? game.id : 'new'}/edit`);
	};
</script>

<CardContainer>
	<CardImage
		{supabase}
		bucket="game-banners"
		url={game.illustration}
		alt={game.name}
		onClick={handleClick(game)}
	>
		{#if !showDetails}
			<button
				class="btn preset-tonal-primary absolute bottom-2 left-1/2 -translate-x-1/2 transform"
				onclick={() => (showDetails = !showDetails)}
			>
				Plus <ChevronDown size={16} />
			</button>
		{/if}
	</CardImage>

	{#if showDetails}
		<CardSection as="article" className="flex-col gap-4 p-4">
			<h3 class="h3">{game.name}</h3>
		</CardSection>

		<CardText text={game.description || ''} />

		<CardMoreButton more={!showDetails} onClick={() => (showDetails = !showDetails)} />
	{/if}
</CardContainer>

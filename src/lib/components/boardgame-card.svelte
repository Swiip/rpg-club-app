<script lang="ts">
	import { goto } from '$app/navigation';
	import CardContainer from './card/card-container.svelte';
	import CardSection from './card/card-section.svelte';
	import CardMoreButton from './card/card-more-button.svelte';
	import CardText from './card/card-text.svelte';
	import RegistrationsTable from './forms/registrations-table.svelte';
	import type { Member } from '$lib/supabase/members';
	import { formatDate } from '$lib/logic/dates';
	import { enhance } from '$app/forms';
	import RegistrationTable from './tables/registration-table.svelte';
	import type { BoardgameWithJoins } from '$lib/supabase/boardgames';
	import Pen from '@lucide/svelte/icons/pen';
	import X from '@lucide/svelte/icons/x';
	import BoardgamesTable from './forms/boardgames-table.svelte';
	import type { Game } from '$lib/supabase/games';

	type Props = {
		members: Member[];
		boardgame: BoardgameWithJoins;
		games: Game[];
	};

	const { members, boardgame, games }: Props = $props();
	let showDetails = $state(false);

	const handleEdit = (event: Event) => {
		event.preventDefault();
		goto(`/boardgames/${boardgame.id}/edit`);
	};

	let handleDelete = $derived(boardgame.registration.length === 0 ? () => {} : null);
</script>

<CardContainer>
	<CardSection as="article" className="p-4 items-center justify-between">
		<small class="opacity-60">{formatDate(boardgame.event?.date)}</small>
		<small class="inline-flex gap-2 opacity-60">
			<button class="btn-icon preset-tonal-primary" onclick={handleEdit}>
				<Pen size={16} />
			</button>
			{#if handleDelete}
				<form method="POST" action="?/delete" use:enhance>
					<input type="hidden" name="boardgameId" value={boardgame.id} />
					<button class="btn-icon preset-tonal-error" onclick={handleDelete}>
						<X size={16} />
					</button>
				</form>
			{/if}
		</small>
	</CardSection>

	{#if showDetails}
		<CardText text={boardgame.description || 'Pas de description'} />
	{/if}

	<CardSection as="article" className="p-4 items-start flex-col gap-4">
		{#if showDetails}
			<RegistrationsTable
				targetId={boardgame.id}
				registrations={boardgame.registration}
				{members}
			/>
		{:else}
			<RegistrationTable withRegistration={boardgame} roleLabel="" />
		{/if}
	</CardSection>

	<CardSection as="article" className="p-4 items-start flex-col gap-4">
		{#if showDetails}
			<BoardgamesTable {boardgame} {games} />
		{:else if boardgame.boardgame_games.length > 0}
			{boardgame.boardgame_games.map(({ game }) => game.name).join(', ')}
		{:else}
			Pas de jeux sélectionnés
		{/if}
	</CardSection>

	<CardMoreButton more={!showDetails} onClick={() => (showDetails = !showDetails)} />
</CardContainer>

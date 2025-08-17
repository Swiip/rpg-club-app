<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '$lib/components/container.svelte';
	import GameCard from '$lib/components/game-card.svelte';

	const { data } = $props();
	const { supabase, games } = data;

	let filter = $state('');

	let filteredGames = $derived(
		games ? games?.filter((game) => game.name.toLowerCase().includes(filter.toLowerCase())) : []
	);
</script>

<Container>
	<div class="flex w-full justify-end">
		<button class="btn preset-filled-primary-500" onclick={() => goto(`/games/new/edit`)}>
			Ajouter +
		</button>
	</div>

	<label class="label">
		<span class="label-text">Filtre</span>
		<input class="input" type="text" bind:value={filter} placeholder="Entrer le nom d'un jeu" />
	</label>

	<hr class="border-surface-200-800 w-full" />

	{#each filteredGames as game (game.id)}
		<GameCard {game} {supabase} />
	{/each}
</Container>

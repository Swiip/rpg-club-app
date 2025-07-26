<script lang="ts">
	import GameCard from '$lib/components/game-card.svelte';

	const { data } = $props();
	const { supabase, games } = data;

	let filter = $state('');

	let filteredGames = $derived(
		games ? games?.filter((game) => game.name.toLowerCase().includes(filter.toLowerCase())) : []
	);
</script>

<div class="mx-auto flex w-4/5 flex-col items-center gap-8 pb-20 md:w-3xl">
	<div class="flex w-full justify-end">
		<button class="btn preset-filled-primary-500">Ajouter +</button>
	</div>

	<label class="label">
		<span class="label-text">Filtre</span>
		<input class="input" type="text" bind:value={filter} placeholder="Entrer le nom d'un jeu" />
	</label>

	<hr class="border-surface-200-800 w-full" />

	{#each filteredGames as game (game.id)}
		<GameCard {game} {supabase} />
	{/each}
</div>

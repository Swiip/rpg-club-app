<script lang="ts">
	import GameCard from '$lib/components/game-card.svelte';

	const { data } = $props();
	const { supabase, games } = data;
</script>

<div class="mx-auto flex w-4/5 flex-col items-center gap-8 pb-20 md:w-3xl">
	<div class="flex w-full justify-end">
		<button class="btn preset-filled-primary-500">Add +</button>
	</div>

	{#if games && games.length > 0}
		{#each games as game (game.id)}
			<GameCard {game} {supabase} />
		{/each}
	{/if}
</div>

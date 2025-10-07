<script lang="ts">
	import { goto } from '$app/navigation';
	import BoardgameCard from '$lib/components/boardgame-card.svelte';
	import Container from '$lib/components/container.svelte';
	import FuturePastTabs from '$lib/components/future-past-tabs.svelte';

	let { data } = $props();
	let { members, boardgames, games } = $derived(data);
</script>

<Container>
	<FuturePastTabs />

	<div class="flex w-full justify-end">
		<button class="btn preset-filled-primary-500" onclick={() => goto(`/boardgames/new/edit`)}>
			Ajouter +
		</button>
	</div>

	{#if boardgames && boardgames.length > 0}
		{#each boardgames as boardgame (boardgame.id)}
			<BoardgameCard {members} {boardgame} {games} />
		{/each}
	{:else}
		Aucune session de jeu de société planifié pour le moment
	{/if}
</Container>

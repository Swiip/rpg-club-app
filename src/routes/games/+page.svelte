<script lang="ts">
	import { goto } from '$app/navigation';
	import SupabaseImage from '$lib/components/image/supabase-image.svelte';
	import type { Game } from '$lib/types';
	import SvelteMarkdown from 'svelte-markdown';

	const { data } = $props();
	const { supabase, games } = data;

	const handleClick = (game: Game | undefined) => () => {
		goto(`/games/${game?.id ? game.id : 'new'}/edit`);
	};
</script>

<div class="table-wrap mx-auto max-w-4xl">
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Nom</th>
				<th>Description</th>
				<th>Illustration</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#if games && games.length > 0}
				{#each games as game (game.id)}
					<tr onclick={handleClick(game)} class="cursor-pointer">
						<td>{game.name}</td>
						<td class="prose prose-invert">
							<SvelteMarkdown source={game.description || ''} />
						</td>
						<td class="w-sm">
							<SupabaseImage
								{supabase}
								bucket="game-banners"
								url={game.illustration}
								alt={game.name}
								className="h-48 w-sm rounded-2xl object-cover"
							/>
						</td>
					</tr>
				{/each}
			{/if}
			<tr onclick={handleClick(undefined)} class="cursor-pointer text-center">
				<td colspan="100">+</td>
			</tr>
		</tbody>
	</table>
</div>

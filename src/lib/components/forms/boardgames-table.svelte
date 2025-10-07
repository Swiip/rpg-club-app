<script lang="ts">
	import Trash from '@lucide/svelte/icons/trash';
	import Plus from '@lucide/svelte/icons/plus';
	import { enhance } from '$app/forms';
	import type { Game } from '$lib/supabase/games';

	import type { BoardgameWithJoins } from '$lib/supabase/boardgames';

	type Props = {
		boardgame: BoardgameWithJoins;
		games: Game[];
	};

	let { boardgame, games }: Props = $props();

	let gameId = $state<number>();
	let newGameId = $state<number>();
	let action = $state<'add' | 'delete'>();

	const handleClick = (newAction: 'add' | 'delete', id: number | undefined) => () => {
		action = newAction;
		gameId = id;
	};
</script>

<form method="POST" action="?/games" class="table-wrap mx-auto max-w-4xl" use:enhance>
	<input name="targetId" type="hidden" value={boardgame.id} />
	<input name="gameId" type="hidden" value={gameId} />
	<input name="action" type="hidden" value={action} />
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Jeu</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#each boardgame.boardgame_games as { id, game } (id)}
				<tr>
					<td>{game.name}</td>
					<td>
						<button class="btn-icon preset-tonal-error" onclick={handleClick('delete', game.id)}>
							<Trash size={16} />
						</button>
					</td>
				</tr>
			{/each}
			<tr>
				<td colspan="2">
					<select class="select" name="new" bind:value={newGameId}>
						{#if games && games.length > 0}
							{#each games as { id, name } (id)}
								<option value={id}>{name}</option>
							{/each}
						{/if}
					</select>
				</td>
				<td>
					<button class="btn-icon preset-tonal-primary" onclick={handleClick('add', newGameId)}>
						<Plus size={16} />
					</button>
				</td>
			</tr>
		</tbody>
	</table>
</form>

<script lang="ts">
	import { goto } from '$app/navigation';

	const { data } = $props();
	const { games, members } = data;

	const handleCancel = (event: MouseEvent) => {
		event.preventDefault();
		goto('/os');
	};
</script>

<form method="POST" action="?/save" class="mx-auto w-full max-w-md space-y-4">
	<label class="label">
		<span class="label-text">Title</span>
		<input class="input" name="name" type="text" />
	</label>
	<label class="label">
		<span class="label-text">Game</span>
		<select class="select">
			{#if games && games.length > 0}
				{#each games as game (game.id)}
					<option value={game.id}>{game.name}</option>
				{/each}
			{/if}
		</select>
	</label>
	<label class="label">
		<span class="label-text">GM</span>
		<select class="select">
			{#if members && members.length > 0}
				{#each members as member (member.id)}
					<option value={member.id}>{member.handle}</option>
				{/each}
			{/if}
		</select>
	</label>
	<div class="flex justify-end gap-4">
		<button class="btn preset-tonal-primary" onclick={handleCancel}>Cancel</button>
		<button class="btn preset-filled-primary-500">Save</button>
	</div>
</form>

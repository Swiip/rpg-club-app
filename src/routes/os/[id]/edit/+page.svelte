<script lang="ts">
	import { goto } from '$app/navigation';

	const { data } = $props();
	const { os, games, members, events } = data;

	const handleCancel = (event: MouseEvent) => {
		event.preventDefault();
		goto('/os');
	};
</script>

<form method="POST" action="?/save" class="mx-auto w-full max-w-md space-y-4">
	<label class="label">
		<span class="label-text">Title</span>
		<input class="input" name="title" type="text" value={os?.title} required />
	</label>
	<label class="label">
		<span class="label-text">Game</span>
		<select class="select" name="game" value={os?.game} required>
			{#if games && games.length > 0}
				{#each games as game (game.id)}
					<option value={game.id}>{game.name}</option>
				{/each}
			{/if}
		</select>
	</label>
	<label class="label">
		<span class="label-text">GM</span>
		<select class="select" name="gm" value={os?.gm} required>
			{#if members && members.length > 0}
				{#each members as member (member.id)}
					<option value={member.id}>{member.handle}</option>
				{/each}
			{/if}
		</select>
	</label>
	<label class="label">
		<span class="label-text">Event</span>
		<select class="select" name="event" value={os?.event} required>
			{#if events && events.length > 0}
				{#each events as event (event.id)}
					<option value={event.id}>{event.date}</option>
				{/each}
			{/if}
		</select>
	</label>
	<div class="flex justify-end gap-4">
		<button class="btn preset-tonal-primary" onclick={handleCancel}>Cancel</button>
		<button class="btn preset-filled-primary-500">Save</button>
	</div>
</form>

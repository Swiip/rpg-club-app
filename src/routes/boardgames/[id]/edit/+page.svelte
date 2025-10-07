<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/logic/dates';

	const { data } = $props();
	const { os, events } = data;

	const handleCancel = (event: MouseEvent) => {
		event.preventDefault();
		goto('/boardgames');
	};
</script>

<form method="POST" action="?/save" class="mx-auto w-full max-w-md space-y-4">
	<label class="label">
		<span class="label-text">Description</span>
		<textarea class="textarea" name="description" value={os?.description}></textarea>
	</label>
	<label class="label">
		<span class="label-text">Évènement</span>
		<select class="select" name="event" value={os?.event} required>
			{#if events && events.length > 0}
				{#each events as event (event.id)}
					<option value={event.id}>{formatDate(event.date)} / {event.location}</option>
				{/each}
			{/if}
		</select>
	</label>
	<div class="flex justify-end gap-4">
		<button class="btn preset-tonal-primary" onclick={handleCancel}>Cancel</button>
		<button class="btn preset-filled-primary-500">Save</button>
	</div>
</form>

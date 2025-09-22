<script lang="ts">
	import { goto } from '$app/navigation';

	const { data } = $props();
	const { event } = data;

	const handleCancel = (event: MouseEvent) => {
		event.preventDefault();
		goto('/calendar');
	};
</script>

<form method="POST" action="?/save" class="mx-auto w-full max-w-md space-y-4">
	<label class="label">
		<span class="label-text">Date</span>
		<input class="input" name="date" type="date" value={event?.date} required />
	</label>
	<label class="label">
		<span class="label-text">Start</span>
		<input class="input" name="start" type="time" value={event?.start} required />
	</label>
	<label class="label">
		<span class="label-text">Start</span>
		<input class="input" name="end" type="time" value={event?.end} required />
	</label>
	<label class="label">
		<span class="label-text">Location</span>
		<input class="input" name="location" type="text" required value={event?.location} />
	</label>
	<div class="flex justify-end gap-4">
		<button class="btn preset-tonal-primary" onclick={handleCancel}>Cancel</button>
		<button class="btn preset-filled-primary-500">Save</button>
	</div>
</form>

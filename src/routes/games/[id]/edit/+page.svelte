<script lang="ts">
	import { goto } from '$app/navigation';

	const { data } = $props();
	const { game } = data;

	const handleCancel = (event: MouseEvent) => {
		event.preventDefault();
		goto('/games');
	};
</script>

<form method="POST" action="?/save" class="mx-auto w-full max-w-md space-y-4">
	<label class="label">
		<span class="label-text">Name</span>
		<input class="input" name="name" type="text" value={game?.name} />
	</label>
	<label class="label">
		<span class="label-text">Illustration</span>
		<input class="input" name="illustration" type="text" value={game?.illustration} />
	</label>
	<div class="flex justify-end gap-4">
		<button class="btn preset-tonal-primary" onclick={handleCancel}>Cancel</button>
		<button class="btn preset-filled-primary-500">Save</button>
	</div>
</form>

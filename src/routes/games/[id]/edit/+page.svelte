<script lang="ts">
	import { goto } from '$app/navigation';
	import UploadImage from '$lib/components/image/upload-image.svelte';
	import { getGameType } from '$lib/supabase/games.js';

	const { data } = $props();
	const { game, supabase } = data;

	const handleCancel = (event: MouseEvent) => {
		event.preventDefault();
		goto('/games');
	};
</script>

<form method="POST" action="?/save" class="mx-auto w-full max-w-md space-y-4">
	<label class="label">
		<span class="label-text">Type</span>
		<select class="select" name="type" value={getGameType(game?.type)} required>
			<option value="rpg">Jeu de rôle</option>
			<option value="bg">Jeu de société</option>
		</select>
	</label>
	<label class="label">
		<span class="label-text">Nom</span>
		<input class="input" name="name" type="text" value={game?.name} />
	</label>
	<label class="label">
		<span class="label-text">Description</span>
		<textarea class="textarea" name="description" value={game?.description}></textarea>
	</label>
	<UploadImage
		{supabase}
		bucket="game-banners"
		url={game?.illustration}
		className="h-48 w-sm rounded-2xl object-cover"
	/>
	<div class="flex justify-end gap-4">
		<button class="btn preset-tonal-primary" onclick={handleCancel}>Cancel</button>
		<button class="btn preset-filled-primary-500">Save</button>
	</div>
</form>

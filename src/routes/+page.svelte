<script lang="ts">
	import Avatar from '$lib/components/avatar.svelte';

	const { data } = $props();
	const { member } = data;
</script>

<div class="flex min-h-48 flex-col items-center justify-center gap-8">
	<img src="/assets/ROCKNOLISTES.png" alt="Rock'n'Rôlistes App Logo" class="size-98 rounded-4xl" />

	<h2>Hello {member?.handle}!</h2>

	{#if member.avatar}
		<Avatar mode="big-avatar" {member} />
	{/if}
</div>

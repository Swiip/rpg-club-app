<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';

	const { data } = $props();
	const { member } = data;
</script>

<svelte:head>
	<title>RPG Club App - Login</title>
</svelte:head>

<div class="flex min-h-48 flex-col items-center justify-center gap-8">
	<img src="/assets/ROCKNOLISTES.png" alt="RPG Club App Logo" class="size-98 rounded-4xl" />

	<h2>Hello {member?.handle}!</h2>

	<Avatar src={member?.avatar} name={member?.handle} />
</div>

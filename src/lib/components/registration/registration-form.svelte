<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		targetId: string;
		memberId: string;
	};

	const { children, targetId, memberId }: Props = $props();
</script>

<form method="POST">
	<input type="hidden" name="targetId" value={targetId} />
	<input type="hidden" name="memberId" value={memberId} />
	{@render children()}
</form>

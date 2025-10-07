<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		children: Snippet;
	};

	const { title, children }: Props = $props();
</script>

<tr>
	<td class="text-nowrap">{title}</td>
	<td class="w-full">
		<div class="flex flex-wrap gap-1">
			{@render children()}
		</div>
	</td>
</tr>

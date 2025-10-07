<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet };

	const { children }: Props = $props();
</script>

<div class="table-wrap mx-auto max-w-4xl">
	<table class="table caption-bottom">
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{@render children()}
		</tbody>
	</table>
</div>

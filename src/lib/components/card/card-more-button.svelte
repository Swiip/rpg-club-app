<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';

	type Props = {
		more: boolean;
		onClick: () => void;
	};

	const { more, onClick }: Props = $props();
</script>

<div class="flex p-2">
	<button
		class="btn preset-tonal-primary mx-auto self-center justify-self-center"
		onclick={onClick}
	>
		{#if more}
			Plus <ChevronDown size={16} />
		{:else}
			Moins <ChevronUp size={16} />
		{/if}
	</button>
</div>

<script lang="ts">
	import CardSection from './card-section.svelte';
	import SvelteMarkdown from 'svelte-markdown';

	type Props = {
		text: string | undefined;
		className?: string;
	};

	const { text, className }: Props = $props();
</script>

<CardSection as="article" className={`p-4 ${className}`}>
	<div class="prose dark:prose-invert prose-sm mx-auto opacity-60">
		<SvelteMarkdown source={text || ''} />
	</div>
</CardSection>

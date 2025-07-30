<script lang="ts">
	import CardSection from './card-section.svelte';
	import SvelteMarkdown from 'svelte-markdown';

	type Props = {
		text: string | undefined;
		className?: string;
	};

	const { text, className }: Props = $props();
</script>

<CardSection
	as="article"
	className={`prose dark:prose-invert prose-sm mx-auto opacity-60 ${className}`}
>
	<p class="">
		<SvelteMarkdown source={text || ''} />
	</p>
</CardSection>

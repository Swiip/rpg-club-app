<script lang="ts">
	import type { Snippet } from 'svelte';
	import SupabaseImage from '../image/supabase-image.svelte';
	import Pen from '@lucide/svelte/icons/pen';
	import CardSection from './card-section.svelte';
	import type { SupabaseClient } from '$lib/supabase/types';

	type Props = {
		supabase: SupabaseClient;
		bucket: string;
		url: string;
		alt: string;
		children?: Snippet;
		className?: string;
		title?: string;
		onClick?: () => void;
	};

	const { supabase, bucket, url, alt, children, className, title, onClick }: Props = $props();
</script>

<CardSection as="illustration" className={`relative ${className}`}>
	<SupabaseImage {supabase} {bucket} {url} {alt} className="aspect-[21/9] w-full object-cover" />
	{#if title}
		<p class="absolute top-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-lg">
			{title}
		</p>
	{/if}
	{#if onClick}
		<button class="btn-icon preset-tonal-primary absolute top-4 right-4" onclick={onClick}>
			<Pen size={16} />
		</button>
	{/if}
	{@render children?.()}
</CardSection>

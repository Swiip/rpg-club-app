<script lang="ts">
	import { downloadImage } from '$lib/supabase/image';
	import type { SupabaseClient } from '@supabase/supabase-js';

	type Props = {
		supabase: SupabaseClient;
		bucket: string;
		url: string;
		className?: string;
		alt?: string;
	};

	let { supabase, bucket, url: inputUrl, className, alt = undefined } = $props();

	let url = $state<string>();

	$effect(() => {
		const run = async () => {
			url = await downloadImage(supabase, bucket, inputUrl);
		};
		run();
	});
</script>

{#if url}
	<img src={url} {alt} class={className} />
{:else}
	<div class={className}>No image</div>
{/if}

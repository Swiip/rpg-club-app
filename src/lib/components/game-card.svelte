<script lang="ts">
	import { goto } from '$app/navigation';
	import SupabaseImage from '$lib/components/image/supabase-image.svelte';
	import type { Game } from '$lib/types';
	import SvelteMarkdown from 'svelte-markdown';
	import Pen from '@lucide/svelte/icons/pen';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import type { SupabaseClient } from '@supabase/supabase-js';

	type Props = {
		game: Game;
		supabase: SupabaseClient;
	};

	const { game, supabase }: Props = $props();
	let showDetails = $state(false);

	const handleClick = (game: Game | undefined) => () => {
		goto(`/games/${game?.id ? game.id : 'new'}/edit`);
	};
</script>

<section
	class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block w-full divide-y overflow-hidden rounded-xl border"
>
	<!-- Header -->
	<header class="relative">
		<SupabaseImage
			{supabase}
			bucket="game-banners"
			url={game.illustration}
			alt={game.name}
			className="aspect-[21/9] w-full object-cover"
		/>
		<button
			class="btn-icon preset-tonal-primary absolute top-4 right-4"
			onclick={handleClick(game)}
		>
			<Pen size={16} />
		</button>
		<button
			class="btn preset-tonal-primary absolute bottom-2 left-1/2 -translate-x-1/2 transform"
			onclick={() => (showDetails = !showDetails)}
		>
			{#if showDetails}
				Moins <ChevronUp size={16} />
			{:else}
				Plus <ChevronDown size={16} />
			{/if}
		</button>
	</header>
	<!-- Article -->
	<article class={`space-y-4 p-4 ${showDetails ? 'block' : 'hidden'}`}>
		<div>
			<h3 class="h3">{game.name}</h3>
		</div>
		<p class="prose prose-invert prose-sm opacity-60">
			<SvelteMarkdown source={game.description || ''} />
		</p>
	</article>
</section>

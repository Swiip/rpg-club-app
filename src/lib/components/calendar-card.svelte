<script lang="ts">
	import SupabaseImage from '$lib/components/image/supabase-image.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Event } from '../logic/calendar';

	type Props = {
		event: Event;
		supabase: SupabaseClient;
	};

	const { event, supabase }: Props = $props();
	let showDetails = $state(false);
</script>

<section
	class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block w-full divide-y overflow-hidden rounded-xl border"
>
	<header class="flex items-center justify-between gap-4 p-4">
		<small class="opacity-60">{event.location}</small>
		<small class="opacity-60">
			{new Date(event.date).toLocaleString(navigator.language, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				weekday: 'long'
			})}
		</small>
	</header>
	<article class="flex flex-col gap-4">
		{#if showDetails}
			{#each event.tables as table (`${table.type}${table.id}`)}
				<div class="flex flex-col gap-2">
					<div class="relative">
						<SupabaseImage
							{supabase}
							bucket="game-banners"
							url={table.game.illustration}
							alt={table.game.name}
							className="aspect-[21/9] w-full object-cover"
						/>
						<p class="absolute top-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-lg">
							{table.type === 'os' ? 'OS' : 'Campagne'}: {table.title}
						</p>
					</div>
					<p class="mx-4">Jeu: {table.game.name}</p>
					<p class="mx-4">MJ: {table.gm.handle}</p>
					<p class="mx-4">
						PJs: {table.registration.map((registration) => registration.member.handle).join(', ')}
					</p>
				</div>
			{/each}
		{:else}
			{#each event.tables as table (`${table.type}${table.id}`)}
				<p class="mx-4 first:mt-4">{table.type === 'os' ? 'OS' : 'Campagne'}: {table.title}</p>
			{/each}
			{#if event.tables.length === 0}
				<p class="p-4">Aucune table n'a été créée pour cet événement.</p>
			{/if}
		{/if}
		{#if event.tables.length > 0}
			<button
				class="btn preset-tonal-primary mb-4 self-center justify-self-center"
				onclick={() => (showDetails = !showDetails)}
			>
				{#if showDetails}
					Moins <ChevronUp size={16} />
				{:else}
					Plus <ChevronDown size={16} />
				{/if}
			</button>
		{/if}
	</article>
</section>

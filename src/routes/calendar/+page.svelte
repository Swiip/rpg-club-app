<script lang="ts">
	import { computeCalendar } from '$lib/logic/calendar.js';

	const { data } = $props();
	const { events } = data;

	const calendar = $derived(computeCalendar(events));
</script>

<div class="table-wrap mx-auto max-w-4xl">
	{#each calendar.months as month (month.name)}
		<h2 class="h2 pt-8 pb-4 capitalize">
			{new Date(month.name).toLocaleString(navigator.language, { year: 'numeric', month: 'long' })}
		</h2>
		<div class="flex flex-row flex-wrap gap-4">
			{#each month.events as event (event.date)}
				<section
					class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block max-w-md divide-y overflow-hidden border"
				>
					<header>
						<!-- <img src={imgSrc} class="aspect-[21/9] w-full grayscale hue-rotate-90" alt="banner" /> -->
					</header>

					<article class="space-y-4 p-4">
						<div>
							<h2 class="h6">{event.location}</h2>
							<h3 class="h3 capitalize">
								{new Date(event.date).toLocaleString(navigator.language, {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									weekday: 'long'
								})}
							</h3>
						</div>
						{#each event.tables as table (table.id)}
							<div>
								<h4 class="h4">{table.title}</h4>
							</div>
							<ul class="opacity-60">
								<li>Game: {table.game.name}</li>
								<li>GM: {table.gm.handle}</li>
								<li>Players: {table.registration.map((r) => r.member.handle).join(', ')}</li>
							</ul>
						{/each}
						{#if event.tables.length === 0}
							<p class="opacity-60">Aucune table pour cette date!</p>
						{/if}
					</article>

					<!-- <footer class="flex items-center justify-between gap-4 p-4">
					<small class="opacity-60">By Alex</small>
					<small class="opacity-60">On {new Date().toLocaleDateString()}</small>
				</footer> -->
				</section>
			{/each}
		</div>
	{/each}
</div>

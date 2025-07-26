<script lang="ts">
	import CalendarCard from '$lib/components/calendar-card.svelte';
	import { computeCalendar } from '$lib/logic/calendar.js';

	const { data } = $props();
	const { supabase, events } = data;

	const calendar = $derived(computeCalendar(events));
</script>

<div class="mx-auto flex w-4/5 flex-col items-center gap-8 pb-20 md:w-3xl">
	{#each calendar.months as month (`month-${month.name}`)}
		<h2 class="h2 pt-8 pb-4 capitalize">
			{new Date(month.name).toLocaleString(navigator.language, { year: 'numeric', month: 'long' })}
		</h2>
		{#each month.events as event (event.date)}
			<CalendarCard {event} {supabase} />
		{/each}
	{/each}
</div>

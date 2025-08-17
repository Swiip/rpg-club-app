<script lang="ts">
	import CalendarCard from '$lib/components/calendar-card.svelte';
	import Container from '$lib/components/container.svelte';
	import FuturePastTabs from '$lib/components/future-past-tabs.svelte';
	import { computeCalendar } from '$lib/logic/calendar.js';

	let { data } = $props();
	let { supabase, events } = $derived(data);

	const calendar = $derived(computeCalendar(events));
</script>

<Container>
	<FuturePastTabs />

	{#each calendar.months as month (`month-${month.name}`)}
		<h2 class="h2 pt-8 pb-4 capitalize">
			{new Date(month.name).toLocaleString(navigator.language, { year: 'numeric', month: 'long' })}
		</h2>
		{#each month.events as event (event.date)}
			<CalendarCard {event} {supabase} />
		{/each}
	{/each}
</Container>

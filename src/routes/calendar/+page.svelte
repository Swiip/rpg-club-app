<script lang="ts">
	import AddButton from '$lib/components/add-button.svelte';
	import CalendarCard from '$lib/components/calendar-card.svelte';
	import Container from '$lib/components/container.svelte';
	import FuturePastTabs from '$lib/components/future-past-tabs.svelte';
	import { computeCalendar } from '$lib/logic/calendar';
	import { formatMonth } from '$lib/logic/dates';

	let { data } = $props();
	let { supabase, events } = $derived(data);

	const calendar = $derived(computeCalendar(events));
</script>

<Container>
	<AddButton url="/calendar/new/edit" />

	<FuturePastTabs />

	{#each calendar.months as month (`month-${month.name}`)}
		<h2 class="h2 pt-8 pb-4 capitalize">
			{formatMonth(month.name)}
		</h2>
		{#each month.events as event (event.id)}
			<CalendarCard {event} {supabase} />
		{/each}
	{/each}
</Container>

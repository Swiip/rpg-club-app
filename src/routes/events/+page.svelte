<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '$lib/components/container.svelte';
	import FuturePastTabs from '$lib/components/future-past-tabs.svelte';
	import { formatDate, formatTime } from '$lib/logic/dates';
	import type { Event } from '$lib/supabase/events';

	let { data } = $props();
	let { events } = $derived(data);

	const handleClick = (event: Event | undefined) => () => {
		goto(`/events/${event?.id ? event.id : 'new'}/edit`);
	};
</script>

<Container>
	<FuturePastTabs />

	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Date</th>
				<th>Début</th>
				<th>Fin</th>
				<th>Location</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#if events && events.length > 0}
				{#each events as event (event.id)}
					<tr onclick={handleClick(event)} class="cursor-pointer">
						<td>{formatDate(event.date)}</td>
						<td>{formatTime(event.start)}</td>
						<td>{formatTime(event.end)}</td>
						<td>{event.location}</td>
					</tr>
				{/each}
			{/if}
			<tr onclick={handleClick(undefined)} class="cursor-pointer text-center">
				<td colspan="100">+</td>
			</tr>
		</tbody>
	</table>
</Container>

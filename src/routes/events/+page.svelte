<script lang="ts">
	import { goto } from '$app/navigation';
	import Container from '$lib/components/container.svelte';
	import FuturePastTabs from '$lib/components/future-past-tabs.svelte';
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
				<th>Start</th>
				<th>End</th>
				<th>Location</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#if events && events.length > 0}
				{#each events as event (event.id)}
					<tr onclick={handleClick(event)} class="cursor-pointer">
						<td>{event.date}</td>
						<td>{event.start}</td>
						<td>{event.end}</td>
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

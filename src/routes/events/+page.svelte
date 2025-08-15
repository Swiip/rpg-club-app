<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Event } from '$lib/supabase/events';

	const { data } = $props();
	const { events } = data;

	const handleClick = (event: Event | undefined) => () => {
		goto(`/events/${event?.id ? event.id : 'new'}/edit`);
	};
</script>

<div class="table-wrap mx-auto max-w-4xl">
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
</div>

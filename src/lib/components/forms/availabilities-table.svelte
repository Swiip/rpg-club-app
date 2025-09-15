<script lang="ts">
	import { enhance } from '$app/forms';
	import type { EventWithAvailabilities } from '$lib/supabase/events';
	import type { AvailabilityStatus } from '$lib/supabase/availabilities';
	import { clsx } from 'clsx';
	import { getStatus } from '$lib/logic/availabilities';
	import { formatDate } from '$lib/logic/dates';

	type Props = {
		memberId: number;
		events: EventWithAvailabilities[];
	};

	let { memberId, events }: Props = $props();

	let availabilityId = $state<number | undefined>();
	let eventId = $state<number>();
	let status = $state<AvailabilityStatus>();

	const handleClick = (event: EventWithAvailabilities, newStatus: AvailabilityStatus) => () => {
		availabilityId = event.availability[0]?.id;
		eventId = event.id;
		status = newStatus;
	};
</script>

<form method="POST" action="?/availability" class="table-wrap mx-auto max-w-4xl" use:enhance>
	<input name="availabilityId" type="hidden" value={availabilityId} />
	<input name="memberId" type="hidden" value={memberId} />
	<input name="eventId" type="hidden" value={eventId} />
	<input name="status" type="hidden" value={status} />
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Date</th>
				<th>Lieu</th>
				<th class="!text-right">Actions</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#if events && events.length > 0}
				{#each events as event (event.id)}
					<tr>
						<td>{formatDate(event.date)}</td>
						<td>{event.location}</td>
						<td class="text-right">
							<nav class="btn-group btn-sm preset-outlined-surface-200-800 px-1">
								<button
									class={clsx(
										'btn-icon btn-sm',
										getStatus(event.availability) === 'unset'
											? 'preset-filled-surface-500'
											: 'hover:preset-tonal'
									)}
									onclick={handleClick(event, 'unset')}
								>
									?
								</button>
								<button
									class={clsx(
										'btn-icon btn-sm',
										getStatus(event.availability) === 'off'
											? 'preset-tonal-error'
											: 'hover:preset-tonal'
									)}
									onclick={handleClick(event, 'off')}
								>
									X
								</button>
								<button
									class={clsx(
										'btn-icon btn-sm',
										getStatus(event.availability) === 'maybe'
											? 'preset-tonal-warning'
											: 'hover:preset-tonal'
									)}
									onclick={handleClick(event, 'maybe')}
								>
									(✓)
								</button>
								<button
									class={clsx(
										'btn-icon btn-sm',
										getStatus(event.availability) === 'on'
											? 'preset-tonal-success'
											: 'hover:preset-tonal'
									)}
									onclick={handleClick(event, 'on')}
								>
									✓
								</button>
							</nav>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</form>

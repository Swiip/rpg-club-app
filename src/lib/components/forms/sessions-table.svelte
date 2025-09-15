<script lang="ts">
	import Trash from '@lucide/svelte/icons/trash';
	import Plus from '@lucide/svelte/icons/plus';
	import { enhance } from '$app/forms';
	import type { SessionAction } from '$lib/supabase/sessions';
	import type { Event } from '$lib/supabase/events';
	import type { CampaignWithJoins } from '$lib/supabase/campaigns';
	import { formatDate } from '$lib/logic/dates';

	type Props = {
		targetId: number;
		sessions: CampaignWithJoins['session'];
		events: Event[];
	};

	let { targetId, sessions, events }: Props = $props();

	let eventId = $state<number>();
	let action = $state<SessionAction>();
	let newEventId = $state<number>();

	const handleClick = (newAction: SessionAction, id: number | undefined) => () => {
		action = newAction;
		eventId = id;
	};
</script>

<form method="POST" action="?/session" class="table-wrap mx-auto max-w-4xl" use:enhance>
	<input name="targetId" type="hidden" value={targetId} />
	<input name="eventId" type="hidden" value={eventId} />
	<input name="action" type="hidden" value={action} />
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Événements</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#each sessions as { id, event } (id)}
				<tr>
					<td>{formatDate(event.date)}</td>
					<td>
						<button class="btn-icon preset-tonal-error" onclick={handleClick('delete', event.id)}>
							<Trash size={16} />
						</button>
					</td>
				</tr>
			{/each}
			<tr>
				<td colspan="2">
					<select class="select" name="new" bind:value={newEventId}>
						{#if events && events.length > 0}
							{#each events as { id, date } (id)}
								<option value={id}>{formatDate(date)}</option>
							{/each}
						{/if}
					</select>
				</td>
				<td>
					<button class="btn-icon preset-tonal-primary" onclick={handleClick('add', newEventId)}>
						<Plus size={16} />
					</button>
				</td>
			</tr>
		</tbody>
	</table>
</form>

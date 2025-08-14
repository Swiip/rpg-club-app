<script lang="ts">
	import type { Event } from '$lib/types';
	import Trash from '@lucide/svelte/icons/trash';
	import Plus from '@lucide/svelte/icons/plus';
	import { enhance } from '$app/forms';
	import type { SessionAction } from '$lib/supabase/sessions';

	type Props = {
		targetId: string;
		sessions: Event[];
		events: Event[];
	};

	let { targetId, sessions, events }: Props = $props();

	let eventId = $state<string | undefined>();
	let action = $state<SessionAction | undefined>();
	let newEventId = $state<string | undefined>();

	const handleClick = (newAction: SessionAction, id: string | undefined) => () => {
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
					<td>{event.date}</td>
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
								<option value={id}>{date}</option>
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

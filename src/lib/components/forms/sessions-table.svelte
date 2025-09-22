<script lang="ts">
	import Trash from '@lucide/svelte/icons/trash';
	import Plus from '@lucide/svelte/icons/plus';
	import { enhance } from '$app/forms';
	import type { SessionAction } from '$lib/supabase/sessions';
	import type { CampaignWithJoins } from '$lib/supabase/campaigns';
	import { formatDate } from '$lib/logic/dates';
	import { goto } from '$app/navigation';

	type Props = {
		campaignId: number;
		sessions: CampaignWithJoins['session'];
		showPlusButton?: boolean;
	};

	let { campaignId, sessions, showPlusButton = true }: Props = $props();

	let eventId = $state<number>();
	let action = $state<SessionAction>();

	const handleClick = (newAction: SessionAction, id: number | undefined) => () => {
		action = newAction;
		eventId = id;
	};

	const handleSessions = (event: MouseEvent) => {
		event.preventDefault();
		goto(`/campaigns/${campaignId}/sessions`);
	};
</script>

<form method="POST" action="?/session" class="table-wrap mx-auto max-w-4xl" use:enhance>
	<input name="campaignId" type="hidden" value={campaignId} />
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
					<td>
						<p>{formatDate(event.date)}</p>
						<p>{event.location}</p>
					</td>
					<td>
						<button class="btn-icon preset-tonal-error" onclick={handleClick('delete', event.id)}>
							<Trash size={16} />
						</button>
					</td>
				</tr>
			{/each}
			{#if showPlusButton}
				<tr>
					<td colspan="3">
						<button class="btn-icon preset-tonal-primary" onclick={handleSessions}>
							<Plus size={16} />
						</button>
					</td>
				</tr>
			{/if}
		</tbody>
	</table>
</form>

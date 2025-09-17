<script lang="ts">
	import Plus from '@lucide/svelte/icons/plus';
	import { enhance } from '$app/forms';
	import type { EventWithJoins } from '$lib/supabase/events';
	import type { CampaignWithJoins } from '$lib/supabase/campaigns';
	import { formatDate } from '$lib/logic/dates';
	import { computeEventOptions } from '$lib/logic/events';
	import Warnings from '../warnings.svelte';

	type Props = {
		campaign: CampaignWithJoins;
		events: EventWithJoins[];
	};

	let { campaign, events }: Props = $props();

	let eventOptions = $derived(
		computeEventOptions(
			events,
			campaign.session.map((session) => session.event),
			[campaign.gm, ...campaign.registration.map((registration) => registration.member)]
		)
	);

	let eventId = $state<number>();

	const handleClick = (id: number | undefined) => () => {
		eventId = id;
	};
</script>

<form method="POST" action="?/session" class="table-wrap mx-auto max-w-4xl" use:enhance>
	<input name="campaignId" type="hidden" value={campaign.id} />
	<input name="eventId" type="hidden" value={eventId} />
	<input name="action" type="hidden" value="add" />
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Événements</th>
				<th>Problèmes</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#each eventOptions as event (event.id)}
				<tr>
					<td>{formatDate(event.date)}</td>
					<td><Warnings warnings={event.warnings} /></td>
					<td>
						<button class="btn-icon preset-tonal-primary" onclick={handleClick(event.id)}>
							<Plus size={16} />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</form>

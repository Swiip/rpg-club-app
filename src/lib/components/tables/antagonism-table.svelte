<script lang="ts">
	import type { CampaignWithJoins } from '$lib/supabase/campaigns';
	import { conputeAntagonisms } from '$lib/logic/registrations';
	import Avatars from '../avatars.svelte';

	type Props = {
		campaign: CampaignWithJoins;
		campaigns: CampaignWithJoins[];
	};

	let { campaign, campaigns }: Props = $props();
	let antagonisms = $derived(conputeAntagonisms(campaign, campaigns));
</script>

<div class="table-wrap mx-auto max-w-4xl">
	<table class="table caption-bottom">
		<thead>
			<tr>
				<th>Antagonismes</th>
				<th>Membres</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#each antagonisms as antagonism (antagonism.other.id)}
				<tr>
					<td>{antagonism.other.title}</td>
					<td>
						<div class="flex flex-wrap gap-1">
							<Avatars mode="avatar-and-handle" members={antagonism.members} />
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

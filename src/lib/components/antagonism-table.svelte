<script lang="ts">
	import type { CampaignWithJoins } from '$lib/supabase/campaigns';
	import { conputeAntagonisms } from '$lib/logic/registrations';

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
					<td>{antagonism.members.map((member) => member.handle).join(', ')}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

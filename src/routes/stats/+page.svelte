<script lang="ts">
	import Container from '$lib/components/container.svelte';
	import { computeStats } from '$lib/logic/stats.js';

	let { data } = $props();
	let { events, start, end } = $derived(data);
	let stats = $derived(computeStats(events));
</script>

<Container>
	<div class="flex w-full justify-end gap-4">
		<label class="label">
			<span class="label-text">Début</span>
			<input class="input" name="date" type="date" value={start} />
		</label>
		<label class="label">
			<span class="label-text">Fin</span>
			<input class="input" name="date" type="date" value={end} />
		</label>
	</div>

	<div class="table-wrap mx-auto max-w-4xl">
		<table class="table caption-bottom">
			<thead>
				<tr>
					<th>Membre</th>
					<th>MJ</th>
					<th>Joueur</th>
					<th>JdS</th>
				</tr>
			</thead>
			<tbody class="[&>tr]:hover:preset-tonal-primary">
				{#each stats as stat (stat.member.discord_id)}
					<tr>
						<td>{stat.member.handle}</td>
						<td>{stat.asGm}</td>
						<td>{stat.asPc}</td>
						<td>{stat.bg}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</Container>

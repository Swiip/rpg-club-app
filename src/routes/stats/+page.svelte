<script lang="ts">
	import Container from '$lib/components/container.svelte';
	import TableHead from '$lib/components/table-head.svelte';
	import { computeStats, type Sort } from '$lib/logic/stats.js';
	import { gotoWithParam, gotoWithParams } from '$lib/logic/urls.js';

	let { data } = $props();
	let { events, start, end, sort, dir } = $derived(data);
	let stats = $derived(computeStats(events, sort, dir));

	const handleDateChange = (type: 'start' | 'end') => () =>
		gotoWithParam(type, type === 'start' ? start : end);

	const getDir = (newSort: Sort) => {
		if (newSort === sort) {
			return dir === 'asc' ? 'desc' : 'asc';
		}
		return 'desc';
	};

	const handleSortChange = (sort: Sort) => () => gotoWithParams({ sort, dir: getDir(sort) });
</script>

<Container>
	<div class="flex w-full justify-end gap-4">
		<label class="label">
			<span class="label-text">Début</span>
			<input
				class="input"
				name="date"
				type="date"
				bind:value={start}
				onchange={handleDateChange('start')}
			/>
		</label>
		<label class="label">
			<span class="label-text">Fin</span>
			<input
				class="input"
				name="date"
				type="date"
				bind:value={end}
				onchange={handleDateChange('end')}
			/>
		</label>
	</div>

	<div class="table-wrap mx-auto max-w-4xl">
		<table class="table caption-bottom">
			<thead>
				<tr>
					<TableHead
						onClick={handleSortChange('member')}
						sort={sort === 'member' ? dir : undefined}
					>
						Member
					</TableHead>
					<TableHead onClick={handleSortChange('gm')} sort={sort === 'gm' ? dir : undefined}>
						MJ
					</TableHead>
					<TableHead onClick={handleSortChange('pc')} sort={sort === 'pc' ? dir : undefined}>
						Joueur
					</TableHead>
					<TableHead onClick={handleSortChange('bg')} sort={sort === 'bg' ? dir : undefined}>
						JdS
					</TableHead>
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

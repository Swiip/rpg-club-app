<script lang="ts">
	import Avatar from '$lib/components/avatar.svelte';
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
					<TableHead
						onClick={handleSortChange('all')}
						sort={sort === 'all' ? dir : undefined}
						vertical
					>
						Présence
					</TableHead>
					<TableHead
						onClick={handleSortChange('gm')}
						sort={sort === 'gm' ? dir : undefined}
						vertical
					>
						MJ
					</TableHead>
					<TableHead
						onClick={handleSortChange('gm.os')}
						sort={sort === 'gm.os' ? dir : undefined}
						vertical
					>
						MJ / OS
					</TableHead>
					<TableHead
						onClick={handleSortChange('gm.campaign')}
						sort={sort === 'gm.campaign' ? dir : undefined}
						vertical
					>
						MJ / Campagne
					</TableHead>
					<TableHead
						onClick={handleSortChange('gm.campaignIds')}
						sort={sort === 'gm.campaignIds' ? dir : undefined}
						vertical
					>
						MJ / Campagne Diff
					</TableHead>
					<TableHead
						onClick={handleSortChange('pc')}
						sort={sort === 'pc' ? dir : undefined}
						vertical
					>
						Joueur
					</TableHead>
					<TableHead
						onClick={handleSortChange('pc.os')}
						sort={sort === 'pc.os' ? dir : undefined}
						vertical
					>
						Joueur / OS
					</TableHead>
					<TableHead
						onClick={handleSortChange('pc.campaign')}
						sort={sort === 'pc.campaign' ? dir : undefined}
						vertical
					>
						Joueur / Campagne
					</TableHead>
					<TableHead
						onClick={handleSortChange('pc.campaignIds')}
						sort={sort === 'pc.campaignIds' ? dir : undefined}
						vertical
					>
						Joueur / Campagne Diff
					</TableHead>
					<TableHead
						onClick={handleSortChange('bg')}
						sort={sort === 'bg' ? dir : undefined}
						vertical
					>
						JdS
					</TableHead>
				</tr>
			</thead>
			<tbody class="[&>tr]:hover:preset-tonal-primary">
				{#each stats as stat (stat.member.discord_id)}
					<tr>
						<td><Avatar mode="avatar-and-handle" member={stat.member} /></td>
						<td>
							{stat.asGm.os + stat.asGm.campaign + stat.asPc.os + stat.asPc.campaign + stat.bg}
						</td>
						<td>{stat.asGm.os + stat.asGm.campaign}</td>
						<td>{stat.asGm.os}</td>
						<td>{stat.asGm.campaign}</td>
						<td>{stat.asGm.campaignIds.size}</td>
						<td>{stat.asPc.os + stat.asPc.campaign}</td>
						<td>{stat.asPc.os}</td>
						<td>{stat.asPc.campaign}</td>
						<td>{stat.asPc.campaignIds.size}</td>
						<td>{stat.bg}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</Container>
